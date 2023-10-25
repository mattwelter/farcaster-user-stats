import db from '../api/db'
import style from './Followers.module.css'
import TinyChart from './TinyChart'

export default async function HomeFeed(fid: any) {

    const getData = async function(){
        const data = await db(`
            SELECT
                SUM(CASE WHEN created_at BETWEEN NOW() - INTERVAL '1 day' AND NOW() THEN 1 ELSE 0 END) AS day14,
                SUM(CASE WHEN created_at BETWEEN NOW() - INTERVAL '2 days' AND NOW() - INTERVAL '1 day' THEN 1 ELSE 0 END) AS day13,
                SUM(CASE WHEN created_at BETWEEN NOW() - INTERVAL '3 days' AND NOW() - INTERVAL '2 days' THEN 1 ELSE 0 END) AS day12,
                SUM(CASE WHEN created_at BETWEEN NOW() - INTERVAL '4 days' AND NOW() - INTERVAL '3 days' THEN 1 ELSE 0 END) AS day11,
                SUM(CASE WHEN created_at BETWEEN NOW() - INTERVAL '5 days' AND NOW() - INTERVAL '4 days' THEN 1 ELSE 0 END) AS day10,
                SUM(CASE WHEN created_at BETWEEN NOW() - INTERVAL '6 days' AND NOW() - INTERVAL '5 days' THEN 1 ELSE 0 END) AS day9,
                SUM(CASE WHEN created_at BETWEEN NOW() - INTERVAL '7 days' AND NOW() - INTERVAL '6 days' THEN 1 ELSE 0 END) AS day8,
                SUM(CASE WHEN created_at BETWEEN NOW() - INTERVAL '8 days' AND NOW() - INTERVAL '7 days' THEN 1 ELSE 0 END) AS day7,
                SUM(CASE WHEN created_at BETWEEN NOW() - INTERVAL '9 days' AND NOW() - INTERVAL '8 days' THEN 1 ELSE 0 END) AS day6,
                SUM(CASE WHEN created_at BETWEEN NOW() - INTERVAL '10 days' AND NOW() - INTERVAL '9 days' THEN 1 ELSE 0 END) AS day5,
                SUM(CASE WHEN created_at BETWEEN NOW() - INTERVAL '11 days' AND NOW() - INTERVAL '10 days' THEN 1 ELSE 0 END) AS day4,
                SUM(CASE WHEN created_at BETWEEN NOW() - INTERVAL '12 days' AND NOW() - INTERVAL '11 days' THEN 1 ELSE 0 END) AS day3,
                SUM(CASE WHEN created_at BETWEEN NOW() - INTERVAL '13 days' AND NOW() - INTERVAL '12 days' THEN 1 ELSE 0 END) AS day2,
                SUM(CASE WHEN created_at BETWEEN NOW() - INTERVAL '14 days' AND NOW() - INTERVAL '13 days' THEN 1 ELSE 0 END) AS day1
            FROM links
            WHERE target_fid = ${fid.fid}
            `)
            return data
      }
    
      const data = await getData()
      console.log({ data })

  return (
    <>
        <TinyChart fid={data} />
    </>
    )
}