const Redis = require('ioredis');
const config = require('../config/config');

// const redis = new Redis(config.redis.url);

const redis = {
  get: async (key) => null,
  set: async (key, value, ttl) => null,
  del: async (key) => null
};

module.exports = redis;
