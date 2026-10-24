'use client'

import { useEffect, useState, type ReactNode } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowRight,
  Bookmark,
  BookOpen,
  CircleCheck,
  FileText,
  Layers,
  PlayCircle,
  ShieldCheck,
  Upload,
} from 'lucide-react'
import { useStore } from '@/context/store'
import { useLanguage, LanguageSwitcher } from '@/context/language'
import { BrandMark } from '@/components/shell/Sidebar'
import { Button, CategoryBadge, cx } from '@/components/ui'
import { img, PHOTOS } from '@/lib/data'

function useCountUp(target: number, ms = 1400) {
  const [v, setV] = useState(0)
  useEffect(() => {
    let raf = 0
    const start = performance.now()
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / ms)
      setV(Math.round(target * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, ms])
  return v
}

function Stat({ value, label, suffix }: { value: number; label: string; suffix?: string }) {
  const v = useCountUp(value)
  return (
    <div className="px-8 py-7">
      <div className="text-4xl font-extrabold tracking-tight tabular-nums text-lavender">
        {v.toLocaleString()}
        {suffix && <span className="text-amethyst">{suffix}</span>}
      </div>
      <div className="text-sm text-lavender/55 mt-1.5 font-medium">{label}</div>
    </div>
  )
}

export default function LandingPage() {
  const { specialties, lectures, years, isAuthenticated, openAuthModal, user } = useStore()
  const { dir, isRTL, t } = useLanguage()
  const router = useRouter()

  const handleEnter = () => {
    if (isAuthenticated) {
      router.push('/home')
    } else {
      openAuthModal('signin')
    }
  }

  const students = specialties.reduce((a, s) => a + (s.students || 0), 0)
  const videos = lectures.filter((l) => l.format === 'MP4').length

  return (
    <div dir={dir} className="min-h-screen bg-midnight overflow-x-hidden text-lavender">
      <header className="relative z-20 max-w-[1240px] mx-auto flex items-center gap-6 md:gap-10 px-8 h-20">
        <Link href="/home" className="flex items-center gap-3 shrink-0">
          <BrandMark className="size-9" />
          <span className="font-extrabold text-lg tracking-tight">Psylume</span>
        </Link>
        <nav className="hidden md:flex gap-7 text-sm font-medium text-lavender/60">
          <a href="#features" className="hover:text-amethyst transition-colors">
            {t('landing.features')}
          </a>
          <a href="#stats" className="hover:text-amethyst transition-colors">
            {t('landing.platform')}
          </a>
          <a href="#faculty" className="hover:text-amethyst transition-colors">
            {t('landing.forFaculty')}
          </a>
        </nav>
        <div className={cx('flex items-center gap-3', isRTL ? 'mr-auto' : 'ml-auto')}>
          <LanguageSwitcher variant="landing" />
          {isAuthenticated ? (
            <Link href="/home">
              <Button className="cursor-pointer">
                <span>{t('landing.goToDashboard')}</span>
                <ArrowRight className={cx('size-4', isRTL && 'rotate-180')} />
              </Button>
            </Link>
          ) : (
            <>
              <Button
                variant="ghost"
                onClick={() => openAuthModal('signin')}
                className="cursor-pointer"
              >
                {t('nav.signIn')}
              </Button>
              <Button
                onClick={() => openAuthModal('signup')}
                className="cursor-pointer"
              >
                <span>{t('landing.enterPlatform')}</span>
                <ArrowRight className={cx('size-4', isRTL && 'rotate-180')} />
              </Button>
            </>
          )}
        </div>
      </header>

      {/* Hero */}
      <section className="relative">
        <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
        <div className="absolute -top-40 left-1/3 size-[640px] rounded-full bg-violet/30 blur-[140px]" />
        <div className="relative max-w-[1240px] mx-auto px-8 pt-14 pb-24 grid grid-cols-[1.05fr_1fr] gap-16 items-center">
          <div className="animate-fade-up">
            <div className="inline-flex items-center gap-2 h-8 pl-1.5 pr-3 rounded-full bg-navy ring-1 ring-lavender/15 text-xs font-semibold">
              <span className="h-5 px-2 rounded-full bg-violet grid place-items-center text-[10.5px]">
                {t('common.new')}
              </span>
              {t('landing.heroBadge')}
            </div>
            <h1 className="mt-6 text-[60px] leading-[1.03] font-extrabold tracking-[-0.035em] text-lavender">
              {t('landing.heroTitle')}{' '}
              <span className="font-serif font-medium italic text-amethyst tracking-[-0.02em]">
                {t('landing.heroHighlight')}
              </span>
            </h1>
            <p className="mt-6 text-lg text-lavender/65 leading-relaxed max-w-[520px]">
              {t('landing.heroSubtitle')}
            </p>
            <div className="mt-9 flex items-center gap-3">
              <Button
                size="lg"
                onClick={handleEnter}
                className="h-14 px-7 text-base cursor-pointer"
              >
                {isAuthenticated ? t('landing.goToDashboard') : t('landing.enterPlatform')}{' '}
                <ArrowRight className={cx('size-5', isRTL && 'rotate-180')} />
              </Button>
              <a href="#features">
                <Button size="lg" variant="outline" className="h-14 px-6 cursor-pointer">
                  <PlayCircle className="size-5" /> {t('landing.seeHowItWorks')}
                </Button>
              </a>
            </div>
            <div className="mt-10 flex items-center gap-3">
              <div className="size-2 rounded-full bg-emerald-400 animate-pulse" />
              <div className="text-xs text-lavender/60">
                <span className="font-bold text-lavender">{specialties.length}</span> {t('landing.disciplinesLabel')} &bull; <span className="font-bold text-lavender">{lectures.length}</span> {t('landing.resourcesLabel')}
                {students > 0 && (
                  <> &bull; <span className="font-bold text-lavender">{students.toLocaleString()}</span> {t('landing.statEnrolled')}</>
                )}
              </div>
            </div>
          </div>

          <div className="relative rounded-3xl bg-navy ring-1 ring-lavender/15 p-6 shadow-2xl animate-pop">
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-midnight">
              <img
                src={img(PHOTOS.hall, 900)}
                alt="Amphitheatre Lecture"
                className="absolute inset-0 size-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-midnight/90 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <div>
                  <span className="inline-flex h-6 px-2 items-center rounded-md bg-violet text-[10.5px] font-bold text-lavender">
                    {t('landing.liveCapture')}
                  </span>
                  <div className="font-bold text-sm mt-1 text-lavender">
                    {t('landing.sampleLectureTitle')}
                  </div>
                </div>
                <Link href="/home">
                  <span className="size-10 rounded-full bg-amethyst grid place-items-center text-midnight hover:scale-105 transition-transform cursor-pointer">
                    <PlayCircle className="size-5" />
                  </span>
                </Link>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-3 rounded-xl bg-midnight/50">
                <div className="font-extrabold text-amethyst">{years.length}</div>
                <div className="text-lavender/50 mt-0.5">{t('landing.academicYearsLabel')}</div>
              </div>
              <div className="p-3 rounded-xl bg-midnight/50">
                <div className="font-extrabold text-amethyst">{specialties.length}</div>
                <div className="text-lavender/50 mt-0.5">{t('landing.disciplinesLabel')}</div>
              </div>
              <div className="p-3 rounded-xl bg-midnight/50">
                <div className="font-extrabold text-amethyst">{lectures.length}</div>
                <div className="text-lavender/50 mt-0.5">{t('landing.resourcesLabel')}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section id="stats" className="border-y border-lavender/10 bg-navy/40">
        <div className="max-w-[1240px] mx-auto grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-lavender/10">
          <Stat value={years.length} label={t('landing.academicYearsLabel')} />
          <Stat value={specialties.length} label={t('landing.disciplinesLabel')} />
          <Stat value={lectures.length} label={t('landing.statResources')} />
          <Stat value={videos} label={t('landing.statVideos')} />
        </div>
      </section>

      {/* Features Showcase */}
      <section id="features" className="max-w-[1240px] mx-auto px-8 py-28">
        <div className="max-w-2xl">
          <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-amethyst">
            {t('landing.whatsInside')}
          </div>
          <h2 className="mt-3 text-[42px] leading-[1.08] font-extrabold tracking-[-0.03em]">
            {t('landing.featuresH2')}{' '}
            <span className="font-serif italic font-medium text-amethyst">
              {t('landing.featuresH2Highlight')}
            </span>
          </h2>
        </div>
        <div className="mt-14 grid grid-cols-6 gap-5">
          <Feature
            className="col-span-4"
            icon={<PlayCircle className="size-5" />}
            title={t('landing.feature1Title')}
            body={t('landing.feature1Body')}
          >
            <div className="mt-6 rounded-2xl bg-midnight/70 ring-1 ring-lavender/10 p-4">
              <div className="relative h-2 rounded-full bg-lavender/10">
                <div className="absolute inset-y-0 left-0 w-[58%] rounded-full bg-amethyst" />
                {[18, 38, 80].map((p) => (
                  <span
                    key={p}
                    className="absolute top-1/2 -translate-y-1/2 w-0.5 h-3 bg-midnight"
                    style={{ left: `${p}%` }}
                  />
                ))}
                <span className="absolute top-1/2 -translate-y-1/2 left-[58%] -ml-2 size-4 rounded-full bg-lavender ring-4 ring-amethyst/40" />
              </div>
              <div className="mt-4 flex gap-2 text-[11px] font-semibold">
                {['0.75×', '1×', '1.25×', '1.5×', '2×'].map((s) => (
                  <span
                    key={s}
                    className={cx(
                      'h-7 px-2.5 rounded-lg grid place-items-center',
                      s === '1.5×' ? 'bg-violet text-lavender' : 'bg-lavender/5 text-lavender/60',
                    )}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </Feature>
          <Feature
            className="col-span-2"
            icon={<Layers className="size-5" />}
            title={t('landing.feature2Title')}
            body={t('landing.feature2Body')}
          >
            <div className="mt-6 flex flex-col gap-2">
              {['Cours', 'TD', 'Exam', 'TP / Lab Work'].map((c) => (
                <div
                  key={c}
                  className="flex items-center gap-3 h-11 px-3 rounded-xl bg-midnight/60 ring-1 ring-lavender/10"
                >
                  <CategoryBadge category={c} />
                  <span className="text-xs text-lavender/60">
                    {lectures.filter((l) => l.category === c).length} {t('landing.itemsCount')}
                  </span>
                </div>
              ))}
            </div>
          </Feature>
          <Feature
            className="col-span-3"
            icon={<BookOpen className="size-5" />}
            title={t('landing.feature3Title')}
            body={t('landing.feature3Body')}
          >
            <div className="mt-6 flex gap-3">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={cx(
                    'flex-1 aspect-[3/4] rounded-lg bg-paper p-3',
                    i === 1 ? '-translate-y-2 shadow-2xl' : 'opacity-60',
                  )}
                >
                  <div className="h-1.5 w-1/3 bg-violet rounded-sm" />
                  <div className="h-1.5 w-4/5 bg-navy/60 rounded-sm mt-2" />
                  {[90, 70, 85, 60, 75].map((w, k) => (
                    <div
                      key={k}
                      className="h-1 bg-navy/20 rounded-sm mt-1.5"
                      style={{ width: `${w}%` }}
                    />
                  ))}
                </div>
              ))}
            </div>
          </Feature>
          <Feature
            className="col-span-3"
            icon={<Bookmark className="size-5" />}
            title={t('landing.feature4Title')}
            body={t('landing.feature4Body')}
          >
            <div className="mt-6 space-y-2">
              {['Law of Obligations and Contracts', 'Final Exam — Cognitive Psychology'].map(
                (titleText, i) => (
                  <div
                    key={titleText}
                    className="flex items-center gap-3 h-12 px-3 rounded-xl bg-midnight/60 ring-1 ring-lavender/10"
                  >
                    {i === 0 ? (
                      <PlayCircle className="size-4 text-amethyst" />
                    ) : (
                      <FileText className="size-4 text-amethyst" />
                    )}
                    <span className="text-[13px] font-semibold flex-1 truncate">{titleText}</span>
                    <Bookmark className="size-4 fill-amethyst text-amethyst" />
                  </div>
                ),
              )}
            </div>
          </Feature>
        </div>
      </section>

      {/* For Faculty Banner */}
      <section id="faculty" className="max-w-[1240px] mx-auto px-8 pb-28">
        <div className="grid grid-cols-2 rounded-[32px] overflow-hidden ring-1 ring-lavender/10 bg-navy">
          <div className="relative min-h-[420px]">
            <img
              src={img(PHOTOS.womanBoard, 1000)}
              alt="Instructor in front of a chalkboard"
              className="absolute inset-0 size-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-navy" />
          </div>
          <div className="p-14 flex flex-col justify-center">
            <div className="inline-flex w-fit items-center gap-1.5 h-7 px-2.5 rounded-lg bg-violet text-xs font-bold text-lavender">
              <ShieldCheck className="size-3.5" /> {t('landing.facultyTag')}
            </div>
            <h2 className="mt-5 text-[34px] leading-tight font-extrabold tracking-[-0.025em]">
              {t('landing.facultyH2')}
            </h2>
            <p className="mt-4 text-lavender/60 leading-relaxed">
              {t('landing.facultyDesc')}
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              {[
                t('landing.facultyPoint1'),
                t('landing.facultyPoint2'),
                t('landing.facultyPoint3'),
              ].map((text) => (
                <li key={text} className="flex items-center gap-2.5">
                  <CircleCheck className="size-4 text-amethyst" /> {text}
                </li>
              ))}
            </ul>
            <Button
              size="lg"
              onClick={() => {
                if (isAuthenticated) router.push('/home')
                else openAuthModal('signin')
              }}
              className="mt-8 w-fit cursor-pointer"
            >
              <Upload className="size-4" /> {t('landing.enterAsFaculty')}
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Footer Section */}
      <section className="relative overflow-hidden border-t border-lavender/10">
        <div className="absolute left-1/2 -translate-x-1/2 -bottom-60 size-[700px] rounded-full bg-violet/25 blur-[140px]" />
        <div className="relative max-w-[1240px] mx-auto px-8 py-24 text-center">
          <h2 className="text-[44px] font-extrabold tracking-[-0.03em]">
            {years.length} {t('landing.ctaH2', { specialties: specialties.length })}{' '}
            <span className="font-serif italic font-medium text-amethyst">{t('landing.oneHub')}</span>
          </h2>
          <Button
            size="lg"
            onClick={handleEnter}
            className="mt-9 h-14 px-8 text-base cursor-pointer"
          >
            {isAuthenticated ? t('landing.goToDashboard') : t('landing.enterPlatform')}{' '}
            <ArrowRight className={cx('size-5', isRTL && 'rotate-180')} />
          </Button>
        </div>
        <footer className="relative max-w-[1240px] mx-auto px-8 py-8 flex items-center justify-between text-xs text-lavender/40 border-t border-lavender/10">
          <span>{t('landing.copyright')}</span>
          <span>{t('landing.footerLinks')}</span>
        </footer>
      </section>
    </div>
  )
}

function Feature({
  icon,
  title,
  body,
  className,
  children,
}: {
  icon: ReactNode
  title: string
  body: string
  className?: string
  children?: ReactNode
}) {
  return (
    <div
      className={cx(
        'group rounded-3xl bg-navy ring-1 ring-lavender/10 p-7 transition-all hover:ring-amethyst/40 hover:-translate-y-0.5',
        className,
      )}
    >
      <div className="size-11 rounded-2xl bg-violet grid place-items-center text-lavender">
        {icon}
      </div>
      <h3 className="mt-5 text-lg font-bold text-lavender">{title}</h3>
      <p className="mt-1.5 text-sm text-lavender/60 leading-relaxed max-w-md">{body}</p>
      {children}
    </div>
  )
}
