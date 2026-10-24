'use client'

import { use, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Download,
  Edit,
  Eye,
  FileText,
  ListVideo,
  Play,
  Share2,
  Trash2,
} from 'lucide-react'
import { useLookup, useStore } from '@/context/store'
import { useLanguage } from '@/context/language'
import {
  Avatar,
  Button,
  CategoryBadge,
  EmptyState,
  FormatBadge,
  cx,
} from '@/components/ui'
import { VideoPlayer, usePlayback } from '@/components/player/VideoPlayer'
import { DocumentViewer } from '@/components/player/DocumentViewer'
import {
  buildChapters,
  buildDocument,
  buildPdf,
  buildWordDoc,
  downloadBlob,
  fileSlug,
} from '@/lib/content'
import { compact, formatDuration, timeAgo } from '@/lib/data'
import { type Lecture } from '@/types'

export default function PlayerPage({
  params,
}: {
  params: Promise<{ lectureId: string }>
}) {
  const { lectureId } = use(params)
  const router = useRouter()
  const { t, isRTL } = useLanguage()
  const {
    lectures,
    history,
    isBookmarked,
    toggleBookmark,
    recordHistory,
    toast,
    openModal,
    role,
  } = useStore()
  const { specialty, year } = useLookup()

  const l = lectures.find((x) => x.id === lectureId)

  const s = l ? specialty(l.specialtyId) : null
  const y = l ? year(l.yearId) : null
  const isVideo = l?.format === 'MP4'
  const saved = l ? isBookmarked(l.id) : false
  const [autoplay, setAutoplay] = useState(true)
  const [expanded, setExpanded] = useState(false)

  // Playlist of related lectures in same specialty, year, and section
  const playlist = useMemo(
    () =>
      l
        ? lectures
            .filter(
              (x) =>
                x.specialtyId === l.specialtyId &&
                x.yearId === l.yearId &&
                (x.section_id === l.section_id || x.category === l.category),
            )
            .sort((a, b) => a.module.localeCompare(b.module) || a.createdAt - b.createdAt)
        : [],
    [lectures, l],
  )

  const idx = playlist.findIndex((x) => x.id === l?.id)
  const next = playlist[idx + 1]
  const prev = playlist[idx - 1]

  const prevProgress = history.find((h) => h.lectureId === l?.id)?.progress ?? 0
  const docPages = useMemo(
    () =>
      l && !isVideo ? buildDocument(l, s?.name ?? '', y?.name ?? '') : [],
    [l, isVideo, s, y],
  )

  const isRealVideo = Boolean(
    isVideo &&
      l?.file_url &&
      (l.file_url.startsWith('http') || l.file_url.startsWith('blob:')),
  )

  const download = () => {
    if (!l) return
    if (l.file_url) {
      const link = document.createElement('a')
      link.href = l.file_url
      link.download = `${fileSlug(l)}.${(l.format || 'pdf').toLowerCase()}`
      link.target = '_blank'
      link.rel = 'noopener noreferrer'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      toast(`Downloading ${l.title} from cloud repository…`)
      return
    }
    const name = fileSlug(l)
    if (l.format === 'DOCX') {
      downloadBlob(
        buildWordDoc(
          docPages.length ? docPages : buildDocument(l, s?.name ?? '', y?.name ?? ''),
          l.title,
        ),
        `${name}.doc`,
      )
    } else if (l.format === 'PDF') {
      downloadBlob(buildPdf(docPages, l.title), `${name}.pdf`)
    } else {
      downloadBlob(
        buildPdf(
          buildDocument({ ...l, pages: 4 }, s?.name ?? '', y?.name ?? ''),
          `${l.title} — lecture notes`,
        ),
        `${name}_notes.pdf`,
      )
    }
    toast(
      `Downloading ${l.format === 'MP4' ? 'lecture notes (PDF)' : l.format + ' file'}…`,
    )
  }

  const chapters = useMemo(() => (l ? buildChapters(l) : []), [l])
  const pb = usePlayback(
    l?.duration ?? 0,
    prevProgress > 0 && prevProgress < 0.98 ? prevProgress * (l?.duration ?? 0) : 0,
    isRealVideo,
  )

  // Watch progress recording
  const progressRef = useRef(0)
  progressRef.current = isVideo ? pb.time / (l?.duration || 1) : progressRef.current

  useEffect(() => {
    if (!l) return
    recordHistory(
      l.id,
      isVideo ? prevProgress : Math.max(prevProgress, 1 / (l.pages ?? 1)),
    )
    return () => {
      if (isVideo) recordHistory(l.id, progressRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!l || !isVideo || !pb.playing) return
    const t = setInterval(() => recordHistory(l.id, progressRef.current), 8000)
    return () => clearInterval(t)
  }, [isVideo, pb.playing, l, recordHistory])

  if (!l) {
    return (
      <EmptyState
        icon={<FileText className="size-5" />}
        title="Lecture not found"
        body="This lecture does not exist or has been removed."
        action={
          <Link
            href="/lectures"
            className="h-10 px-4 rounded-xl bg-violet text-lavender font-semibold text-sm inline-flex items-center"
          >
            Browse all lectures
          </Link>
        }
      />
    )
  }

  const currentChapter = chapters.reduce(
    (acc, c, i) => (pb.time >= c.at ? i : acc),
    0,
  )

  return (
    <div className="grid grid-cols-[minmax(0,1fr)_380px] gap-7 animate-fade-up">
      <div className="min-w-0">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <nav
            aria-label="Breadcrumbs"
            className="flex items-center gap-2 text-xs font-semibold text-lavender/55 flex-wrap"
          >
            <Link
              href="/home"
              className="hover:text-amethyst transition-colors inline-flex items-center gap-1"
            >
              {t('nav.home')}
            </Link>
            <span className="text-lavender/30">/</span>
            <Link
              href={`/years/${l.yearId}`}
              className="hover:text-amethyst transition-colors"
            >
              {y?.code || y?.name || 'Academic Year'}
            </Link>
            <span className="text-lavender/30">/</span>
            <Link
              href={`/years/${l.yearId}/specialties/${l.specialtyId}?section=${l.section_id}`}
              className="hover:text-amethyst transition-colors"
            >
              {s?.name ?? 'Specialty'}
            </Link>
            <span className="text-lavender/30">/</span>
            <span className="text-amethyst truncate max-w-xs">{l.title}</span>
          </nav>

          <Link
            href={`/years/${l.yearId}/specialties/${l.specialtyId}?section=${l.section_id}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-lavender/55 hover:text-amethyst cursor-pointer"
          >
            <ArrowLeft className={cx("size-3.5", isRTL && "rotate-180")} /> {s?.name ?? t('specialty.curriculum')}
          </Link>
        </div>

        {isVideo ? (
          <VideoPlayer
            lecture={l}
            chapters={chapters}
            pb={pb}
            next={next}
            autoplay={autoplay}
            onNext={() => next && router.push(`/lectures/${next.id}`)}
            specialtyCode={s?.code ?? ''}
          />
        ) : (
          <DocumentViewer
            lecture={l}
            pages={docPages}
            specialty={s?.name ?? ''}
            faculty={s?.faculty ?? ''}
            year={y?.name ?? ''}
            onDownload={download}
            onPage={(p) => recordHistory(l.id, p / (docPages.length || 1))}
          />
        )}

        {/* Title & metadata bar */}
        <div className="mt-5">
          <div className="flex items-center gap-2 mb-2">
            <CategoryBadge category={l.category} />
            <FormatBadge format={l.format} />
            <span className="text-xs font-semibold text-amethyst ml-1">
              {s?.name} · {y?.name} · {l.module}
            </span>
          </div>
          <h1 className="text-[26px] font-extrabold tracking-[-0.02em] leading-tight text-lavender">
            {l.title}
          </h1>
        </div>

        {/* Instructor info & Actions */}
        <div className="mt-4 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <Avatar name={l.instructor} size="lg" />
            <div>
              <div className="font-bold text-sm text-lavender">{l.instructor}</div>
              <div className="text-xs text-lavender/50">{s?.faculty}</div>
            </div>
            <span className="mx-2 h-8 w-px bg-lavender/10" />
            <div className="text-xs text-lavender/55 flex items-center gap-3">
              <span className="inline-flex items-center gap-1">
                <Eye className="size-3.5" /> {compact(l.views + 1)} views
              </span>
              <span>{timeAgo(l.createdAt)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {role === 'instructor' && (
              <>
                <Button
                  variant="outline"
                  onClick={() => openModal({ type: 'edit-lecture', lecture: l })}
                >
                  <Edit className="size-4" /> {t('common.edit')}
                </Button>
                <Button
                  variant="danger"
                  onClick={() => openModal({ type: 'delete-lecture', lecture: l })}
                >
                  <Trash2 className="size-4" /> {t('common.delete')}
                </Button>
              </>
            )}

            <Button
              variant={saved ? 'secondary' : 'primary'}
              onClick={() => toggleBookmark(l.id)}
              aria-pressed={saved}
              className={cx(saved && 'ring-1 ring-amethyst text-amethyst')}
            >
              <Bookmark className={cx('size-4', saved && 'fill-current')} />
              {saved ? t('saved.removeBookmark') : t('common.bookmark')}
            </Button>
            <Button variant="secondary" onClick={download}>
              <Download className="size-4" />{' '}
              {isVideo ? t('specialty.notesPdf') : t('common.download')}
            </Button>
            <Button
              variant="secondary"
              aria-label="Share"
              onClick={() => {
                if (typeof window !== 'undefined') {
                  navigator.clipboard?.writeText(window.location.href).catch(() => {})
                  toast(t('specialty.copiedToClipboard'))
                }
              }}
            >
              <Share2 className="size-4" />
            </Button>
          </div>
        </div>

        {/* Description card */}
        <div className="mt-5 rounded-2xl bg-navy ring-1 ring-lavender/10 p-5">
          <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs font-semibold text-lavender/70 mb-3">
            <span>
              {isVideo
                ? `${t('common.duration')} ${formatDuration(l.duration ?? 0)}`
                : `${l.pages} ${t('common.pages')}`}
            </span>
            <span>{l.sizeMB} MB</span>
            <span>
              {t('specialty.published')}{' '}
              {new Date(l.createdAt).toLocaleDateString(isRTL ? 'ar-EG' : 'en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </span>
          </div>
          <p
            className={cx(
              'text-sm text-lavender/70 leading-relaxed',
              !expanded && 'line-clamp-2',
            )}
          >
            {l.description}
          </p>
          {expanded && (
            <div className="mt-4 grid grid-cols-3 gap-3 text-xs">
              {[
                [t('common.module'), l.module],
                [t('header.breadcrumbs.specialty'), s?.name],
                [t('specialty.academicYear'), y?.name],
              ].map(([k, v]) => (
                <div key={k} className="rounded-xl bg-midnight/50 p-3">
                  <div className="text-lavender/45">{k}</div>
                  <div className="font-bold mt-0.5 text-lavender">{v}</div>
                </div>
              ))}
            </div>
          )}
          <button
            onClick={() => setExpanded((e) => !e)}
            className="mt-2 text-xs font-bold text-amethyst hover:text-lavender cursor-pointer"
          >
            {expanded ? t('specialty.showLess') : t('specialty.showMore')}
          </button>
        </div>

        {/* Chapters list */}
        {isVideo && chapters.length > 0 && (
          <div className="mt-5 rounded-2xl bg-navy ring-1 ring-lavender/10 p-2">
            <div className="px-3 pt-2 pb-1 text-[11px] font-bold uppercase tracking-[0.16em] text-lavender/45">
              {t('specialty.chapters')}
            </div>
            <div className="grid grid-cols-5 gap-2 p-1">
              {chapters.map((c, i) => (
                <button
                  key={c.at}
                  onClick={() => {
                    pb.seek(c.at)
                    pb.setPlaying(true)
                  }}
                  className={cx(
                    'text-start rounded-xl p-3 ring-1 transition-colors cursor-pointer',
                    i === currentChapter
                      ? 'bg-violet/25 ring-amethyst'
                      : 'ring-lavender/10 hover:ring-amethyst/50',
                  )}
                >
                  <div className="text-[11px] font-bold text-amethyst tabular-nums">
                    {formatDuration(c.at)}
                  </div>
                  <div className="text-[12.5px] font-semibold leading-snug mt-1 line-clamp-2 text-lavender">
                    {c.title}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Side Playlist */}
      <aside className="min-w-0">
        <div className="sticky top-[96px] rounded-2xl bg-navy ring-1 ring-lavender/10 overflow-hidden flex flex-col max-h-[calc(100vh-120px)]">
          <div className="p-4 border-b border-lavender/10 bg-gradient-to-br from-violet/30 to-transparent">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-amethyst">
                <ListVideo className="size-4" /> {t('specialty.playlist')}
              </div>
              <span className="text-xs text-lavender/55 tabular-nums">
                {idx + 1} / {playlist.length}
              </span>
            </div>
            <div className="mt-2 font-bold leading-tight text-lavender">
              {s?.name} — {l.category}
            </div>
            <div className="text-xs text-lavender/50">
              {y?.name} · {t('specialty.continuousLearning')}
            </div>

            <div className="mt-3 flex items-center justify-between">
              <div className="flex gap-1.5">
                <button
                  disabled={!prev}
                  onClick={() => prev && router.push(`/lectures/${prev.id}`)}
                  aria-label="Previous item"
                  className="size-8 grid place-items-center rounded-lg bg-midnight/50 hover:bg-violet text-lavender disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                >
                  <ChevronLeft className="size-4" />
                </button>
                <button
                  disabled={!next}
                  onClick={() => next && router.push(`/lectures/${next.id}`)}
                  aria-label="Next item"
                  className="size-8 grid place-items-center rounded-lg bg-midnight/50 hover:bg-violet text-lavender disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>

              <label className="flex items-center gap-2 text-xs font-semibold text-lavender/70 cursor-pointer">
                Autoplay
                <button
                  role="switch"
                  aria-checked={autoplay}
                  onClick={() => setAutoplay((a) => !a)}
                  className={cx(
                    'relative w-9 h-5 rounded-full transition-colors cursor-pointer',
                    autoplay ? 'bg-amethyst' : 'bg-lavender/20',
                  )}
                >
                  <span
                    className={cx(
                      'absolute top-0.5 size-4 rounded-full bg-lavender transition-all',
                      autoplay ? 'left-[18px]' : 'left-0.5',
                    )}
                  />
                </button>
              </label>
            </div>
          </div>

          <ol className="overflow-y-auto p-2 space-y-1">
            {playlist.map((p, i) => {
              const current = p.id === l.id
              return (
                <li key={p.id}>
                  <Link
                    href={`/lectures/${p.id}`}
                    aria-current={current}
                    className={cx(
                      'group w-full flex gap-3 p-2 rounded-xl text-left transition-colors cursor-pointer block',
                      current
                        ? 'bg-violet/25 ring-1 ring-amethyst/60'
                        : 'hover:bg-lavender/5',
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <span className="w-4 pt-4 text-[11px] font-bold text-lavender/40 tabular-nums text-center shrink-0">
                        {i + 1}
                      </span>
                      <div className="w-24 shrink-0 aspect-video rounded-lg overflow-hidden bg-midnight relative">
                        <img
                          src={p.image}
                          alt=""
                          className="size-full object-cover"
                        />
                        <span className="absolute bottom-1 right-1 text-[9px] font-bold bg-midnight/80 text-lavender px-1 rounded">
                          {p.format}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div
                          className={cx(
                            'text-xs font-semibold line-clamp-2',
                            current ? 'text-amethyst' : 'text-lavender group-hover:text-amethyst',
                          )}
                        >
                          {p.title}
                        </div>
                        <div className="text-[11px] text-lavender/45 mt-1 truncate">
                          {p.instructor}
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              )
            })}
          </ol>
        </div>
      </aside>
    </div>
  )
}
