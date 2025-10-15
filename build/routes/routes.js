"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * API Routes factory.
 * Creates the versioned API root router with health check and feature routers.
 * @returns {import('express').Router} Express Router instance
 */
const express = require('express');
const userRoutes = require('./userRoutes');
/**
 * Build and return the root router for API v1.
 * @returns {import('express').Router}
 */
function buildRoutes() {
    const router = express.Router();
    router.get('/health', (_req, res) => {
        res.send('api is healthy');
    });
    router.use('/users', userRoutes);
    return router;
}
module.exports = buildRoutes;
//# sourceMappingURL=routes.js.map