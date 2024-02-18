import style from './../styles/Unfollowers.module.css'

export default async function Unfollowers(fid: any, username: any) {

  async function getUnfollows() {
    const response = await fetch(`https://farcasteruserstats.com/api/unfollowers?fid=${fid.fid}`);
    if (!response.ok) { throw new Error('Failed to fetch unfollowers'); }
    let data = await response.json()
    return data
  }
  const unfollows = await getUnfollows()

  return (
    <>
        <div className={style['unfollows-wrapper']}>
            {unfollows.length != 0 ? unfollows.map((event: any) => (
            <div className={style['unfollowCard']}>
                <a>{ event.local_date }</a>
                <h3>@<a href={"/users/" + event.fid}>{ event.user1_username }</a> unfollowed this user</h3>
            </div>
            )) : <div className={style['unfollowCard']}>
                <a>Oops!</a>
                <h3>Looks like no one unfollowed you.</h3>
            </div>}
        </div>
    </>
    )
}