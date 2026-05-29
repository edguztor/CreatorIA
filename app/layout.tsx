import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PostGenius — AI Social Media Content Generator',
  description: 'Generate 7 platform-optimized social media posts in 10 seconds using AI. Supports Instagram, LinkedIn, Twitter, Facebook, and TikTok.',
  openGraph: {
    title: 'PostGenius — AI Social Media Content Generator',
    description: 'Generate 7 social media posts in 10 seconds with AI',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 antialiased`}>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            className: 'dark:bg-gray-800 dark:text-white',
            duration: 4000,
          }}
        />
      </body>
    </html>
  )
}
