'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Bookmark,
  ChevronRight,
  Clapperboard,
  GraduationCap,
  House,
  Layers,
  LifeBuoy,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { useStore } from '@/context/store'
import { Avatar, cx } from '@/components/ui'
import { type Role } from '@/types'

export function BrandMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden>
      <rect width="40" height="40" rx="12" fill="#6247aa" />
      <path
        d="M11 27.5V13l9 4.5 9-4.5v14.5l-9 4.5-9-4.5Z"
        fill="#102b3f"
        opacity=".55"
      />
      <path d="M11 13l9-4.5 9 4.5-9 4.5-9-4.5Z" fill="#e2cfea" />
      <path
        d="M20 17.5V32"
        stroke="#a06cd5"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  )
}

const NAV = [
  { key: 'home', label: 'Home', icon: House, href: '/home', match: (p: string) => p === '/home' },
  {
    key: 'lectures',
    label: 'Lectures',
    icon: Clapperboard,
    href: '/lectures',
    match: (p: string) => p.startsWith('/lectures'),
  },
  {
    key: 'years',
    label: 'Academic Years',
    icon: Layers,
    href: '/home#academic-years',
    match: (p: string) => p.startsWith('/years'),
  },
  {
    key: 'saved',
    label: 'Saved',
    icon: Bookmark,
    href: '/saved',
    match: (p: string) => p.startsWith('/saved'),
  },
  {
    key: 'support',
    label: 'Support',
    icon: LifeBuoy,
    href: '/support',
    match: (p: string) => p.startsWith('/support'),
  },
]

export const PROFILES: Record<Role, { name: string; title: string; detail: string }> = {
  student: { name: 'Student', title: 'Student', detail: 'Academic Student' },
  instructor: {
    name: 'Instructor',
    title: 'Faculty Instructor',
    detail: 'Academic Faculty',
  },
  admin: {
    name: 'Administrator',
    title: 'System Admin',
    detail: 'Administration',
  },
}

import { useLanguage } from '@/context/language'

export function Sidebar() {
  const pathname = usePathname()
  const { role, bookmarks, user, openAuthModal } = useStore()
  const { isRTL, t } = useLanguage()
  const isInstructor = role === 'instructor'

  const displayName = user ? user.full_name : (isRTL ? 'زائر' : 'Guest')
  const displayDetail = user
    ? (user.email || user.faculty || '')
    : t('header.signInRegister')
  const roleTitle = isInstructor ? t('nav.instructorTitle') : t('nav.studentTitle')

  return (
    <aside
      className={cx(
        'fixed inset-y-0 w-[264px] z-30 flex flex-col bg-navy transition-all duration-200',
        isRTL ? 'right-0 border-l border-lavender/10' : 'left-0 border-r border-lavender/10',
      )}
    >
      <Link
        href="/home"
        className="flex items-center gap-3 px-6 h-[72px] cursor-pointer text-start shrink-0"
      >
        <BrandMark className="size-9 shrink-0" />
        <div>
          <div className="font-extrabold text-[17px] tracking-tight leading-none text-lavender">
            Psylume
          </div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-lavender/45 mt-1">
            {t('common.tagline')}
          </div>
        </div>
      </Link>

      <nav className="px-3 mt-4 flex-1 overflow-y-auto">
        <div className="px-3 mb-2 text-[10.5px] font-bold uppercase tracking-[0.18em] text-lavender/35">
          {t('nav.menu')}
        </div>
        <ul className="space-y-1">
          {NAV.map((n) => {
            const active = n.match(pathname)
            const label = t(`nav.${n.key}`) || n.label
            return (
              <li key={n.key}>
                <Link
                  href={n.href}
                  aria-current={active ? 'page' : undefined}
                  className={cx(
                    'group relative w-full flex items-center gap-3 h-11 px-3 rounded-xl text-sm font-semibold transition-all cursor-pointer',
                    active
                      ? 'bg-violet text-lavender shadow-[0_10px_30px_-12px_var(--color-violet)]'
                      : 'text-lavender/65 hover:text-amethyst hover:bg-lavender/5',
                  )}
                >
                  <n.icon className="size-[18px] shrink-0" strokeWidth={active ? 2.4 : 2} />
                  <span className="truncate">{label}</span>
                  {n.key === 'saved' && bookmarks.length > 0 && (
                    <span
                      className={cx(
                        'text-[11px] tabular-nums h-5 min-w-5 px-1.5 rounded-md grid place-items-center shrink-0',
                        isRTL ? 'mr-auto' : 'ml-auto',
                        active ? 'bg-lavender/20' : 'bg-amethyst/20 text-amethyst',
                      )}
                    >
                      {bookmarks.length}
                    </span>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>

        <div className="mt-8 mx-1 rounded-2xl p-4 bg-gradient-to-br from-violet/40 to-midnight/40 ring-1 ring-lavender/10">
          <Sparkles className="size-4 text-amethyst" />
          <div className="text-sm font-bold mt-2 text-lavender">{t('nav.springSemester')}</div>
          <p className="text-xs text-lavender/55 mt-1 leading-relaxed">
            {t('nav.examPeriodInfo')}
          </p>
          <Link
            href="/"
            className="mt-3 text-xs font-semibold text-amethyst hover:text-lavender inline-flex items-center gap-1 cursor-pointer"
          >
            <span>{t('nav.viewLandingPage')}</span>
            <ChevronRight className={cx('size-3.5', isRTL && 'rotate-180')} />
          </Link>
        </div>
      </nav>

      {/* User profile footer */}
      <div className="p-3.5 border-t border-lavender/10 bg-midnight/30">
        {user ? (
          <div className="flex items-center gap-3">
            <Avatar name={displayName} size="md" />
            <div className="min-w-0 flex-1">
              <div className="text-sm font-bold truncate text-lavender">{displayName}</div>
              <div className="text-[11px] text-lavender/45 truncate">{displayDetail}</div>
              <div
                className={cx(
                  'inline-flex items-center gap-1 mt-1 h-5 px-1.5 rounded-md text-[10.5px] font-bold',
                  isInstructor ? 'bg-violet text-lavender' : 'bg-lavender/10 text-lavender/80',
                )}
              >
                {isInstructor ? (
                  <ShieldCheck className="size-3" />
                ) : (
                  <GraduationCap className="size-3" />
                )}
                {roleTitle}
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => openAuthModal('signin')}
            className="w-full flex items-center justify-center gap-2 h-10 px-4 rounded-xl bg-gradient-to-r from-violet to-amethyst text-lavender font-bold text-xs shadow-md hover:opacity-95 transition-all cursor-pointer"
          >
            <ShieldCheck className="size-4" />
            <span>{t('header.signInRegister')}</span>
          </button>
        )}
      </div>
    </aside>
  )
}
