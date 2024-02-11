import { pool } from '../api/db'
import MostLikedCasts from './MostLikedCastsClient'
import redis from '../utils/redis';

export default async function UserFeed(fid: any, username: any) {
  async function getTotalLikedCasts() {
    const cacheKey = `mostlikedcasts:${fid.fid}`;
    let cachedData = await redis.get(cacheKey);

    if (cachedData) {
        return JSON.parse(cachedData); // Parse the stringified data back into JSON
    } else {

      const startTime = Date.now();

      const response = await pool.query(`
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

      const endTime = Date.now();
      const timeDiff = endTime - startTime;
      const timeInSeconds = timeDiff / 1000;
      console.log("MostLikedCasts.tsx took", timeInSeconds, "milliseconds")

      const data = response.rows;
      for(let i=0; i<data.length; i++){
        const buffer: Buffer = data[i].hash;
        const hash: string = buffer.toString('hex');
        const getCast = await fetch(`https://api.neynar.com/v2/farcaster/cast?type=hash&identifier=0x${hash}`, { method: "GET",
        headers: {
          'api_key': `${process.env.NEYNAR_API_KEY}`
        }, });
        const castResponse = await getCast.json();
        console.log({castResponse})
        if(castResponse.code && castResponse.code == "NotFound"){
          data[i].link = 'https://warpcast.com/'
        } else {
          data[i].link = `https://warpcast.com/${castResponse.cast.author.username}/${castResponse.cast.hash}`;
        }
      }
      redis.set(cacheKey, JSON.stringify(data), 'EX', 3600); // 60 minutes
      return data
    }
  }
  const casts = await getTotalLikedCasts()

  return (
    <>
      <MostLikedCasts casts={casts}/>
    </>
    )
}