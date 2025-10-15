/**
 * Movie routes: explore catalog via Pexels, CRUD and playback controls.
 * @module routes/movies
 */
const express = require('express');
const { Request, Response } = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');
const auth = require('../middleware/auth');

/** Explore catalog from Pexels */
router.get('/explore', (req: any, res: any) => movieController.explore(req, res));

/** Movie CRUD through GlobalController (optional) */
router.post('/', auth, (req: Request, res: Response) => movieController.create(req, res));
router.get('/', (req: Request, res: Response) => movieController.list(req, res));
router.get('/:id', (req: Request, res: Response) => movieController.read(req, res));
router.put('/:id', auth, (req: Request, res: Response) => movieController.update(req, res));
router.delete('/:id', auth, (req: Request, res: Response) => movieController.delete(req, res));

/** Playback controls (protected) */
router.post('/:id/play', auth, (req: Request, res: Response) => movieController.play(req, res));
router.post('/:id/pause', auth, (req: Request, res: Response) => movieController.pause(req, res));
router.post('/:id/stop', auth, (req: Request, res: Response) => movieController.stop(req, res));

module.exports = router;
