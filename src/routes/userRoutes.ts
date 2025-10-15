/**
 * User routes: CRUD, login, and password reset endpoints.
 * @module routes/user
 */
const express = require('express');
const { Request, Response } = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');
/** Create user */
router.post('/', (req: Request, res: Response) => userController.create(req, res));
/** List users */
router.get('/', (req: Request, res: Response) => userController.list(req, res));
/** Read user */
router.get('/:id', (req: Request, res: Response) => userController.read(req, res));
/** Update user */
router.put('/:id', (req: Request, res: Response) => userController.update(req, res));
/** Delete user */
router.delete('/:id', (req: Request, res: Response) => userController.delete(req, res));
/** Login */
router.post('/login', (req: Request, res: Response) => userController.login(req, res));
/** Request password reset */
router.post('/forgot-password', (req: Request, res: Response) => userController.forgotPassword(req, res));
/** Reset password */
router.post('/reset-password', (req: Request, res: Response) => userController.resetPassword(req, res));

module.exports = router;