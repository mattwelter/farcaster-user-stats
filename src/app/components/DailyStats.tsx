import { pool } from '../api/db'
import style from './styles/EverydayFollows.module.css'
import redis from '../utils/redis';

// Function to format date objects to strings
const formatDate = (date: any) => {
    return new Date(date).toLocaleDateString(); // Adjust the format as needed
};

export default async function HomeFeed(fid: any) {

    const getData = async function() {
        const cacheKey = `dailystats:${fid.fid}`;
        let cachedData = await redis.get(cacheKey);
    
        if (cachedData) {
            return JSON.parse(cachedData); // Parse the stringified data back into JSON
        } else {
            let response = await pool.query(`
                WITH Following AS (
                    SELECT 
                        DATE(timestamp) AS date,
                        COUNT(DISTINCT target_fid) AS following_count,
                        SUM(COUNT(DISTINCT target_fid)) OVER (ORDER BY DATE(timestamp) ASC ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS following_running_total
                    FROM links
                    WHERE fid = ${fid.fid}
                    AND deleted_at IS NULL
                    GROUP BY DATE(timestamp)
                ),
                Followers AS (
                    SELECT 
                        DATE(timestamp) AS date,
                        COUNT(DISTINCT fid) AS followers_count,
                        SUM(COUNT(DISTINCT fid)) OVER (ORDER BY DATE(timestamp) ASC ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS followers_running_total
                    FROM links
                    WHERE target_fid = ${fid.fid}
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
                    WHERE fid = ${fid.fid}
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
                LIMIT 28;
            `);
            let data = response.rows;
            
            // Formatting the date of each item in the data
            data = data.map((item: any) => ({
                ...item,
                date: formatDate(item.date), // Convert date to string
            }));

            redis.set(cacheKey, JSON.stringify(data), 'EX', 1800); // 30 minutes

            return data;
        }
    };
    
    const data = await getData();

    return (
        <>
            <table className={`${style['table']}`}>
                <thead className={`${style['thead']}`}>
                    <tr>
                        <th>Date</th>
                        <th>Difference</th>
                        <th>Followers</th>
                        {/* <th>Difference</th>
                        <th>Following</th>
                        <th>Difference</th>
                        <th>Casts</th> */}
                    </tr>
                </thead>
                <tbody className={`${style['tbody']}`}>
                    {data.length !== 0 ? (
                        data.map((event: any, index: any) => (
                            <tr key={index}> {/* Changed key to index to ensure uniqueness */}
                                <td>{ event.date }</td>
                                <td className={event.followers_count > 0 ? `${style['increase']}` : event.followers_count == 0 ? `${style['neutral']}` : `${style['decrease']}`}>{event.followers_count > 0 ? "+" : event.followers_count == 0 ? '' : "-"}{event.followers_count}</td>
                                <td>{event.followers_running_total}</td>
                                {/* <td className={event.following_count > 0 ? `${style['increase']}` : event.following_count == 0 ? `${style['neutral']}` : `${style['decrease']}`}>{event.following_count > 0 ? "+" : event.following_count == 0 ? '' : "-"}{event.following_count}</td>
                                <td>{event.following_running_total}</td>
                                <td className={event.cast_count > 0 ? `${style['increase']}` : event.cast_count == 0 ? `${style['neutral']}` : `${style['decrease']}`}>{event.cast_count > 0 ? "+" : event.cast_count == 0 ? '' : "-"}{event.cast_count}</td>
                                <td>{event.casts_running_total}</td> */}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td>Nothing here...</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </>
    );
}
