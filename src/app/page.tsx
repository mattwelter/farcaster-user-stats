import Image from 'next/image'
import Head from 'next/head'
import style from './page.module.css'
import Search from './components/utils/Search'
import { Suspense } from 'react'
import type { Metadata, Viewport } from 'next'

export const metadata: Metadata = {
  title: `Farcaster User Stats`,
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

export const viewport: Viewport = {
  themeColor: '#3F1E94'
}

export const dynamic = 'force-dynamic';

export default function Home() {

  return (
    <main className={style.main}>
      <div className="homepage-hero-wrapper">
        <div className="header-padding homepage-hero">
          <div>
            <section className="header_h1">
                <Image id="h1_logo" src="/farcaster-user-stats-logo.png" alt="Statscaster logo" width="42" height="42" />
                <h1>Farcaster User Stats</h1>
            </section>
            <p>The #1 source to get your Farcaster profile statistics, analytics, and insights.</p>
          </div>
          <Suspense fallback={<p>Loading search...</p>}>
            <Search />
          </Suspense>
          <div className={'navigation'}>
            <nav>
              <ul>
                <li><a href="/leaderboards/engagement">Trending</a></li>
                <li><a href="/leaderboards/followers">100 Most Followed</a></li>
                <li><a target="_blank" href="https://hatecast.xyz">Most Hated</a></li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </main>
  )
}