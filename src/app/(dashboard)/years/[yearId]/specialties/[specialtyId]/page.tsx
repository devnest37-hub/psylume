'use client'

import { Suspense, use, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Clock,
  Edit,
  Eye,
  FileText,
  HardDrive,
  Layers,
  Plus,
  Trash2,
} from 'lucide-react'
import { useLookup, useStore } from '@/context/store'
import { useLanguage } from '@/context/language'
import {
  AddButton,
  Avatar,
  CategoryBadge,
  EmptyState,
  FormatBadge,
  LectureThumb,
  SpecialtyIcon,
  cx,
} from '@/components/ui'
import {
  CATEGORY_META,
  FORMATS,
  compact,
  formatDuration,
  img,
  timeAgo,
} from '@/lib/data'
import { type Format, type Lecture } from '@/types'

function SpecialtyHubContent({
  params,
}: {
  params: Promise<{ yearId: string; specialtyId: string }>
}) {
  const { yearId, specialtyId } = use(params)
  const { t, isRTL } = useLanguage()
  const searchParams = useSearchParams()
  const initialSectionParam = searchParams.get('section')

  const {
    years,
    specialties,
    sections,
    lectures,
    openModal,
    role,
  } = useStore()
  const { specialty } = useLookup()
  const s = specialty(specialtyId)
  const y = years.find((x) => x.id === yearId)

  // Get all dynamic sections for this specialty and year
  const specialtySections = useMemo(
    () =>
      sections
        .filter(
          (sec) =>
            sec.specialty_id === specialtyId && sec.academic_year_id === yearId,
        )
        .sort((a, b) => a.sort_order - b.sort_order),
    [sections, specialtyId, yearId],
  )

  const [activeSectionId, setActiveSectionId] = useState<string>(
    initialSectionParam || specialtySections[0]?.id || '',
  )

  useEffect(() => {
    if (initialSectionParam && specialtySections.some((sec) => sec.id === initialSectionParam)) {
      setActiveSectionId(initialSectionParam)
    } else if (specialtySections.length > 0 && !specialtySections.some((sec) => sec.id === activeSectionId)) {
      setActiveSectionId(specialtySections[0].id)
    }
  }, [specialtySections, initialSectionParam, activeSectionId])

  const activeSection =
    specialtySections.find((sec) => sec.id === activeSectionId) ||
    specialtySections[0]

  const [format, setFormat] = useState<Format | 'all'>('all')
  const [sort, setSort] = useState<'new' | 'views' | 'title'>('new')

  // Filter lectures for active section
  const scopedLectures = useMemo(() => {
    return lectures.filter(
      (l) =>
        l.specialtyId === specialtyId &&
        l.yearId === yearId &&
        (l.section_id === activeSection?.id || l.category === activeSection?.name),
    )
  }, [lectures, specialtyId, yearId, activeSection])

  const filteredItems = useMemo(() => {
    const list = scopedLectures.filter(
      (l) => format === 'all' || l.format === format,
    )
    return [...list].sort((a, b) => {
      if (sort === 'new') return b.createdAt - a.createdAt
      if (sort === 'views') return b.views - a.views
      return a.title.localeCompare(b.title)
    })
  }, [scopedLectures, format, sort])

  if (!s) {
    return (
      <EmptyState
        icon={<Layers className="size-5" />}
        title={t('specialty.specialtyNotFound')}
        body={t('specialty.specialtyNotFoundDesc')}
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

  const meta = activeSection ? CATEGORY_META[activeSection.name] : null

  return (
    <div className="animate-fade-up">
      {/* Specialty Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl ring-1 ring-lavender/10 mb-8 min-h-[240px] flex">
        <img
          src={img(s.image, 1600)}
          alt=""
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-midnight via-midnight/90 to-midnight/30" />

        <div className="relative p-5 sm:p-8 flex-1 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <Link
              href={`/years/${yearId}`}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-lavender/60 hover:text-amethyst cursor-pointer"
            >
              <ArrowLeft className={cx("size-3.5", isRTL && "rotate-180")} /> {y?.name ?? t('nav.years')}
            </Link>

            {role === 'instructor' && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openModal({ type: 'edit-specialty', specialty: s })}
                  className="h-8 px-3 rounded-lg bg-midnight/80 ring-1 ring-lavender/15 text-xs font-semibold text-lavender hover:bg-violet inline-flex items-center gap-1.5"
                >
                  <Edit className="size-3.5" /> {t('common.edit')}
                </button>
                <button
                  onClick={() => openModal({ type: 'delete-specialty', specialty: s })}
                  className="h-8 px-3 rounded-lg bg-midnight/80 ring-1 ring-lavender/15 text-xs font-semibold text-red-400 hover:bg-red-500/20 inline-flex items-center gap-1.5"
                >
                  <Trash2 className="size-3.5" /> {t('common.delete')}
                </button>
              </div>
            )}
          </div>

          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-8">
            <div className="flex items-center gap-4 sm:gap-5">
              <span className="size-14 sm:size-16 rounded-2xl bg-violet grid place-items-center shadow-xl text-lavender shrink-0">
                <SpecialtyIcon icon={s.icon} iconUrl={s.iconUrl} className="size-6 sm:size-7" />
              </span>
              <div>
                <div className="text-xs font-semibold text-amethyst">
                  {s.faculty} · {s.code}
                </div>
                <h1 className="text-[22px] sm:text-[30px] md:text-[36px] font-extrabold tracking-[-0.03em] leading-tight text-lavender">
                  {s.name}
                </h1>
                <p className="text-xs sm:text-sm text-lavender/65 max-w-lg mt-1">
                  {s.description}
                </p>
              </div>
            </div>

            {/* Year Switcher Pills */}
            <div className="flex flex-col items-start sm:items-end gap-2">
              <span className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-lavender/45">
                {t('specialty.academicYear')}
              </span>
              <div className="flex gap-1 p-1 rounded-xl bg-midnight/70 ring-1 ring-lavender/15 backdrop-blur">
                {s.yearIds.map((yid) => {
                  const yy = years.find((x) => x.id === yid)
                  if (!yy) return null
                  const isCurrent = yid === yearId
                  return (
                    <Link
                      key={yid}
                      href={`/years/${yid}/specialties/${specialtyId}`}
                      className={cx(
                        'h-8 px-3 rounded-lg text-xs font-bold transition-colors inline-flex items-center',
                        isCurrent
                          ? 'bg-violet text-lavender'
                          : 'text-lavender/60 hover:text-amethyst',
                      )}
                    >
                      {yy.code}
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Step 2: Dynamic Sections */}
      <div className="flex items-center justify-between mb-3">
        <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-amethyst">
          {t('specialty.step2')}
        </div>
        {role === 'instructor' && (
          <button
            onClick={() => openModal({ type: 'section', yearId, specialtyId })}
            className="h-8 px-3 rounded-lg bg-navy ring-1 ring-lavender/15 text-xs font-semibold text-amethyst hover:bg-violet hover:text-lavender inline-flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Plus className="size-3.5" /> {t('specialty.addCustomSection')}
          </button>
        )}
      </div>

      {specialtySections.length === 0 ? (
        <EmptyState
          icon={<Layers className="size-6" />}
          title={t('specialty.noSectionsYet')}
          body={t('specialty.noSectionsDesc')}
          action={
            role === 'instructor' ? (
              <AddButton
                label={t('specialty.createFirstSection')}
                onClick={() => openModal({ type: 'section', yearId, specialtyId })}
              />
            ) : undefined
          }
        />
      ) : (
        <>
          <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
            {/* Dynamic Section Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
              {specialtySections.map((sec) => {
                const count = lectures.filter(
                  (l) =>
                    l.specialtyId === specialtyId &&
                    l.yearId === yearId &&
                    (l.section_id === sec.id || l.category === sec.name),
                ).length
                const active = sec.id === activeSection?.id

                return (
                  <div
                    key={sec.id}
                    className={cx(
                      'group inline-flex items-center rounded-xl p-1 transition-all',
                      active ? 'bg-violet text-lavender shadow' : 'bg-midnight/60 ring-1 ring-lavender/10',
                    )}
                  >
                    <button
                      onClick={() => {
                        setActiveSectionId(sec.id)
                        setFormat('all')
                      }}
                      className={cx(
                        'h-9 px-4 rounded-lg font-semibold text-sm inline-flex items-center gap-2 cursor-pointer transition-colors',
                        active ? 'text-lavender' : 'text-lavender/65 hover:text-amethyst',
                      )}
                    >
                      <span>{sec.name}</span>
                      <span
                        className={cx(
                          'text-[11px] tabular-nums px-1.5 rounded-md',
                          active ? 'bg-lavender/20 text-lavender' : 'bg-lavender/5 text-lavender/50',
                        )}
                      >
                        {count}
                      </span>
                    </button>

                    {role === 'instructor' && (
                      <div className="flex items-center gap-1 pr-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            openModal({ type: 'edit-section', section: sec })
                          }}
                          title="Edit section"
                          className="size-6 grid place-items-center rounded-md hover:bg-lavender/10 text-lavender/70"
                        >
                          <Edit className="size-3" />
                        </button>
                        {!sec.is_default && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              openModal({ type: 'delete-section', section: sec })
                            }}
                            title="Delete section"
                            className="size-6 grid place-items-center rounded-md hover:bg-red-500/20 text-red-300"
                          >
                            <Trash2 className="size-3" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Add Lecture / File Button */}
            <AddButton
              label={t('specialty.addLectureOrFile')}
              onClick={() =>
                openModal({
                  type: 'lecture',
                  yearId,
                  specialtyId,
                  sectionId: activeSection?.id,
                  category: activeSection?.name,
                })
              }
            />
          </div>

          {/* Section Blurb & Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <p className="text-sm text-lavender/55">
              <span className="font-semibold text-lavender">
                {meta?.label || `${activeSection?.name || 'Section'} Resources`}
              </span>{' '}
              — {meta?.blurb || 'Curated educational material published by instructors.'}
            </p>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              {(['all', ...FORMATS] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFormat(f)}
                  className={cx(
                    'h-8 px-3 rounded-lg text-xs font-bold ring-1 transition-colors cursor-pointer',
                    format === f
                      ? 'bg-lavender text-navy ring-lavender'
                      : 'ring-lavender/15 text-lavender/60 hover:text-amethyst hover:ring-amethyst/50',
                  )}
                >
                  {f === 'all' ? t('specialty.allFormats') : f}
                </button>
              ))}

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as typeof sort)}
                aria-label="Sort"
                className="h-8 px-2 rounded-lg bg-navy ring-1 ring-lavender/15 text-xs font-semibold text-lavender outline-none cursor-pointer"
              >
                <option value="new">{t('specialty.newestFirst')}</option>
                <option value="views">{t('specialty.mostViewed')}</option>
                <option value="title">{t('specialty.titleAZ')}</option>
              </select>
            </div>
          </div>

          {/* Lectures List */}
          {filteredItems.length === 0 ? (
            <EmptyState
              icon={<FileText className="size-6" />}
              title={
                format === 'all'
                  ? t('specialty.noLecturesUploaded')
                  : `No ${format} files in “${activeSection?.name || 'this section'}”`
              }
              body={
                format === 'all'
                  ? t('specialty.noLecturesSectionDesc')
                  : `No ${format} files found in this section. Try choosing “${t('specialty.allFormats')}”.`
              }
              action={
                role === 'instructor' ? (
                  <AddButton
                    label={'+ ' + t('specialty.addLectureOrFile')}
                    onClick={() =>
                      openModal({
                        type: 'lecture',
                        yearId,
                        specialtyId,
                        sectionId: activeSection?.id,
                        category: activeSection?.name,
                      })
                    }
                  />
                ) : undefined
              }
            />
          ) : (
            <div className="space-y-3">
              {filteredItems.map((l, i) => (
                <LectureRowItem key={l.id} lecture={l} index={i + 1} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

function LectureRowItem({
  lecture: l,
  index,
}: {
  lecture: Lecture
  index?: number
}) {
  const { isBookmarked, toggleBookmark, openModal, role } = useStore()
  const saved = isBookmarked(l.id)

  return (
    <div className="group flex flex-col md:flex-row items-stretch md:items-center gap-3 sm:gap-5 p-3 sm:pr-5 rounded-2xl bg-navy/60 ring-1 ring-lavender/10 hover:ring-amethyst/50 hover:bg-navy transition-all animate-fade-up">
      {index !== undefined && (
        <span className="hidden md:inline-block w-6 text-center text-sm font-bold text-lavender/35 tabular-nums">
          {index}
        </span>
      )}

      <Link href={`/lectures/${l.id}`} className="shrink-0 w-full md:w-48">
        <LectureThumb lecture={l} compact className="w-full md:w-48 aspect-video" />
      </Link>

      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1.5">
          <CategoryBadge category={l.category} />
          <FormatBadge format={l.format} />
          <span className="text-[11px] font-semibold text-lavender/45">
            {l.module}
          </span>
        </div>

        <Link
          href={`/lectures/${l.id}`}
          className="font-bold text-[15px] leading-snug group-hover:text-amethyst transition-colors line-clamp-1 text-lavender block"
        >
          {l.title}
        </Link>

        <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 mt-2 text-xs text-lavender/55">
          <span className="inline-flex items-center gap-1.5">
            <Avatar name={l.instructor} size="sm" /> {l.instructor}
          </span>
          <span className="inline-flex items-center gap-1">
            {l.format === 'MP4' ? <Clock className="size-3.5" /> : <FileText className="size-3.5" />}
            {l.format === 'MP4' ? formatDuration(l.duration ?? 0) : `${l.pages} pages`}
          </span>
          <span className="inline-flex items-center gap-1">
            <HardDrive className="size-3.5" /> {l.sizeMB} MB
          </span>
          <span className="inline-flex items-center gap-1">
            <Eye className="size-3.5" /> {compact(l.views)}
          </span>
          <span>{timeAgo(l.createdAt)}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 justify-end md:justify-start pt-2 md:pt-0 border-t border-lavender/5 md:border-0">
        {/* Instructor actions */}
        {role === 'instructor' && (
          <div className="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => openModal({ type: 'edit-lecture', lecture: l })}
              title="Edit lecture"
              className="size-9 grid place-items-center rounded-xl bg-midnight/80 ring-1 ring-lavender/15 text-lavender/70 hover:text-amethyst cursor-pointer"
            >
              <Edit className="size-4" />
            </button>
            <button
              onClick={() => openModal({ type: 'delete-lecture', lecture: l })}
              title="Delete lecture"
              className="size-9 grid place-items-center rounded-xl bg-midnight/80 ring-1 ring-lavender/15 text-lavender/70 hover:text-red-400 cursor-pointer"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        )}

        {/* Bookmark button */}
        <button
          onClick={() => toggleBookmark(l.id)}
          aria-label={saved ? 'Remove bookmark' : 'Save to bookmarks'}
          aria-pressed={saved}
          className={cx(
            'size-10 grid place-items-center rounded-xl ring-1 transition-colors cursor-pointer shrink-0',
            saved
              ? 'bg-amethyst/20 ring-amethyst text-amethyst'
              : 'ring-lavender/15 text-lavender/60 hover:text-amethyst hover:ring-amethyst/60',
          )}
        >
          <Bookmark className={cx('size-4', saved && 'fill-current')} />
        </button>

        {/* Open / Watch CTA */}
        <Link
          href={`/lectures/${l.id}`}
          className="h-10 px-4 rounded-xl bg-violet text-lavender text-sm font-semibold inline-flex items-center gap-1.5 shrink-0 group-hover:bg-amethyst group-hover:text-midnight transition-colors"
        >
          {l.format === 'MP4' ? 'Watch' : 'Open'} <ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  )
}

export default function SpecialtyHubPage({
  params,
}: {
  params: Promise<{ yearId: string; specialtyId: string }>
}) {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center text-sm text-lavender/40">
          Loading specialty resources…
        </div>
      }
    >
      <SpecialtyHubContent params={params} />
    </Suspense>
  )
}
