import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import { NavBar } from '@/components/NavBar'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AOHH',
  description: 'AOHH',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className='bg-black'>
      <ClerkProvider>
        <body className={inter.className}>
          <NavBar/>
          <div className='mt-4'>
            <Toaster/>
            {children}
          </div>
        </body>
      </ClerkProvider>
    </html>
  )
}
