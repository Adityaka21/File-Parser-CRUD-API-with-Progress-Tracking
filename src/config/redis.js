const { Redis } = require('ioredis');

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

redis.on('connect',() => console.log('Redis connected successfully'));
redis.on('error',(error) => console.error('Redis connection failed:', error.message));

module.exports = redis;
