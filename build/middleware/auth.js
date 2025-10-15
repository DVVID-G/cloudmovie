"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require('jsonwebtoken');
/**
 * Express middleware to verify JWT from Authorization header (Bearer token).
 * On success attaches decoded payload to req.user; otherwise responds 401/403.
 */
function authMiddleware(req, res, next) {
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    if (!authHeader || typeof authHeader !== 'string' || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Missing or invalid Authorization header' });
    }
    const token = authHeader.substring('Bearer '.length);
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        console.error('JWT_SECRET not configured');
        return res.status(500).json({ error: 'Server misconfiguration' });
    }
    try {
        const payload = jwt.verify(token, secret);
        req.user = payload;
        next();
    }
    catch (err) {
        return res.status(403).json({ error: 'Invalid or expired token' });
    }
}
module.exports = authMiddleware;
//# sourceMappingURL=auth.js.map