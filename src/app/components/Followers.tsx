import db from '../api/db'
import style from './Followers.module.css'
import TinyChart from './TinyChart'

export default async function HomeFeed(fid: any) {

    const getData = async function(){
        const data = await db(`
            SELECT
            (SELECT COUNT(*) FROM links WHERE target_fid = ${fid.fid} AND created_at >= NOW() - INTERVAL '7 days') AS one,
            (SELECT COUNT(*) FROM links WHERE target_fid = ${fid.fid} AND created_at BETWEEN NOW() - INTERVAL '14 days' AND NOW() - INTERVAL '7 days') AS two,
            (SELECT COUNT(*) FROM links WHERE target_fid = ${fid.fid} AND created_at BETWEEN NOW() - INTERVAL '21 days' AND NOW() - INTERVAL '14 days') AS three,
            (SELECT COUNT(*) FROM links WHERE target_fid = ${fid.fid} AND created_at BETWEEN NOW() - INTERVAL '28 days' AND NOW() - INTERVAL '21 days') AS four,
            (SELECT COUNT(*) FROM links WHERE target_fid = ${fid.fid} AND created_at BETWEEN NOW() - INTERVAL '35 days' AND NOW() - INTERVAL '28 days') AS five,
          `)

          return data
      }
    
      const data = await getData()
      console.log({ data })

  //let percent = `${((res[0].one / res[0].two) * 100)}`.split(".")[0] // Multiply by 100 to get % and not decimal

  return (
    <>
        <TinyChart fid={data} />
        {/* <div className={style['followers-wrapper']}>
            <div className={style['followers-wrapper']}>
                <a>{ res[0].last_7_days } followers &nbsp; { percent }% since last week</a>
            </div>
        </div> */}
    </>
    )
}