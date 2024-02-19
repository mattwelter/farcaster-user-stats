"use client"

import React, { useState, useEffect } from 'react';
import style from './../styles/ActiveBadgeCheck.module.css'

interface ActiveBadge {
    active: boolean;
    completeProfile: boolean;
    connectedAddress: boolean;
    profile: {
        name: boolean;
        bio: boolean;
        pfp: boolean;
    };
    followers: boolean;
    checkRegistration: boolean;
    inboundReaction: boolean;
    inboundReplies: boolean;
    engagingCasts: boolean;
    engagingCastsNumber: number;
    count: any;
    reply_count: any;
    reactions_received: any;
}


export default function ActiveBadgeCheck(userObject: any) {
    const [activeBadge, setActiveBadge] = useState<ActiveBadge | null>(null);
    const [loading, setLoading] = useState(false);

    let user = userObject.userObject

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch(`https://farcasteruserstats.com/api/users/active-badge-check?fid=${userObject.fid}`);
                if (!response.ok) throw new Error('Failed to fetch active badge requirements');
                const activeBadgeRes = await response.json();
                console.log({ activeBadgeRes })
    
                if (activeBadgeRes.length === 0 || !activeBadgeRes[0]) {
                    throw new Error('No data returned from the API');
                }
    
                const defaultDate = new Date().toJSON();
                const registrationDate = new Date(activeBadgeRes[0].registration_date || defaultDate);
                const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                const reactions = parseInt(activeBadgeRes[0].reactions_received || '0');
                const replyCount = parseInt(activeBadgeRes[0].reply_count || '0');
                const castCount = parseInt(activeBadgeRes[0].count || '0');
    
                const engagingCastsNumber = ((reactions !== 0 ? reactions : 0) + replyCount) / (castCount || 1); // Avoid division by zero
    
                const activeBadgeData = {
                    active: user.activeStatus === "active",
                    completeProfile: !!(user.displayName && user.profile.bio.text && user.pfp.url),
                    connectedAddress: user.verifications.length >= 1,
                    profile: {
                        name: !!user.displayName,
                        bio: !!user.profile.bio.text,
                        pfp: !!user.pfp.url,
                    },
                    followers: user.followerCount >= 400,
                    checkRegistration: registrationDate < sevenDaysAgo,
                    inboundReaction: reactions !== 0 ? reactions >= 1 : false,
                    inboundReplies: replyCount >= 1,
                    engagingCasts: engagingCastsNumber >= 1.2,
                    engagingCastsNumber: engagingCastsNumber,
                    count: castCount,
                    reply_count: replyCount,
                    reactions_received: reactions,
                };
                setActiveBadge(activeBadgeData);
            } catch (error) {
                console.log("Error fetching data: ", error);
                const response = await fetch(`https://farcasteruserstats.com/api/users/active-badge-check?fid=${userObject.fid}`);
                if (!response.ok) throw new Error('Failed to fetch active badge requirements');
                const activeBadgeRes = await response.json();
                console.log({ activeBadgeRes })
            } finally {
                setLoading(false);
            }
        };
    
        fetchData();
    }, [userObject]);

    if (loading) {
        return <div>Loading...</div>
    }

    if (!activeBadge) {
        console.log({ "NEW NEW NEW NEW NEW activeBadge": activeBadge })
        return <div>Data not available</div>;
    }

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
                            { !activeBadge.engagingCasts ? <li><a>❌ &nbsp;User has less engagement than total casts in past 30 days <a className={style['requirement-subtitle']}>(User has {parseFloat(activeBadge.reactions_received != 0 ? activeBadge.reactions_received : 0) + parseInt(activeBadge.reply_count) + " likes/replies out of " + parseInt(activeBadge.count) + " casts"})</a></a></li> : <li><a>✅ &nbsp;User has more engagement than total casts in past 30 days</a></li> }
                        </ul>
                    }
                </div>
            </div>
        </>
        )
}
