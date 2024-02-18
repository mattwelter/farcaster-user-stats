import { pool } from '../db';
import redis from '../../utils/redis';

export async function GET(request) {
    const { searchParams } = new URL(request.url)
    const fid = searchParams.get('fid')

    const headers = new Headers();
    headers.set('Access-Control-Allow-Origin', '*');

    if (!fid) {
        return new Response.json({ error: 'Missing fid parameter' }, { headers });
    }

    try {
        const cacheKey = `followers:${fid}`;
        let cachedData = await redis.get(cacheKey);
    
        if (cachedData) {
            return new Response.json(JSON.parse(cachedData), { headers });
        } else {
            const startTime = Date.now();
            const client = await pool.connect();
            const response = await pool.query(`WITH time_boundaries AS (
                SELECT generate_series(
                    NOW() - INTERVAL '168 hours',
                    NOW(),
                    INTERVAL '4 hours'
                ) AS start_time
            ),
            counts AS (
                SELECT
                    tb.start_time,
                    COUNT(l.id) AS count
                FROM
                    time_boundaries tb
                    LEFT JOIN links l ON l.created_at >= tb.start_time AND l.created_at < tb.start_time + INTERVAL '4 hours'
                    AND l.target_fid = $1::integer
                GROUP BY
                    tb.start_time
            ),
            totals AS (
                SELECT
                    COUNT(*) FILTER (WHERE created_at BETWEEN NOW() - INTERVAL '7 days' AND NOW()) AS total_this_week,
                    COUNT(*) FILTER (WHERE created_at BETWEEN NOW() - INTERVAL '14 days' AND NOW() - INTERVAL '7 days') AS total_last_week
                FROM
                    links
                WHERE
                    target_fid = $1::integer
            )
            SELECT
                ARRAY(SELECT count FROM counts ORDER BY start_time) AS daily_counts,
                total_this_week,
                total_last_week,
                CASE
                    WHEN total_last_week = 0 THEN NULL
                    ELSE (total_this_week - total_last_week)::float / total_last_week * 100
                END AS percent_change
            FROM
                totals`, [fid]);
            client.release()
            const data = response.rows;

            redis.set(cacheKey, JSON.stringify(data), 'EX', 7200); // 2 hours

            const endTime = Date.now();
            const timeInSeconds = (endTime - startTime) / 1000;
            console.log("FollowerSummary took", timeInSeconds, "seconds")

            return new Response.json(data, { headers });
        }
    } catch (error) {
        console.error('Error fetching 7 day follower summary:', error);
        return new Response.json({ message: 'Internal server error', error: error }, { headers });
    }
};
