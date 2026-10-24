'use client'

import {
  useEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type ReactNode,
} from 'react'
import Link from 'next/link'
import {
  AlertTriangle,
  BookOpen,
  Brain,
  ChartLine,
  Check,
  Cpu,
  Feather,
  FileText,
  Landmark,
  Play,
  Plus,
  Radio,
  Scale,
  Trash2,
  Upload,
  Users,
  Video,
  X,
} from 'lucide-react'
import { formatDuration, img, initials, timeAgo } from '@/lib/data'
import { type Format, type IconKey, type Lecture } from '@/types'
import { useLookup, useStore } from '@/context/store'
import { useLanguage } from '@/context/language'

export const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ')

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  type = 'button',
  ...p
}: BtnProps) {
  return (
    <button
      type={type}
      {...p}
      className={cx(
        'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 disabled:opacity-40 disabled:pointer-events-none cursor-pointer whitespace-nowrap',
        size === 'sm' && 'h-8 px-3 text-[13px]',
        size === 'md' && 'h-10 px-4 text-sm',
        size === 'lg' && 'h-12 px-6 text-[15px]',
        variant === 'primary' &&
          'bg-violet text-lavender shadow-[0_8px_24px_-10px_var(--color-violet)] hover:bg-amethyst hover:text-midnight',
        variant === 'secondary' && 'bg-lavender/10 text-lavender hover:bg-lavender/15',
        variant === 'outline' &&
          'border border-lavender/20 text-lavender hover:border-amethyst hover:text-amethyst',
        variant === 'ghost' && 'text-lavender/70 hover:text-amethyst hover:bg-lavender/5',
        variant === 'danger' && 'bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30',
        className,
      )}
    />
  )
}

/** Renders only for the Supervisor Instructor role. */
export function AddButton({
  label,
  onClick,
  size = 'md',
}: {
  label: string
  onClick: () => void
  size?: 'sm' | 'md'
}) {
  const { role } = useStore()
  if (role !== 'instructor') return null
  return (
    <Button onClick={onClick} size={size} className="animate-pop">
      <Plus className="size-4" strokeWidth={2.5} />
      {label}
    </Button>
  )
}

export function CategoryBadge({
  category,
  className,
}: {
  category: string
  className?: string
}) {
  const isCours = category.toLowerCase() === 'cours'
  const isTd = category.toLowerCase() === 'td'
  const isExam = category.toLowerCase() === 'exam'

  return (
    <span
      className={cx(
        'inline-flex items-center h-6 px-2.5 rounded-md text-[11px] font-bold tracking-wide',
        isCours && 'bg-violet text-lavender',
        isTd && 'bg-amethyst text-midnight',
        isExam && 'bg-lavender text-navy',
        !isCours && !isTd && !isExam && 'bg-midnight ring-1 ring-amethyst/50 text-amethyst',
        className,
      )}
    >
      {category}
    </span>
  )
}

export function FormatBadge({ format, className }: { format: Format; className?: string }) {
  const Icon = format === 'MP4' ? Video : FileText
  return (
    <span
      className={cx(
        'inline-flex items-center gap-1 h-6 px-2 rounded-md text-[10.5px] font-bold tracking-wider bg-midnight/80 text-lavender ring-1 ring-lavender/20 backdrop-blur',
        className,
      )}
    >
      <Icon className="size-3" />
      {format}
    </span>
  )
}

const ICONS: Record<IconKey, typeof Brain> = {
  brain: Brain,
  scale: Scale,
  radio: Radio,
  feather: Feather,
  users: Users,
  chart: ChartLine,
  landmark: Landmark,
  cpu: Cpu,
  book: BookOpen,
}
export const ICON_KEYS = Object.keys(ICONS) as IconKey[]

export function SpecialtyIcon({
  icon,
  iconUrl,
  className,
}: {
  icon: IconKey
  iconUrl?: string
  className?: string
}) {
  const [broken, setBroken] = useState(false)
  const Icon = ICONS[icon] ?? BookOpen
  if (iconUrl && !broken) {
    return (
      <img
        src={iconUrl}
        alt=""
        onError={() => setBroken(true)}
        className={cx('object-contain', className)}
      />
    )
  }
  return <Icon className={className} />
}

