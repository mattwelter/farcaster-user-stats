import { pool } from '../db'; // Adjust the import path as needed
import redis from '../../utils/redis';

export async function GET(request) {
    const { searchParams } = new URL(request.url)
    const fid = searchParams.get('fid')

    if (!fid) {
        return Response.json({ error: 'Missing fid parameter' });
    }

    try {
        const cacheKey = `activebadge:${fid}`;
        let cachedData = await redis.get(cacheKey);
    
        if (cachedData) {
            return Response.json(JSON.parse(cachedData));
        } else {
            const startTime = Date.now();
            const response = await pool.query(`WITH user_base AS (
                SELECT 
                    $1 AS fid,
                    COALESCE(f.created_at, CURRENT_DATE) as registration_date
                FROM fids f
                WHERE f.fid = $1
            ),
            total_reactions AS (
                SELECT
                    c.fid AS fid,
                    COUNT(*) AS reactions_received
                FROM
                    reactions r
                    INNER JOIN casts c ON c.hash = r.target_hash
                WHERE
                    r.timestamp >= current_timestamp - interval '30' day
                GROUP BY
                    c.fid
            ),
            replies AS (
                SELECT 
                    orig.fid,
                    COUNT(distinct reply.id) AS reply_count
                FROM 
                    casts AS orig
                JOIN 
                    casts AS reply 
                ON 
                    orig.hash = reply.parent_hash
                WHERE 
                    orig.fid = $1
                AND 
                    reply.fid <> orig.fid
                AND 
                    orig.created_at >= CURRENT_DATE - INTERVAL '30 days'
                GROUP BY
                    orig.fid
            ),
            total_casts AS (
                SELECT 
                    fid,
                    COUNT(*) as count
                FROM 
                    casts
                WHERE 
                    fid = $1
                AND 
                    created_at >= CURRENT_DATE - INTERVAL '30 days'
                GROUP BY
                    fid
            )
            
            SELECT 
                ub.fid, 
                COALESCE(tr.reactions_received, 0) AS reactions_received,
                COALESCE(r.reply_count, 0) AS reply_count,
                COALESCE(tc.count, 0) AS count,
                ub.registration_date
            FROM 
                user_base ub
            LEFT JOIN 
                total_reactions tr ON ub.fid = tr.fid
            LEFT JOIN 
                replies r ON ub.fid = r.fid
            LEFT JOIN 
                total_casts tc ON ub.fid = tc.fid`, [fid]); 
            const data = response.rows;
            redis.set(cacheKey, JSON.stringify(data), 'EX', 1800); // 30 minutes

            const endTime = Date.now();
            const timeInSeconds = (endTime - startTime) / 1000;
            console.log("ActiveBadgeCheck took", timeInSeconds, "seconds")

            return Response.json(data);
        }
    } catch (error) {
        console.error('Error fetching active badge:', error);
        return Response.json({ message: 'Internal server error', error: error });
    }
};
