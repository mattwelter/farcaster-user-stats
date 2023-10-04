import Image from 'next/image'
import styles from './page.module.css'
import Search from './components/Search'
import PopularUsers from './components/PopularUsers'
import { Suspense } from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: `Farcaster User Stats`,
  description: 'Farcaster User Stats - Inspect your profile data on Farcaster',
  manifest: '/manifest.json',
  icons: { apple: '/farcaster-user-stats-logo.png' },
  themeColor: '#1B1A1F'
}

export const dynamic = 'force-dynamic';

export default function Home() {

  return (
    <main className={styles.main}>
      <div className="homepage-hero-wrapper">
        <div className="header-padding homepage-hero">
          <div>
            <section className="header_h1">
                <Image id="h1_logo" src="/farcaster-user-stats-logo.png" alt="Statscaster logo" width="42" height="42" />
                <h1>Farcaster User Stats</h1>
            </section>
            <p>Search for a Farcaster user's profile data.</p>
          </div>
          <Suspense fallback={<p>Loading search...</p>}>
            <Search />
          </Suspense>
        </div>
      </div>
      <PopularUsers />
    </main>
  )
}