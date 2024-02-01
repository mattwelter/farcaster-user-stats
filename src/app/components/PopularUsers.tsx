import db from '../api/db'
import PopularUsersClient from './PopularUsersClient'
import style from './styles/PopularUsers.module.css'

export default async function HomeFeed(fid: any) {
  
  const getData = async function(){
    const data = await db(`
    WITH
        total_casts AS (
        SELECT
            fid,
            COUNT(*) AS total_casts,
            SUM(CASE WHEN parent_hash IS NULL AND parent_url IS NOT NULL THEN 1 ELSE 0 END) AS with_parent_url,
            SUM(CASE WHEN parent_hash IS NULL AND parent_url IS NULL THEN 1 ELSE 0 END) AS without_parent_url
        FROM
            casts
        WHERE
            timestamp >= current_timestamp - interval '7' day
        GROUP BY
            fid
        ),
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
        tr.reactions_received,
        tc.total_casts,
        CAST(tr.reactions_received AS DOUBLE PRECISION) / CAST(tc.total_casts AS DOUBLE PRECISION) AS reaction_cast_ratio,
        CASE 
        WHEN tc.without_parent_url = 0 THEN DOUBLE PRECISION '1e308'
        ELSE CAST(tc.with_parent_url AS DOUBLE PRECISION) / CAST(tc.without_parent_url AS DOUBLE PRECISION)
        END AS "top-level_fip2_ratio"
    FROM
        casts c
        INNER JOIN user_data u ON c.fid = u.fid AND u.type = 6
        INNER JOIN total_casts tc ON c.fid = tc.fid
        INNER JOIN total_reactions tr ON c.fid = tr.fid
    GROUP BY
        c.fid,
        u.value,
        tc.total_casts,
        tc.with_parent_url,
        tc.without_parent_url,
        tr.reactions_received
    ORDER BY
        tr.reactions_received DESC
    LIMIT
        100;
      `)
    return data
  }

  const data = await getData()
  
  return (
    <>
        <div className={style['popular-users-wrapper']}>
            <section>
                <h2>Trending Users</h2>
                <a className={style['header-subtitle']}>Users with the most engagement in the past 7 days. Engagement includes likes, replies, and recasts combined. <i>Updated seconds ago.</i></a>
            </section>
            <PopularUsersClient data={data} />
        </div>
    </>
    )
}