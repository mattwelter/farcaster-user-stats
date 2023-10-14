import db from '../api/db'
import style from './ActiveBadgeCheck.module.css'

export default async function HomeFeed(userObject: any) {

    let user = userObject.userObject

    async function getReaction() {
        const data = await db(`
            SELECT 
                c.fid,
                COUNT(DISTINCT r.id) AS reaction_count
            FROM 
                casts AS c
            LEFT JOIN 
                reactions AS r 
            ON 
                c.fid = r.fid
            WHERE 
                c.fid = ${user.fid} 
            AND 
                c.created_at >= NOW() - INTERVAL '30 days'
            GROUP BY 
                c.fid;
        `)
        return data
      }
      const checkReaction = await getReaction()
      console.log({ checkReaction })

      



      async function getReplies() {
        const data = await db(`
            SELECT 
                COUNT(distinct reply.id) AS reply_count
            FROM 
                casts AS orig
            JOIN 
                casts AS reply 
            ON 
                orig.hash = reply.parent_hash
            WHERE 
                orig.fid = ${user.fid}
            AND 
                reply.fid <> orig.fid
            AND 
                orig.created_at >= CURRENT_DATE - INTERVAL '30 days';
    
        `)
        return data
      }
      const checkReplies = await getReplies()
      console.log({ checkReplies })




      async function getTotalCasts() {
        const data = await db(`
            SELECT 
                COUNT(*)
            FROM 
                casts
            WHERE 
                fid = ${user.fid}
            AND 
                created_at >= CURRENT_DATE - INTERVAL '30 days';
        `)
        return data
      }
      const checkTotalCasts = await getTotalCasts()
      console.log({ checkTotalCasts })





      const activeBadge = {
        active: user.activeStatus == "active" ? true : false,
        completeProfile: user.displayName && user.profile.bio.text && user.pfp.url ? true : false,
        connectedAddress: user.verifications.length >= 1 ? true : false,
        profile: {
            name: user.displayName ? true : false,
            bio: user.profile.bio.text ? true : false,
            pfp: user.pfp.url ? true : false,
        },
        followers: user.followerCount >= 100 ? true : false,
        inboundReaction: checkReaction[0].reaction_count >= 1 ? true : false,
        inboundReplies: checkReplies[0].reply_count >= 1 ? true : false,
        // reaction_count: checkReaction[0].reaction_count,
        // reply_count: checkReplies[0].reply_count,
        // count: checkTotalCasts[0].count,
        engagingCasts: ((checkReaction[0].reaction_count + checkReplies[0].reply_count) / checkTotalCasts[0].count) >= 1 ? true : false
    }

    console.log({ activeBadge })

    return (
        <>
            <div className={style['badge-check-wrapper']}>
                <div className={style['badge-check']}>
                    {
                        activeBadge.active ? <a></a> :
                        <ul>
                            
                        </ul>
                    }
                </div>
            </div>
        </>
        )
}