var express = require('express');
var helmet = require('helmet');
var indexRouter = require('./routes/index');

var app = express();
app.use(helmet())

app.use(express.json());

app.use('/', indexRouter);

module.exports = app;
