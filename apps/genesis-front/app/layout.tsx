import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { LenisProvider } from '@/components/LenisProvider'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Aurora Genesis | Private Banking Redefined',
  description: 'O usuário não preenche formulários. Ele constrói decisões.',
  keywords: ['private banking', 'wealth management', 'financial planning'],
  authors: [{ name: 'Aurora AI' }],
  openGraph: {
    title: 'Aurora Genesis | Private Banking Redefined',
    description: 'O usuário não preenche formulários. Ele constrói decisões.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body>
        <LenisProvider>
          {children}
        </LenisProvider>
      </body>
    </html>
  )
}
