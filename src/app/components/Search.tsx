'use client'

import { useState } from 'react'
import { redirect } from 'next/navigation'
import { searchUsername } from '../actions'
import style from './Search.module.css'

export default function Page() {
  const [username, setUsername] = useState<string>('')

  async function handleSearch(formData: FormData) {
    const res = await searchUsername(formData)

    if (!res.result) {
      return alert('No user found')
    } else if (res.code == "NotFound") {
      return alert('No user found')
    }

    const user = res.result.user

    return redirect(`/users/${res.result.user.fid}`)
  }

  return (
    <div className={style.search}>
        <form action={handleSearch}>
            <input
            id="username"
            name="username"
            placeholder="Search by username"
            onChange={(e) => setUsername(e.target.value)}
            />

            <button type="submit" disabled={!username}>
            Search
            </button>
        </form>
        {/* <a>Search by fid or ENS is not supported.</a> */}
    </div>
  )
}
