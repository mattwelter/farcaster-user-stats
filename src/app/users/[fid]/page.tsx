import style from './UserPage.module.css'
import type { Metadata, ResolvingMetadata, Viewport } from 'next'
import { Suspense } from 'react'
import Body from './body'
import SearchTopBar from '../../components/utils/Search-TopBar'

type Props = {
    params: { fid: string }
}
   
export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
  ): Promise<Metadata> {

    const getUser = await fetch(`https://api.neynar.com/v1/farcaster/user/?api_key=${process.env.NEYNAR_API_KEY}&fid=${params.fid}`, { method: "GET" });
    const userResponse = await getUser.json();
    let user = userResponse.result.user;
   
    return {
        title: `Farcaster User Stats - ${ user ? "@" + user.username : params.fid}`,
        description: 'The #1 source to see your Farcaster profile stats',
        manifest: '/manifest.json',
        icons: { apple: '/farcaster-user-stats-logo.png' },
        themeColor: '#3F1E94',
        openGraph: {
          title: 'Farcaster User Stats',
          description: 'The #1 source to see your Farcaster profile stats',
          images: ['/og_image.png']
        }
    }
}

export const viewport: Viewport = {
    themeColor: '#3F1E94'
}

export const dynamic = 'force-dynamic';

export default async function Page({ params }: {
    params: { fid: string }
}) {

    const getUser = await fetch(`https://api.neynar.com/v1/farcaster/user/?api_key=${process.env.NEYNAR_API_KEY}&fid=${params.fid}&viewerFid=3`, { method: "GET" });
    const userResponse = await getUser.json();
    let user = userResponse.result.user;
    console.log({ user })

    return (
        <main className={style['top-bottom-padding']}>
            {/* <p>Site is down. In maintenance.<br/><br/>I appreciate you all for using Farcaster User Stats, I love that you all love using it.<br/><br/>I'm trying to understand why you all like it.<br/><br/>Is it because it helps you with airdrop farming?<br/><br/>Are you looking for user data when betting on @perl?<br/><br/>I'll gift you 10 warps if you <a className={'white'} href="https://warpcast.com/fun">send me a message</a> telling me one thing you use FarcasterUserStats for, or what data you like looking at. Thank you!</p> */}
            {/* <p>Site is under maintenance for the weekend. Please <a className={'white'} href="https://warpcast.com/fun">follow @fun on Farcaster</a> for updates.</p> */}
            {/* <br/>
            <p>Below is the error I keep receiving. If anyone knows how to fix this Postgres db connection issue, please reach out via DM. Specifically happens when the site receives more than 80 visitors online at one time. Another issue keeps happening, which is the more people there are on the site, the slower the connections take. If it gets above 50 visitors, queries will time out after 15s, which isnt good. All the queries should be under 1-2s. Please  help lol</p>
            <img src="/error.png"></img> */}
            <div className={style['user-page-header']}>
                <div className="width-500">
                    <section>
                        <a className="svg-back-button-wrapper" href="/">
                            <svg width="12" height="21" viewBox="0 0 40 72" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M38.4 1.99999C38.0285 1.62808 37.5874 1.33305 37.1018 1.13175C36.6162 0.930454 36.0957 0.826843 35.57 0.826843C35.0444 0.826843 34.5239 0.930454 34.0383 1.13175C33.5527 1.33305 33.1115 1.62808 32.74 1.99999L1.60003 33.17C1.22812 33.5415 0.933086 33.9826 0.731789 34.4682C0.530491 34.9538 0.42688 35.4743 0.42688 36C0.42688 36.5257 0.530491 37.0462 0.731789 37.5317C0.933086 38.0173 1.22812 38.4585 1.60003 38.83L32.74 70C33.4906 70.7506 34.5086 71.1722 35.57 71.1722C36.6315 71.1722 37.6495 70.7506 38.4 70C39.1506 69.2494 39.5723 68.2314 39.5723 67.17C39.5723 66.1085 39.1506 65.0905 38.4 64.34L10.09 36L38.4 7.68999C38.7765 7.31796 39.0753 6.87493 39.2793 6.38657C39.4832 5.89821 39.5883 5.37423 39.5883 4.84499C39.5883 4.31575 39.4832 3.79176 39.2793 3.3034C39.0753 2.81504 38.7765 2.37202 38.4 1.99999Z" fill="white"/></svg>
                        </a>
                        <Suspense fallback={<a>Loading...</a>}>
                            <SearchTopBar />
                        </Suspense>
                    </section>
                    <div className="header-padding userFeedHeader">
                        <img className="profile-pic" src={user.pfp.url ? user.pfp.url : "/avatar.png"} height="48px" width="48px" />
                        <h1>{ user ? user.displayName : params.fid }</h1>
                        <h2>{ user ? "@" + user.username : params.fid }</h2>
                        <p>{ user ? `${user.followerCount}` : 0 } <a className={`${style['follow-sub-title']}`}>followers</a></p>
                        <p>{ user ? `${user.followingCount}` : 0 } <a className={`${style['follow-sub-title']}`}>following</a></p>
                    </div>
                </div>
            </div>
            
            <Body fid={params.fid} user={user} />
        </main>
    )
}