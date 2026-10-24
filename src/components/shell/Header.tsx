'use client'

import { Suspense, useEffect, useRef, useState, type ReactNode } from 'react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import {
  Bell,
  ChevronDown,
  ChevronRight,
  CircleCheck,
  GraduationCap,
  LogOut,
  Menu,
  Search,
  ShieldCheck,
  User,
} from 'lucide-react'
import { useLookup, useStore } from '@/context/store'
import { useLanguage, LanguageSwitcher } from '@/context/language'
import { cx } from '@/components/ui'
import { timeAgo } from '@/lib/data'
import { type Role } from '@/types'

export function UserMenu() {
  const { user, role, setRole, signOut, openAuthModal, isAuthenticated, toast } = useStore()
  const { isRTL, t } = useLanguage()
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => openAuthModal('signin')}
          className="flex items-center gap-2 h-9 px-3.5 rounded-xl bg-gradient-to-r from-violet to-amethyst text-lavender font-semibold text-xs shadow-md shadow-violet/30 hover:opacity-95 transition-all cursor-pointer"
        >
          <User className="size-3.5" />
          <span>{t('header.signInRegister')}</span>
        </button>
      </div>
    )
  }

  const initials = user.full_name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  const isAdmin = user.role === 'admin'
  const isInstructor = role === 'instructor' || role === 'admin' || isAdmin

  const canSwitchMode = user.role === 'instructor' || isAdmin

  return (
    <div ref={menuRef} className="relative shrink-0">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex items-center gap-2.5 p-1.5 pl-2 rounded-xl bg-navy ring-1 ring-lavender/15 hover:ring-amethyst/40 transition-all cursor-pointer text-left"
      >
        <div className="size-8 rounded-lg bg-gradient-to-br from-[#6247aa] to-[#a06cd5] text-white font-bold text-xs grid place-items-center shadow-sm shrink-0">
          {initials || 'U'}
        </div>
        <div className="hidden sm:block min-w-0 pr-1">
          <div className="text-xs font-bold text-lavender truncate max-w-[125px]">
            {user.full_name}
          </div>
          <div className="flex items-center gap-1 mt-0.5">
            <span
              className={cx(
                'inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.2 rounded',
                isAdmin || isInstructor
                  ? 'bg-violet/40 text-amethyst border border-amethyst/30'
                  : 'bg-lavender/10 text-lavender/70 border border-lavender/15',
              )}
            >
              {isAdmin || isInstructor ? (
                <ShieldCheck className="size-2.5" />
              ) : (
                <GraduationCap className="size-2.5" />
              )}
              {isAdmin
                ? (isRTL ? 'مسؤول النظام' : 'System Admin')
                : isInstructor
                ? t('nav.instructorTitle')
                : t('nav.studentTitle')}
            </span>
          </div>
        </div>
        <ChevronDown
          className={cx(
            'size-3.5 text-lavender/50 transition-transform duration-200 ml-0.5 shrink-0',
            open && 'rotate-180',
          )}
        />
      </button>

      {open && (
        <div
          className={cx(
            'absolute top-12 w-72 rounded-2xl bg-[#102b3f] ring-1 ring-white/15 shadow-2xl p-3 animate-pop z-50 text-white',
            isRTL ? 'left-0 origin-top-left' : 'right-0 origin-top-right',
          )}
        >
          <div className="p-3 rounded-xl bg-black/30 border border-white/10 mb-2">
            <div className="font-bold text-sm text-lavender truncate">
              {user.full_name}
            </div>
            <div className="text-xs text-lavender/60 truncate mt-0.5">
              {user.email}
            </div>
            {user.faculty && (
              <div className="text-[11px] text-amethyst truncate mt-1">
                {user.faculty}
              </div>
            )}
          </div>

          <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-lavender/40">
            {t('nav.accountAndMode')}
          </div>

          {canSwitchMode ? (
            <div className="p-1 space-y-1">
              <button
                onClick={() => {
                  const nextRole = role === 'instructor' ? 'student' : 'instructor'
                  setRole(nextRole)
                  toast(
                    nextRole === 'instructor'
                      ? t('header.switchedToInstructor')
                      : t('header.switchedToStudent'),
                  )
                }}
                className="w-full flex items-center justify-between p-2 rounded-lg text-xs hover:bg-white/5 transition-colors cursor-pointer text-lavender"
              >
                <span className="flex items-center gap-2">
                  {role === 'instructor' ? (
                    <ShieldCheck className="size-3.5 text-amethyst" />
                  ) : (
                    <GraduationCap className="size-3.5 text-lavender/60" />
                  )}
                  <span>{t('nav.activeMode')}</span>
                </span>
                <span className="font-bold text-amethyst">
                  {role === 'instructor' ? t('nav.instructorCrud') : t('nav.studentView')}
                </span>
              </button>
            </div>
          ) : (
            <div className="p-2 flex items-center justify-between text-xs text-lavender/70">
              <span className="flex items-center gap-2">
                <GraduationCap className="size-3.5 text-lavender/60" />
                <span>{t('nav.activeMode')}</span>
              </span>
              <span className="font-semibold text-lavender/90">{t('nav.studentTitle')}</span>
            </div>
          )}

          <div className="my-1 border-t border-white/10" />

          <button
            onClick={async () => {
              setOpen(false)
              await signOut()
            }}
            className="w-full flex items-center gap-2.5 p-2 rounded-lg text-xs font-semibold text-rose-300 hover:bg-rose-500/15 hover:text-rose-200 transition-colors cursor-pointer"
          >
            <LogOut className="size-3.5" />
            <span>{t('nav.signOut')}</span>
          </button>
        </div>
      )}
    </div>
  )
}