export function Avatar({
  name,
  size = 'md',
  className,
}: {
  name: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}) {
  return (
    <span
      className={cx(
        'inline-grid place-items-center rounded-full bg-gradient-to-br from-violet to-amethyst text-lavender font-bold shrink-0',
        size === 'sm' && 'size-6 text-[9.5px]',
        size === 'md' && 'size-9 text-xs',
        size === 'lg' && 'size-11 text-sm',
        className,
      )}
    >
      {initials(name)}
    </span>
  )
}

export function SectionHeader({
  eyebrow,
  title,
  action,
  description,
}: {
  eyebrow?: string
  title: string
  description?: string
  action?: ReactNode
}) {
  return (
    <div className="flex items-end justify-between gap-6 mb-5">
      <div>
        {eyebrow && (
          <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-amethyst mb-1.5">
            {eyebrow}
          </div>
        )}
        <h2 className="text-xl font-bold tracking-tight text-lavender">{title}</h2>
        {description && (
          <p className="text-sm text-lavender/55 mt-1 max-w-xl">{description}</p>
        )}
      </div>
      {action && <div className="flex items-center gap-2 shrink-0">{action}</div>}
    </div>
  )
}

export function Tabs<T extends string>({
  tabs,
  value,
  onChange,
  size = 'md',
}: {
  tabs: { value: T; label: ReactNode; count?: number }[]
  value: T
  onChange: (v: T) => void
  size?: 'sm' | 'md'
}) {
  return (
    <div
      role="tablist"
      className="inline-flex items-center gap-1 p-1 rounded-xl bg-midnight/60 ring-1 ring-lavender/10"
    >
      {tabs.map((t) => {
        const active = t.value === value
        return (
          <button
            key={t.value}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(t.value)}
            className={cx(
              'relative inline-flex items-center gap-2 rounded-lg font-semibold transition-colors cursor-pointer',
              size === 'md' ? 'h-9 px-4 text-sm' : 'h-8 px-3 text-[13px]',
              active ? 'bg-violet text-lavender shadow' : 'text-lavender/60 hover:text-amethyst',
            )}
          >
            {t.label}
            {t.count !== undefined && (
              <span
                className={cx(
                  'text-[11px] tabular-nums px-1.5 rounded-md',
                  active
                    ? 'bg-lavender/20 text-lavender'
                    : 'bg-lavender/5 text-lavender/50',
                )}
              >
                {t.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

export function EmptyState({
  icon,
  title,
  body,
  action,
}: {
  icon: ReactNode
  title: string
  body: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center text-center py-16 px-6 rounded-2xl border border-dashed border-lavender/15 bg-navy/30">
      <div className="size-12 rounded-2xl bg-violet/20 text-amethyst grid place-items-center mb-4">
        {icon}
      </div>
      <h3 className="font-bold text-lavender">{title}</h3>
      <p className="text-sm text-lavender/55 mt-1 max-w-sm">{body}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

export function LectureThumb({
  lecture: l,
  compact,
  className,
}: {
  lecture: Lecture
  compact?: boolean
  className?: string
}) {
  const { history } = useStore()
  const { t } = useLanguage()
  const progress = history.find((h) => h.lectureId === l.id)?.progress
  return (
    <div
      className={cx(
        'relative aspect-video rounded-xl overflow-hidden bg-midnight ring-1 ring-lavender/10',
        compact ? 'w-48' : 'w-full',
        className,
      )}
    >
      <img
        src={img(l.image, 600)}
        alt=""
        className="absolute inset-0 size-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-midnight/90 via-transparent to-transparent" />
      <span className="absolute top-2 left-2">
        <CategoryBadge category={l.category} />
      </span>
      <span className="absolute top-2 right-2">
        <FormatBadge format={l.format} />
      </span>
      <span className="absolute bottom-2 right-2 text-[11px] font-bold text-lavender bg-midnight/85 px-1.5 py-0.5 rounded backdrop-blur">
        {l.format === 'MP4' ? formatDuration(l.duration ?? 0) : `${l.pages} ${t('common.pages')}`}
      </span>
      {progress !== undefined && progress > 0 && (
        <div className="absolute bottom-0 inset-x-0 h-1 bg-lavender/20">
          <div
            className="h-full bg-amethyst"
            style={{ width: `${Math.min(100, Math.max(4, progress * 100))}%` }}
          />
        </div>
      )}
    </div>
  )
}

export function LectureCard({
  lecture,
  showContext = true,
}: {
  lecture: Lecture
  showContext?: boolean
}) {
  const { specialty, year } = useLookup()
  const s = specialty(lecture.specialtyId)
  const y = year(lecture.yearId)

  return (
    <Link
      href={`/lectures/${lecture.id}`}
      className="group text-start rounded-2xl p-2 -m-2 transition-colors hover:bg-lavender/[0.04] cursor-pointer min-w-0 block"
    >
      <LectureThumb lecture={lecture} />
      <div className="pt-3 px-1">
        {showContext && (
          <div className="text-[11px] font-semibold text-amethyst mb-1 truncate">
            {s?.name} · {y?.code} · {lecture.module}
          </div>
        )}
        <h3 className="font-semibold text-[14.5px] leading-snug text-lavender line-clamp-2 group-hover:text-amethyst transition-colors">
          {lecture.title}
        </h3>
        <div className="flex items-center gap-2 mt-2 text-[12.5px] text-lavender/55 min-w-0">
          <Avatar name={lecture.instructor} size="sm" />
          <span className="truncate">{lecture.instructor}</span>
          <span className="text-lavender/25">•</span>
          <span className="shrink-0">{timeAgo(lecture.createdAt)}</span>
        </div>
      </div>
    </Link>
  )
}

export function Modal({
  open,
  onClose,
  title,
  subtitle,
  icon,
  children,
  footer,
  width = 'max-w-lg',
}: {
  open: boolean
  onClose: () => void
  title: string
  subtitle?: string
  icon?: ReactNode
  children: ReactNode
  footer?: ReactNode
  width?: string
}) {
  const { dir, t } = useLanguage()

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      dir={dir}
      className="fixed inset-0 z-50 grid place-items-center p-6 animate-fade-in"
      role="dialog"
      aria-modal
      aria-label={title}
    >
      <div className="absolute inset-0 bg-midnight/80 backdrop-blur-sm" onClick={onClose} />
      <div
        className={cx(
          'relative w-full max-h-[90vh] flex flex-col rounded-3xl bg-navy ring-1 ring-lavender/15 shadow-[0_40px_120px_-20px_rgba(0,0,0,0.7)] animate-pop',
          width,
        )}
      >
        <div className="flex items-start gap-4 p-6 pb-5 border-b border-lavender/10">
          {icon && (
            <div className="size-11 rounded-2xl bg-violet grid place-items-center text-lavender shrink-0">
              {icon}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-lavender">{title}</h2>
            {subtitle && <p className="text-sm text-lavender/55 mt-0.5">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            aria-label={t('common.close')}
            className="size-9 grid place-items-center rounded-xl text-lavender/60 hover:bg-lavender/10 hover:text-lavender cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto">{children}</div>
        {footer && (
          <div className="flex justify-end gap-2 px-6 py-4 border-t border-lavender/10 bg-midnight/30 rounded-b-3xl">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel,
  loading = false,
}: {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmLabel?: string
  loading?: boolean
}) {
  const { t } = useLanguage()
  const resolvedConfirmLabel = confirmLabel || t('common.delete')

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      icon={<AlertTriangle className="size-5 text-amber-400" />}
      width="max-w-md"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            {t('common.cancel')}
          </Button>
          <Button variant="danger" onClick={onConfirm} disabled={loading}>
            {loading ? (
              <span className="size-4 rounded-full border-2 border-lavender/30 border-t-lavender animate-spin" />
            ) : (
              <Trash2 className="size-4" />
            )}
            {resolvedConfirmLabel}
          </Button>
        </>
      }
    >
      <p className="text-sm text-lavender/70 leading-relaxed">{message}</p>
    </Modal>
  )
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: ReactNode
}) {
  return (
    <div>
      <span className="flex items-baseline justify-between mb-1.5">
        <span className="text-[13px] font-semibold text-lavender">{label}</span>
        {hint && <span className="text-[11.5px] text-lavender/45">{hint}</span>}
      </span>
      {children}
    </div>
  )
}

export const inputCls =
  'w-full h-11 px-3.5 rounded-xl bg-midnight/70 ring-1 ring-lavender/15 text-sm text-lavender placeholder:text-lavender/35 outline-none focus:ring-2 focus:ring-amethyst transition-shadow'

export function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string; hint?: string; icon?: ReactNode }[]
  value: T
  onChange: (v: T) => void
}) {
  return (
    <div
      className="grid gap-2"
      style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
    >
      {options.map((o) => {
        const active = o.value === value
        return (
          <button
            type="button"
            key={o.value}
            onClick={() => onChange(o.value)}
            aria-pressed={active}
            className={cx(
              'relative text-left rounded-xl px-3 py-2.5 ring-1 transition-all cursor-pointer',
              active
                ? 'ring-2 ring-amethyst bg-violet/25'
                : 'ring-lavender/15 bg-midnight/50 hover:ring-amethyst/60',
            )}
          >
            <span className="flex items-center gap-2 text-sm font-bold text-lavender">
              {o.icon}
              {o.label}
            </span>
            {o.hint && (
              <span className="block text-[11px] text-lavender/50 mt-0.5 leading-tight pr-4">
                {o.hint}
              </span>
            )}
            {active && (
              <span className="absolute top-2 right-2 size-4 rounded-full bg-amethyst grid place-items-center">
                <Check className="size-2.5 text-midnight" strokeWidth={4} />
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

export function DropZone({
  accept,
  file,
  onFile,
  hint,
}: {
  accept?: string
  file: File | null
  onFile: (f: File | null) => void
  hint: string
}) {
  const [over, setOver] = useState(false)
  const ref = useRef<HTMLInputElement>(null)
  const { t, isRTL } = useLanguage()

  return (
    <div
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && ref.current?.click()}
      onDragOver={(e) => {
        e.preventDefault()
        setOver(true)
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault()
        setOver(false)
        const f = e.dataTransfer.files?.[0]
        if (f) onFile(f)
      }}
      onClick={() => ref.current?.click()}
      className={cx(
        'relative rounded-2xl border-2 border-dashed p-6 text-center cursor-pointer transition-all',
        over
          ? 'border-amethyst bg-amethyst/10 scale-[1.01]'
          : 'border-lavender/20 bg-midnight/40 hover:border-amethyst/60',
      )}
    >
      <input
        ref={ref}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          onFile(e.target.files?.[0] ?? null)
          e.target.value = ''
        }}
      />
      {file ? (
        <div className="flex items-center gap-3 text-start">
          <div className="size-11 rounded-xl bg-violet grid place-items-center shrink-0">
            <FileText className="size-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold truncate">{file.name}</div>
            <div className="text-xs text-lavender/50">
              {(file.size / 1024 / 1024).toFixed(2)} MB · {isRTL ? 'جاهز للرفع' : 'ready to upload'}
            </div>
            <div className="h-1 rounded-full bg-lavender/10 mt-2 overflow-hidden">
              <div className="h-full w-full bg-amethyst" />
            </div>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onFile(null)
            }}
            className="size-8 grid place-items-center rounded-lg hover:bg-lavender/10 cursor-pointer"
            aria-label="Remove file"
          >
            <X className="size-4" />
          </button>
        </div>
      ) : (
        <>
          <div className="size-12 mx-auto rounded-2xl bg-violet/25 text-amethyst grid place-items-center mb-3">
            <Upload className="size-5" />
          </div>
          <div className="text-sm font-semibold">
            {t('modals.dragAndDrop')}
          </div>
          <div className="text-xs text-lavender/45 mt-1">{hint}</div>
        </>
      )}
    </div>
  )
}
