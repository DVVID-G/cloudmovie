const app = require('@server/server');
const dotenv = require('dotenv');
const { connectToDatabase } = require('./config/db');
const morgan = require('morgan');

connectToDatabase().catch((error: unknown) => {
  console.error('Failed to connect to the database:', error);
  process.exit(1);
});

dotenv.config();

const PORT = process.env.PORT || 4000;

app.use(morgan('dev'));

app.listen(PORT, () => {
  console.log('Server is running on port ' + PORT);
});

module.exports = app;

