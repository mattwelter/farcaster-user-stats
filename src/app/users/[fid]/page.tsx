import Casts from '../../components/getTotalLikedCasts'
import { Suspense } from 'react'
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
        title: `Hatecast - ${ user ? "@" + user.username : params.fid}`,
        description: 'Hatecast - Reveal your unfollowers on Farcaster',
        manifest: '/manifest.json',
        icons: { apple: '/hatecast_logo.png' },
        themeColor: '#1B1A1F'
    }
}

export default async function Page({ params }: {
    params: { fid: string }
}) {

    const getUser = await fetch(`https://api.neynar.com/v1/farcaster/user/?api_key=${process.env.NEYNAR_API_KEY}&fid=${params.fid}`, { method: "GET" });
    const userResponse = await getUser.json();
    let user = userResponse.result.user;

    return (
        <main>
            <Suspense fallback={<p>Loading search...</p>}>
                <Search />
            </Suspense>
            <div className="header userFeedHeader">
                <h1>{ user ? "@" + user.username : params.fid }</h1>
            </div>
            <div>
                <Suspense>
                    <Casts fid={params.fid}/>
                </Suspense>
            </div>
        </main>
    )
}