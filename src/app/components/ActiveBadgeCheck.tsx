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




      async function getRegisteredDate() {
        const data = await db(`
            SELECT created_at 
            FROM fids 
            WHERE fid = ${user.fid};
        `)
        return data
      }
      const checkRegistration = await getRegisteredDate()
      console.log({ checkRegistration })
      const registrationDate = new Date(checkRegistration[0].created_at)
      const sevenDaysAgo: Date = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) 

      const engagingCastsNumber = ((checkReaction.length != 0 ? checkReaction[0].reaction_count : 0) + parseInt(checkReplies[0].reply_count)) / parseInt(checkTotalCasts[0].count)




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
        checkRegistration: registrationDate < sevenDaysAgo ? true : false,
        inboundReaction: checkReaction.length != 0 ? checkReaction[0].reaction_count >= 1 ? true : false : false,
        inboundReplies: checkReplies[0].reply_count >= 1 ? true : false,
        // reaction_count: checkReaction[0].reaction_count,
        // reply_count: checkReplies[0].reply_count,
        // count: checkTotalCasts[0].count,
        engagingCasts: engagingCastsNumber >= 1 ? true : false,
        engagingCastsNumber: engagingCastsNumber
    }

    console.log({ activeBadge })

    return (
        <>
            <div className={style['badge-check-wrapper']}>
                <div className={style['badge-check']}>
                    {
                        activeBadge.active ?
                        
                        <a>Verified active ✅</a>
                        :
                        <ul>
                            { !activeBadge.connectedAddress ? <li><a>❌ &nbsp;User needs to connect an Ethereum address</a></li> : <li><a>✅ &nbsp;User has connected Ethereum address</a></li> }
                            { !activeBadge.profile.name ? <li><a>❌ &nbsp;User has no display name</a></li> : <li><a>✅ &nbsp;User has display name</a></li> }
                            { !activeBadge.profile.bio ? <li><a>❌ &nbsp;User has no bio</a></li> : <li><a>✅ &nbsp;User has a bio</a></li> }
                            { !activeBadge.profile.pfp ? <li><a>❌ &nbsp;User has no profile picture</a></li> : <li><a>✅ &nbsp;User has a profile picture</a></li> }
                            { !activeBadge.followers ? <li><a>❌ &nbsp;User has less than 100 followers</a></li> : <li><a>✅ &nbsp;User has more than 100 followers</a></li> }
                            { !activeBadge.checkRegistration ? <li><a>❌ &nbsp;Account was created less than 7 days ago</a></li> : <li><a>✅ &nbsp;Account older than 7 days</a></li> }
                            { !activeBadge.inboundReaction ? <li><a>❌ &nbsp;User received 0 likes in past 30 days</a></li> : <li><a>✅ &nbsp;User received 1 or more likes in past 30 days</a></li> }
                            { !activeBadge.inboundReplies ? <li><a>❌ &nbsp;User received 0 replies in past 30 days</a></li> : <li><a>✅ &nbsp;User received 1 or more replies in past 30 days</a></li> }
                            { !activeBadge.engagingCasts ? <li><a>❌ &nbsp;User has less engagement than total casts in past 30 days</a></li> : <li><a>✅ &nbsp;User has more engagement than total casts in past 30 days</a></li> }
                        </ul>
                    }
                </div>
            </div>
        </>
        )
}