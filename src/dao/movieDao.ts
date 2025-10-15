const { GlobalDao } = require('./globalDao');
const movieModel = require('../model/movie');

class MovieDao extends GlobalDao {
  constructor() {
    super(movieModel);
  }

  /**
   * Find a movie by its Pexels video id
   * @param {number} pexelsVideoId
   * @returns {Promise<any|null>}
   */
  async findByPexelsId(pexelsVideoId: number) {
    return await this.model.findOne({ pexelsVideoId }).lean();
  }
}

module.exports = { MovieDao, movieDao: new MovieDao() };
