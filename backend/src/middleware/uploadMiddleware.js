const multer = require('multer');
const path = require('path');
const fs = require('fs');

//File Name & Path Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.resolve(__dirname, '../../uploads');
        if(!fs.existsSync(uploadPath)){
            fs.mkdirSync(uploadPath, {recursive:true});
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

//PDF / JPEG / PNG / DOCX Filter
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/png', 'image/jpeg', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowedTypes.includes(file.mimetype)){
        cb(null, true);
    } else{
        cb(new Error('Formato file non supportato!'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {fileSize: 5*1024*1024}
});

module.exports = upload;