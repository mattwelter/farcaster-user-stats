import { pool } from '../db';
import redis from '../../utils/redis';

export async function GET(request) {
    const { searchParams } = new URL(request.url)
    const fid = searchParams.get('fid')

    const headers = new Headers();
    headers.set('Access-Control-Allow-Origin', '*');

    if (!fid) {
        return new Response({ headers }).json({ error: 'Missing fid parameter' });
    }

    try {
        const cacheKey = `mostlikedcasts:${fid}`;
        let cachedData = await redis.get(cacheKey);
    
        if (cachedData) {
            return new Response({ headers }).json(JSON.parse(cachedData));
        } else {
            const startTime = Date.now();

            const getCasts = await fetch(`https://api.neynar.com/v2/farcaster/feed/user/${fid}/popular?api_key=${process.env.NEYNAR_API_KEY}`, { method: "GET" });
            const res = await getCasts.json();
            let data = res.casts;
            console.log({ "casts": data })

            const endTime = Date.now();
            const timeDiff = endTime - startTime;
            const timeInSeconds = timeDiff / 1000;
            console.log("MostLikedCasts took", timeInSeconds, "seconds")

            redis.set(cacheKey, JSON.stringify(data), 'EX', 7200); // 2 hours
            return new Response({ headers }).json(data);
        }
    } catch (error) {
        console.error('Error fetching most liked casts:', error);
        return new Response({ headers }).json({ message: 'Internal server error', error: error });
    }
};
