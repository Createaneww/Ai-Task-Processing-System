import Redis from 'ioredis';

const redis = new Redis({
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: parseInt(process.env.REDIS_PORT) || 6379,
    retryStrategy: (times) => {
        const delay = Math.min(times * 100, 3000);
        console.log(`Redis reconnecting in ${delay}ms (attempt ${times})`);
        return delay;
    },
    maxRetriesPerRequest: null,
});

redis.on('connect', () => console.log('Redis connected'));
redis.on('error', (err) => console.error(`Redis error: ${err.message}`));

export default redis;