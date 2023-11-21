import { Inter, Space_Grotesk } from 'next/font/google'
import './globals.css'
import { Footer } from '@/components/footer/Footer'
import { Navbar } from '@/components/navbar/Navbard'

import { UserProvider } from '@/context/userContext'

import style from '../styles/index.css'

const inter = Inter({ subsets: ['latin'] })
const space = Space_Grotesk({ subsets: ['latin'] })

export const metadata = {
  title: 'Github Metrics',
  description: 'Search in Github...',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <UserProvider>
          {children}
        </UserProvider>
        <Footer />
      </body>
    </html>
  )
}
