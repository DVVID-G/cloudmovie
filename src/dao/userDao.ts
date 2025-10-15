/** Data access for Users with auth helpers. */
const { GlobalDao } = require('./globalDao');
const userModel = require('../model/user');

class UserDao extends GlobalDao {
    constructor() {
        super(userModel);
    }

    /**
     * Find a user by email
     * @param {string} email - User email to search (case-insensitive)
     * @returns {Promise<any|null>} The Mongoose document or null
     */
    async findByEmail(email: string) {
        return await this.model.findOne({ email: email.toLowerCase().trim() }).lean(false);
    }

    /**
     * Set a password reset token hash and expiration for an email
     * @param {string} email
     * @param {string} tokenHash - SHA256 hash of the reset token
     * @param {Date} expiresAt - Expiration datetime
     */
    async setResetToken(email: string, tokenHash: string, expiresAt: Date) {
        const emailNorm = email.toLowerCase().trim();
        return await this.model.findOneAndUpdate(
            { email: emailNorm },
            { resetPasswordTokenHash: tokenHash, resetPasswordExpiresAt: expiresAt },
            { new: true }
        );
    }

    /**
     * Find a user by email and valid (non-expired) reset token hash
     * @param {string} email
     * @param {string} tokenHash - SHA256 hash of the reset token
     */
    async findByResetToken(email: string, tokenHash: string) {
        const emailNorm = email.toLowerCase().trim();
        return await this.model.findOne({
            email: emailNorm,
            resetPasswordTokenHash: tokenHash,
            resetPasswordExpiresAt: { $gt: new Date() }
        }).lean(false);
    }

    /**
     * Update user's password and clear reset fields; triggers hashing via pre-save hook
     * @param {string} userId
     * @param {string} newPassword
     */
    async updatePasswordAndClearReset(userId: string, newPassword: string) {
        const user = await this.model.findById(userId).lean(false);
        if (!user) return null;
        // Set new password and clear reset fields; pre('save') will hash the password
        user.password = newPassword;
        user.resetPasswordTokenHash = null;
        user.resetPasswordExpiresAt = null;
        await user.save();
        return user;
    }
}

module.exports = { UserDao, userDao: new UserDao() };