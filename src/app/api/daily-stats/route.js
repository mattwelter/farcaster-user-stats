import { pool } from '../db'; // Adjust the import path as needed
import redis from '../../utils/redis';

export async function GET(request) {
    const { searchParams } = new URL(request.url)
    const fid = searchParams.get('fid')
    
    const headers = new Headers();
    headers.set('Access-Control-Allow-Origin', '*');

    if (!fid) {
        return Response.json({ error: 'Missing fid parameter' }, { headers });
    }

    try {
        const cacheKey = `dailystats:${fid}`;
        let cachedData = await redis.get(cacheKey);
    
        if (cachedData) {
            return Response.json(JSON.parse(cachedData), { headers });
        } else {
            const startTime = Date.now();
            const client = await pool.connect();
            const response = await pool.query(`WITH Following AS (
                SELECT 
                    DATE(timestamp) AS date,
                    COUNT(DISTINCT target_fid) AS following_count,
                    SUM(COUNT(DISTINCT target_fid)) OVER (ORDER BY DATE(timestamp) ASC ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS following_running_total
                FROM links
                WHERE fid = $1
                AND deleted_at IS NULL
                GROUP BY DATE(timestamp)
            ),
            Followers AS (
                SELECT 
                    DATE(timestamp) AS date,
                    COUNT(DISTINCT fid) AS followers_count,
                    SUM(COUNT(DISTINCT fid)) OVER (ORDER BY DATE(timestamp) ASC ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS followers_running_total
                FROM links
                WHERE target_fid = $1
                AND deleted_at IS NULL
                GROUP BY DATE(timestamp)
                HAVING COUNT(DISTINCT fid) > 0
            ),
            Casts AS (
                SELECT 
                    DATE(timestamp) AS date,
                    COUNT(DISTINCT id) AS cast_count,
                    SUM(COUNT(DISTINCT id)) OVER (ORDER BY DATE(timestamp) ASC ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS casts_running_total
                FROM casts
                WHERE fid = $1
                AND deleted_at IS NULL
                GROUP BY DATE(timestamp)
            )
            SELECT 
                COALESCE(Following.date, Followers.date, Casts.date) AS date,
                Following.following_count,
                Following.following_running_total,
                Followers.followers_count,
                Followers.followers_running_total,
                Casts.cast_count,
                Casts.casts_running_total
            FROM Following
            FULL OUTER JOIN Followers ON Following.date = Followers.date
            FULL OUTER JOIN Casts ON COALESCE(Following.date, Followers.date) = Casts.date
            ORDER BY date DESC
            LIMIT 28;`, [fid]);
            client.release()
            const data = response.rows;

            let newData = data.map((item) => ({
                ...item,
                date: new Date(item.date).toLocaleDateString(), 
            }));

            redis.set(cacheKey, JSON.stringify(newData), 'EX', 7200); // 2 hours

            const endTime = Date.now();
            const timeInSeconds = (endTime - startTime) / 1000;
            console.log("DailyStats took", timeInSeconds, "seconds")

            return Response.json(newData), { headers };
        }
    } catch (error) {
        console.error('Error fetching daily stats:', error);
        return Response.json({ message: 'Internal server error', error: error }, { headers });
    }
};
