import { pool } from '../db';
import redis from '../../utils/redis';
import { DateTime } from "luxon";

export async function GET(request) {
    const { searchParams } = new URL(request.url)
    const fid = searchParams.get('fid')

    const headers = new Headers();
    headers.set('Access-Control-Allow-Origin', '*');

    if (!fid) {
        return new Response({ headers }).json({ error: 'Missing fid parameter' });
    }

    try {
        const cacheKey = `unfollowers:${fid}`;
        let cachedData = await redis.get(cacheKey);
    
        if (cachedData) {
            return new Response({ headers }).json(JSON.parse(cachedData));
        } else {
            const startTime = Date.now();
            const client = await pool.connect();
            const response = await pool.query(`
                SELECT *
                FROM links
                WHERE target_fid = $1::integer
                AND deleted_at IS NOT null
                ORDER BY deleted_at DESC
                LIMIT 20;
            `, [fid]);
            client.release()
            const data = response.rows;

            // Sort unfollows by "Most recent" first
            data.sort(function(a, b){
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

            redis.set(cacheKey, JSON.stringify(data), 'EX', 7200); // 2 hours

            const endTime = Date.now();
            const timeInSeconds = (endTime - startTime) / 1000;
            console.log("Unfollowers took", timeInSeconds, "seconds")

            return new Response({ headers }).json(data);
        }
    } catch (error) {
        console.error('Error fetching Unfollowers summary:', error);
        return new Response({ headers }).json({ message: 'Internal server error', error: error });
    }
};
