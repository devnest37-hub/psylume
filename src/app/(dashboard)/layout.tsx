'use client'

import { Suspense } from 'react'
import { Sidebar } from '@/components/shell/Sidebar'
import { Header } from '@/components/shell/Header'
import { useLanguage } from '@/context/language'
import { cx } from '@/components/ui'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { dir, isRTL, t } = useLanguage()

  return (
    <div dir={dir} className="min-h-screen bg-midnight text-lavender">
      <Sidebar />
      <div
        className={cx(
          'w-full min-w-0 flex-1 transition-[padding] duration-200 overflow-x-hidden',
          isRTL ? 'lg:pr-[264px]' : 'lg:pl-[264px]',
        )}
      >
        <Suspense
          fallback={
            <div className="h-[72px] bg-midnight/85 backdrop-blur-xl border-b border-lavender/10" />
          }
        >
          <Header />
        </Suspense>
        <main className="px-4 sm:px-6 lg:px-8 py-5 sm:py-8 max-w-[1600px] mx-auto w-full">
          <Suspense
            fallback={
              <div className="py-20 text-center text-sm text-lavender/40">
                {t('common.loading')}
              </div>
            }
          >
            {children}
          </Suspense>
        </main>
      </div>
    </div>
  )
}
