const { GlobalDao } = require('./globalDao');
const userModel = require('../model/user');

class UserDao extends GlobalDao {
    constructor() {
        super(userModel);
    }

    async findByEmail(email: string) {
        return await this.model.findOne({ email: email.toLowerCase().trim() }).lean(false);
    }
}

module.exports = { UserDao, userDao: new UserDao() };