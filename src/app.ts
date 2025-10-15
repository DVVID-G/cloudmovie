/**
 * Application entrypoint.
 * Loads environment variables, connects to the database, and starts the HTTP server.
 */
const dotenv = require('dotenv');
dotenv.config();

const app = require('@server/server');
const { connectToDatabase } = require('./config/db');

connectToDatabase().catch((error: unknown) => {
  console.error('Failed to connect to the database:', error);
  process.exit(1);
});

/**
 * Port where the HTTP server will listen.
 * @type {number|string}
 */
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log('Server is running on port ' + PORT);
});

module.exports = app;

