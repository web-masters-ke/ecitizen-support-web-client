import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { AuthProvider } from '@/contexts/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'eCitizen Kenya — Access Government Services Online',
    template: '%s | eCitizen Kenya',
  },
  description:
    'Submit and track government service requests across all Kenyan agencies — anytime, anywhere. Fast, secure, and free.',
  keywords: ['eCitizen', 'Kenya', 'government services', 'national ID', 'passport', 'KRA'],
  authors: [{ name: 'eCitizen Service Command Centre' }],
  creator: 'Republic of Kenya',
  metadataBase: new URL('https://ecitizen.go.ke'),
  openGraph: {
    type: 'website',
    locale: 'en_KE',
    url: 'https://ecitizen.go.ke',
    title: 'eCitizen Kenya — Access Government Services Online',
    description: 'Submit and track government service requests across all Kenyan agencies.',
    siteName: 'eCitizen Kenya',
  },
  icons: {
    icon: [
      { url: '/icon-16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [{ url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }],
    shortcut: '/icon-32.png',
  },
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#E87722' },
    { media: '(prefers-color-scheme: dark)', color: '#E87722' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
