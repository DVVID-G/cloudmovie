const { GlobalDao } = require('./globalDao');
const playSessionModel = require('../model/playSession');

class PlaySessionDao extends GlobalDao {
  constructor() {
    super(playSessionModel);
  }

  /**
   * Upsert a play session for a given user and movie
   * @param {string} userId
   * @param {string} movieId
   * @param {any} data - Partial session fields to set
   */
  async upsert(userId: string, movieId: string, data: any) {
    return await this.model.findOneAndUpdate(
      { userId, movieId },
      { $set: data },
      { new: true, upsert: true }
    );
  }

  /**
   * Set the playback status and optionally position
   * @param {string} userId
   * @param {string} movieId
   * @param {'playing'|'paused'|'stopped'} status
   * @param {number} [positionSec]
   */
  async setStatus(userId: string, movieId: string, status: 'playing' | 'paused' | 'stopped', positionSec?: number) {
    const update: any = { status, updatedAt: new Date() };
    if (typeof positionSec === 'number') update.positionSec = positionSec;
    return await this.model.findOneAndUpdate(
      { userId, movieId },
      { $set: update },
      { new: true, upsert: true }
    );
  }
}

module.exports = { PlaySessionDao, playSessionDao: new PlaySessionDao() };
