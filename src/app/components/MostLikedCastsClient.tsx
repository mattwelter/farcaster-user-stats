'use client';

import style from './styles/MostLikedCasts.module.css'

export default async function Page(fid: any, username: any) {

  async function getTotalLikedCasts() {
    const response = await fetch(`https://farcasteruserstats.com/api/most-liked-casts?fid=${fid.fid}`);
    if (!response.ok) { throw new Error('Failed to fetch most liked casts summary'); }
    let data = await response.json()
    return data
  }
  const casts = await getTotalLikedCasts()

  return (
      <div className={style.casts}>
        {casts.casts.length !== 0 ? casts.casts.map((cast: any) => (
          <section key={cast.id} className={style.cast}>
            <div className={style.text}>
              {cast.text.split('\n').map((line: any, index: any) =>
              <span key={index}>{line}{index !== cast.text.split('\n').length - 1 && <br/>}</span>
              )}
              {
                cast.embeds.length != 0 ?
                cast.embeds.length == 2 ?
                ((cast.embeds[0].url ? (cast.embeds[0].url.includes(".jpeg") || cast.embeds[0].url.includes(".jpg") || cast.embeds[0].url.includes(".png")) : false) && (cast.embeds[1].url ? (cast.embeds[1].url.includes(".jpeg") || cast.embeds[1].url.includes(".jpg") || cast.embeds[1].url.includes(".png")) : false) ? <div className={style.cast_image_wrapper}><img className={`${style.text_image}`} src={cast.embeds[0].url} /> <img className={style.text_image} src={cast.embeds[1].url} /></div> : "") : 
                ((cast.embeds[0].url ? (cast.embeds[0].url.includes(".jpeg") || cast.embeds[0].url.includes(".jpg") || cast.embeds[0].url.includes(".png")) : false) ? <img className={style.text_image} src={cast.embeds[0].url} /> : "")
                : ""
              }
            </div>
            <a className={style.likes}>{ cast.reactions.likes.length } <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2.95124 0.888916C1.12231 0.888916 0 2.44389 0 3.71932C0 6.47716 3.22416 9.03706 5.5 10.6667C7.77586 9.03706 11 6.47716 11 3.71932C11 2.44389 9.87769 0.888916 8.04878 0.888916C7.02735 0.888916 6.15479 1.68063 5.5 2.43277C4.84524 1.68063 3.97263 0.888916 2.95124 0.888916Z" fill="#FF75C8"/>
              </svg>
            </a>
            <a className={style['link-to-warpcast']} href={`https://warpcast.com/${cast.author.username}/${cast.hash}`} target="_blank">View on Warpcast</a>
          </section>
          )) : <section className={style.cast}>
              <a>Oops!</a>
              <h3>Looks like this user doesn't cast.</h3>
          </section>}
        </div>
  )
}