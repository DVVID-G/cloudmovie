const { GlobalDao } = require('./globalDao');
const userModel = require('../model/user');

class UserDao extends GlobalDao {
    constructor() {
        super(userModel);
    }

    async findByEmail(email: string) {
        return await this.model.findOne({ email: email.toLowerCase().trim() }).lean(false);
    }

    async setResetToken(email: string, tokenHash: string, expiresAt: Date) {
        const emailNorm = email.toLowerCase().trim();
        return await this.model.findOneAndUpdate(
            { email: emailNorm },
            { resetPasswordTokenHash: tokenHash, resetPasswordExpiresAt: expiresAt },
            { new: true }
        );
    }

    async findByResetToken(email: string, tokenHash: string) {
        const emailNorm = email.toLowerCase().trim();
        return await this.model.findOne({
            email: emailNorm,
            resetPasswordTokenHash: tokenHash,
            resetPasswordExpiresAt: { $gt: new Date() }
        }).lean(false);
    }

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