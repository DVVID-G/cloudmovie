const { GlobalDao } = require('./globalDao');
const userModel = require('../model/user');

class UserDao extends GlobalDao {
    constructor() {
        super(userModel);
    }
}

module.exports = { UserDao, userDao: new UserDao() };