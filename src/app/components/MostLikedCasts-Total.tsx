import sql from '../db.js'
import style from '../css/MostLikedCasts.module.css'

export default async function UserFeed(fid: any) {

  async function getTotalLikedCasts() {
    const data = await sql`
      SELECT c.hash, c.text, c.embeds, 
      COUNT(r.id) AS total_likes
      FROM casts AS c
      LEFT JOIN reactions AS r ON c.hash = r.target_hash AND c.fid = r.target_fid AND r.reaction_type = 1
      WHERE c.fid = ${fid.fid}
        AND c.deleted_at IS null
      GROUP BY c.id, c.text
      ORDER BY total_likes DESC
      LIMIT 10;
    `
    return data
  }
  const casts = await getTotalLikedCasts()

  for(let i=0; i<casts.length; i++){
    // const getCast = await fetch(`https://api.neynar.com/v2/farcaster/cast/?type=hash&identifier=${casts[i].hash}&api_key=${process.env.NEYNAR_API_KEY}`, { method: "GET", headers: { api_key: process.env.NEYNAR_API_KEY } });
    // const castResponse = await getCast.json();
    // console.log(castResponse)
    // casts[i].link = castResponse.result.user.username;
    // casts[i].timestamp_date = new Date(casts[i].timestamp).toLocaleDateString()
    // console.log(casts[i].embeds)
  }

  return (
    <>
    <div className={style.casts}>
      {casts.length !== 0 ? casts.map((cast: any) => (
        <section className={style.cast}>
          <p className={style.text}>
            {cast.text.split('\n').map((line: any, index: any) =>
            <span key={index}>{line}{index !== cast.text.split('\n').length - 1 && <br/>}</span>
            )}

            {
              cast.embeds.length !=0 ? (cast.embeds[0].url.includes(".jpeg") || cast.embeds[0].url.includes(".jpg") || cast.embeds[0].url.includes(".png") ? <img className={style.text_image} src={cast.embeds[0].url} /> : "") : ""
            }
          </p>
          <a className={style.likes}>{ cast.total_likes } <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.95124 0.888916C1.12231 0.888916 0 2.44389 0 3.71932C0 6.47716 3.22416 9.03706 5.5 10.6667C7.77586 9.03706 11 6.47716 11 3.71932C11 2.44389 9.87769 0.888916 8.04878 0.888916C7.02735 0.888916 6.15479 1.68063 5.5 2.43277C4.84524 1.68063 3.97263 0.888916 2.95124 0.888916Z" fill="#FF75C8"/>
            </svg>
          </a>
          <a className={style['link-to-warpcast']}>View on Warpcast</a>
        </section>
        )) : <section className={style.cast}>
            <a>Oops!</a>
            <h3>Looks like this user doesn't cast.</h3>
        </section>}
      </div>
    </>
    )
}