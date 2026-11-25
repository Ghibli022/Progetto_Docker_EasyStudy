const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

router.get('/ai', async (req,res) =>{
    res.render('ai-tools', {layout: "main", title: "AI Tools", styles: ["home.css","navbar.css","searchbar.css"]});
});


module.exports = router;