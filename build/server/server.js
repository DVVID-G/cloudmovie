"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Server module
 * Initializes the Express application with JSON parsing, logging, and mounts API routes.
 * @module server
 */
const express = require('express');
const morgan = require('morgan');
const routesFactory = require('@/routes/routes');
const app = express();
app.use(express.json());
app.use(morgan('dev'));
/**
 * Mount versioned API routes.
 * routesFactory is expected to be a function returning an Express Router.
 */
app.use('/api/v1', routesFactory());
module.exports = app;
//# sourceMappingURL=server.js.map