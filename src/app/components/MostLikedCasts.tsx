import MostLikedCasts from './MostLikedCastsClient'

export default async function UserFeed(fid: any, username: any) {
  async function getTotalLikedCasts() {
    const response = await fetch(`https://farcasteruserstats.com/api/most-liked-casts?fid=${fid.fid}`);
    if (!response.ok) { throw new Error('Failed to fetch most liked casts summary'); }
    let data = await response.json()
    return data
  }
  const casts = await getTotalLikedCasts()

  return (
    <>
      <MostLikedCasts casts={casts}/>
    </>
    )
}