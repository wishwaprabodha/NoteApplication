const Redis = require('ioredis');
const dotenv = require('dotenv');
const logger = require('../../utils/logger/logger');

dotenv.config({ path: '.env' });

let redisClient;

function createConnection () {
    try {
        const client = new Redis({
            host: process.env.REDIS_HOST || '127.0.0.1',
            port: process.env.REDIS_PORT || 6379,
            password: process.env.REDIS_PASSWORD || null,
        });

        client.on('connect', () => logger.info('Redis client connected'));
        client.on('error', (err) => logger.error('Redis client error:', err));

        redisClient = client;
        logger.info('Connected to Redis');
        return redisClient;
    } catch (error) {
        logger.error('Failed to connect to Redis', error.message);
        throw error;
    }
};

function getRedisClient ()  {
    if (redisClient) {
        logger.info('Using existing Redis connection');
        return redisClient;
    }
    redisClient = createConnection();
    return redisClient;
}

async function invalidateCache(cacheKey) {
    try {
        const result = await redisClient.del(cacheKey);
        if (result === 1) {
            logger.info(`Cache invalidated for Key: ${cacheKey}`);
        } else {
            logger.info(`No cache found to invalidate for Key: ${cacheKey}`);
        }
    } catch (error) {
        logger.error(`Error invalidating cache for Key: ${cacheKey}`, error.message);
    }
}

module.exports = {
    getRedisClient,
    invalidateCache
};