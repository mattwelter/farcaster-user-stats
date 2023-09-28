import { Inter } from 'next/font/google'
import './globals.css'
import type { Metadata } from 'next'
import PlausibleProvider from 'next-plausible'

export const metadata: Metadata = {
  title: `Farcaster User Stats`,
  description: 'Farcaster User Stats - Inspect your profile data on Farcaster',
  manifest: '/manifest.json',
  icons: { apple: '/farcaster-user-stats-logo.png' },
  themeColor: '#1B1A1F'
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
        <PlausibleProvider domain="farcasteruserstats.com">
          <body>{children}</body>
        </PlausibleProvider>
      </html>
    </>
  )
}
