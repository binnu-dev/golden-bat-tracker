import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '함평 황금박쥐 가치 추적기',
  description: '함평 황금박쥐 조형물의 가치 변화를 추적합니다.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6920752453203341"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className={`${inter.className} min-h-screen bg-gray-50`}>
        {children}
      </body>
    </html>
  )
}
