const express = require('express');
const { Request, Response } = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');

router.post('/', (req: Request, res: Response) => userController.create(req, res));
router.get('/', (req: Request, res: Response) => userController.list(req, res));
router.get('/:id', (req: Request, res: Response) => userController.read(req, res));
router.put('/:id', (req: Request, res: Response) => userController.update(req, res));
router.delete('/:id', (req: Request, res: Response) => userController.delete(req, res));

module.exports = router;