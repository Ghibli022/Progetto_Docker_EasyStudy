const { Material, Tag, User } = require('../models');
const { Op } = require('sequelize');
const nodemailer = require("nodemailer");
const { response } = require('../app');
const { Resend } = require('resend');

//100 mails per day & 3000 emails per month
const resend = new Resend(process.env.RESEND_API_KEY);

const reportMaterial = async (req, res) => {
    try {
        const data = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: 'easy.study.admin@gmail.com',
            subject: 'File riportato',
            html: "<p>Attenzione, un file è stato riportato, all'interno dell'app 'Easy Study'</p>"
        });
        console.log("Email inviata con successo:", data);
        res.redirect('/materials');
    } catch (err) {
        console.error("Error while sending mail:", err);
        res.send(500);
    }

    /* let testAccount = await nodemailer.createTestAccount();
 
     const transporter = nodemailer.createTransport({
             host: "smtp.ethereal.email",
             port:587,
             secure: false,
             auth:{
                 user: testAccount.user,
                 pass: testAccount.pass
             },
         });
 
     try {
         await transporter.verify();
         console.log("Server is ready to take our messages");
         } catch (err) {
         console.error("Verification failed:", err);
     }
     try {
         const info = await transporter.sendMail({
             from: '"Easy Study" <easy.study.admin@gmail.com>', 
             to: "easy.study.admin@gmail.com",
             subject: "File riportato",
             text: "Attenzio, un file è stato riportato, all'interno dell'app 'Easy Study'",
             html: "<b>Attenzio, un file è stato riportato, all'interno dell'app 'Easy Study'</b>",
         });
 
         console.log("Message sent: %s", info.messageId);
     
         console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
 
         res.redirect('/materials');
         } catch (err) {
         console.error("Error while sending mail:", err);
         }*/
};

const searchMaterial = async (req, res) => {
    try {
        const query = (req.query.q || '').trim();
        const tagIds = (req.query.tags || '').split(',').map(Number).filter(n => Number.isInteger(n) && n > 0);
        const materials = await getMaterials(query, tagIds);
        return res.status(200).json(materials);

    } catch (error) {
        console.error('Errore durante la ricerca AJAX:', error);
        return res.status(500).json({error: 'Errore durante la ricerca'});
    }
};

const getMaterials = async (query = '', tagIds = []) => {
    const where = {};

    if (query) {
        where[Op.or] = [
            { title: { [Op.like]: `%${query}%` } },
            { description: { [Op.like]: `%${query}%` } },
            { filename: { [Op.like]: `%${query}%` } }
        ];
    }

    if (tagIds.length) {
        const matching = await Material.findAll({
            attributes: ['id'],
            include: [{
                model: Tag,
                as: 'tags',
                attributes: ['id'],
                where: { id: tagIds },
                through: { attributes: [] }
            }]
        });
        const ids = matching.filter(m => m.tags.length === tagIds.length).map(m => m.id);
        where.id = ids; //if the array is empty, then it will show no result
    }

    const materials = await Material.findAll({
        where,
        include: [
            {
                model: Tag,
                as: 'tags',
                attributes: ['id', 'name'],
                through: {
                    attributes: []
                }
            },
            {
                model: User,
                as: 'author',
                attributes: ['email']
            }
        ]
    });

    return materials.map(material => {
        const data = material.toJSON();

        data.created_at = new Date(data.created_at).toLocaleDateString('it-IT');
        data.hasMoreTags = data.tags.length > 3;
        data.tags_3 = data.tags.slice(0, 3);

        return data;
    });
};

const getAllTags = async (req,res) => {
    const allTags = await Tag.findAll({
        attributes: ['id', 'name'],
        order: [['name', 'ASC']],
        raw: true
    });
    return allTags;
}

const uploadMaterial = async (req, res) => {
    try {
        //If muller has failed or missing file
        if (!req.file) {
            return res.status(400).json({ error: 'Nessun file caricato o formato non valido' });
        }

        const { title, description, 'select-tags': tags } = req.body;
        const author_id = req.session.userId;

        let file_type = 'PDF';
        if (req.file.mimetype.includes('png')) file_type = 'PNG';
        if (req.file.mimetype.includes('jpeg')) file_type = 'JPEG';
        if (req.file.mimetype.includes('wordprocessingml')) file_type = 'DOCX';

        //Saving into the DB using Sequelize
        const newMaterial = await Material.create({
            author_id,
            title,
            description,
            file_type,
            file_url: `/uploads/${req.file.filename}`,
            filename: req.file.originalname,
            file_size: req.file.size,
            download_count: 0
        });

        if (tags) {
            await newMaterial.addTags(tags);
        }

        res.redirect('/materials');
    } catch (error) {
        console.error('Errore durante il caricamento del file:', error);
        return res.status(500).json({
            error: 'Errore interno del server durante il caricamento file'
        });
    }
};

module.exports = {
    getMaterials,
    uploadMaterial,
    searchMaterial,
    reportMaterial,
    getAllTags
};