import { pool } from '../../api/db'
import MostFollowedUsersClient from './MostFollowedUsersClient'
import style from './../styles/PopularUsers.module.css'
import redis from '../../utils/redis';

// export const dynamic = 'force-dynamic';

export default async function HomeFeed(fid: any) {
    const getData = async function(){
        const cacheKey = `mostfollowedusers`;
        let cachedData = await redis.get(cacheKey);
    
        if (cachedData) {
            return JSON.parse(cachedData); // Parse the stringified data back into JSON
        } else {

            const startTime = Date.now();
            const client = await pool.connect();
            const response = await pool.query(`
                SELECT
                    ROW_NUMBER() OVER (ORDER BY COUNT(*) DESC) AS rank,
                    pwa.fname AS username,
                    pwa.display_name,
                    pwa.fid,
                    COUNT(*) AS follower_count
                FROM
                    links l
                INNER JOIN (
                    SELECT fid, MAX(fname) AS fname, MAX(display_name) AS display_name
                    FROM profile_with_addresses
                    GROUP BY fid
                ) pwa ON l.target_fid = pwa.fid
                WHERE
                    l.type = 'follow'
                    AND l.deleted_at IS NULL
                GROUP BY
                    pwa.fname, pwa.display_name, pwa.fid
                ORDER BY
                    follower_count DESC
                LIMIT 100;
            `)
            client.release()

            const endTime = Date.now();
            const timeDiff = endTime - startTime;
            const timeInSeconds = timeDiff / 1000;
            console.log("MostFollowedUsers.tsx took", timeInSeconds, "seconds")

            const data = response.rows;
            redis.set(cacheKey, JSON.stringify(data), 'EX', 86400); // 24 hours
            return data
        }
    }

  const data = await getData()
  
  return (
    <>
        <div className={style['popular-users-wrapper']}>
            <section>
                <h2>100 Most Followed</h2>
                <a className={style['header-subtitle']}>Top 100 users with the most followers. <i>Updated seconds ago.</i></a>
            </section>
            <MostFollowedUsersClient data={data} />
        </div>
    </>
    )
}