"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto = require('crypto');
const mailerService = require('./mailerService');
const { userDao } = require('../dao/userDao');
/**
 * UserService provides higher-level user operations such as password reset flows.
 */
class UserService {
    /**
     * Initiates a password reset flow by generating a token and sending an email.
     * Returns a generic response regardless of user existence to avoid enumeration.
     * @param {string} email
     * @returns {Promise<{sent: boolean}>}
     */
    async requestPasswordReset(email) {
        const user = await userDao.findByEmail(email);
        // Always respond as if email was sent (avoid user enumeration)
        const ttlMs = Number(process.env.RESET_TTL_MS || 1000 * 60 * 15); // default 15 minutes
        const appUrl = process.env.APP_URL || 'http://localhost:4000';
        // If user doesn't exist, do nothing but mimic success
        if (!user) {
            return { sent: true };
        }
        const token = crypto.randomBytes(32).toString('hex');
        const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
        const expiresAt = new Date(Date.now() + ttlMs);
        await userDao.setResetToken(email, tokenHash, expiresAt);
        const resetUrl = `${appUrl}/reset-password?email=${encodeURIComponent(email)}&token=${token}`;
        try {
            await mailerService.sendPasswordResetEmail(email, resetUrl);
        }
        catch (e) {
            console.warn('Fallo al enviar email de recuperación:', e);
            // No revelamos el fallo al cliente para evitar enumeración
        }
        return { sent: true };
    }
    /**
     * Completes a password reset given email, token, and a new password.
     * @param {string} email
     * @param {string} token
     * @param {string} newPassword
     * @returns {Promise<{ok: boolean, error?: string}>}
     */
    async resetPassword(email, token, newPassword) {
        const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
        const user = await userDao.findByResetToken(email, tokenHash);
        if (!user) {
            return { ok: false, error: 'Token inválido o expirado' };
        }
        await userDao.updatePasswordAndClearReset(user._id, newPassword);
        return { ok: true };
    }
}
module.exports = new UserService();
//# sourceMappingURL=userServices.js.map