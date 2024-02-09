import Redis from 'ioredis';

const redis = new Redis(); // Connects to 127.0.0.1:6379 by default, configure as needed

export default redis;