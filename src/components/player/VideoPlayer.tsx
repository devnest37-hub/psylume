'use client'

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import {
  Captions,
  Check,
  Maximize,
  Minimize,
  Pause,
  Play,
  RotateCcw,
  Settings,
  SkipForward,
  Volume2,
  VolumeX,
} from 'lucide-react'
import { Button, cx } from '@/components/ui'
import { BrandMark } from '@/components/shell/Sidebar'
import { formatDuration, img } from '@/lib/data'
import { CAPTIONS, type Chapter } from '@/lib/content'
import { type Lecture } from '@/types'
import { useLanguage } from '@/context/language'

export interface Playback {
  playing: boolean
  setPlaying: (p: boolean) => void
  time: number
  seek: (t: number) => void
  duration: number
  setDuration?: (d: number) => void
  speed: number
  setSpeed: (s: number) => void
  ended: boolean
}

export function usePlayback(
  duration: number,
  initialTime = 0,
  isExternal = false,
): Playback {
  const [playing, setPlaying] = useState(false)
  const [time, setTime] = useState(initialTime)
  const [dur, setDur] = useState(duration)
  const [speed, setSpeed] = useState(1)
  const last = useRef(performance.now())

  useEffect(() => {
    if (duration > 0) setDur(duration)
  }, [duration])

  useEffect(() => {
    if (!playing || isExternal) return
    last.current = performance.now()
    const t = setInterval(() => {
      const now = performance.now()
      const dt = ((now - last.current) / 1000) * speed
      last.current = now
      setTime((prev) => {
        const next = prev + dt
        if (next >= dur) {
          setPlaying(false)
          return dur
        }
        return next
      })
    }, 100)
    return () => clearInterval(t)
  }, [playing, speed, dur, isExternal])

  const seek = useCallback(
    (t: number) => {
      setTime(Math.max(0, Math.min(dur || 1, t)))
    },
    [dur],
  )

  return {
    playing,
    setPlaying,
    time,
    seek,
    duration: dur,
    setDuration: setDur,
    speed,
    setSpeed,
    ended: time >= (dur || 1) && dur > 0,
  }
}

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2]

