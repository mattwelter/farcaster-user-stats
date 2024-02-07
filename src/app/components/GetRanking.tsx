import db from '../api/db'
import style from './styles/GetRanking.module.css'

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
            ),
            ranked_data AS (
                SELECT
                    c.fid AS fid,
                    u.value AS username,
                    tr.reactions_received,
                    tc.total_casts,
                    CAST(tr.reactions_received AS DOUBLE PRECISION) / CAST(tc.total_casts AS DOUBLE PRECISION) AS reaction_cast_ratio,
                    CASE 
                        WHEN tc.without_parent_url = 0 THEN DOUBLE PRECISION '1e308'
                        ELSE CAST(tc.with_parent_url AS DOUBLE PRECISION) / CAST(tc.without_parent_url AS DOUBLE PRECISION)
                    END AS "top-level_fip2_ratio",
                    ROW_NUMBER() OVER(ORDER BY tr.reactions_received DESC) AS rank
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
            ),
            total_records AS (
                SELECT COUNT(*) AS total_count FROM ranked_data
            )
            SELECT 
                rd.*,
                tr.total_count
            FROM ranked_data rd, total_records tr
            WHERE fid = ${fid.fid};
        `)
        return data
    }
    const rank_data = await getData()

    return (
        <>
            <h2 className={style.rank}>&nbsp;• <a href={'/trending/ratio'}>{ rank_data ? (rank_data.length != 0 ? "Engagement Rank #" + rank_data[0].rank + " of " + rank_data[0].total_count : "Unranked") : "Unranked." }</a></h2>
        </>
    )
}