import { Inter } from 'next/font/google'
import './globals.css'
import type { Metadata } from 'next'
import Head from 'next/head'
import PlausibleProvider from 'next-plausible'

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

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <html lang="en" className={inter.className}>
        <PlausibleProvider domain="farcasteruserstats.com" taggedEvents={true}>
          <body>
            {/* <p className={'warning'}>Please support and <a target="_blank" href="https://prop.house/0xdc86e4b4f5280747d1038a0ed5aa701b125f7e82">vote here</a> for FarcasterUserStats.com for Purple's retro funding. Ends Feb 21st</p> */}
            {children}
          </body>
        </PlausibleProvider>
      </html>
    </>
  )
}
