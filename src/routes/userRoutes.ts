/**
 * User routes: CRUD, login, logout and password reset endpoints.
 * @module routes/user
 */
const express = require('express');
const { Request, Response } = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');
const auth = require('../middleware/auth');
/** Create user */
router.post('/', (req: Request, res: Response) => userController.create(req, res));
/** List users (protected) */
router.get('/', auth, (req: Request, res: Response) => userController.list(req, res));
/** Read user (protected) */
router.get('/:id', auth, (req: Request, res: Response) => userController.read(req, res));
/** Update user (protected) */
router.put('/:id', auth, (req: Request, res: Response) => userController.update(req, res));
/** Delete user (protected) */
router.delete('/:id', auth, (req: Request, res: Response) => userController.delete(req, res));
/** Login */
router.post('/login', (req: Request, res: Response) => userController.login(req, res));
/** Request password reset */
router.post('/forgot-password', (req: Request, res: Response) => userController.forgotPassword(req, res));
/** Reset password */
router.post('/reset-password', (req: Request, res: Response) => userController.resetPassword(req, res));
/** Logout (protected) */
router.post('/logout', auth, (req: Request, res: Response) => userController.logout(req, res));

module.exports = router;