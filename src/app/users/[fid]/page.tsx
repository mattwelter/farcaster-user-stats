import Casts from '../../components/MostLikedCasts-Total'
import Activity from '../../components/CastActivity'
import CastsLoading from '../../components/Casts-Loading'
import { Suspense } from 'react'
import PageStyle from '../../css/UserPage.module.css'
import SearchTopBar from '../../components/Search-TopBar'
import type { Metadata, ResolvingMetadata } from 'next'
import style from '../../css/UserPage.module.css'

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
        description: 'Farcaster User Stats - Inspect your profile data on Farcaster',
        manifest: '/manifest.json',
        icons: { apple: '/farcaster-user-stats-logo.png' },
        themeColor: '#1B1A1F'
    }
}

export default async function Page({ params }: {
    params: { fid: string }
}) {

    const getUser = await fetch(`https://api.neynar.com/v1/farcaster/user/?api_key=${process.env.NEYNAR_API_KEY}&fid=${params.fid}`, { method: "GET" });
    const userResponse = await getUser.json();
    let user = userResponse.result.user;
    console.log(user)

    return (
        <main className={PageStyle['top-bottom-padding']}>
            <section>
                <a className="svg-back-button-wrapper" href="/">
                    <svg width="12" height="21" viewBox="0 0 40 72" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M38.4 1.99999C38.0285 1.62808 37.5874 1.33305 37.1018 1.13175C36.6162 0.930454 36.0957 0.826843 35.57 0.826843C35.0444 0.826843 34.5239 0.930454 34.0383 1.13175C33.5527 1.33305 33.1115 1.62808 32.74 1.99999L1.60003 33.17C1.22812 33.5415 0.933086 33.9826 0.731789 34.4682C0.530491 34.9538 0.42688 35.4743 0.42688 36C0.42688 36.5257 0.530491 37.0462 0.731789 37.5317C0.933086 38.0173 1.22812 38.4585 1.60003 38.83L32.74 70C33.4906 70.7506 34.5086 71.1722 35.57 71.1722C36.6315 71.1722 37.6495 70.7506 38.4 70C39.1506 69.2494 39.5723 68.2314 39.5723 67.17C39.5723 66.1085 39.1506 65.0905 38.4 64.34L10.09 36L38.4 7.68999C38.7765 7.31796 39.0753 6.87493 39.2793 6.38657C39.4832 5.89821 39.5883 5.37423 39.5883 4.84499C39.5883 4.31575 39.4832 3.79176 39.2793 3.3034C39.0753 2.81504 38.7765 2.37202 38.4 1.99999Z" fill="white"/></svg>
                </a>
                <SearchTopBar />
            </section>
            <div className="header-padding userFeedHeader">
                <img className="profile-pic" src={user.pfp.url} height="48px" width="48px" />
                <h1>{ user ? user.displayName : params.fid }</h1>
                <h2>{ user ? "@" + user.username : params.fid } • #{ params.fid }</h2>
            </div>
            <div>
            <h3 className="castactivity-title">Cast Activity</h3>
                <Activity fid={params.fid} />
            </div>
            <div>
                <h3 className="mostlikedcasts-title">Most Liked Casts (all time)</h3>
                <Suspense fallback={<CastsLoading />}>
                    <Casts fid={params.fid} username={user.username}/>
                </Suspense>
            </div>
            <div className={style.neighbors}>
                <a href={ `/users/${(parseInt(params.fid) - 1)}` }>
                    <svg width="17" height="20" viewBox="0 0 17 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.9646 0.303037C15.779 -0.172117 16.8019 0.415357 16.8019 1.35828C16.8019 6.86281 16.8019 12.3686 16.8019 17.8731C16.8019 18.816 15.7791 19.4035 14.9647 18.9284L0.809099 10.672C0.000914627 10.2006 0.000856017 9.0329 0.808991 8.56143L14.9646 0.303037Z" fill="#6C6A74"/></svg>
                </a>
                <a href={ `/users/${(parseInt(params.fid) - 1)}` }>{ params.fid != "0" ? (parseInt(params.fid) - 1) : "" }</a>
                <a href={ `/users/${(parseInt(params.fid))}` }>{ params.fid }</a>
                <a href={ `/users/${(parseInt(params.fid) + 1)}` }>{ (parseInt(params.fid) + 1) }</a>
                <a href={ `/users/${(parseInt(params.fid) + 1)}` }>
                    <svg width="14" height="17" viewBox="0 0 14 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.73216 16.1092C1.05528 16.504 0.205186 16.0158 0.205186 15.2322C0.205187 10.6575 0.205187 6.08171 0.205187 1.507C0.205187 0.723402 1.05519 0.235156 1.73207 0.629953L13.4965 7.49172C14.1682 7.88348 14.1682 8.85393 13.4966 9.24576L1.73216 16.1092Z" fill="#6C6A74"/></svg>
                </a>
            </div>
        </main>
    )
}