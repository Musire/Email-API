require('dotenv').config();
const bodyParser = require('body-parser')
const cors = require('cors')
const emailRoute = require('./routes/api')

const express = require('express');
const app = express()

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api', emailRoute);

module.exports = app;