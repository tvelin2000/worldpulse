import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'

export const metadata: Metadata = {
  title: 'WorldPulse — Live Global Intelligence',
  description: 'Explore today\'s most important global events on an interactive 3D globe. Real-time news hotspots from around the world.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`dark ${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body className="font-sans bg-[#080B14] text-white">
        {children}
      </body>
    </html>
  )
}
