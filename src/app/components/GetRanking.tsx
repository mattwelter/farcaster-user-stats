import { pool } from '../api/db'
import style from './styles/GetRanking.module.css'
import redis from '../utils/redis';

export default async function HomeFeed(fid: any) {
    const getData = async function(){
        const cacheKey = `getranking:${fid.fid}`;
        let cachedData = await redis.get(cacheKey);
    
        if (cachedData) {
            return JSON.parse(cachedData); // Parse the stringified data back into JSON
        } else {

            const startTime = Date.now();
            
            const response = await pool.query(`
                WITH
                ranked_data AS (
                    SELECT
                        c.fid AS fid,
                        ROW_NUMBER() OVER(ORDER BY COUNT(*) DESC) AS rank
                    FROM
                        casts c
                        INNER JOIN reactions r ON c.hash = r.target_hash
                    WHERE
                        c.timestamp >= current_timestamp - interval '7' day
                        AND r.timestamp >= current_timestamp - interval '7' day
                    GROUP BY
                        c.fid
                ),
                total_records AS (
                    SELECT COUNT(*) AS total_count FROM ranked_data
                )
                SELECT 
                    rd.fid,
                    rd.rank,
                    tr.total_count
                FROM ranked_data rd, total_records tr
                WHERE rd.fid = ${fid.fid};
            `)

            const endTime = Date.now();
            const timeDiff = endTime - startTime;
            const timeInSeconds = timeDiff / 1000;
            console.log("GetRanking.tsx took", timeInSeconds, "milliseconds")

            const data = response.rows;
            redis.set(cacheKey, JSON.stringify(data), 'EX', 3600); // 60 minutes
            return data
        }
    }

    const rank_data = await getData()

    return (
        <>
            <h2 className={style.rank}>&nbsp;• <a href={'/trending/ratio'}>{ rank_data ? (rank_data.length != 0 ? "Engagement Rank #" + rank_data[0].rank + " of " + rank_data[0].total_count : "Unranked") : "Unranked." }</a></h2>
        </>
    )
}