function useBreadcrumbs() {
  const pathname = usePathname()
  const { year, specialty } = useLookup()
  const { lectures } = useStore()
  const { t } = useLanguage()

  if (pathname === '/home') return [{ label: t('header.breadcrumbs.home') }]
  if (pathname === '/lectures') return [{ label: t('header.breadcrumbs.lectures') }]
  if (pathname === '/saved') return [{ label: t('header.breadcrumbs.saved') }]
  if (pathname === '/support') return [{ label: t('header.breadcrumbs.support') }]

  const yearMatch = pathname.match(/^\/years\/([^/]+)$/)
  if (yearMatch) {
    const y = year(yearMatch[1])
    return [
      { label: t('header.breadcrumbs.home'), href: '/home' },
      { label: y?.name || t('header.breadcrumbs.year') },
    ]
  }

  const specMatch = pathname.match(/^\/years\/([^/]+)\/specialties\/([^/]+)$/)
  if (specMatch) {
    const y = year(specMatch[1])
    const s = specialty(specMatch[2])
    return [
      { label: t('header.breadcrumbs.home'), href: '/home' },
      { label: y?.name || t('header.breadcrumbs.year'), href: `/years/${specMatch[1]}` },
      { label: s?.name || t('header.breadcrumbs.specialty') },
    ]
  }

  const playerMatch = pathname.match(/^\/lectures\/([^/]+)$/)
  if (playerMatch) {
    const l = lectures.find((item) => item.id === playerMatch[1])
    if (!l) return [{ label: t('header.breadcrumbs.lectures'), href: '/lectures' }]
    const y = year(l.yearId)
    const s = specialty(l.specialtyId)
    return [
      { label: y?.name || t('header.breadcrumbs.year'), href: `/years/${l.yearId}` },
      {
        label: s?.name || t('header.breadcrumbs.specialty'),
        href: `/years/${l.yearId}/specialties/${l.specialtyId}?section=${l.section_id}`,
      },
      { label: l.title },
    ]
  }

  return [{ label: t('header.breadcrumbs.dashboard'), href: '/home' }]
}

function SearchInput() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [q, setQ] = useState(searchParams.get('q') || '')
  const { t, isRTL } = useLanguage()

  useEffect(() => {
    setQ(searchParams.get('q') || '')
  }, [searchParams])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (q.trim()) {
      router.push(`/lectures?q=${encodeURIComponent(q.trim())}`)
    } else {
      router.push('/lectures')
    }
  }

  return (
    <form
      onSubmit={handleSearch}
      className={cx('relative flex-1 min-w-0 max-w-xs sm:max-w-md', isRTL ? 'mr-auto' : 'ml-auto')}
    >
      <Search
        className={cx(
          'absolute top-1/2 -translate-y-1/2 size-4 text-lavender/40',
          isRTL ? 'right-3.5' : 'left-3.5',
        )}
      />
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={t('header.searchPlaceholder')}
        aria-label="Search"
        className={cx(
          'w-full h-10 rounded-xl bg-navy ring-1 ring-lavender/10 text-sm text-lavender placeholder:text-lavender/35 outline-none focus:ring-2 focus:ring-amethyst',
          isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4',
        )}
      />
    </form>
  )
}

