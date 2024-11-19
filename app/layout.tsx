import type { Metadata } from 'next'
import './global.css'

export const metadata: Metadata = {
  title: 'Painter Leaf',
  description: 'Easily create AI-generated art with Painter Leaf',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}
