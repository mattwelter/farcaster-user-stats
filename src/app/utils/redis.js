import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST, // Hostname of the Redis server
  port: process.env.REDIS_PORT, // Port, typically 6379
  password: process.env.REDIS_PASSWORD, // Redis password
});

export default redis;