const express = require('express');
const morgan = require('morgan');
const routesFactory = require('@/routes/routes');

const app = express();

app.use(express.json());
app.use(morgan('dev'));

// routesFactory expected to be a function returning a router
app.use('/api/v1', routesFactory());

module.exports = app;