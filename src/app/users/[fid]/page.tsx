import Casts from '../../components/MostLikedCasts-Total'
import Activity from '../../components/CastActivity'
import { Suspense } from 'react'
import PageStyle from '../../css/UserPage.module.css'
import Navigation from '../../components/Navigation'
import Search from '../../components/Search'
import type { Metadata, ResolvingMetadata } from 'next'

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
        title: `Statscaster - ${ user ? "@" + user.username : params.fid}`,
        description: 'Statscaster - Inspect your profile data on Farcaster',
        manifest: '/manifest.json',
        icons: { apple: '/logo.png' },
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
            <Search />
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
                <Suspense>
                    <h3 className="mostlikedcasts-title">Most Liked Casts (all time)</h3>
                    <Casts fid={params.fid}/>
                </Suspense>
            </div>
        </main>
    )
}