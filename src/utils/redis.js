import Redis from 'ioredis'

const redis = new Redis(6379, 'redis')

const redisClient = () => new Redis(6379, 'redis')

module.exports = { redis, redisClient }
