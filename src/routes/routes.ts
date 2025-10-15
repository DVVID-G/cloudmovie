const express = require('express');
const userRoutes = require('./userRoutes');

function buildRoutes() {
  const router = express.Router();
  router.get('/health', (_req: any, res: any) => {
    res.send('api is healthy');
  });
  router.use('/users', userRoutes);
  return router;
}

module.exports = buildRoutes;

