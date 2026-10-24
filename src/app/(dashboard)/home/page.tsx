'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  Edit,
  Eye,
  FileText,
  FolderOpen,
  GraduationCap,
  Play,
  Trash2,
  TrendingUp,
  Users,
} from 'lucide-react'
import { useLookup, useStore } from '@/context/store'
import { useLanguage } from '@/context/language'
import {
  AddButton,
  Button,
  EmptyState,
  LectureCard,
  LectureThumb,
  SectionHeader,
  SpecialtyIcon,
  cx,
} from '@/components/ui'
import { compact, formatDuration, img } from '@/lib/data'

export default function HomePage() {
  const {
    years,
    specialties,
    sections,
    lectures,
    openModal,
    history,
    role,
    user,
  } = useStore()
  const { specialty, year } = useLookup()
  const { isRTL, t } = useLanguage()
  const displayName = user?.full_name || (role === 'instructor' ? t('nav.instructor') : t('nav.student'))
  const firstName = user?.full_name ? user.full_name.split(' ')[0] : displayName
  const hour = new Date().getHours()
  const greeting =
    hour < 12 ? t('home.goodMorning') : hour < 18 ? t('home.goodAfternoon') : t('home.goodEvening')

  const resume = history
    .map((h) => ({ h, l: lectures.find((l) => l.id === h.lectureId) }))
    .find((x) => x.l && x.h.progress < 1)

  const recent = [...lectures].sort((a, b) => b.createdAt - a.createdAt).slice(0, 8)
  const weekCount = lectures.filter((l) => Date.now() - l.createdAt < 7 * 86_400_000).length

  const specStats = specialties
    .map((s) => {
      const ls = lectures.filter((l) => l.specialtyId === s.id)
      return {
        s,
        views: ls.reduce((a, l) => a + l.views, 0),
        lecturesCount: ls.length,
      }
    })
    .sort((a, b) => b.views - a.views)
    .slice(0, 4)

  const maxViews = specStats[0]?.views || 1

  return (
    <div className="space-y-14 animate-fade-up">
      {/* Top Banner */}
      <section className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-6">
        <div className="relative overflow-hidden rounded-3xl bg-navy ring-1 ring-lavender/10 p-5 sm:p-8">
          <div className="absolute inset-0 bg-grid opacity-60 [mask-image:linear-gradient(to_left,black,transparent)]" />
          <div className="absolute -right-24 -top-24 size-80 rounded-full bg-violet/40 blur-[90px]" />
          <div className="relative">
            <div className="text-sm text-lavender/55 font-medium">
              {greeting}, {firstName}
            </div>
            <h1 className="mt-2 text-[22px] sm:text-[28px] md:text-[32px] leading-[1.15] font-extrabold tracking-[-0.03em] max-w-xl text-lavender">
              {weekCount > 0 ? (
                role === 'instructor' ? (
                  <>
                    {t('home.publishedResourcesInstructor', { count: weekCount })}
                  </>
                ) : (
                  <>
                    {t('home.publishedResourcesStudent', { count: weekCount })}
                  </>
                )
              ) : (
                role === 'instructor' ? (
                  <>{t('home.welcomeInstructor')}</>
                ) : (
                  <>{t('home.welcomeStudent')}</>
                )
              )}
            </h1>
            <div className="mt-7 flex gap-10">
              {[
                { label: t('nav.years'), v: years.length },
                { label: t('specialty.specialties'), v: specialties.length },
                { label: t('common.resources'), v: lectures.length },
              ].map((s) => (
                <div key={s.label}>
                  <div className="text-2xl font-extrabold tabular-nums text-lavender">
                    {s.v}
                  </div>
                  <div className="text-xs text-lavender/50 font-medium mt-0.5">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Continue watching / resume card */}
        {resume?.l ? (
          <div className="relative rounded-3xl bg-navy ring-1 ring-lavender/10 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-lavender/50">
                <span>{t('home.resumeTitle')}</span>
                <span className="text-amethyst">
                  {t('home.resumeProgress', { percent: Math.round(resume.h.progress * 100) })}
                </span>
              </div>
              <div className="mt-4 flex gap-4 items-center">
                <LectureThumb lecture={resume.l} compact className="w-32 shrink-0" />
                <div className="min-w-0">
                  <div className="text-[11px] font-bold text-amethyst uppercase tracking-wide">
                    {specialty(resume.l.specialtyId)?.name} · {year(resume.l.yearId)?.code}
                  </div>
                  <div className="font-bold text-sm text-lavender line-clamp-2 mt-0.5">
                    {resume.l.title}
                  </div>
                </div>
              </div>
            </div>
            <Link
              href={`/lectures/${resume.l.id}`}
              className="mt-4 h-10 px-4 rounded-xl bg-violet text-lavender hover:bg-amethyst hover:text-midnight font-semibold text-xs inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Play className="size-3.5 fill-current" /> {t('saved.resume')}
            </Link>
          </div>
        ) : (
          <div className="relative rounded-3xl bg-navy ring-1 ring-lavender/10 p-6 flex flex-col justify-between">
            <div>
              <div className="text-xs font-semibold text-lavender/50">{t('common.appName')}</div>
              <h3 className="text-lg font-bold text-lavender mt-2">{t('home.welcomeStudent')}</h3>
              <p className="text-xs text-lavender/60 mt-1 leading-relaxed">
                {t('home.academicYearsDesc')}
              </p>
            </div>
            <Link href="/lectures">
              <Button size="md" className="w-full">
                <span>{t('lectures.allLectures')}</span> <ArrowRight className={cx('size-4', isRTL && 'rotate-180')} />
              </Button>
            </Link>
          </div>
        )}
      </section>

      {/* Section A: Academic Years */}
      <section id="academic-years">
        <SectionHeader
          eyebrow={t('nav.years')}
          title={t('home.academicYearsTitle')}
          description={t('home.academicYearsDesc')}
          action={
            <AddButton
              label={t('home.addYear')}
              onClick={() => openModal({ type: 'year' })}
            />
          }
        />
        {years.length === 0 ? (
          <EmptyState
            icon={<GraduationCap className="size-6" />}
            title={t('home.noYearsYet')}
            body={t('home.academicYearsDesc')}
            action={
              role === 'instructor' ? (
                <AddButton
                  label={t('home.addYear')}
                  onClick={() => openModal({ type: 'year' })}
                />
              ) : undefined
            }
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {years.map((y, i) => {
              const specs = specialties.filter((s) => s.yearIds.includes(y.id))
              const ls = lectures.filter((l) => l.yearId === y.id)
              const yearSecs = sections.filter((sec) => sec.academic_year_id === y.id)

              return (
                <div
                  key={y.id}
                  style={{ animationDelay: `${i * 50}ms` }}
                  className="group relative overflow-hidden rounded-2xl bg-navy ring-1 ring-lavender/10 p-5 hover:ring-amethyst/60 hover:-translate-y-1 transition-all duration-300 animate-fade-up"
                >
                  <div className="absolute -right-4 -top-6 font-serif text-[104px] leading-none font-semibold text-lavender/[0.05] group-hover:text-amethyst/15 transition-colors select-none">
                    {y.code}
                  </div>

                  <div className="flex items-center justify-between relative">
                    <span className="inline-flex h-7 px-2.5 items-center rounded-lg bg-violet text-xs font-extrabold tracking-wide text-lavender">
                      {y.code}
                    </span>

                    {role === 'instructor' && (
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            openModal({ type: 'edit-year', year: y })
                          }}
                          aria-label="Edit year"
                          className="size-7 grid place-items-center rounded-md bg-midnight/80 text-lavender/60 hover:text-amethyst hover:bg-midnight"
                        >
                          <Edit className="size-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            openModal({ type: 'delete-year', year: y })
                          }}
                          aria-label="Delete year"
                          className="size-7 grid place-items-center rounded-md bg-midnight/80 text-lavender/60 hover:text-red-400 hover:bg-midnight"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  <Link href={`/years/${y.id}`} className="block cursor-pointer">
                    <div className="relative mt-8 text-lg font-bold tracking-tight truncate text-lavender">
                      {y.name}
                    </div>
                    <div className="relative text-xs text-lavender/50 mt-0.5 line-clamp-1">
                      {y.tagline}
                    </div>
                    <div className="relative mt-4 flex gap-5 text-xs text-lavender">
                      <div>
                        <div className="font-extrabold text-base tabular-nums">
                          {specs.length}
                        </div>
                        <div className="text-lavender/50">{t('specialty.specialties')}</div>
                      </div>
                      <div>
                        <div className="font-extrabold text-base tabular-nums">
                          {ls.length}
                        </div>
                        <div className="text-lavender/50">{t('common.resources')}</div>
                      </div>
                    </div>
                    <ArrowRight className={cx('absolute bottom-4 size-4 text-amethyst opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0', isRTL ? 'left-4 translate-x-2 rotate-180' : 'right-4 -translate-x-2')} />
                  </Link>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* Section B: Most Viewed Specialties */}
      <section>
        <SectionHeader
          eyebrow={t('home.topSpecialtiesTitle')}
          title={t('home.topSpecialtiesTitle')}
          description={t('home.topSpecialtiesDesc')}
          action={
            <div className="flex items-center gap-2">
              <AddButton
                label={t('home.addSpecialty')}
                size="sm"
                onClick={() => openModal({ type: 'specialty' })}
              />
              <Link href="/lectures">
                <Button variant="ghost" size="sm">
                  <span>{t('lectures.allLectures')}</span> <ArrowRight className={cx('size-4', isRTL && 'rotate-180')} />
                </Button>
              </Link>
            </div>
          }
        />
        {specStats.length === 0 ? (
          <EmptyState
            icon={<FolderOpen className="size-6" />}
            title={t('home.noSpecialtiesYet')}
            body={t('home.topSpecialtiesDesc')}
            action={
              role === 'instructor' ? (
                <AddButton
                  label={t('home.addSpecialty')}
                  size="sm"
                  onClick={() => openModal({ type: 'specialty' })}
                />
              ) : undefined
            }
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {specStats.map(({ s, views, lecturesCount }, rank) => {
              const yearId = s.yearIds[0] || 'y1'
              const specSections = sections.filter(
                (sec) => sec.specialty_id === s.id && sec.academic_year_id === yearId,
              )

              return (
                <div
                  key={s.id}
                  className="group rounded-2xl bg-navy ring-1 ring-lavender/10 overflow-hidden hover:ring-amethyst/50 transition-all"
                >
                  <Link
                    href={`/years/${yearId}/specialties/${s.id}`}
                    className="block w-full text-start cursor-pointer"
                  >
                    <div className="relative h-32 overflow-hidden">
                      <img
                        src={img(s.image, 600)}
                        alt=""
                        className="absolute inset-0 size-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/40 to-violet/20" />
                      <span className={cx('absolute top-3 h-6 px-2 rounded-md bg-midnight/80 backdrop-blur text-[11px] font-bold tabular-nums inline-flex items-center text-lavender', isRTL ? 'right-3' : 'left-3')}>
                        #{rank + 1} {t('common.views')}
                      </span>

                      {role === 'instructor' && (
                        <div className={cx('absolute top-3 flex items-center gap-1', isRTL ? 'left-3' : 'right-3')}>
                          <button
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              openModal({ type: 'edit-specialty', specialty: s })
                            }}
                            className="size-7 grid place-items-center rounded-md bg-midnight/80 text-lavender/70 hover:text-amethyst"
                          >
                            <Edit className="size-3.5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              openModal({ type: 'delete-specialty', specialty: s })
                            }}
                            className="size-7 grid place-items-center rounded-md bg-midnight/80 text-lavender/70 hover:text-red-400"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="relative px-4">
                      <span className={cx('absolute -top-6 size-11 rounded-xl bg-violet grid place-items-center ring-4 ring-navy text-lavender', isRTL ? 'right-4' : 'left-4')}>
                        <SpecialtyIcon icon={s.icon} iconUrl={s.iconUrl} className="size-5" />
                      </span>
                      <div className="pt-8 font-bold text-[15px] group-hover:text-amethyst transition-colors text-lavender">
                        {s.name}
                      </div>
                      <div className="text-xs text-lavender/45 mt-0.5 truncate">
                        {s.faculty}
                      </div>
                      <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
                        <Metric
                          icon={<Eye className="size-3.5" />}
                          value={compact(views)}
                          label={t('common.views')}
                        />
                        <Metric
                          icon={<Users className="size-3.5" />}
                          value={compact(s.students)}
                          label={t('common.students')}
                        />
                        <Metric
                          icon={<TrendingUp className="size-3.5" />}
                          value={`+${s.growth}%`}
                          label={t('common.new')}
                        />
                      </div>
                      <div className="mt-3 h-1 rounded-full bg-lavender/10 overflow-hidden">
                        <div
                          className="h-full bg-amethyst rounded-full"
                          style={{ width: `${(views / maxViews) * 100}%` }}
                        />
                      </div>
                    </div>
                  </Link>

                  {/* Section Quick Jump Buttons */}
                  <div className="flex gap-1.5 p-4 pt-3 flex-wrap">
                    {specSections.slice(0, 3).map((sec) => {
                      const count = lectures.filter((l) => l.section_id === sec.id).length
                      return (
                        <Link
                          key={sec.id}
                          href={`/years/${yearId}/specialties/${s.id}?section=${sec.id}`}
                          className="flex-1 h-8 rounded-lg bg-lavender/5 ring-1 ring-lavender/10 text-[11.5px] font-semibold text-lavender/75 hover:bg-amethyst hover:text-midnight hover:ring-amethyst transition-colors inline-flex items-center justify-center gap-1"
                        >
                          {sec.name}{' '}
                          <span className="opacity-60 tabular-nums">{count}</span>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* Section C: Recently Added */}
      <section>
        <SectionHeader
          eyebrow={t('home.recentLecturesTitle')}
          title={t('home.recentLecturesTitle')}
          description={t('home.recentLecturesDesc')}
          action={
            <div className="flex items-center gap-2">
              <AddButton
                label={t('home.addLecture')}
                size="sm"
                onClick={() => openModal({ type: 'lecture' })}
              />
              <Link href="/lectures">
                <Button variant="ghost" size="sm">
                  <span>{t('home.viewAllCatalog')}</span> <ArrowRight className={cx('size-4', isRTL && 'rotate-180')} />
                </Button>
              </Link>
            </div>
          }
        />
        {recent.length === 0 ? (
          <EmptyState
            icon={<FileText className="size-6" />}
            title={t('home.noLecturesYet')}
            body={t('home.recentLecturesDesc')}
            action={
              role === 'instructor' ? (
                <AddButton
                  label={t('home.addLecture')}
                  size="sm"
                  onClick={() => openModal({ type: 'lecture' })}
                />
              ) : undefined
            }
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {recent.map((l) => (
              <LectureCard key={l.id} lecture={l} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

function Metric({
  icon,
  value,
  label,
}: {
  icon: ReactNode
  value: string
  label: string
}) {
  return (
    <div className="rounded-lg bg-midnight/50 px-2 py-1.5">
      <div className="flex items-center gap-1 font-bold text-lavender">
        <span className="text-amethyst">{icon}</span>
        <span className="tabular-nums">{value}</span>
      </div>
      <div className="text-[10.5px] text-lavender/45 mt-0.5">{label}</div>
    </div>
  )
}
