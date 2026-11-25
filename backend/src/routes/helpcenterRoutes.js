const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

const helpcenterController = require('../controllers/helpcenterController');

router.get('/help-center', async (req,res) =>{
    const today = await helpcenterController.todayRequests();
    const user = await helpcenterController.userRequests(req);
    res.render('helpcenter', {layout: "main", title: "Help Center", styles: ["home.css","navbar.css","searchbar.css","materials.css"], scripts: ["helpcenter.js"], requests_today: today, requests_user: user});
});

router.post('/help-center/chat/resolved/:requestId', helpcenterController.closeChat);
router.get('/help-center/new-request', (req,res) =>{
    res.render('new-request', {layout: "main", styles: ["navbar.css","searchbar.css","materials.css","home.css","upload.css"], scripts: []});
});

router.get('/help-center/:requestId', helpcenterController.showChatPage);

router.post('/help-center/add-request', helpcenterController.addRequest);

//Async research
router.get("/api/requests/search", helpcenterController.searchRequest);


module.exports = router;