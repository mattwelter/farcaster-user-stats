import db from '../api/db'
import MostLikedCasts from './MostLikedCastsClient'

export default async function UserFeed(fid: any, username: any) {

  async function getTotalLikedCasts() {
    const data = await db(`
      SELECT c.hash, c.text, c.embeds, 
      COUNT(r.id) AS total_likes
      FROM casts AS c
      LEFT JOIN reactions AS r ON c.hash = r.target_hash AND c.fid = r.target_fid AND r.reaction_type = 1
      WHERE c.fid = ${fid.fid}
        AND c.deleted_at IS null
      GROUP BY c.id, c.text
      ORDER BY total_likes DESC
      LIMIT 10;
    `)
    return data
  }
  const casts = await getTotalLikedCasts()

  for(let i=0; i<casts.length; i++){
    const buffer: Buffer = casts[i].hash;
    const hash: string = buffer.toString('hex');
    const getCast = await fetch(`https://api.neynar.com/v2/farcaster/cast?type=hash&identifier=0x${hash}`, { method: "GET",
		headers: {
			'api_key': `${process.env.NEYNAR_API_KEY}`
		}, });
    const castResponse = await getCast.json();
    casts[i].link = `https://warpcast.com/${castResponse.cast.author.username}/${castResponse.cast.hash}`;
  }

  return (
    <>
      <MostLikedCasts casts={casts}/>
    </>
    )
}