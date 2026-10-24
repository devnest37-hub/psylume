'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Bookmark,
  BookmarkX,
  CircleCheck,
  Clock,
  FileText,
  HardDrive,
  History,
  Play,
  PlayCircle,
  Trash2,
} from 'lucide-react'
import { useLookup, useStore } from '@/context/store'
import { useLanguage } from '@/context/language'
import {
  Button,
  CategoryBadge,
  EmptyState,
  FormatBadge,
  LectureCard,
  LectureThumb,
  Tabs,
  cx,
} from '@/components/ui'
import { formatDuration, timeAgo } from '@/lib/data'
import { type Lecture } from '@/types'

type Tab = 'videos' | 'docs' | 'history'

export default function SavedPage() {
  const { bookmarks, lectures, history, toggleBookmark, clearHistory } = useStore()
  const { isRTL, t } = useLanguage()
  const [tab, setTab] = useState<Tab>('videos')

  const saved = bookmarks
    .map((id) => lectures.find((l) => l.id === id))
    .filter(Boolean) as Lecture[]

  const videos = saved.filter((l) => l.format === 'MP4')
  const docs = saved.filter((l) => l.format !== 'MP4')

  const hist = history
    .map((h) => ({ h, l: lectures.find((l) => l.id === h.lectureId) }))
    .filter((x) => Boolean(x.l)) as { h: (typeof history)[number]; l: Lecture }[]

  const groups = (() => {
    const out: { label: string; items: typeof hist }[] = []
    const startOfToday = new Date().setHours(0, 0, 0, 0)
    const bucket = (ts: number) =>
      ts >= startOfToday
        ? t('saved.today')
        : ts >= startOfToday - 86_400_000
          ? t('saved.yesterday')
          : ts >= startOfToday - 6 * 86_400_000
            ? t('saved.thisWeek')
            : t('saved.older')

    for (const item of hist) {
      const label = bucket(item.h.at)
      const g = out.find((x) => x.label === label)
      if (g) g.items.push(item)
      else out.push({ label, items: [item] })
    }
    return out
  })()

  return (
    <div className="animate-fade-up">
      {/* Header */}
      <div className="flex items-end justify-between gap-6 mb-7">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-amethyst mb-1.5">
            {t('saved.title')}
          </div>
          <h1 className="text-[32px] font-extrabold tracking-[-0.03em] text-lavender">
            {t('nav.saved')}
          </h1>
          <p className="text-lavender/55 mt-1">
            {t('saved.subtitle')}
          </p>
        </div>

        <div className="flex gap-3">
          {[
            { v: videos.length, l: t('saved.videosTab'), i: <PlayCircle className="size-4" /> },
            { v: docs.length, l: t('saved.documentsTab'), i: <FileText className="size-4" /> },
            {
              v: hist.filter((x) => x.h.progress >= 0.98).length,
              l: t('common.completed'),
              i: <CircleCheck className="size-4" />,
            },
          ].map((s) => (
            <div
              key={s.l}
              className="rounded-2xl bg-navy ring-1 ring-lavender/10 px-4 py-3 min-w-28"
            >
              <div className="flex items-center gap-1.5 text-amethyst">{s.i}</div>
              <div className="text-xl font-extrabold tabular-nums mt-1 text-lavender">
                {s.v}
              </div>
              <div className="text-xs text-lavender/50">{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between mb-6">
        <Tabs<Tab>
          tabs={[
            { value: 'videos', label: t('saved.videosTab'), count: videos.length },
            { value: 'docs', label: t('saved.documentsTab'), count: docs.length },
            { value: 'history', label: t('saved.historyTab'), count: hist.length },
          ]}
          value={tab}
          onChange={setTab}
        />

        {tab === 'history' && hist.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clearHistory}>
            <Trash2 className="size-4" /> {t('saved.clearHistory')}
          </Button>
        )}
      </div>

      {/* Tab: Videos */}
      {tab === 'videos' &&
        (videos.length === 0 ? (
          <EmptyState
            icon={<Bookmark className="size-6" />}
            title={t('saved.noSavedVideos')}
            body={t('saved.noSavedVideosDesc')}
            action={
              <Link href="/lectures">
                <Button>
                  <span>{t('lectures.allLectures')}</span>
                </Button>
              </Link>
            }
          />
        ) : (
          <div className="grid grid-cols-4 gap-x-6 gap-y-8">
            {videos.map((l) => (
              <div key={l.id} className="relative group/card">
                <LectureCard lecture={l} />
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    toggleBookmark(l.id)
                  }}
                  aria-label="Remove from saved"
                  title="Remove from saved"
                  className="absolute top-2 right-2 size-8 grid place-items-center rounded-lg bg-midnight/85 ring-1 ring-lavender/20 text-amethyst opacity-0 group-hover/card:opacity-100 hover:bg-amethyst hover:text-midnight transition-all cursor-pointer z-10"
                >
                  <BookmarkX className="size-4" />
                </button>
              </div>
            ))}
          </div>
        ))}

      {/* Tab: Documents */}
      {tab === 'docs' &&
        (docs.length === 0 ? (
          <EmptyState
            icon={<FileText className="size-6" />}
            title={t('saved.noSavedDocs')}
            body={t('saved.noSavedDocsDesc')}
            action={
              <Link href="/lectures">
                <Button>{t('saved.browseCatalog')}</Button>
              </Link>
            }
          />
        ) : (
          <div className="space-y-3">
            {docs.map((l) => (
              <div
                key={l.id}
                className="group flex items-center gap-5 p-3 pr-5 rounded-2xl bg-navy/60 ring-1 ring-lavender/10 hover:ring-amethyst/50 hover:bg-navy transition-all animate-fade-up"
              >
                <Link href={`/lectures/${l.id}`} className="shrink-0">
                  <LectureThumb lecture={l} compact className="w-44" />
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
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
                  <div className="flex items-center gap-4 mt-2 text-xs text-lavender/55">
                    <span>{l.instructor}</span>
                    <span>{l.pages} {t('common.pages')}</span>
                    <span>{l.sizeMB} MB</span>
                  </div>
                </div>
                <button
                  onClick={() => toggleBookmark(l.id)}
                  aria-label={t('saved.removeBookmark')}
                  className="size-10 grid place-items-center rounded-xl bg-amethyst/20 ring-1 ring-amethyst text-amethyst hover:bg-amethyst hover:text-midnight transition-colors cursor-pointer shrink-0"
                >
                  <Bookmark className="size-4 fill-current" />
                </button>
                <Link
                  href={`/lectures/${l.id}`}
                  className="h-10 px-4 rounded-xl bg-violet text-lavender text-sm font-semibold inline-flex items-center gap-1.5 shrink-0 group-hover:bg-amethyst group-hover:text-midnight transition-colors"
                >
                  {t('saved.openDoc')}
                </Link>
              </div>
            ))}
          </div>
        ))}

      {/* Tab: Watch History */}
      {tab === 'history' &&
        (hist.length === 0 ? (
          <EmptyState
            icon={<History className="size-6" />}
            title={t('saved.noHistory')}
            body={t('saved.noHistoryDesc')}
          />
        ) : (
          <div className="space-y-8">
            {groups.map((g) => (
              <div key={g.label}>
                <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-lavender/45 mb-3">
                  {g.label}
                </div>
                <div className="space-y-2">
                  {g.items.map(({ h, l }) => (
                    <HistoryRowItem
                      key={l.id}
                      l={l}
                      progress={h.progress}
                      at={h.at}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
    </div>
  )
}

function HistoryRowItem({
  l,
  progress,
  at,
}: {
  l: Lecture
  progress: number
  at: number
}) {
  const { specialty, year } = useLookup()
  const done = progress >= 0.98
  const isVideo = l.format === 'MP4'

  return (
    <Link
      href={`/lectures/${l.id}`}
      className="group w-full flex items-center gap-5 p-3 pr-5 rounded-2xl bg-navy/60 ring-1 ring-lavender/10 hover:ring-amethyst/50 hover:bg-navy text-left transition-all cursor-pointer block"
    >
      <div className="flex items-center gap-5 w-full">
        <LectureThumb lecture={l} compact className="w-44 shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <CategoryBadge category={l.category} />
            <FormatBadge format={l.format} />
            <span className="text-[11px] text-lavender/45 font-semibold">
              {specialty(l.specialtyId)?.name} · {year(l.yearId)?.code}
            </span>
          </div>
          <div className="font-bold text-[15px] truncate group-hover:text-amethyst transition-colors text-lavender">
            {l.title}
          </div>
          <div className="mt-2 flex items-center gap-3">
            <div className="w-56 h-1.5 rounded-full bg-lavender/10 overflow-hidden">
              <div
                className={cx('h-full rounded-full', done ? 'bg-lavender' : 'bg-amethyst')}
                style={{ width: `${Math.max(progress, 0.03) * 100}%` }}
              />
            </div>
            <span className="text-xs text-lavender/55 tabular-nums">
              {done
                ? isVideo
                  ? 'Watched'
                  : 'Read'
                : isVideo
                  ? `${formatDuration((l.duration ?? 0) * (1 - progress))} left`
                  : `Page ${Math.max(1, Math.round(progress * (l.pages ?? 1)))} of ${l.pages}`}
            </span>
          </div>
        </div>

        <span className="text-xs text-lavender/45 shrink-0">{timeAgo(at)}</span>
        <span
          className={cx(
            'h-9 px-3.5 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shrink-0 transition-colors',
            done
              ? 'bg-lavender/10 text-lavender'
              : 'bg-violet text-lavender group-hover:bg-amethyst group-hover:text-midnight',
          )}
        >
          {done ? (
            <CircleCheck className="size-3.5" />
          ) : (
            <Play className="size-3.5 fill-current" />
          )}
          {done ? 'Open again' : 'Resume'}
        </span>
      </div>
    </Link>
  )
}
