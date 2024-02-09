import db from '../api/db'
import style from './styles/ActiveBadgeCheck.module.css'
import redis from '../utils/redis';

export default async function HomeFeed(userObject: any) {

    let user = userObject.userObject

    async function checkActiveBadge() {
        const cacheKey = `activebadge:${user.fid}`;
        let cachedData = await redis.get(cacheKey);
    
        if (cachedData) {
            return JSON.parse(cachedData); // Parse the stringified data back into JSON
        } else {
            const data = await db(`
                WITH user_base AS (
                    SELECT 
                        ${user.fid} AS fid,
                        COALESCE(f.created_at, CURRENT_DATE) as registration_date
                    FROM fids f
                    WHERE f.fid = ${user.fid}
                ),
                total_reactions AS (
                    SELECT
                        c.fid AS fid,
                        COUNT(*) AS reactions_received
                    FROM
                        reactions r
                        INNER JOIN casts c ON c.hash = r.target_hash
                    WHERE
                        r.timestamp >= current_timestamp - interval '30' day
                    GROUP BY
                        c.fid
                ),
                replies AS (
                    SELECT 
                        orig.fid,
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
                        orig.created_at >= CURRENT_DATE - INTERVAL '30 days'
                    GROUP BY
                        orig.fid
                ),
                total_casts AS (
                    SELECT 
                        fid,
                        COUNT(*) as count
                    FROM 
                        casts
                    WHERE 
                        fid = ${user.fid}
                    AND 
                        created_at >= CURRENT_DATE - INTERVAL '30 days'
                    GROUP BY
                        fid
                )
                
                SELECT 
                    ub.fid, 
                    COALESCE(tr.reactions_received, 0) AS reactions_received,
                    COALESCE(r.reply_count, 0) AS reply_count,
                    COALESCE(tc.count, 0) AS count,
                    ub.registration_date
                FROM 
                    user_base ub
                LEFT JOIN 
                    total_reactions tr ON ub.fid = tr.fid
                LEFT JOIN 
                    replies r ON ub.fid = r.fid
                LEFT JOIN 
                    total_casts tc ON ub.fid = tc.fid
            `)
            redis.set(cacheKey, JSON.stringify(data), 'EX', 3600); // 60 minutes
            return data
        }
    }
    const activeBadgeRes = await checkActiveBadge()
    console.log({ activeBadgeRes })

    const defaultDate = new Date().toJSON()
    const registrationDate = new Date(activeBadgeRes[0].registration_date || defaultDate)
    const sevenDaysAgo: Date = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) 
    const reactions = parseInt(activeBadgeRes[0].reactions_received)
    const replyCount = parseInt(activeBadgeRes[0].reply_count)
    const castCount = parseInt(activeBadgeRes[0].count)

    const engagingCastsNumber = ((reactions != 0 ? reactions : 0) + replyCount) / parseInt(activeBadgeRes[0].count)




    const activeBadge = {
        active: user.activeStatus == "active" ? true : false,
        completeProfile: user.displayName && user.profile.bio.text && user.pfp.url ? true : false,
        connectedAddress: user.verifications.length >= 1 ? true : false,
        profile: {
            name: user.displayName ? true : false,
            bio: user.profile.bio.text ? true : false,
            pfp: user.pfp.url ? true : false,
        },
        followers: user.followerCount >= 400 ? true : false,
        checkRegistration: registrationDate < sevenDaysAgo ? true : false,
        inboundReaction: parseInt(activeBadgeRes[0].reactions_received) != 0 ? parseInt(activeBadgeRes[0].reactions_received) >= 1 ? true : false : false,
        inboundReplies: parseInt(activeBadgeRes[0].reply_count) >= 1 ? true : false,
        // reaction_count: checkReaction[0].reaction_count,
        // reply_count: checkReplies[0].reply_count,
        // count: checkTotalCasts[0].count,
        engagingCasts: engagingCastsNumber >= 1.2 ? true : false,
        engagingCastsNumber: engagingCastsNumber
    }

    // console.log({ activeBadge })

    return (
        <>
            <div className={`${style['badge-check-wrapper']} ${ activeBadge.active ? style['active-bg-wrapper'] : style['not-active-bg-wrapper']}`}>
                <div className={`${style['badge-check']} ${ activeBadge.active ? style['active-bg'] : style['not-active-bg']}`}>
                    {
                        <ul>
                            { !activeBadge.connectedAddress ? <li><a>❌ &nbsp;User needs to connect an Ethereum address</a></li> : <li><a>✅ &nbsp;User has connected Ethereum address</a></li> }
                            { !activeBadge.profile.name ? <li><a>❌ &nbsp;User has no display name</a></li> : <li><a>✅ &nbsp;User has display name</a></li> }
                            { !activeBadge.profile.bio ? <li><a>❌ &nbsp;User has no bio</a></li> : <li><a>✅ &nbsp;User has a bio</a></li> }
                            { !activeBadge.profile.pfp ? <li><a>❌ &nbsp;User has no profile picture</a></li> : <li><a>✅ &nbsp;User has a profile picture</a></li> }
                            { !activeBadge.followers ? <li><a>❌ &nbsp;User has less than 400 followers ({user.followerCount} total)</a></li> : <li><a>✅ &nbsp;User has more than 400 followers</a></li> }
                            { !activeBadge.checkRegistration ? <li><a>❌ &nbsp;Account was created less than 7 days ago</a></li> : <li><a>✅ &nbsp;Account older than 7 days</a></li> }
                            { !activeBadge.inboundReaction ? <li><a>❌ &nbsp;User received 0 likes in past 30 days</a></li> : <li><a>✅ &nbsp;User received 1 or more likes in past 30 days</a></li> }
                            { !activeBadge.inboundReplies ? <li><a>❌ &nbsp;User received 0 replies in past 30 days</a></li> : <li><a>✅ &nbsp;User received 1 or more replies in past 30 days</a></li> }
                            { !activeBadge.engagingCasts ? <li><a>❌ &nbsp;User has less engagement than total casts in past 30 days <a className={style['requirement-subtitle']}>(User has {parseFloat(activeBadgeRes[0].reactions_received != 0 ? activeBadgeRes[0].reactions_received : 0) + parseInt(activeBadgeRes[0].reply_count) + " likes/replies out of " + parseInt(activeBadgeRes[0].count) + " casts"})</a></a></li> : <li><a>✅ &nbsp;User has more engagement than total casts in past 30 days</a></li> }
                        </ul>
                    }
                </div>
            </div>
        </>
        )
}
