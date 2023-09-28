import sql from '../db.js'
import style from '../css/CastActivity.module.css'

export default async function HomeFeed(fid: any) {

  // 260 = Sunday
  // 260 = Monday
  // 261 = Tuesday
  // 262 = Wednesday
  // 263 = Thursday
  // 264 = Friday
  // 265 = Saturday
  
  const getData = async function(){
    const data = await sql`
      WITH date_range AS (
        SELECT NOW() - (n || ' days')::interval AS date
        FROM generate_series(0, 262) AS n
      )
      SELECT DATE(date_range.date) AS date,
            COUNT(casts.timestamp) AS castamount
      FROM date_range
      LEFT JOIN casts
      ON DATE(date_range.date) = DATE(casts.timestamp)
      AND casts.fid = ${fid.fid}
      GROUP BY DATE(date_range.date)
      ORDER BY DATE(date_range.date);
      `
    return data
  }

  const data = await getData()

  data.map((event: any) => (
    console.log(event.castamount)
  ))


  return (
    <>
      <div className={style['cast-activity-wrapper']}>
        <div className={style['cast-activity']}>
          {data.length != 0 ? data.map((event: any) => (
            <a className={ parseInt(event.castamount) == 0 ? style['cast-color-0'] : (parseInt(event.castamount) <= 4 ? style['cast-color-2'] : parseInt(event.castamount) <= 8 ? style['cast-color-4'] : parseInt(event.castamount) <= 12 ? style['cast-color-6'] : style['cast-color-8']) }></a>
          )) : <a>Nothing here...</a>
          }
        </div>
      </div>
    </>
    )
}