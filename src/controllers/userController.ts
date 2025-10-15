const GlobalController = require('./globalController');
const { userDao } = require('../dao/userDao');

class UserController extends GlobalController {
    constructor() {
        super(userDao);
    }
}

module.exports = new UserController();