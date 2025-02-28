import type { Metadata, Viewport } from 'next'
import './global.css'

export const metadata: Metadata = {
  title: 'Painter Leaf',
  description: 'Easily create AI-generated art with Painter Leaf',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body className='bg-[#fff0f0] dark:bg-[#0e131d]'>{children}</body>
    </html>
  )
}
