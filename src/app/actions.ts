'use server'

export async function searchUsername(formData: FormData) {
  const _username = formData.get('username') as string
  const username = _username.toLowerCase().replaceAll(' ', '').replaceAll('@', '')
  const getUser = await fetch(
    `https://api.neynar.com/v1/farcaster/user-by-username/?api_key=${process.env.NEYNAR_API_KEY}&username=${username}`,
    { method: 'GET' }
  )
  const userResponse = await getUser.json()
  console.log(userResponse)
  return userResponse
}
