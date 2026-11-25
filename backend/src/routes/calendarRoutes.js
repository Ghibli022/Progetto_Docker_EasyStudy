const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

router.get("/calendar", async (req, res) => {
    res.render('calendar', {layout: "main", title: "Calendar", styles: ["navbar.css","home.css"]});
});

module.exports = router;