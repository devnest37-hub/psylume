'use client'

import { use } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Edit,
  FolderOpen,
  Layers,
  Trash2,
  Users,
} from 'lucide-react'
import { useStore } from '@/context/store'
import { useLanguage } from '@/context/language'
import {
  AddButton,
  Avatar,
  EmptyState,
  SectionHeader,
  SpecialtyIcon,
  cx,
} from '@/components/ui'
import { compact, img } from '@/lib/data'
import { type Specialty } from '@/types'

export default function YearPage({
  params,
}: {
  params: Promise<{ yearId: string }>
}) {
  const { yearId } = use(params)
  const { t, isRTL } = useLanguage()
  const {
    years,
    specialties,
    sections,
    lectures,
    openModal,
    role,
  } = useStore()

  const y = years.find((x) => x.id === yearId)
  if (!y) {
    return (
      <EmptyState
        icon={<Layers className="size-5" />}
        title={t('specialty.yearNotFound')}
        body={t('specialty.yearNotFoundDesc')}
        action={
          <Link
            href="/home"
            className="h-10 px-4 rounded-xl bg-violet text-lavender font-semibold text-sm inline-flex items-center"
          >
            {t('common.back')}
          </Link>
        }
      />
    )
  }

  const specs = specialties.filter((s) => s.yearIds.includes(yearId))
  const yl = lectures.filter((l) => l.yearId === yearId)
  const yearSecs = sections.filter((s) => s.academic_year_id === yearId)

  return (
    <div className="animate-fade-up">
      {/* Year Banner Header */}
      <div className="relative overflow-hidden rounded-3xl bg-navy ring-1 ring-lavender/10 p-8 mb-10">
        <div className="absolute right-6 -top-10 font-serif text-[220px] leading-none font-semibold text-lavender/[0.04] select-none">
          {y.code}
        </div>
        <div className="absolute -left-20 -bottom-32 size-80 rounded-full bg-violet/30 blur-[100px]" />

        <div className="flex items-center justify-between relative">
          <Link
            href="/home"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-lavender/55 hover:text-amethyst cursor-pointer"
          >
            <ArrowLeft className={cx("size-3.5", isRTL && "rotate-180")} /> {t('nav.years')}
          </Link>

          {role === 'instructor' && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => openModal({ type: 'edit-year', year: y })}
                className="h-8 px-3 rounded-lg bg-midnight/80 ring-1 ring-lavender/15 text-xs font-semibold text-lavender hover:bg-violet inline-flex items-center gap-1.5"
              >
                <Edit className="size-3.5" /> {t('common.edit')}
              </button>
              <button
                onClick={() => openModal({ type: 'delete-year', year: y })}
                className="h-8 px-3 rounded-lg bg-midnight/80 ring-1 ring-lavender/15 text-xs font-semibold text-red-400 hover:bg-red-500/20 inline-flex items-center gap-1.5"
              >
                <Trash2 className="size-3.5" /> {t('common.delete')}
              </button>
            </div>
          )}
        </div>

        <div className="relative mt-5 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <span className="inline-flex h-7 px-2.5 items-center rounded-lg bg-violet text-xs font-extrabold text-lavender">
              {y.code}
            </span>
            <h1 className="mt-3 text-[26px] sm:text-[34px] md:text-[38px] font-extrabold tracking-[-0.03em] leading-tight text-lavender">
              {y.name}
            </h1>
            <p className="mt-2 text-lavender/60 text-sm sm:text-base">{y.tagline}</p>
          </div>

          <div className="flex flex-wrap gap-2.5 sm:gap-3">
            {[
              { v: specs.length, l: t('specialty.specialties') },
              { v: yl.length, l: t('specialty.lecturesAndFiles') },
              { v: yearSecs.length, l: t('specialty.dynamicSections') },
            ].map((s) => (
              <div
                key={s.l}
                className="flex-1 sm:flex-initial min-w-24 sm:min-w-28 rounded-2xl bg-midnight/50 ring-1 ring-lavender/10 px-3.5 sm:px-4 py-2.5 sm:py-3 text-center sm:text-start"
              >
                <div className="text-xl sm:text-2xl font-extrabold tabular-nums text-lavender">
                  {s.v}
                </div>
                <div className="text-[11px] sm:text-xs text-lavender/50">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <SectionHeader
        eyebrow={t('specialty.step1')}
        title={t('specialty.enrolledSpecialties')}
        description={t('specialty.pickSpecialtyDesc', { year: y.name })}
        action={
          <AddButton
            label={t('home.addSpecialty')}
            onClick={() => openModal({ type: 'specialty', yearId })}
          />
        }
      />

      {specs.length === 0 ? (
        <EmptyState
          icon={<FolderOpen className="size-6" />}
          title={t('specialty.noSpecialtiesYearTitle')}
          body={t('specialty.noSpecialtiesYearDesc')}
          action={
            <AddButton
              label={'+ ' + t('home.addSpecialty')}
              onClick={() => openModal({ type: 'specialty', yearId })}
            />
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {specs.map((s, i) => (
            <SpecialtyCard
              key={s.id}
              s={s}
              yearId={yearId}
              delay={i * 40}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function SpecialtyCard({
  s,
  yearId,
  delay = 0,
}: {
  s: Specialty
  yearId: string
  delay?: number
}) {
  const { sections, lectures, openModal, role } = useStore()
  const { t } = useLanguage()
  const ls = lectures.filter((l) => l.specialtyId === s.id && l.yearId === yearId)
  const specSections = sections.filter(
    (sec) => sec.specialty_id === s.id && sec.academic_year_id === yearId,
  )

  return (
    <div
      style={{ animationDelay: `${delay}ms` }}
      className="group rounded-2xl bg-navy ring-1 ring-lavender/10 overflow-hidden hover:ring-amethyst/60 hover:-translate-y-1 transition-all duration-300 animate-fade-up relative flex flex-col justify-between"
    >
      <div>
        <Link
          href={`/years/${yearId}/specialties/${s.id}`}
          className="block w-full text-start cursor-pointer"
        >
          <div className="relative h-40 overflow-hidden">
            <img
              src={img(s.image, 700)}
              alt=""
              className="absolute inset-0 size-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/50 to-transparent" />
            <div className="absolute bottom-4 left-5 right-5 flex items-end gap-3">
              <span className="size-12 rounded-xl bg-violet grid place-items-center shrink-0 shadow-lg text-lavender">
                <SpecialtyIcon icon={s.icon} iconUrl={s.iconUrl} className="size-5" />
              </span>
              <div className="min-w-0">
                <div className="text-lg font-bold leading-tight group-hover:text-amethyst transition-colors text-lavender">
                  {s.name}
                </div>
                <div className="text-xs text-lavender/60 truncate">{s.faculty}</div>
              </div>
            </div>

            {role === 'instructor' && (
              <div className="absolute top-3 right-3 flex items-center gap-1 z-10">
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

          <div className="px-5 pt-4">
            <p className="text-sm text-lavender/60 line-clamp-2 min-h-10">
              {s.description}
            </p>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex -space-x-2">
                {s.instructors.map((n) => (
                  <Avatar key={n} name={n} size="sm" className="ring-2 ring-navy" />
                ))}
              </div>
              <span className="text-xs text-lavender/50 inline-flex items-center gap-1">
                <Users className="size-3.5" /> {compact(s.students)} {t('common.students')}
              </span>
            </div>
          </div>
        </Link>
      </div>

      {/* Dynamic Sections Grid */}
      <div className="grid grid-cols-3 gap-1.5 p-5 pt-4">
        {specSections.slice(0, 3).map((sec) => (
          <Link
            key={sec.id}
            href={`/years/${yearId}/specialties/${s.id}?section=${sec.id}`}
            className="rounded-xl bg-midnight/50 ring-1 ring-lavender/10 py-2 text-center hover:ring-amethyst hover:bg-amethyst/10 transition-colors cursor-pointer block"
          >
            <div className="text-base font-extrabold tabular-nums text-lavender">
              {ls.filter((l) => l.section_id === sec.id).length}
            </div>
            <div className="text-[11px] text-lavender/55 font-semibold truncate px-1">
              {sec.name}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
