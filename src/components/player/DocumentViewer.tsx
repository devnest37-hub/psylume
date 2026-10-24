'use client'

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
  Maximize2,
  RotateCcw,
  ZoomIn,
  ZoomOut,
} from 'lucide-react'
import { cx } from '@/components/ui'
import { fileSlug, type DocPage } from '@/lib/content'
import { type Lecture } from '@/types'
import { useLanguage } from '@/context/language'

const BASE_W = 540

export function DocumentViewer({
  lecture: l,
  pages,
  specialty,
  faculty,
  year,
  onDownload,
  onPage,
}: {
  lecture: Lecture
  pages: DocPage[]
  specialty: string
  faculty: string
  year: string
  onDownload: () => void
  onPage: (page: number) => void
}) {
  const { t, isRTL } = useLanguage()
  const [page, setPage] = useState(1)
  const [zoom, setZoom] = useState(1)
  const [input, setInput] = useState('1')
  const scrollRef = useRef<HTMLDivElement>(null)
  const railRef = useRef<HTMLDivElement>(null)
  const total = pages.length || 1

  const isRealPdf = Boolean(
    l.file_url &&
      (l.format === 'PDF' || l.file_url.includes('lecture-documents') || l.file_url.includes('.pdf')) &&
      (l.file_url.startsWith('http') || l.file_url.startsWith('blob:')),
  )
  const [viewMode, setViewMode] = useState<'embed' | 'interactive'>(
    isRealPdf ? 'embed' : 'interactive',
  )

  const handleDownload = () => {
    if (l.file_url) {
      const a = document.createElement('a')
      a.href = l.file_url
      a.target = '_blank'
      a.rel = 'noopener noreferrer'
      a.download = `${fileSlug(l)}.${l.format.toLowerCase()}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    } else {
      onDownload()
    }
  }

  const go = useCallback(
    (p: number) => {
      const np = Math.max(1, Math.min(total, p))
      setPage(np)
      setInput(String(np))
      scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
    },
    [total],
  )

  useEffect(() => {
    onPage(page)
    railRef.current
      ?.querySelector<HTMLElement>(`[data-page="${page}"]`)
      ?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [page, onPage])

  const fit = () => {
    const w = scrollRef.current?.clientWidth ?? BASE_W
    setZoom(Math.round(((w - 64) / BASE_W) * 10) / 10)
  }

  const currentPage = pages[page - 1]

  return (
    <div
      className="rounded-2xl ring-1 ring-lavender/10 overflow-hidden bg-navy shadow-[0_30px_80px_-30px_rgba(98,71,170,0.45)] select-none"
      onKeyDown={(e) => {
        if ((e.target as HTMLElement).tagName === 'INPUT') return
        if (e.key === 'ArrowRight') go(page + 1)
        if (e.key === 'ArrowLeft') go(page - 1)
      }}
      tabIndex={-1}
    >
      {/* Toolbar */}
      <div className="h-14 px-4 flex items-center justify-between border-b border-lavender/10 bg-navy/90 backdrop-blur">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <span
            className={cx(
              'size-9 rounded-lg grid place-items-center shrink-0 text-lavender',
              l.format === 'DOCX' ? 'bg-amethyst text-midnight' : 'bg-violet',
            )}
          >
            <FileText className="size-4" />
          </span>
          <div className="min-w-0">
            <div className="text-[13px] font-bold truncate text-lavender">
              {fileSlug(l)}.{l.format.toLowerCase()}
            </div>
            <div className="text-[11px] text-lavender/50">
              {l.format} · {total} {t('common.pages')} · {l.sizeMB} MB
            </div>
          </div>
        </div>

        {/* View Mode Toggle when real PDF exists */}
        {isRealPdf && (
          <div className="flex items-center gap-1 rounded-xl bg-midnight/60 ring-1 ring-lavender/10 p-1 mx-3">
            <button
              type="button"
              onClick={() => setViewMode('embed')}
              className={cx(
                'h-7 px-3 rounded-lg text-xs font-semibold transition-colors cursor-pointer',
                viewMode === 'embed'
                  ? 'bg-violet text-lavender shadow'
                  : 'text-lavender/60 hover:text-lavender',
              )}
            >
              {t('player.pdfDocument')}
            </button>
            <button
              type="button"
              onClick={() => setViewMode('interactive')}
              className={cx(
                'h-7 px-3 rounded-lg text-xs font-semibold transition-colors cursor-pointer',
                viewMode === 'interactive'
                  ? 'bg-violet text-lavender shadow'
                  : 'text-lavender/60 hover:text-lavender',
              )}
            >
              {t('player.studyNotes')}
            </button>
          </div>
        )}

        {/* Page navigation (in interactive mode) */}
        {viewMode === 'interactive' && (
          <div className="flex items-center gap-1 rounded-xl bg-midnight/60 ring-1 ring-lavender/10 p-1">
            <ToolBtn label={t('player.previousPage')} onClick={() => go(page - 1)} disabled={page === 1}>
              <ChevronLeft className="size-4" />
            </ToolBtn>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                go(Number(input) || 1)
              }}
              className="flex items-center gap-1.5 text-xs font-semibold text-lavender/60 px-1"
            >
              {t('player.page')}
              <input
                value={input}
                onChange={(e) => setInput(e.target.value.replace(/\D/g, ''))}
                onBlur={() => go(Number(input) || page)}
                aria-label="Page number"
                className="w-9 h-7 rounded-md bg-navy ring-1 ring-lavender/15 text-center text-lavender tabular-nums outline-none focus:ring-amethyst"
              />
              {t('player.of')} <span className="tabular-nums text-lavender">{total}</span>
            </form>
            <ToolBtn label={t('player.nextPage')} onClick={() => go(page + 1)} disabled={page === total}>
              <ChevronRight className="size-4" />
            </ToolBtn>
          </div>
        )}

        {/* Zoom & Download */}
        <div className="flex items-center gap-2 ml-3">
          {viewMode === 'interactive' && (
            <div className="flex items-center gap-1 rounded-xl bg-midnight/60 ring-1 ring-lavender/10 p-1">
              <ToolBtn
                label={t('player.zoomOut')}
                onClick={() => setZoom((z) => Math.max(0.5, Math.round((z - 0.1) * 10) / 10))}
                disabled={zoom <= 0.5}
              >
                <ZoomOut className="size-4" />
              </ToolBtn>
              <button
                onClick={() => setZoom(1)}
                className="text-xs font-semibold tabular-nums text-lavender/70 px-1.5 hover:text-amethyst cursor-pointer"
              >
                {Math.round(zoom * 100)}%
              </button>
              <ToolBtn
                label={t('player.zoomIn')}
                onClick={() => setZoom((z) => Math.min(2, Math.round((z + 0.1) * 10) / 10))}
                disabled={zoom >= 2}
              >
                <ZoomIn className="size-4" />
              </ToolBtn>
              <ToolBtn label={t('player.fitWidth')} onClick={fit}>
                <Maximize2 className="size-4" />
              </ToolBtn>
              <ToolBtn label={t('player.resetZoom')} onClick={() => setZoom(1)}>
                <RotateCcw className="size-4" />
              </ToolBtn>
            </div>
          )}

          <button
            onClick={handleDownload}
            aria-label={t('common.download')}
            title={l.file_url ? t('player.downloadOriginal') : t('player.downloadFile')}
            className="h-9 px-3 rounded-xl bg-violet text-lavender hover:bg-amethyst hover:text-midnight font-semibold text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow"
          >
            <Download className="size-3.5" /> {t('common.download')}
          </button>
        </div>
      </div>

      {/* Main Body: Embedded Cloud PDF or Interactive Notes Reader */}
      {viewMode === 'embed' && isRealPdf ? (
        <div className="h-[640px] w-full bg-midnight/90">
          <iframe
            src={`${l.file_url}#toolbar=1`}
            title={l.title}
            className="size-full border-0 bg-white"
          />
        </div>
      ) : (
        /* Reader Layout: Left mini rail + Center paper canvas */
        <div className="grid grid-cols-[130px_1fr] h-[640px] bg-midnight/80">
        {/* Page Thumbnail Rail */}
        <div
          ref={railRef}
          className="border-r border-lavender/10 p-2 overflow-y-auto space-y-2.5 bg-navy/40"
        >
          {pages.map((_, i) => {
            const pNum = i + 1
            const active = pNum === page
            return (
              <button
                key={pNum}
                data-page={pNum}
                onClick={() => go(pNum)}
                className={cx(
                  'w-full text-left rounded-xl p-2 transition-all cursor-pointer block',
                  active
                    ? 'ring-2 ring-amethyst bg-violet/20'
                    : 'hover:bg-lavender/5 opacity-70 hover:opacity-100',
                )}
              >
                <div className="aspect-[3/4] rounded-lg bg-paper/90 p-2 text-navy flex flex-col justify-between shadow">
                  <div className="space-y-1">
                    <div className="h-1 w-2/3 bg-navy/60 rounded-xs" />
                    <div className="h-0.5 w-full bg-navy/30 rounded-xs" />
                    <div className="h-0.5 w-4/5 bg-navy/30 rounded-xs" />
                  </div>
                  <div className="text-[9px] font-bold text-center tabular-nums text-navy/60">
                    {pNum}
                  </div>
                </div>
                <div className="text-[10.5px] font-bold text-center text-lavender/60 mt-1">
                  Page {pNum}
                </div>
              </button>
            )
          })}
        </div>

        {/* Center Paper View */}
        <div
          ref={scrollRef}
          className="overflow-auto p-8 grid place-items-center bg-midnight/60"
        >
          <div
            style={{ width: `${BASE_W * zoom}px` }}
            className="transition-all duration-200"
          >
            <div className="aspect-[1/1.414] rounded-xl bg-paper text-navy p-10 shadow-2xl flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-violet via-amethyst to-violet" />

              {/* Cover vs content page layout */}
              {currentPage?.cover ? (
                <div className="flex-1 flex flex-col justify-center text-center px-4">
                  <div className="text-xs uppercase tracking-[0.2em] font-bold text-violet mb-2">
                    {specialty} · {year}
                  </div>
                  <h1 className="font-serif text-3xl font-bold text-navy leading-tight mb-4">
                    {l.title}
                  </h1>
                  <div className="text-sm font-semibold text-navy/70 mb-8">
                    {l.instructor} · {faculty}
                  </div>
                  <div className="p-4 rounded-xl bg-navy/5 border border-navy/10 text-xs text-navy/70 text-left max-w-md mx-auto leading-relaxed">
                    Official course material deposited in Psylume University repository. For
                    individual study and academic revision purposes only.
                  </div>
                </div>
              ) : (
                <div className="flex-1 space-y-4 text-left">
                  <div className="flex items-center justify-between pb-3 border-b border-navy/10 text-[11px] font-semibold text-navy/50">
                    <span>{specialty} — {l.module}</span>
                    <span>{l.title}</span>
                  </div>

                  {currentPage?.blocks.map((b, idx) => {
                    if (b.type === 'h') {
                      return (
                        <h2
                          key={idx}
                          className="font-serif text-lg font-bold text-navy pt-2"
                        >
                          {b.text}
                        </h2>
                      )
                    }
                    if (b.type === 'p') {
                      return (
                        <p
                          key={idx}
                          className="text-[13px] leading-relaxed text-navy/80"
                        >
                          {b.text}
                        </p>
                      )
                    }
                    if (b.type === 'list') {
                      return (
                        <ul key={idx} className="space-y-1.5 pl-4 text-[12.5px] text-navy/80">
                          {b.items.map((it, i) => (
                            <li key={i} className="list-disc">
                              {it}
                            </li>
                          ))}
                        </ul>
                      )
                    }
                    if (b.type === 'q') {
                      return (
                        <div
                          key={idx}
                          className="p-3 rounded-lg bg-navy/5 border-l-4 border-violet text-[12.5px] text-navy/90 my-2"
                        >
                          <span className="font-bold">{b.label}: </span>
                          {b.text}
                          {b.points && (
                            <span className="text-violet font-semibold ml-1">
                              ({b.points} pts)
                            </span>
                          )}
                        </div>
                      )
                    }
                    if (b.type === 'note') {
                      return (
                        <div
                          key={idx}
                          className="p-2.5 rounded-lg bg-amethyst/10 text-[11.5px] italic text-navy/80"
                        >
                          {b.text}
                        </div>
                      )
                    }
                    return null
                  })}
                </div>
              )}

              {/* Page footer */}
              <div className="pt-4 border-t border-navy/10 flex items-center justify-between text-[10.5px] text-navy/50">
                <span>Psylume Lecture Hub · {year}</span>
                <span className="tabular-nums font-semibold">
                  Page {page} of {total}
                </span>
              </div>
            </div>
          </div>
        </div>
        </div>
      )}
    </div>
  )
}

function ToolBtn({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string
  onClick: () => void
  disabled?: boolean
  children: ReactNode
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className="size-8 grid place-items-center rounded-lg text-lavender/70 hover:text-lavender hover:bg-lavender/10 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
    >
      {children}
    </button>
  )
}
