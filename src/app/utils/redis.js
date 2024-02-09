import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL); // Connects to 127.0.0.1:6379 by default, configure as needed

export default redis;