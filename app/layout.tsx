import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '台灣道教廟宇元宇宙 - 扶鸞體驗',
  description: '體驗台灣傳統道教扶鸞儀式的元宇宙空間，感受鳳凰乩筆的神聖力量',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-TW">
      <body>{children}</body>
    </html>
  )
}