export function VideoPlayer({
  lecture: l,
  chapters,
  pb,
  next,
  autoplay,
  onNext,
  specialtyCode,
}: {
  lecture: Lecture
  chapters: Chapter[]
  pb: Playback
  next?: Lecture
  autoplay: boolean
  onNext: () => void
  specialtyCode: string
}) {
  const { t, isRTL } = useLanguage()
  const ref = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const isRealVideo = Boolean(
    l.file_url && (
      l.file_url.includes('lecture-videos') ||
      l.file_url.endsWith('.mp4') ||
      l.file_url.endsWith('.webm') ||
      l.file_url.endsWith('.mov') ||
      l.file_url.includes('.mp4?') ||
      l.file_url.includes('.webm?') ||
      (l.format === 'MP4' && (l.file_url.startsWith('http') || l.file_url.startsWith('blob:')))
    ),
  )

  const [volume, setVolume] = useState(0.8)
  const [muted, setMuted] = useState(false)
  const [cc, setCc] = useState(true)
  const [menu, setMenu] = useState(false)
  const [quality, setQuality] = useState('1080p')
  const [fs, setFs] = useState(false)
  const [active, setActive] = useState(true)
  const [flash, setFlash] = useState<string | null>(null)
  const [countdown, setCountdown] = useState<number | null>(null)
  const idle = useRef<number>(0)

  const chapterIdx = chapters.reduce((acc, c, i) => (pb.time >= c.at ? i : acc), 0)
  const chapter = chapters[chapterIdx] || {
    title: l.title,
    bullets: ['Introduction & Overview', 'Theoretical Framework', 'Case Study'],
  }

  const handleSeek = useCallback(
    (t: number) => {
      pb.seek(t)
      if (isRealVideo && videoRef.current) {
        videoRef.current.currentTime = t
      }
    },
    [pb, isRealVideo],
  )

  const toggle = useCallback(() => {
    if (isRealVideo && videoRef.current) {
      if (videoRef.current.paused || videoRef.current.ended) {
        if (pb.ended) {
          videoRef.current.currentTime = 0
          pb.seek(0)
        }
        videoRef.current.play().catch(() => {})
        pb.setPlaying(true)
        setFlash('play')
      } else {
        videoRef.current.pause()
        pb.setPlaying(false)
        setFlash('pause')
      }
      setTimeout(() => setFlash(null), 500)
      return
    }

    if (pb.ended) {
      pb.seek(0)
      pb.setPlaying(true)
      return
    }
    pb.setPlaying(!pb.playing)
    setFlash(pb.playing ? 'pause' : 'play')
    setTimeout(() => setFlash(null), 500)
  }, [pb, isRealVideo])

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = muted ? 0 : volume
      videoRef.current.muted = muted
    }
  }, [volume, muted])

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = pb.speed
    }
  }, [pb.speed])

  const toggleFs = () => {
    if (document.fullscreenElement) document.exitFullscreen()
    else ref.current?.requestFullscreen?.().catch(() => {})
  }

  useEffect(() => {
    const onFs = () => setFs(Boolean(document.fullscreenElement))
    document.addEventListener('fullscreenchange', onFs)
    return () => document.removeEventListener('fullscreenchange', onFs)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(tag)) return
      if (e.key === ' ' || e.key === 'k') {
        e.preventDefault()
        toggle()
      } else if (e.key === 'ArrowRight' || e.key === 'l') handleSeek(pb.time + (e.key === 'l' ? 10 : 5))
      else if (e.key === 'ArrowLeft' || e.key === 'j') handleSeek(pb.time - (e.key === 'j' ? 10 : 5))
      else if (e.key === 'm') setMuted((m) => !m)
      else if (e.key === 'c') setCc((c) => !c)
      else if (e.key === 'f') toggleFs()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [toggle, pb, handleSeek])

  // Up-next countdown when the lecture ends
  useEffect(() => {
    if (!pb.ended || !autoplay || !next) {
      setCountdown(null)
      return
    }
    setCountdown(5)
    const t = setInterval(() => setCountdown((c) => (c === null ? null : c - 1)), 1000)
    return () => clearInterval(t)
  }, [pb.ended, autoplay, next])

  useEffect(() => {
    if (countdown === 0) onNext()
  }, [countdown, onNext])

  const poke = () => {
    setActive(true)
    window.clearTimeout(idle.current)
    idle.current = window.setTimeout(() => setActive(false), 2600)
  }
  const showControls = active || !pb.playing || menu

  return (
    <div
      ref={ref}
      onMouseMove={poke}
      onMouseLeave={() => setActive(false)}
      className={cx(
        'group/player relative aspect-video w-full overflow-hidden bg-midnight ring-1 ring-lavender/10 select-none @container',
        fs
          ? 'rounded-none'
          : 'rounded-2xl shadow-[0_30px_80px_-30px_rgba(98,71,170,0.55)]',
        !showControls && 'cursor-none',
      )}
    >
      {/* Real Video Stream OR Simulated lecture capture */}
      {isRealVideo ? (
        <div
          className="absolute inset-0 bg-midnight flex items-center justify-center cursor-pointer"
          onClick={toggle}
        >
          <video
            ref={videoRef}
            src={l.file_url}
            playsInline
            preload="metadata"
            className="size-full object-contain"
            onPlay={() => pb.setPlaying(true)}
            onPause={() => pb.setPlaying(false)}
            onTimeUpdate={(e) => {
              pb.seek(e.currentTarget.currentTime)
            }}
            onLoadedMetadata={(e) => {
              const v = e.currentTarget
              if (v.duration && isFinite(v.duration)) {
                pb.setDuration?.(Math.round(v.duration))
              }
              if (pb.time > 0 && Math.abs(v.currentTime - pb.time) > 1) {
                v.currentTime = pb.time
              }
            }}
            onEnded={() => {
              pb.setPlaying(false)
              pb.seek(videoRef.current?.duration || pb.duration)
            }}
          />
        </div>
      ) : (
        <div className="absolute inset-0 grid grid-cols-[1.45fr_1fr]" onClick={toggle}>
          <div className="relative bg-navy bg-grid p-[4.5cqw] flex flex-col overflow-hidden">
            <div className="absolute -left-[10cqw] -bottom-[14cqw] size-[40cqw] rounded-full bg-violet/30 blur-[6cqw]" />
            <div className="relative flex items-center justify-between text-[1.25cqw] font-bold text-lavender/50 uppercase tracking-[0.18em]">
              <span>
                {l.module} · {l.category}
              </span>
              <span className="tabular-nums">
                Part {String(chapterIdx + 1).padStart(2, '0')} /{' '}
                {String(chapters.length || 1).padStart(2, '0')}
              </span>
            </div>
            <div key={chapterIdx} className="relative my-auto animate-fade-up">
              <div className="text-[1.4cqw] font-bold text-amethyst uppercase tracking-[0.2em]">
                {specialtyCode} lecture
              </div>
              <h2 className="mt-[1cqw] font-serif text-[3.6cqw] leading-[1.08] font-semibold text-lavender">
                {chapter.title}
              </h2>
              <ul className="mt-[2.2cqw] space-y-[1cqw]">
                {chapter.bullets.map((b, i) => (
                  <li
                    key={b}
                    className="flex items-center gap-[1cqw] text-[1.6cqw] text-lavender/80 animate-fade-up"
                    style={{ animationDelay: `${150 + i * 120}ms` }}
                  >
                    <span className="size-[0.7cqw] rounded-full bg-amethyst shrink-0" /> {b}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative flex items-center gap-[0.8cqw] text-[1.1cqw] text-lavender/45 font-semibold">
              <BrandMark className="size-[2.2cqw]" /> Psylume University · Lecture capture
            </div>
          </div>
          <div className="relative overflow-hidden">
            <img
              src={img(l.image, 900)}
              alt=""
              className={cx(
                'absolute inset-0 size-full object-cover transition-transform duration-[20s] ease-linear',
                pb.playing && 'scale-110',
              )}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-navy via-transparent to-transparent" />
            <div className="absolute inset-0 bg-violet/10 mix-blend-overlay" />
            <span className="absolute top-[2cqw] right-[2cqw] inline-flex items-center gap-[0.6cqw] h-[2.6cqw] px-[1cqw] rounded-[0.6cqw] bg-midnight/75 text-[1.1cqw] font-bold text-lavender">
              <span
                className={cx('size-[0.7cqw] rounded-full bg-amethyst', pb.playing && 'animate-pulse')}
              />{' '}
              Amphitheatre B
            </span>
            <span className="absolute bottom-[2cqw] right-[2cqw] h-[2.8cqw] px-[1.2cqw] rounded-[0.6cqw] bg-midnight/75 text-[1.2cqw] font-semibold text-lavender inline-flex items-center">
              {l.instructor}
            </span>
          </div>
        </div>
      )}

      {/* Centre play/pause states */}
      {!pb.playing && !pb.ended && (
        <button
          onClick={toggle}
          aria-label="Play"
          className="absolute inset-0 m-auto size-20 rounded-full bg-violet/95 grid place-items-center shadow-2xl ring-8 ring-lavender/10 hover:bg-amethyst hover:scale-105 transition-all cursor-pointer"
        >
          <Play className="size-8 fill-lavender text-lavender ml-1" />
        </button>
      )}

      {flash && (
        <span className="pointer-events-none absolute inset-0 m-auto size-16 rounded-full bg-midnight/60 grid place-items-center animate-pop">
          {flash === 'play' ? (
            <Play className="size-6 fill-lavender text-lavender ml-1" />
          ) : (
            <Pause className="size-6 fill-lavender text-lavender" />
          )}
        </span>
      )}

      {pb.ended && (
        <div className="absolute inset-0 bg-midnight/85 backdrop-blur-sm grid place-items-center animate-fade-in">
          <div className="text-center">
            {next && autoplay && countdown !== null ? (
              <>
                <div className="text-xs font-bold uppercase tracking-[0.18em] text-amethyst">
                  {t('player.upNextIn')} {countdown}s
                </div>
                <div className="mt-2 text-lg font-bold text-lavender max-w-md">
                  {next.title}
                </div>
                <div className="mt-5 flex justify-center gap-2">
                  <Button onClick={onNext}>
                    <SkipForward className="size-4" /> {t('player.playNow')}
                  </Button>
                  <Button variant="secondary" onClick={() => setCountdown(null)}>
                    {t('common.cancel')}
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="text-lg font-bold text-lavender">{t('player.lectureComplete')}</div>
                <div className="text-sm text-lavender/55 mt-1">
                  {t('player.progressSaved')}
                </div>
                <div className="mt-5 flex justify-center gap-2">
                  <Button variant="secondary" onClick={toggle}>
                    <RotateCcw className="size-4" /> {t('player.replay')}
                  </Button>
                  {next && (
                    <Button onClick={onNext}>
                      <SkipForward className="size-4" /> {t('player.nextItem')}
                    </Button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Captions */}
      {cc && pb.playing && (
        <div
          className={cx(
            'pointer-events-none absolute inset-x-0 flex justify-center transition-all',
            showControls ? 'bottom-24' : 'bottom-8',
          )}
        >
          <span className="max-w-[70%] text-center px-3 py-1.5 rounded-lg bg-midnight/85 text-[15px] font-medium text-lavender">
            {CAPTIONS[Math.floor(pb.time / 6) % CAPTIONS.length]}
          </span>
        </div>
      )}

      {/* Bottom Controls Bar */}
      <div
        className={cx(
          'absolute inset-x-0 bottom-0 pt-10 pb-3 px-4 bg-gradient-to-t from-midnight/95 via-midnight/60 to-transparent transition-opacity duration-200',
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none',
        )}
      >
        <Timeline pb={pb} chapters={chapters} onSeek={handleSeek} />

        <div className="mt-3 flex items-center justify-between text-lavender">
          <div className="flex items-center gap-3">
            <CtrlBtn label={pb.playing ? t('player.pause') : t('player.play')} onClick={toggle}>
              {pb.playing ? <Pause className="size-5 fill-current" /> : <Play className="size-5 fill-current ml-0.5" />}
            </CtrlBtn>
            {next && (
              <CtrlBtn label={t('player.nextLecture')} onClick={onNext}>
                <SkipForward className="size-4" />
              </CtrlBtn>
            )}
            <div className="hidden sm:flex items-center gap-2 group/vol">
              <CtrlBtn
                label={muted ? t('player.unmute') : t('player.mute')}
                onClick={() => setMuted((m) => !m)}
              >
                {muted || volume === 0 ? <VolumeX className="size-5" /> : <Volume2 className="size-5" />}
              </CtrlBtn>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={muted ? 0 : volume}
                onChange={(e) => {
                  setVolume(Number(e.target.value))
                  setMuted(false)
                }}
                aria-label="Volume"
                className="w-16 h-1 rounded-full cursor-pointer opacity-80 hover:opacity-100"
              />
            </div>
            <div className="text-xs font-semibold tabular-nums text-lavender/70 ml-1">
              <span>{formatDuration(pb.time)}</span>
              <span className="text-lavender/30 mx-1">/</span>
              <span>{formatDuration(pb.duration)}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 relative">
            <CtrlBtn
              label={t('player.captions')}
              onClick={() => setCc((c) => !c)}
              active={cc}
            >
              <Captions className="size-5" />
            </CtrlBtn>

            <div className="relative">
              <CtrlBtn
                label={t('player.settings')}
                onClick={() => setMenu((m) => !m)}
                active={menu}
              >
                <Settings className="size-5" />
              </CtrlBtn>

              {menu && (
                <div className="absolute right-0 bottom-12 w-56 rounded-2xl bg-navy ring-1 ring-lavender/15 shadow-2xl p-2 text-xs font-semibold animate-pop z-50">
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-lavender/40">
                    {t('player.speed')}
                  </div>
                  <div className="grid grid-cols-4 gap-1 p-1">
                    {SPEEDS.map((s) => (
                      <button
                        key={s}
                        onClick={() => {
                          pb.setSpeed(s)
                          setMenu(false)
                        }}
                        className={cx(
                          'h-7 rounded-lg text-center transition-colors cursor-pointer',
                          pb.speed === s
                            ? 'bg-violet text-lavender'
                            : 'hover:bg-lavender/10 text-lavender/70',
                        )}
                      >
                        {s}×
                      </button>
                    ))}
                  </div>
                  <div className="mt-2 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-lavender/40 border-t border-lavender/10">
                    {t('player.quality')}
                  </div>
                  {['1080p', '720p', '480p'].map((q) => (
                    <button
                      key={q}
                      onClick={() => {
                        setQuality(q)
                        setMenu(false)
                      }}
                      className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg hover:bg-lavender/10 cursor-pointer text-start"
                    >
                      <span className={cx(quality === q ? 'text-amethyst' : 'text-lavender/70')}>
                        {q}
                      </span>
                      {quality === q && <Check className="size-3.5 text-amethyst" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <CtrlBtn label={fs ? t('player.exitFullscreen') : t('player.fullscreen')} onClick={toggleFs}>
              {fs ? <Minimize className="size-5" /> : <Maximize className="size-5" />}
            </CtrlBtn>
          </div>
        </div>
      </div>
    </div>
  )
}

function CtrlBtn({
  label,
  onClick,
  children,
  active,
}: {
  label: string
  onClick: () => void
  children: ReactNode
  active?: boolean
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cx(
        'size-9 grid place-items-center rounded-xl transition-all cursor-pointer',
        active
          ? 'bg-violet text-lavender shadow'
          : 'text-lavender/70 hover:text-lavender hover:bg-lavender/10',
      )}
    >
      {children}
    </button>
  )
}

function Timeline({
  pb,
  chapters,
  onSeek,
}: {
  pb: Playback
  chapters: Chapter[]
  onSeek?: (t: number) => void
}) {
  const [hoverTime, setHoverTime] = useState<number | null>(null)
  const [hoverX, setHoverX] = useState(0)
  const barRef = useRef<HTMLDivElement>(null)

  const onMove = (e: React.MouseEvent) => {
    if (!barRef.current || !pb.duration) return
    const rect = barRef.current.getBoundingClientRect()
    const p = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    setHoverTime(p * pb.duration)
    setHoverX(e.clientX - rect.left)
  }

  const onClick = (e: React.MouseEvent) => {
    if (!barRef.current || !pb.duration) return
    const rect = barRef.current.getBoundingClientRect()
    const p = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    const t = p * pb.duration
    if (onSeek) onSeek(t)
    else pb.seek(t)
  }

  const pct = pb.duration ? (pb.time / pb.duration) * 100 : 0
  const hoverChapter =
    hoverTime !== null
      ? chapters.reduce((acc, c) => (hoverTime >= c.at ? c : acc), chapters[0])
      : null

  return (
    <div
      ref={barRef}
      onMouseMove={onMove}
      onMouseLeave={() => setHoverTime(null)}
      onClick={onClick}
      className="group/timeline relative h-6 flex items-center cursor-pointer"
    >
      <div className="relative w-full h-1 group-hover/timeline:h-2 rounded-full bg-lavender/20 transition-all overflow-hidden">
        <div className="h-full bg-amethyst" style={{ width: `${pct}%` }} />
        {chapters.map(
          (c) =>
            c.at > 0 && (
              <span
                key={c.at}
                className="absolute top-0 bottom-0 w-0.5 bg-midnight"
                style={{ left: `${(c.at / (pb.duration || 1)) * 100}%` }}
              />
            ),
        )}
      </div>

      <span
        className="absolute top-1/2 -translate-y-1/2 -ml-2 size-4 rounded-full bg-lavender ring-4 ring-amethyst/50 scale-0 group-hover/timeline:scale-100 transition-transform pointer-events-none"
        style={{ left: `${pct}%` }}
      />

      {hoverTime !== null && (
        <div
          className="pointer-events-none absolute bottom-8 -translate-x-1/2 flex flex-col items-center animate-fade-in"
          style={{ left: `${hoverX}px` }}
        >
          <div className="px-2.5 py-1 rounded-lg bg-navy ring-1 ring-lavender/15 text-[11px] font-semibold text-lavender shadow-xl whitespace-nowrap">
            <span className="tabular-nums text-amethyst">{formatDuration(hoverTime)}</span>
            {hoverChapter && <span className="ml-1.5 text-lavender/70">· {hoverChapter.title}</span>}
          </div>
          <span className="size-1.5 bg-navy rotate-45 -mt-0.5" />
        </div>
      )}
    </div>
  )
}
