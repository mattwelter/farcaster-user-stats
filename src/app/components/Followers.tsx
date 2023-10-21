import db from '../api/db'
import style from './Followers.module.css'

export default async function HomeFeed(fid: any) {

  const getData = async function(){
    const data = await db(`
        SELECT
        (SELECT COUNT(*) FROM links WHERE target_fid = ${fid.fid} AND created_at >= NOW() - INTERVAL '7 days') AS last_7_days,
        (SELECT COUNT(*) FROM links WHERE target_fid = ${fid.fid} AND created_at BETWEEN NOW() - INTERVAL '14 days' AND NOW() - INTERVAL '7 days') AS between_7_and_14_days_ago
      `)
      return data
  }

  const data = await getData()
  let percent = `${((data[0].last_7_days / data[0].between_7_and_14_days_ago) * 100)}`.split(".")[0] // Multiply by 100 to get % and not decimal

  return (
    <>
        <div className={style['followers-wrapper']}>
            <div className={style['followers-wrapper']}>
                <a>{ data[0].last_7_days } followers &nbsp; { percent }% since last week</a>
            </div>
        </div>
    </>
    )
}