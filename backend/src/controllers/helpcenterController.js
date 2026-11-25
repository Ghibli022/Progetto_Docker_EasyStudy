const { Op } = require('sequelize');
const User = require('../models/userModel');
const HelpRequest = require('../models/requestModel');
const MessageRequest = require('../models/messageModel');
const validator = require('../utils/validator');

const closeChat = async(req,res)=>{
    try{
        const requestId = req.params.requestId;
        const request = await HelpRequest.findByPk(requestId);

        if (!request) {
            return res.status(404).send("Richiesta di aiuto non trovata");
        } else if (request.author_id != req.session.userId){
            return res.status(403).json({
                success: false,
                message: "Non sei autorizzato a risolvere questa richiesta"
            });
        }

        await request.update({
            status: "RESOLVED"
        });

        const broadcastData = {
            isChatResolved : true
        };

        req.io.to(`request_${requestId}`).emit('chat status', broadcastData);
        return res.status(201).json({ success: true, message: broadcastData });


    }catch (err) {
        console.error("Errore chiusura chat:", err);
        return res.status(500).json({
            success: false,
            message: "Errore interno del server"
        });
    }
}

const showChatPage = async(req,res)=>{
    try{
        const requestId = req.params.requestId;
        const request = await HelpRequest.findByPk(requestId);

        if (!request) {
            return res.status(404).send("Richiesta di aiuto non trovata");
        }

        const reqAuthor = await User.findByPk(request.author_id);

        const messages = await MessageRequest.findAll({
            where: {request_id: requestId}
        });

        const formattedMessages = await Promise.all(
            messages.map(async (message) => {
                const author = await User.findByPk(message.author_id); 
                const replyAuthor = await User.findByPk(message.parent_message_id);
                let author_email="";

                if(author){
                    if(author.id == req.session.userId){
                        author_email="Tu";
                    }else{
                        author_email = author.email;
                    }
                }

                return{
                    id: message.id,
                    content: message.content,
                    author_id: message.author_id,
                    isOwner: message.author_id == req.session.userId ? true : false,
                    author_name: author_email,
                    message_replied: replyAuthor?.email ?? false,
                    reply_to_author_id: message.parent_message_id
                };
            })
        );

        res.render('helpcenter_chat', {
            layout: "main",
            title: "Chat",
            styles: ["home.css", "navbar.css", "searchbar.css", "chat.css"],
            scripts: ["chat.js"],
            
            request: {
                id: request.id,
                title: request.title,
                author_name: reqAuthor.email,
                is_req_owner: request.author_id == req.session.userId ? true : false,
                is_status_resolved: request.status == "RESOLVED" ? true : false
            }, 

            currentUserId: req.session.userId,
            messages: formattedMessages 
        });
    } catch(err){
        console.error("Errore nella renderizzazione della chat", err);
        res.status(500).send("Errore interno del server");
    }
};

const getRequest = async(req)=>{
    return HelpRequest.findByPk(req.params.requestId);
}


const addRequest = async (req, res) => {
    try {
        const title = validator.sanitizeInput(req.body.title, 'Titolo');
        const description = validator.sanitizeInput(req.body.description, 'Descrizione');
        const author_id = req.session.userId;

        const request = await HelpRequest.create({
            title,
            description,
            author_id
        })
        
        // Insert the first message
        await MessageRequest.create({
            request_id : request.id,
            author_id : author_id,
            parent_message_id : null,
            content : description,
            status: "ACTIVE"
        });

        res.redirect('/help-center');
    }catch(error){
        if (error instanceof validator.ValidationError) {
            return res.status(400).render('new-request', {error: error.message, layout: "main", styles: ["navbar.css", "searchbar.css", "materials.css", "home.css", "upload.css"], scripts: [] });
        }

        console.error('Errore durante la creazione:', error);
        return res.status(500).render('new-request', { error: "Errore durante la creazione della richiesta", layout: "main", styles: ["navbar.css", "searchbar.css", "materials.css", "home.css", "upload.css"], scripts: [] });
    }
}

const todayRequests = async () => {
    const today = new Date();

    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0);

    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59);

    const requests = await HelpRequest.findAll({
        attributes: ['id', 'title', 'created_at', 'author_id','status'],
        where: {
            created_at: {
                [Op.between]: [startOfDay, endOfDay]
            }
        },
        order: [['created_at', 'DESC']]
    });

    const requestsToday = [];

    for (const request of requests) {
        const user = await User.findByPk(request.author_id);
        let hoursText = "";

        const hoursAgo = Math.floor(
            (today - new Date(request.created_at)) / (1000 * 60 * 60)
        );

        if(hoursAgo === 0){
            hoursText += 'meno di un\'ora fa';
        }else if(hoursAgo === 1){
            hoursText += "un'ora fa";
        }else{
            hoursText += hoursAgo + ' ore fa';
        }

        let statusColor;
        switch(request.status){
            case 'OPEN':
                statusColor = '#0047AB';
                break;
            case 'RESOLVED':
                statusColor = '#2E6F40';
                break;
            case 'REMOVED':
                statusColor = '#FF2400';
                break;
        }

        requestsToday.push({
            id: request.id,
            title: request.title,
            created_at_hours_ago: hoursText,
            user_email: user.email,
            status: request.status,
            statusColor
        });
    }

    return requestsToday;
};

const userRequests = async (req) => {
    const userId = req.session.userId;
    const requests = await HelpRequest.findAll({
        attributes: ['id', 'title', 'created_at','status'],
        where: {
            author_id: userId
        },
        order: [['created_at', 'DESC']],
        raw: true
    });

    const requestsUser = [];

    for(const req of requests){
        let statusColor;
        switch(req.status){
            case 'OPEN':
                statusColor = '#0047AB';
                break;
            case 'RESOLVED':
                statusColor = '#2E6F40';
                break;
            case 'REMOVED':
                statusColor = '#FF2400';
                break;
        }

        requestsUser.push({
            id: req.id,
            title: req.title,
            created_at: new Date(req.created_at).toLocaleString('it-CH', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            }),
            status: req.status,
            statusColor
        })
    }

    return requestsUser;
};

const searchRequest = async (req,res) => {
    try {
        const query = req.query.q || '';
        const requests = await getRequests(query);

        return res.status(200).json(requests);

    } catch (error) {
        console.error('Errore durante la ricerca AJAX:', error);

        return res.status(500).json({
            error: 'Errore durante la ricerca'
        });
    }
};

const getRequests = async (query = '') => {
    const where = {};

    if (query) {
        where[Op.or] = [
            { title: { [Op.like]: `%${query}%` } },
            { description: { [Op.like]: `%${query}%` } }
        ];
    }

    const requests = await HelpRequest.findAll({
        where,
        attributes: ['id', 'title', 'created_at', 'author_id', 'status'],
        include: [
            {
                model: User,
                as: 'author',
                attributes: ['email']
            }
        ],
        order: [['created_at', 'DESC']]
    });

    return requests.map(request => {
        const data = request.toJSON();
        data.created_at = new Date(data.created_at).toLocaleDateString('it-IT');
        data.user_email = data.author ? data.author.email : '';
        delete data.author;
        return data;
    });
};

module.exports = {
    addRequest,
    todayRequests,
    userRequests,
    searchRequest,
    getRequests,
    getRequest,
    showChatPage,
    closeChat
}