const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

const materialController = require('../controllers/materialController');
const { isNotLoggedIn } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { Material } = require('../models');
const uploadPath = path.join(__dirname, '../../uploads');

//Report a material
router.get('/materials/report/:id', materialController.reportMaterial);

//Async research
router.get("/api/materials/search", materialController.searchMaterial);

//Material List GET Route
router.get("/materials", async (req, res) => {
    let materials = await materialController.getMaterials();
    let allTags = await materialController.getAllTags();
    res.render('materials', {materials, allTags, searched: true, layout: "main", title: "Resources", styles: ["navbar.css","searchbar.css","materials.css","home.css"], scripts: ["materials.js"]});
});

//Upload material GET Route
router.get("/materials/upload", (req, res) => {
    res.render('upload-material', {layout: "main", title: "Upload new resource", styles: ["navbar.css","searchbar.css","materials.css","home.css","upload.css"], scripts: ["upload.js"]})
});

//Upload material POST Route
//router.post("/materials/upload/resource", upload.single('material_file'), materialController.uploadMaterial)
router.post("/materials/upload/resource", (req,res, next) =>{
    upload.single('material_file')(req,res,(err)=>{
        if(err){
            console.error("Errore Multer:", err.message);
            return res.status(400).json({error: err.message});
        }
        req.flash('success_msg', 'Materiale creato con successo!');
        next();
    });
}, materialController.uploadMaterial);

//Download material with id given GET Route
router.get('/materials/download/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).send('ID materiale non valido');
        }

        const material = await Material.findByPk(id);

        if (!material) {
            return res.status(404).send('Materiale non trovato');
        }

        const filename = path.basename(material.file_url);
        const filePath = path.join(uploadPath, filename);

        if (!fs.existsSync(filePath)) {
            return res.status(404).send('File non trovato');
        }

        res.download(filePath, filename, async (err) => {
            if (err) {
                console.error('Errore durante il download:', err);

                if (!res.headersSent) {
                    res.status(500).send('Errore interno durante il download');
                }
            }else{
                try {
                    await material.increment('download_count', {by: 1});
                } catch (error) {
                    console.error('Errore aggiornamento download_count:', error);
                }
            }
        });

    } catch (error) {
        console.error('Errore nel download:', error);
        res.status(500).send('Errore interno del server');
    }
});

module.exports = router;