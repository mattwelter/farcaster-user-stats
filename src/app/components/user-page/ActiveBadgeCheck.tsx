import style from './../styles/ActiveBadgeCheck.module.css'

export default async function HomeFeed(userObject: any) {

    let user = userObject.userObject

    const checkActiveBadge = async function() {
        const response = await fetch(`https://farcasteruserstats.com/api/active-badge-check?fid=${user.fid}`);
        if (!response.ok) { throw new Error('Failed to fetch daily stats'); }
        let data = await response.json()
        return data
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
