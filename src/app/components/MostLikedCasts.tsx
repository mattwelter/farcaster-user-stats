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

      const getCasts = await fetch(`https://api.neynar.com/v2/farcaster/feed/user/${fid.fid}/popular?api_key=${process.env.NEYNAR_API_KEY}`, { method: "GET" });
      const res = await getCasts.json();
      let data = res.casts;
      console.log({ "casts": data })

      const endTime = Date.now();
      const timeDiff = endTime - startTime;
      const timeInSeconds = timeDiff / 1000;
      console.log("MostLikedCasts.tsx took", timeInSeconds, "seconds")

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