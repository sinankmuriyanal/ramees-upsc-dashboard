import type { Metadata } from 'next'
import { Cinzel, Crimson_Pro, IBM_Plex_Mono } from 'next/font/google'
import './globals.css'

const cinzel = Cinzel({
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['400', '600', '700'],
})

const crimsonPro = Crimson_Pro({
  variable: '--font-body',
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  style: ['normal', 'italic'],
})

const ibmPlexMono = IBM_Plex_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
})

export const metadata: Metadata = {
  title: 'UPSC Command — Ramees',
  description: 'UPSC preparation progress dashboard',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cinzel.variable} ${crimsonPro.variable} ${ibmPlexMono.variable} h-full`}>
      <body className="min-h-full">{children}</body>
    </html>
  )
}
