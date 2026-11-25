const { render } = require('../app');
const { HelpMessage } = require('../models');
const {Op, json} = require('sequelize');
const User = require('../models/userModel');

const getMessages = async (req,res)=>{
    try{
        let messages = HelpMessage.findAll();
        return messages;
    }catch(err){
        console.error("ERRORE NEL REPERIMENTO MESSAGI", err)
    }
}

const saveMessage = async (req,res)=>{
    try{
        const requestId = req.params.requestId;
        const replyToAuthor = req.body.authRepliedMsg || null;
        const text = req.body.text || null;
        const userId = req.session.userId || null;

        if(!requestId){
            console.error("nessun questionId trovato", err);     
        }

        const userReplied = await User.findOne({
            where: {email:replyToAuthor}
        });

        
        const message = await HelpMessage.create({
            request_id : requestId,
            author_id : userId,
            parent_message_id : userReplied?.id ?? null,
            content : text,
            status: "ACTIVE"
        });

        const author = await User.findByPk(message.author_id);

        const broadcastData = {
            id: message.id,
            content: message.content,
            author_id: message.author_id,
            author: author?.email ?? null,
            reply_to_message: userReplied?.email ?? null,
            reply_to_author_id: userReplied?.id ?? null
        };

        // Send the message through WebSocket
        req.io.to(`request_${requestId}`).emit('new message', broadcastData);
        return res.status(201).json({ success: true, message: broadcastData });

    }catch(err){
        console.error("errore salvamento messaggio", err);
        return res.status(500).json({ error: "Errore interno del server" });
    }
}

module.exports = {
    saveMessage,
    getMessages
}