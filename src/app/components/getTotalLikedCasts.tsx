import sql from '../db.js'

export default async function UserFeed(fid: any) {

  async function getTotalLikedCasts() {
    const data = await sql`
    SELECT c.timestamp, c.text, 
    COUNT(r.id) AS total_likes
    FROM casts AS c
    LEFT JOIN reactions AS r ON c.hash = r.target_hash AND c.fid = r.target_fid AND r.reaction_type = 1
    WHERE c.fid = ${fid.fid}
    GROUP BY c.id, c.text
    ORDER BY total_likes DESC
    LIMIT 10;
    `
    return data
  }
  const casts = await getTotalLikedCasts()

  for(let i=0; i<casts.length; i++){
    casts[i].timestamp_date = new Date(casts[i].timestamp).toLocaleDateString()
  }

  return (
    <>
    <ol>
       {casts.length != 0 ? casts.map((cast: any) => (
        <li className="cast">
            <a>{ cast.timestamp_date }</a><br />
            <a>{ cast.total_likes } likes</a>
            <h3>{ cast.text }</h3>
        </li>
        )) : <li className="cast">
            <a>Oops!</a>
            <h3>Looks like this user doesn't cast.</h3>
        </li>}
      </ol>
    </>
    )
}