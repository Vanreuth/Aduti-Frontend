import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { AuthProvider } from '@/context/AuthContext'
import TopBar from '@/components/layout/Tobar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ShopLogo - Your Online Store',
  description: 'Quality products at great prices',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
           <AuthProvider>
            <TopBar />
             <Navbar />
             <main className="flex-1">{children}</main>
             <Footer />
           </AuthProvider>
        </div>
      </body>
    </html>
  )
}