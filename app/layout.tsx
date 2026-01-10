import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '告别仪式 | Candy Hearts',
  description: '有些照片，值得一个体面的告别。封存、抹除、或珍藏——你说了算。',
  keywords: ['分手', '照片处理', '告别仪式', '情感治愈'],
  authors: [{ name: 'Candy Hearts' }],
  openGraph: {
    title: '告别仪式 | Candy Hearts',
    description: '有些照片，值得一个体面的告别',
    type: 'website',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="bg-paper safe-area-top safe-area-bottom">
        <main className="min-h-screen flex flex-col">
          {children}
        </main>
      </body>
    </html>
  )
}
