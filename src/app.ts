const dotenv = require('dotenv');
dotenv.config();

const app = require('@server/server');
const { connectToDatabase } = require('./config/db');

connectToDatabase().catch((error: unknown) => {
  console.error('Failed to connect to the database:', error);
  process.exit(1);
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log('Server is running on port ' + PORT);
});

module.exports = app;

