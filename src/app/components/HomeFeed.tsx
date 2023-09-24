import sql from '../db.js'

export default async function HomeFeed() {

  const getHomeFeed = async function(){
    const data = await sql`
        SELECT *
        FROM links
        WHERE deleted_at IS NOT null
        ORDER BY deleted_at DESC
        LIMIT 10;
      `
    return data
  }

  const unfollows = await getHomeFeed()

  return (
    <>
       <a></a>
    </>
    )
}