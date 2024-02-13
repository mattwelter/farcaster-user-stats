import { pool } from '../api/db'
import style from './styles/Followers.module.css'
import TinyChart from './TinyChart'
import redis from '../utils/redis';

export default async function HomeFeed(fid: any) {
    const getData = async function(){
        const cacheKey = `followers:${fid.fid}`;
        let cachedData = await redis.get(cacheKey);
    
        if (cachedData) {
            return JSON.parse(cachedData); // Parse the stringified data back into JSON
        } else {

            const startTime = Date.now();

            const response = await pool.query(`
                WITH time_boundaries AS (
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
                        AND l.target_fid = ${fid.fid}
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
                        target_fid = ${fid.fid}
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
                    totals;
            `)

            const endTime = Date.now();
            const timeDiff = endTime - startTime;
            const timeInSeconds = timeDiff / 1000;
            console.log("Followers.tsx took", timeInSeconds, "milliseconds")
            
            const data = response.rows;
            redis.set(cacheKey, JSON.stringify(data), 'EX', 3600); // 60 minutes
            return data
        }
    }
    
    const data = await getData()
    console.log({ data })

    return (
        <>
            <h3 className={style['sub-heading']}>{data.length > 0 ? data[0].total_this_week : ""} new followers <a className={`${style['sub-heading-percentage']} ${(data[0] ? data[0].percent_change : 0) < 0 ? style['negative-change'] : style['positive-change']}`}>{(data[0] ? data[0].percent_change : false) ? data[0].percent_change.toFixed(2) : 100}% since last week</a></h3>
            <TinyChart fid={data[0].daily_counts} />
        </>
    )
}