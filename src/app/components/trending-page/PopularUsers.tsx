import { pool } from '../../api/db'
import PopularUsersClient from './PopularUsersClient'
import style from './../styles/PopularUsers.module.css'
import redis from '../../utils/redis';

export default async function HomeFeed(fid: any) {
    const getData = async function(){
        const cacheKey = `trendingusers`;
        let cachedData = await redis.get(cacheKey);

        if (cachedData) {
            return JSON.parse(cachedData); // Parse the stringified data back into JSON
        } else {
            const startTime = Date.now();
            const client = await pool.connect();
            const response = await pool.query(`
                WITH
                    total_reactions AS (
                        SELECT
                            c.fid AS fid,
                            COUNT(*) AS reactions_received
                        FROM
                            reactions r
                            INNER JOIN casts c ON c.hash = r.target_hash
                        WHERE
                            r.timestamp >= current_timestamp - interval '7' day
                        GROUP BY
                            c.fid
                    )
                SELECT
                    c.fid AS fid,
                    u.value AS username,
                    tr.reactions_received
                FROM
                    casts c
                    INNER JOIN user_data u ON c.fid = u.fid AND u.type = 6
                    INNER JOIN total_reactions tr ON c.fid = tr.fid
                GROUP BY
                    c.fid,
                    u.value,
                    tr.reactions_received
                ORDER BY
                    tr.reactions_received DESC
                LIMIT
                    100;
        
            `)
            client.release()

            const endTime = Date.now();
            const timeDiff = endTime - startTime;
            const timeInSeconds = timeDiff / 1000;
            console.log("PopularUsers.tsx took", timeInSeconds, "seconds")

            const data = response.rows;
            redis.set(cacheKey, JSON.stringify(data), 'EX', 14400); // 4 hours
            return data
        }
    }

    const data = await getData()
    
    return (
        <>
            <div className={style['popular-users-wrapper']}>
                <section>
                    <h2>100 Most Engagement</h2>
                    <a className={style['header-subtitle']}>Users with the most engagement in the past 7 days. Engagement includes likes, replies, and recasts combined. <i>Updated seconds ago.</i></a>
                </section>
                <PopularUsersClient data={data} />
            </div>
        </>
        )
}