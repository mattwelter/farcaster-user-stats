import style from './UserPage.module.css'
import type { Metadata, ResolvingMetadata, Viewport } from 'next'
import { Suspense } from 'react'
import Body from './body'
import SearchTopBar from '../../components/Search-TopBar'
import GetRanking from '../../components/GetRanking'
import Casts from '../../components/MostLikedCasts'
import CastsLoading from '../../components/loading/Casts-Loading'
import Activity from '../../components/CastActivity'
import ActiveBadgeCheck from '../../components/ActiveBadgeCheck'
import Followers from '../../components/Followers'
import Cast from '../../components/Casts'
import Unfollowers from '../../components/Unfollowers'
import DailyStats from '../../components/DailyStats'
import db from '../../api/db'

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

    // const getUser = await fetch(`https://api.neynar.com/v1/farcaster/user/?api_key=${process.env.NEYNAR_API_KEY}&fid=${params.fid}&viewerFid=3`, { method: "GET" });
    // const userResponse = await getUser.json();
    // let user = userResponse.result.user;
    // console.log({ user })

    return (
        <main className={style['top-bottom-padding']}>
            <p>You guys broke my site. Site down for now</p>
            
        </main>
    )
}