'use client'

import { CircleCheck } from 'lucide-react'
import { useStore } from '@/context/store'

export function Toasts() {
  const { toasts } = useStore()
  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] flex flex-col items-center gap-2 pointer-events-none"
      aria-live="polite"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className="flex items-center gap-2.5 h-11 pl-3 pr-4 rounded-xl bg-lavender text-navy text-sm font-semibold shadow-2xl animate-pop pointer-events-auto"
        >
          <CircleCheck className="size-4 text-violet" />
          {t.message}
        </div>
      ))}
    </div>
  )
}
