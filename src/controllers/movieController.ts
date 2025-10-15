/**
 * MovieController: manages movie CRUD, exploration via Pexels and playback state.
 */
const GlobalController = require('./globalController');
const { movieDao } = require('../dao/movieDao');
const { playSessionDao } = require('../dao/playSessionDao');
const pexels = require('../services/pexelsService');

class MovieController extends GlobalController {
  constructor() {
    super(movieDao);
  }

  /**
   * Explore Pexels video catalog
   * GET /api/v1/movies/explore?query=&page=&per_page=&popular=true
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async explore(req: any, res: any) {
    try {
      const { query = '', page = '1', per_page = '10', popular } = req.query || {};
      const p = Math.max(1, parseInt(page as string, 10) || 1);
      const pp = Math.min(80, Math.max(1, parseInt(per_page as string, 10) || 10));
      let data;
      if (popular === 'true') {
        data = await pexels.popularVideos(p, pp);
      } else if (query) {
        data = await pexels.searchVideos(String(query), p, pp);
      } else {
        data = await pexels.popularVideos(p, pp);
      }
      return res.status(200).json(data);
    } catch (err) {
      console.error('explore error:', err);
      return res.status(500).json({ error: 'No se pudo obtener catálogo de Pexels' });
    }
  }

  /**
   * Start or resume playback
   * POST /api/v1/movies/:id/play
   * @param {import('express').Request} req - body: { positionSec?: number }
   * @param {import('express').Response} res
   */
  async play(req: any, res: any) {
    try {
      const userId = req.user?.sub;
      const movieId = req.params.id;
      if (!userId) return res.status(401).json({ error: 'No autenticado' });
      const positionSec = typeof req.body?.positionSec === 'number' ? req.body.positionSec : 0;
      const session = await playSessionDao.setStatus(userId, movieId, 'playing', positionSec);
      return res.status(200).json(session);
    } catch (err) {
      console.error('play error:', err);
      return res.status(500).json({ error: 'No se pudo iniciar reproducción' });
    }
  }

  /**
   * Pause playback at a given position
   * POST /api/v1/movies/:id/pause
   * @param {import('express').Request} req - body: { positionSec: number }
   * @param {import('express').Response} res
   */
  async pause(req: any, res: any) {
    try {
      const userId = req.user?.sub;
      const movieId = req.params.id;
      const positionSec = req.body?.positionSec;
      if (!userId) return res.status(401).json({ error: 'No autenticado' });
      if (typeof positionSec !== 'number') return res.status(400).json({ error: 'positionSec requerido' });
      const session = await playSessionDao.setStatus(userId, movieId, 'paused', positionSec);
      return res.status(200).json(session);
    } catch (err) {
      console.error('pause error:', err);
      return res.status(500).json({ error: 'No se pudo pausar' });
    }
  }

  /**
   * Stop playback and reset position
   * POST /api/v1/movies/:id/stop
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async stop(req: any, res: any) {
    try {
      const userId = req.user?.sub;
      const movieId = req.params.id;
      if (!userId) return res.status(401).json({ error: 'No autenticado' });
      const session = await playSessionDao.setStatus(userId, movieId, 'stopped', 0);
      return res.status(200).json(session);
    } catch (err) {
      console.error('stop error:', err);
      return res.status(500).json({ error: 'No se pudo detener' });
    }
  }
}

module.exports = new MovieController();
