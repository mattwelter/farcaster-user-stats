import redis from '../../../utils/redis';

export async function GET(request) {
    const { searchParams } = new URL(request.url)
    const fid = searchParams.get('fid')

    if (!fid) {
        return Response.json({ error: 'Missing fid parameter' });
    }

    try {
        const cacheKey = `mostlikedcasts:${fid}`;
        let cachedData = await redis.get(cacheKey);
    
        if (cachedData) {
            console.log("USING CACHE - MostLikedCasts - ID", fid)
            return Response.json(JSON.parse(cachedData));
        } else {
            const startTime = Date.now();

            const getCasts = await fetch(`https://api.neynar.com/v2/farcaster/feed/user/${fid}/popular?api_key=${process.env.NEYNAR_API_KEY}`, { method: "GET" });
            const res = await getCasts.json();
            let data = res.casts || []; // Default to an empty array if no casts
            console.log( `${fid} casts ` + JSON.stringify(data) )

            const endTime = Date.now();
            const timeDiff = endTime - startTime;
            const timeInSeconds = timeDiff / 1000;
            console.log("NEW CONNECTION - MostLikedCasts - ID", fid)
            console.log({"res": res, "responseCasts": data})
            console.log("MostLikedCasts took", timeInSeconds, "seconds")

            if (data.length > 0) {
                redis.set(cacheKey, JSON.stringify(data), 'EX', 14400); // 4 hours, adjusted TTL
            }
            return Response.json(data);
        }
    } catch (error) {
        console.error('Error fetching most liked casts:', error);
        return Response.json({ message: 'Internal server error', error: error });
    }
};