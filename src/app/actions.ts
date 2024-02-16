'use server'

import { redirect } from 'next/navigation'

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

export async function debounceSearch(username: string) {
  const formattedUsername = username.toLowerCase().replaceAll(' ', '').replaceAll('@', '');
  const getUser = await fetch(
    `https://api.neynar.com/v2/farcaster/user/search?viewer_fid=3&q=${formattedUsername}&api_key=${process.env.NEYNAR_API_KEY}`,
    { method: 'GET' }
  );
  const userResponse = await getUser.json();
  console.log(userResponse);
  return userResponse;
}

export async function formatDate(date: Date) {
  return new Date(date).toLocaleDateString();
};