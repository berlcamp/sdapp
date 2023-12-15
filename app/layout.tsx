import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import { NavBar } from '@/components/NavBar'
import { Toaster } from 'react-hot-toast'
import { currentUser } from '@clerk/nextjs'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Secondo Distrito',
  description: 'Secondo Distrito',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await currentUser()

  const id = user?.id
  let barangays: string[] = []

  // Exclude non-whitelisted users
  // if (user && (id !== 'user_2ZA73AGLyPUkOXHfSWwNODxsMrG' && id !== 'user_2ZZIz46GmJaFLFpYIO9gNLWbjqu')) {
  //   return (
  //     <html lang="en" className='bg-black'>
  //     <ClerkProvider>
  //       <body className={inter.className}>
  //         <div className='mt-4'>
  //           <div className='text-center pt-10 text-bold text-gray-300'>You are not authorize to access this page.</div>
  //         </div>
  //       </body>
  //     </ClerkProvider>
  //   </html>
  //   )
  // }

  return (
    <html lang="en" className='bg-black'>
      <ClerkProvider>
        <body className={inter.className}>
          <NavBar/>
          <div className='mt-4'>
            <Toaster/>
            {children}
            {/* <div className='text-center pt-10 text-bold text-gray-300'>Down for maintance, please wait for few minutes - Berl</div> */}
          </div>
        </body>
      </ClerkProvider>
    </html>
  )
}
