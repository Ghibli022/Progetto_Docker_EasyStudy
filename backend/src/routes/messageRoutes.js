const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const helpcenterController = require('../controllers/helpcenterController');


router.post('/help-center/chat/addMessage/:requestId', messageController.saveMessage);

module.exports = router;