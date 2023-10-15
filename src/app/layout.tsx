import { Inter } from 'next/font/google'
import './globals.css'
import type { Metadata } from 'next'
import PlausibleProvider from 'next-plausible'

export const metadata: Metadata = {
  title: `Farcaster User Stats`,
  description: 'The #1 source to see your Farcaster profile stats',
  manifest: '/manifest.json',
  icons: { apple: '/farcaster-user-stats-logo.png' },
  themeColor: '#5240b5',
  openGraph: {
    title: 'Farcaster User Stats',
    description: 'The #1 source to see your Farcaster profile stats',
    images: ['./og_image.png']
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
        <PlausibleProvider domain="farcasteruserstats.com">
          <body>{children}</body>
        </PlausibleProvider>
      </html>
    </>
  )
}
