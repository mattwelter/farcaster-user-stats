import { DateTime } from "luxon";
import style from './styles/Unfollowers.module.css'
import { pool } from '../api/db'
import redis from '../utils/redis';

export default async function Unfollowers(fid: any, username: any) {

  async function getUnfollows() {
    const cacheKey = `unfollowers:${fid.fid}`;
    let cachedData = await redis.get(cacheKey);

    if (cachedData) {
      return JSON.parse(cachedData); // Parse the stringified data back into JSON
    } else {

      const startTime = Date.now();
      const client = await pool.connect();
      const response = await pool.query(`
        SELECT *
        FROM links
        WHERE target_fid = ${fid.fid}
        AND deleted_at IS NOT null
        ORDER BY deleted_at DESC
        LIMIT 20;
      `)
      client.release()
      const data = response.rows;

      const endTime = Date.now();
      const timeDiff = endTime - startTime;
      const timeInSeconds = timeDiff / 1000;
      console.log("Unfollowers.tsx took", timeInSeconds, "seconds")

      // Sort unfollows by "Most recent" first
      data.sort(function(a: any, b: any){
        return new Date(b.deleted_at).valueOf() - new Date(a.deleted_at).valueOf();
      });

      for(let i=0; i<data.length; i++){
        let d = new Date(data[i].deleted_at).toISOString()
        let event_utc = DateTime.fromISO(d);
        data[i].local_date = `${event_utc.toRelative()}`
      }

      // Get username for each fid
      if (data.length > 0){
        for (let i=0; i<data.length; i++){
          const getUser = await fetch(`https://api.neynar.com/v1/farcaster/user/?api_key=${process.env.NEYNAR_API_KEY}&fid=${data[i].fid}`, { method: "GET" });
          const userResponse = await getUser.json();

          data[i].user1_username = userResponse.result ? userResponse.result.user.username : "user";
        }
      }
      redis.set(cacheKey, JSON.stringify(data), 'EX', 3600); // 60 minutes
      return data
    }
  }
  const unfollows = await getUnfollows()

  return (
    <>
        <div className={style['unfollows-wrapper']}>
            {unfollows.length != 0 ? unfollows.map((event: any) => (
            <div className={style['unfollowCard']}>
                <a>{ event.local_date }</a>
                <h3>@<a href={"/users/" + event.fid}>{ event.user1_username }</a> unfollowed this user</h3>
            </div>
            )) : <div className={style['unfollowCard']}>
                <a>Oops!</a>
                <h3>Looks like no one unfollowed you.</h3>
            </div>}
        </div>
    </>
    )
}