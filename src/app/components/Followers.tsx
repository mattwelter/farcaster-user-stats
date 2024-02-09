import db from '../api/db'
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
            const data = await db(`
                SELECT
                    ARRAY[
                        SUM(CASE WHEN created_at BETWEEN NOW() - INTERVAL '4 hours' AND NOW() THEN 1 ELSE 0 END),
                        SUM(CASE WHEN created_at BETWEEN NOW() - INTERVAL '8 hours' AND NOW() - INTERVAL '4 hours' THEN 1 ELSE 0 END),
                        SUM(CASE WHEN created_at BETWEEN NOW() - INTERVAL '12 hours' AND NOW() - INTERVAL '8 hours' THEN 1 ELSE 0 END),
                        SUM(CASE WHEN created_at BETWEEN NOW() - INTERVAL '16 hours' AND NOW() - INTERVAL '12 hours' THEN 1 ELSE 0 END),
                        SUM(CASE WHEN created_at BETWEEN NOW() - INTERVAL '20 hours' AND NOW() - INTERVAL '16 hours' THEN 1 ELSE 0 END),
                        SUM(CASE WHEN created_at BETWEEN NOW() - INTERVAL '24 hours' AND NOW() - INTERVAL '20 hours' THEN 1 ELSE 0 END),
                        SUM(CASE WHEN created_at BETWEEN NOW() - INTERVAL '28 hours' AND NOW() - INTERVAL '24 hours' THEN 1 ELSE 0 END),
                        SUM(CASE WHEN created_at BETWEEN NOW() - INTERVAL '32 hours' AND NOW() - INTERVAL '28 hours' THEN 1 ELSE 0 END),
                        SUM(CASE WHEN created_at BETWEEN NOW() - INTERVAL '36 hours' AND NOW() - INTERVAL '32 hours' THEN 1 ELSE 0 END),
                        SUM(CASE WHEN created_at BETWEEN NOW() - INTERVAL '40 hours' AND NOW() - INTERVAL '36 hours' THEN 1 ELSE 0 END),
                        SUM(CASE WHEN created_at BETWEEN NOW() - INTERVAL '44 hours' AND NOW() - INTERVAL '40 hours' THEN 1 ELSE 0 END),
                        SUM(CASE WHEN created_at BETWEEN NOW() - INTERVAL '48 hours' AND NOW() - INTERVAL '44 hours' THEN 1 ELSE 0 END),
                        SUM(CASE WHEN created_at BETWEEN NOW() - INTERVAL '52 hours' AND NOW() - INTERVAL '48 hours' THEN 1 ELSE 0 END),
                        SUM(CASE WHEN created_at BETWEEN NOW() - INTERVAL '56 hours' AND NOW() - INTERVAL '52 hours' THEN 1 ELSE 0 END),
                        SUM(CASE WHEN created_at BETWEEN NOW() - INTERVAL '60 hours' AND NOW() - INTERVAL '56 hours' THEN 1 ELSE 0 END),
                        SUM(CASE WHEN created_at BETWEEN NOW() - INTERVAL '64 hours' AND NOW() - INTERVAL '60 hours' THEN 1 ELSE 0 END),
                        SUM(CASE WHEN created_at BETWEEN NOW() - INTERVAL '68 hours' AND NOW() - INTERVAL '64 hours' THEN 1 ELSE 0 END),
                        SUM(CASE WHEN created_at BETWEEN NOW() - INTERVAL '72 hours' AND NOW() - INTERVAL '68 hours' THEN 1 ELSE 0 END),
                        SUM(CASE WHEN created_at BETWEEN NOW() - INTERVAL '76 hours' AND NOW() - INTERVAL '72 hours' THEN 1 ELSE 0 END),
                        SUM(CASE WHEN created_at BETWEEN NOW() - INTERVAL '80 hours' AND NOW() - INTERVAL '76 hours' THEN 1 ELSE 0 END),
                        SUM(CASE WHEN created_at BETWEEN NOW() - INTERVAL '84 hours' AND NOW() - INTERVAL '80 hours' THEN 1 ELSE 0 END),
                        SUM(CASE WHEN created_at BETWEEN NOW() - INTERVAL '88 hours' AND NOW() - INTERVAL '84 hours' THEN 1 ELSE 0 END),
                        SUM(CASE WHEN created_at BETWEEN NOW() - INTERVAL '92 hours' AND NOW() - INTERVAL '88 hours' THEN 1 ELSE 0 END),
                        SUM(CASE WHEN created_at BETWEEN NOW() - INTERVAL '96 hours' AND NOW() - INTERVAL '92 hours' THEN 1 ELSE 0 END),
                        SUM(CASE WHEN created_at BETWEEN NOW() - INTERVAL '100 hours' AND NOW() - INTERVAL '96 hours' THEN 1 ELSE 0 END),
                        SUM(CASE WHEN created_at BETWEEN NOW() - INTERVAL '104 hours' AND NOW() - INTERVAL '100 hours' THEN 1 ELSE 0 END),
                        SUM(CASE WHEN created_at BETWEEN NOW() - INTERVAL '108 hours' AND NOW() - INTERVAL '104 hours' THEN 1 ELSE 0 END),
                        SUM(CASE WHEN created_at BETWEEN NOW() - INTERVAL '112 hours' AND NOW() - INTERVAL '108 hours' THEN 1 ELSE 0 END),
                        SUM(CASE WHEN created_at BETWEEN NOW() - INTERVAL '116 hours' AND NOW() - INTERVAL '112 hours' THEN 1 ELSE 0 END),
                        SUM(CASE WHEN created_at BETWEEN NOW() - INTERVAL '120 hours' AND NOW() - INTERVAL '116 hours' THEN 1 ELSE 0 END),
                        SUM(CASE WHEN created_at BETWEEN NOW() - INTERVAL '124 hours' AND NOW() - INTERVAL '120 hours' THEN 1 ELSE 0 END),
                        SUM(CASE WHEN created_at BETWEEN NOW() - INTERVAL '128 hours' AND NOW() - INTERVAL '124 hours' THEN 1 ELSE 0 END),
                        SUM(CASE WHEN created_at BETWEEN NOW() - INTERVAL '132 hours' AND NOW() - INTERVAL '128 hours' THEN 1 ELSE 0 END),
                        SUM(CASE WHEN created_at BETWEEN NOW() - INTERVAL '136 hours' AND NOW() - INTERVAL '132 hours' THEN 1 ELSE 0 END),
                        SUM(CASE WHEN created_at BETWEEN NOW() - INTERVAL '140 hours' AND NOW() - INTERVAL '136 hours' THEN 1 ELSE 0 END),
                        SUM(CASE WHEN created_at BETWEEN NOW() - INTERVAL '144 hours' AND NOW() - INTERVAL '140 hours' THEN 1 ELSE 0 END),
                        SUM(CASE WHEN created_at BETWEEN NOW() - INTERVAL '148 hours' AND NOW() - INTERVAL '144 hours' THEN 1 ELSE 0 END),
                        SUM(CASE WHEN created_at BETWEEN NOW() - INTERVAL '152 hours' AND NOW() - INTERVAL '148 hours' THEN 1 ELSE 0 END),
                        SUM(CASE WHEN created_at BETWEEN NOW() - INTERVAL '156 hours' AND NOW() - INTERVAL '152 hours' THEN 1 ELSE 0 END),
                        SUM(CASE WHEN created_at BETWEEN NOW() - INTERVAL '160 hours' AND NOW() - INTERVAL '156 hours' THEN 1 ELSE 0 END),
                        SUM(CASE WHEN created_at BETWEEN NOW() - INTERVAL '164 hours' AND NOW() - INTERVAL '160 hours' THEN 1 ELSE 0 END),
                        SUM(CASE WHEN created_at BETWEEN NOW() - INTERVAL '168 hours' AND NOW() - INTERVAL '164 hours' THEN 1 ELSE 0 END)
                    ] AS daily_counts,
                    SUM(CASE WHEN created_at BETWEEN NOW() - INTERVAL '7 days' AND NOW() THEN 1 ELSE 0 END) AS total_this_week,
                    SUM(CASE WHEN created_at BETWEEN NOW() - INTERVAL '14 days' AND NOW() - INTERVAL '7 days' THEN 1 ELSE 0 END) AS total_last_week,
                    CASE 
                        WHEN SUM(CASE WHEN created_at BETWEEN NOW() - INTERVAL '14 days' AND NOW() - INTERVAL '7 days' THEN 1 ELSE 0 END) = 0 THEN NULL
                        ELSE (SUM(CASE WHEN created_at BETWEEN NOW() - INTERVAL '7 days' AND NOW() THEN 1 ELSE 0 END) - SUM(CASE WHEN created_at BETWEEN NOW() - INTERVAL '14 days' AND NOW() - INTERVAL '7 days' THEN 1 ELSE 0 END))::float / SUM(CASE WHEN created_at BETWEEN NOW() - INTERVAL '14 days' AND NOW() - INTERVAL '7 days' THEN 1 ELSE 0 END) * 100
                    END AS percent_change
                FROM links
                WHERE target_fid = ${fid.fid}
                `)
                redis.set(cacheKey, JSON.stringify(data), 'EX', 180); // 3 minutes
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