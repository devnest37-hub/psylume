import type { Metadata, Viewport } from 'next'
import './globals.css'
import { StoreProvider } from '@/context/store'
import { LanguageProvider } from '@/context/language'
import { Modals } from '@/components/modals/Modals'
import { Toasts } from '@/components/shell/Toasts'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0c1b2a',
}

export const metadata: Metadata = {
  title: 'Psylume — University Lecture Hub',
  description:
    'An interactive university e-learning platform offering video lectures, document access, bookmarking, and role-based content management for students and instructors.',
  icons: {
    icon: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-midnight text-lavender min-h-screen">
        <LanguageProvider>
          <StoreProvider>
            {children}
            <Modals />
            <Toasts />
          </StoreProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
