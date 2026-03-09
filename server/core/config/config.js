require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5000,
  db: {
    url: process.env.DATABASE_URL
  },
  redis: {
    url: process.env.REDIS_URL
  },
  jwtSecret: process.env.JWT_SECRET || 'yoursecretkey'
};
