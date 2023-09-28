import sql from '../db.js'
import style from '../css/CastActivity.module.css'

export default async function HomeFeed(fid: any) {

  const getData = async function(){
    const data = await sql`
    SELECT DATE(timestamp) AS date,
    COUNT(*) AS castAmount
    FROM casts
    WHERE casts.fid = ${fid.fid}
    GROUP BY DATE(timestamp)
    ORDER BY DATE(timestamp) DESC;
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
            <a className={ parseInt(event.castamount) == 0 ? style['cast-color-0'] : (parseInt(event.castamount) <= 2 ? style['cast-color-2'] : parseInt(event.castamount) <= 4 ? style['cast-color-4'] : parseInt(event.castamount) <= 6 ? style['cast-color-6'] : style['cast-color-8']) }></a>
          )) : <a>Nothing here...</a>
          }
        </div>
      </div>
    </>
    )
}