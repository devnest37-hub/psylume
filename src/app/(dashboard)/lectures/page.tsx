'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { FileText, Search } from 'lucide-react'
import { useStore } from '@/context/store'
import { useLanguage } from '@/context/language'
import {
  AddButton,
  Button,
  EmptyState,
  LectureCard,
  Tabs,
  cx,
  inputCls,
} from '@/components/ui'
import { FORMATS } from '@/lib/data'
import { type Format } from '@/types'

function LecturesContent() {
  const searchParams = useSearchParams()
  const queryParam = searchParams.get('q') || ''

  const { lectures, specialties, years, openModal, role } = useStore()
  const { isRTL, t } = useLanguage()
  const [q, setQ] = useState(queryParam)
  const [cat, setCat] = useState<string>('all')
  const [fmt, setFmt] = useState<Format | 'all'>('all')
  const [spec, setSpec] = useState('all')
  const [yr, setYr] = useState('all')
  const [sort, setSort] = useState<'new' | 'views'>('new')
  const [limit, setLimit] = useState(24)

  useEffect(() => {
    setQ(queryParam)
  }, [queryParam])

  const allCategories = useMemo(() => {
    const set = new Set<string>()
    lectures.forEach((l) => set.add(l.category))
    return Array.from(set)
  }, [lectures])

  const filtered = useMemo(() => {
    const needle = q.toLowerCase().trim()
    return lectures
      .filter((l) => {
        if (cat !== 'all' && l.category !== cat) return false
        if (fmt !== 'all' && l.format !== fmt) return false
        if (spec !== 'all' && l.specialtyId !== spec) return false
        if (yr !== 'all' && l.yearId !== yr) return false
        if (!needle) return true
        const s = specialties.find((x) => x.id === l.specialtyId)
        return `${l.title} ${l.instructor} ${l.module} ${s?.name}`
          .toLowerCase()
          .includes(needle)
      })
      .sort((a, b) =>
        sort === 'new' ? b.createdAt - a.createdAt : b.views - a.views,
      )
  }, [lectures, specialties, q, cat, fmt, spec, yr, sort])

  const selectCls =
    'h-10 px-3 rounded-xl bg-navy ring-1 ring-lavender/15 text-sm font-semibold text-lavender outline-none cursor-pointer focus:ring-amethyst'

  const reset = () => {
    setQ('')
    setCat('all')
    setFmt('all')
    setSpec('all')
    setYr('all')
  }

  return (
    <div className="animate-fade-up">
      <div className="flex items-end justify-between gap-6 mb-7">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-amethyst mb-1.5">
            {t('lectures.catalog')}
          </div>
          <h1 className="text-[32px] font-extrabold tracking-[-0.03em] text-lavender">
            {t('lectures.allLectures')}
          </h1>
          <p className="text-lavender/55 mt-1">
            <span className="tabular-nums font-semibold text-lavender">
              {filtered.length}
            </span>{' '}
            {t('lectures.resourcesCount', { filtered: filtered.length, total: lectures.length })}
            {q && (
              <>
                {' '}
                {t('lectures.matching', { query: q })}
              </>
            )}
          </p>
        </div>

        <AddButton
          label={t('home.addLecture')}
          onClick={() => openModal({ type: 'lecture' })}
        />
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 p-3 rounded-2xl bg-navy/60 ring-1 ring-lavender/10 mb-8">
        <div className="relative flex-1 min-w-60">
          <Search
            className={cx(
              'absolute top-1/2 -translate-y-1/2 size-4 text-lavender/40',
              isRTL ? 'right-3.5' : 'left-3.5',
            )}
          />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t('lectures.searchPlaceholder')}
            className={cx(
              inputCls,
              'h-10 bg-navy text-lavender',
              isRTL ? 'pr-10 pl-3' : 'pl-10 pr-3',
            )}
          />
        </div>

        <Tabs
          size="sm"
          tabs={[
            { value: 'all', label: t('lectures.allCategories') },
            ...allCategories.map((c) => ({ value: c, label: c })),
          ]}
          value={cat}
          onChange={setCat}
        />

        <select
          value={fmt}
          onChange={(e) => setFmt(e.target.value as Format | 'all')}
          className={selectCls}
          aria-label="Format"
        >
          <option value="all">{t('lectures.allFormats')}</option>
          {FORMATS.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>

        <select
          value={spec}
          onChange={(e) => setSpec(e.target.value)}
          className={selectCls}
          aria-label="Specialty"
        >
          <option value="all">{t('lectures.allSpecialties')}</option>
          {specialties.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        <select
          value={yr}
          onChange={(e) => setYr(e.target.value)}
          className={selectCls}
          aria-label="Year"
        >
          <option value="all">{t('lectures.allYears')}</option>
          {years.map((y) => (
            <option key={y.id} value={y.id}>
              {y.name}
            </option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as 'new' | 'views')}
          className={selectCls}
          aria-label="Sort"
        >
          <option value="new">{t('lectures.sortNewest')}</option>
          <option value="views">{t('lectures.sortViews')}</option>
        </select>
      </div>

      {lectures.length === 0 ? (
        <EmptyState
          icon={<FileText className="size-6" />}
          title={t('home.noLecturesYet')}
          body={t('lectures.noLecturesDesc')}
          action={
            role === 'instructor' ? (
              <AddButton
                label={t('home.addLecture')}
                onClick={() => openModal({ type: 'lecture' })}
              />
            ) : undefined
          }
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Search className="size-5" />}
          title={t('lectures.noLecturesFound')}
          body={t('lectures.noLecturesDesc')}
          action={
            <Button variant="secondary" onClick={reset}>
              {t('lectures.resetFilters')}
            </Button>
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filtered.slice(0, limit).map((l) => (
              <LectureCard key={l.id} lecture={l} />
            ))}
          </div>

          {filtered.length > limit && (
            <div className="mt-10 text-center">
              <Button variant="outline" onClick={() => setLimit((n) => n + 24)}>
                {t('lectures.loadMore')} · {filtered.length - limit}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default function LecturesPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center text-sm text-lavender/40">
          Loading lecture catalog…
        </div>
      }
    >
      <LecturesContent />
    </Suspense>
  )
}
