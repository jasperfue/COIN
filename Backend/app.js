var express = require('express');
var helmet = require('helmet');
var indexRouter = require('./routes/index');
const cors = require('cors');

var app = express();
app.use(cors());
app.use(helmet())

app.use(express.json());

app.use('/', indexRouter);

module.exports = app;
