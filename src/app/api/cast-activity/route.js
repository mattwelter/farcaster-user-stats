import { pool } from '../db'; // Adjust the import path as needed
import redis from '../../utils/redis';

export async function GET(request) {
    const { searchParams } = new URL(request.url)
    const fid = searchParams.get('fid')
    const day = searchParams.get('day')

    if (!fid) {
        return Response.json({ error: 'Missing fid parameter' });
    }
    if (!day) {
        return Response.json({ error: 'Missing day parameter' });
    }

    const fidBigInt = parseInt(fid, 10);
    if (isNaN(fidBigInt)) {
        return Response.json({ error: 'Invalid fid parameter. Must be an integer.' });
    }

    try {
        const cacheKey = `castactivity:${fid}`;
        let cachedData = await redis.get(cacheKey);
    
        if (cachedData) {
            return Response.json(JSON.parse(cachedData));
        } else {
            const startTime = Date.now();
            const client = await pool.connect();
            const response = await pool.query(`
                WITH date_range AS (
                    SELECT NOW() - (n || ' days')::interval AS date
                    FROM generate_series(0, $2) AS n
                )
                SELECT DATE(date_range.date) AS date,
                    COUNT(casts.timestamp) AS castamount
                FROM date_range
                LEFT JOIN casts
                ON DATE(date_range.date) = DATE(casts.timestamp)
                AND casts.fid = $1
                GROUP BY DATE(date_range.date)
                ORDER BY DATE(date_range.date);`, [fidBigInt, day]);
            client.release();
            const data = response.rows;
            
            redis.set(cacheKey, JSON.stringify(data), 'EX', 7200); // 2 hours

            const endTime = Date.now();
            const timeInSeconds = (endTime - startTime) / 1000;
            console.log("CastActivity took", timeInSeconds, "seconds")

            return Response.json(data);
        }
    } catch (error) {
        console.error('Error fetching active badge:', error);
        return Response.json({ message: 'Internal server error', error: error });
    }
};
