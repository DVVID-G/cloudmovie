/**
 * Pexels service: minimal client for Pexels Videos API.
 * Requires PEXELS_API_KEY in environment variables.
 */
import https from 'https';

const PEXELS_API_KEY = process.env.PEXELS_API_KEY;
const BASE_URL = 'https://api.pexels.com/videos';

if (!PEXELS_API_KEY) {
  console.warn('PEXELS_API_KEY is not set. Pexels API calls will fail.');
}

/**
 * Perform a GET request to Pexels API and parse JSON response
 * @param {string} path - API path starting with '/'
 * @returns {Promise<any>} Parsed JSON
 */
function fetchJson(path: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const url = `${BASE_URL}${path}`;
    const req = https.request(url, {
      method: 'GET',
      headers: { Authorization: PEXELS_API_KEY as string },
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const json = JSON.parse(data || '{}');
          resolve(json);
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

/**
 * Search videos in Pexels
 * @param {string} query
 * @param {number} [page=1]
 * @param {number} [per_page=10]
 */
export async function searchVideos(query: string, page = 1, per_page = 10) {
  const q = encodeURIComponent(query);
  return await fetchJson(`/search?query=${q}&page=${page}&per_page=${per_page}`);
}

/**
 * Get popular videos from Pexels
 * @param {number} [page=1]
 * @param {number} [per_page=10]
 */
export async function popularVideos(page = 1, per_page = 10) {
  return await fetchJson(`/popular?page=${page}&per_page=${per_page}`);
}

/**
 * Get Pexels video metadata by id
 * @param {number} id - Pexels video id
 */
export async function videoDetails(id: number) {
  return await fetchJson(`/videos/${id}`);
}

module.exports = { searchVideos, popularVideos, videoDetails };
