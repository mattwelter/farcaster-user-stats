import sql from '../db.js'
import style from '../css/CastActivity.module.css'

export default async function HomeFeed(fid: any) {

  const getData = async function(){
    const data = await sql`
    SELECT DATE(timestamp) AS date,
    COUNT(*) AS number_of_casts
    FROM casts
    WHERE casts.fid = ${fid.fid}
    GROUP BY DATE(timestamp)
    ORDER BY DATE(timestamp) DESC;
      `
    return data
  }

  const data = await getData()


  return (
    <>
      <div className={style['cast-activity']}>
        <a></a>
        <a></a>
        <a></a>
        <a></a>
        <a></a>
        <a></a>
        <a></a>
        <a></a>
        <a></a>
        <a></a>
        <a></a>
        <a></a>
      </div>
    </>
    )
}