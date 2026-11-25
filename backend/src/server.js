const express = require('express');
const multer = require('multer');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = require('./app');


const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server in funzione nella porta ${PORT}`);
})