export function Header() {
  const { lectures, setMobileMenuOpen } = useStore()
  const { isRTL, t } = useLanguage()
  const crumbs = useBreadcrumbs()
  const [bellOpen, setBellOpen] = useState(false)
  const bellRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const close = (e: MouseEvent) =>
      bellRef.current && !bellRef.current.contains(e.target as Node) && setBellOpen(false)
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  const latest = [...lectures].sort((a, b) => b.createdAt - a.createdAt).slice(0, 4)

  return (
    <header className="sticky top-0 z-20 h-[72px] flex items-center gap-2.5 sm:gap-4 px-3 sm:px-8 bg-midnight/85 backdrop-blur-xl border-b border-lavender/10">
      <button
        type="button"
        onClick={() => setMobileMenuOpen((o) => !o)}
        aria-label="Toggle Menu"
        className="lg:hidden p-2 rounded-xl bg-navy ring-1 ring-lavender/10 text-lavender hover:text-amethyst cursor-pointer shrink-0"
      >
        <Menu className="size-5" />
      </button>

      <nav aria-label="Breadcrumb" className="hidden md:flex items-center gap-1.5 text-sm min-w-0 shrink">
        {crumbs.map((c, i) => (
          <span key={i} className="flex items-center gap-1.5 min-w-0">
            {i > 0 && (
              <ChevronRight
                className={cx('size-3.5 text-lavender/30 shrink-0', isRTL && 'rotate-180')}
              />
            )}
            {c.href ? (
              <Link
                href={c.href}
                className="text-lavender/55 hover:text-amethyst truncate cursor-pointer"
              >
                {c.label}
              </Link>
            ) : (
              <span className="font-semibold text-lavender truncate">{c.label}</span>
            )}
          </span>
        ))}
      </nav>

      <Suspense
        fallback={
          <div
            className={cx(
              'relative flex-1 min-w-0 max-w-xs sm:max-w-md h-10 rounded-xl bg-navy/50',
              isRTL ? 'mr-auto' : 'ml-auto',
            )}
          />
        }
      >
        <SearchInput />
      </Suspense>

      {/* Language Switcher */}
      <LanguageSwitcher variant="header" />

      {/* Notifications bell */}
      <div ref={bellRef} className="relative shrink-0">
        <button
          onClick={() => setBellOpen((o) => !o)}
          aria-label={t('header.notifications')}
          aria-expanded={bellOpen}
          className="relative size-10 grid place-items-center rounded-xl bg-navy ring-1 ring-lavender/10 text-lavender/70 hover:text-amethyst cursor-pointer"
        >
          <Bell className="size-[18px]" />
          <span
            className={cx(
              'absolute top-2 size-2 rounded-full bg-amethyst ring-2 ring-navy',
              isRTL ? 'left-2.5' : 'right-2.5',
            )}
          />
        </button>
        {bellOpen && (
          <div
            className={cx(
              'absolute top-12 w-80 rounded-2xl bg-navy ring-1 ring-lavender/15 shadow-2xl p-2 animate-pop z-50',
              isRTL ? 'left-0 origin-top-left' : 'right-0 origin-top-right',
            )}
          >
            <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-lavender/45">
              {t('header.newInSpecialties')}
            </div>
            {latest.map((l) => (
              <Link
                key={l.id}
                href={`/lectures/${l.id}`}
                onClick={() => setBellOpen(false)}
                className="w-full flex gap-3 p-3 rounded-xl text-start hover:bg-lavender/5 cursor-pointer block"
              >
                <CircleCheck className="size-4 text-amethyst mt-0.5 shrink-0" />
                <span className="min-w-0">
                  <span className="block text-[13px] font-semibold line-clamp-1 text-lavender">
                    {l.title}
                  </span>
                  <span className="block text-xs text-lavender/50 mt-0.5">
                    {l.category} · {l.format} · {timeAgo(l.createdAt)}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>

      <UserMenu />
    </header>
  )
}
