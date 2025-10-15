"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * User routes: CRUD, login, and password reset endpoints.
 * @module routes/user
 */
const express = require('express');
const { Request, Response } = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');
const auth = require('../middleware/auth');
/** Create user */
router.post('/', (req, res) => userController.create(req, res));
/** List users (protected) */
router.get('/', auth, (req, res) => userController.list(req, res));
/** Read user (protected) */
router.get('/:id', auth, (req, res) => userController.read(req, res));
/** Update user (protected) */
router.put('/:id', auth, (req, res) => userController.update(req, res));
/** Delete user (protected) */
router.delete('/:id', auth, (req, res) => userController.delete(req, res));
/** Login */
router.post('/login', (req, res) => userController.login(req, res));
/** Request password reset */
router.post('/forgot-password', (req, res) => userController.forgotPassword(req, res));
/** Reset password */
router.post('/reset-password', (req, res) => userController.resetPassword(req, res));
/** Logout (protected) */
router.post('/logout', require('../middleware/auth'), (req, res) => userController.logout(req, res));
module.exports = router;
//# sourceMappingURL=userRoutes.js.map