"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GlobalController = require('./globalController');
const { userDao } = require('../dao/userDao');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userService = require('../services/userServices');
/**
 * UserController extends the base CRUD controller with auth endpoints.
 */
class UserController extends GlobalController {
    constructor() {
        super(userDao);
    }
    /**
     * POST /api/v1/users/login
     * Authenticate a user using email and password.
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async login(req, res) {
        try {
            const { email, password } = req.body || {};
            if (!email || !password) {
                return res.status(400).json({ error: 'Email y password son requeridos' });
            }
            const user = await userDao.findByEmail(email);
            // Para no filtrar información, usa mensaje genérico
            if (!user || !user.password) {
                return res.status(401).json({ error: 'Credenciales inválidas' });
            }
            const ok = await bcrypt.compare(password, user.password);
            if (!ok) {
                return res.status(401).json({ error: 'Credenciales inválidas' });
            }
            // Sanitiza salida (no expongas password)
            const { password: _pwd, ...safe } = user.toObject ? user.toObject() : user;
            // Issue JWT
            const secret = process.env.JWT_SECRET;
            if (!secret) {
                console.error('JWT_SECRET not configured');
                return res.status(500).json({ error: 'Server misconfiguration' });
            }
            const expiresIn = process.env.JWT_EXPIRES_IN || '1h';
            const token = jwt.sign({ sub: user._id.toString(), email: user.email }, secret, { expiresIn });
            return res.status(200).json({ user: safe, token });
        }
        catch (err) {
            console.error('Login error:', err);
            return res.status(500).json({ error: 'Error interno en login' });
        }
    }
    /**
     * POST /api/v1/users/forgot-password
     * Generate and email a password reset link if the email exists.
     * Always returns a generic message to avoid user enumeration.
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async forgotPassword(req, res) {
        try {
            const { email } = req.body || {};
            if (!email)
                return res.status(400).json({ error: 'Email es requerido' });
            await userService.requestPasswordReset(email);
            return res.status(200).json({ message: 'Si el correo existe, se envió un email con instrucciones' });
        }
        catch (err) {
            console.error('forgotPassword error:', err);
            return res.status(500).json({ error: 'Error interno' });
        }
    }
    /**
     * POST /api/v1/users/reset-password
     * Reset password using email, token from email, and new password.
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async resetPassword(req, res) {
        try {
            const { email, token, newPassword } = req.body || {};
            if (!email || !token || !newPassword) {
                return res.status(400).json({ error: 'Email, token y nueva contraseña son requeridos' });
            }
            const result = await userService.resetPassword(email, token, newPassword);
            if (!result.ok) {
                return res.status(400).json({ error: result.error || 'No se pudo restablecer la contraseña' });
            }
            return res.status(200).json({ message: 'Contraseña actualizada correctamente' });
        }
        catch (err) {
            console.error('resetPassword error:', err);
            return res.status(500).json({ error: 'Error interno' });
        }
    }
    /**
     * POST /api/v1/users/logout
     * Stateless logout: the client should delete its token. Server doesn't persist revocations.
     */
    async logout(req, res) {
        try {
            // If you set auth cookies, clear them here (no-op if not using cookies)
            try {
                res.clearCookie?.('access_token');
            }
            catch { }
            try {
                res.clearCookie?.('refresh_token');
            }
            catch { }
            return res.status(200).json({ message: 'Logged out' });
        }
        catch (err) {
            console.error('logout error:', err);
            return res.status(500).json({ error: 'Internal error' });
        }
    }
}
module.exports = new UserController();
//# sourceMappingURL=userController.js.map