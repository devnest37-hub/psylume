'use client'

import { useState, type FormEvent } from 'react'
import {
  ChevronDown,
  CircleCheck,
  Clock,
  FileWarning,
  HelpCircle,
  KeyRound,
  LifeBuoy,
  Mail,
  MonitorPlay,
  Send,
  Upload,
  Wifi,
} from 'lucide-react'
import { useStore } from '@/context/store'
import { useLanguage } from '@/context/language'
import { Button, DropZone, Field, cx, inputCls } from '@/components/ui'
import { timeAgo } from '@/lib/data'
import { type IssueType, type SupportTicket } from '@/types'

const ISSUE_TYPES_CONFIG: { value: IssueType; icon: any }[] = [
  { value: 'video', icon: MonitorPlay },
  { value: 'document', icon: FileWarning },
  { value: 'account', icon: KeyRound },
  { value: 'upload', icon: Upload },
  { value: 'network', icon: Wifi },
  { value: 'other', icon: HelpCircle },
]

const FAQ = [
  {
    q: 'A lecture video keeps buffering or stays on a black screen.',
    a: 'Open the player settings (gear icon) and lower the quality to 720p or 480p. If the issue persists, clear your browser cache, disable any VPN, and try Chrome, Firefox or Edge in their latest versions. Campus Wi-Fi “eduroam” is the most reliable on-site network.',
  },
  {
    q: 'The PDF previewer shows a blank page or the wrong zoom.',
    a: 'Use the “Fit to width” button in the document toolbar, or reset the zoom by clicking the percentage. You can always use “Download File” to open the document in your own reader.',
  },
  {
    q: 'I cannot find the TD or exam papers for my specialty.',
    a: 'Go to Home → select your Academic Year → choose your Specialty, then switch between the Cours, TD, Exam, and custom lab tabs. If a document is still missing, your instructor may not have published it yet.',
  },
  {
    q: 'Where are my bookmarks and watch history stored?',
    a: 'They are saved to your local session and synchronized with your university Supabase account across devices. Visit the Saved page to manage saved videos, documents and your watch history.',
  },
  {
    q: 'How do I download a lecture for offline revision?',
    a: 'Documents (PDF and DOCX) can be downloaded directly from the reader. For video lectures, use “Notes (PDF)” below the player to get the accompanying lecture notes; videos themselves stream directly from Supabase Storage.',
  },
  {
    q: 'I am an instructor and my upload failed.',
    a: 'Uploads are limited to 2 GB for MP4 and 100 MB for PDF/DOCX. Make sure you are signed in as a Supervisor Instructor and that the file is not open in another program.',
  },
  {
    q: 'I forgot my password or my account is locked.',
    a: 'Use the university single sign-on reset page with your student number. After five failed attempts accounts are locked for 15 minutes — if it is still locked afterwards, submit an “Account & login” ticket.',
  },
]

const STATUS = [
  { name: 'Video streaming', ok: true },
  { name: 'Document reader', ok: true },
  { name: 'Instructor uploads', ok: true },
  { name: 'Single sign-on', ok: true },
]

export default function SupportPage() {
  const { role, user, tickets, addTicket } = useStore()
  const { isRTL, t } = useLanguage()
  const [type, setType] = useState<IssueType>('video')
  const [subject, setSubject] = useState('')
  const [desc, setDesc] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [errors, setErrors] = useState<{ subject?: string; desc?: string }>({})
  const [submitted, setSubmitted] = useState<SupportTicket | null>(null)
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  const displayName = user?.full_name || (role === 'instructor' ? t('nav.instructor') : t('nav.student'))
  const displayDetail = user?.email || user?.faculty || ''

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const errs: typeof errors = {}
    if (subject.trim().length < 4)
      errs.subject = 'Please add a short subject (at least 4 characters).'
    if (desc.trim().length < 20)
      errs.desc = 'Describe the issue in a bit more detail (at least 20 characters).'
    setErrors(errs)
    if (Object.keys(errs).length) return

    const tick = addTicket({
      subject: subject.trim(),
      type,
      description: desc.trim(),
      attachment_url: file ? file.name : undefined,
    })

    setSubmitted(tick)
    setSubject('')
    setDesc('')
    setFile(null)
  }

  return (
    <div className="space-y-10 animate-fade-up">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-navy ring-1 ring-lavender/10 p-5 sm:p-8">
        <div className="absolute right-6 -bottom-10 size-60 rounded-full bg-violet/30 blur-[90px]" />
        <div className="relative flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 h-7 px-2.5 rounded-lg bg-violet text-xs font-bold text-lavender">
              <LifeBuoy className="size-3.5" /> {t('support.title')}
            </div>
            <h1 className="mt-3 text-[24px] sm:text-[28px] md:text-[32px] font-extrabold tracking-[-0.03em] text-lavender">
              {t('support.title')}
            </h1>
            <p className="text-xs sm:text-sm text-lavender/60 max-w-xl mt-1 leading-relaxed">
              {t('support.subtitle')}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 p-2 rounded-2xl bg-midnight/60 ring-1 ring-lavender/10">
            {STATUS.map((s) => (
              <div
                key={s.name}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-midnight/40 text-xs font-semibold text-lavender"
              >
                <span className="size-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <span>{s.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] gap-6 items-start">
        {/* Issue Ticket Submission Form */}
        <div className="rounded-3xl bg-navy ring-1 ring-lavender/10 p-5 sm:p-7">
          {submitted ? (
            <div className="text-center py-10 animate-pop">
              <div className="size-16 mx-auto rounded-2xl bg-violet grid place-items-center text-lavender">
                <CircleCheck className="size-8" />
              </div>
              <h2 className="mt-5 text-xl font-bold text-lavender">
                Ticket submitted successfully
              </h2>
              <p className="text-sm text-lavender/60 mt-1">
                Reference{' '}
                <span className="font-bold text-amethyst">{submitted.ticket_code}</span> ·
                our support team will follow up via your university email.
              </p>
              <div className="mt-6 inline-flex flex-col items-start text-left rounded-2xl bg-midnight/50 ring-1 ring-lavender/10 p-4 text-sm max-w-sm">
                <span className="text-xs text-lavender/45">Subject</span>
                <span className="font-semibold text-lavender">{submitted.subject}</span>
              </div>
              <div className="mt-6">
                <Button variant="secondary" onClick={() => setSubmitted(null)}>
                  Submit another issue
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="space-y-5">
              <div>
                <h2 className="text-lg font-bold text-lavender">{t('support.submitTicket')}</h2>
                <p className="text-sm text-lavender/55">
                  Signed in as {displayName} {displayDetail ? `· ${displayDetail}` : ''}
                </p>
              </div>

              <Field label={t('support.issueType')}>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {ISSUE_TYPES_CONFIG.map((it) => (
                    <button
                      type="button"
                      key={it.value}
                      onClick={() => setType(it.value)}
                      aria-pressed={type === it.value}
                      className={cx(
                        'flex items-center gap-2 h-11 px-3 rounded-xl ring-1 text-[13px] font-semibold transition-all cursor-pointer',
                        type === it.value
                          ? 'ring-2 ring-amethyst bg-violet/25 text-lavender'
                          : 'ring-lavender/15 bg-midnight/50 text-lavender/70 hover:ring-amethyst/60',
                      )}
                    >
                      <it.icon
                        className={cx('size-4', type === it.value && 'text-amethyst')}
                      />
                      <span>{t(`support.issueTypes.${it.value}` as any)}</span>
                    </button>
                  ))}
                </div>
              </Field>

              <Field label={t('support.subject')}>
                <input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder={t('support.subjectPlaceholder')}
                  className={cx(
                    inputCls,
                    errors.subject && 'ring-2 ring-amethyst',
                  )}
                  aria-invalid={Boolean(errors.subject)}
                />
                {errors.subject && (
                  <p className="text-xs text-amethyst mt-1.5">{errors.subject}</p>
                )}
              </Field>

              <Field label={t('support.description')} hint={`${desc.length} / 1000`}>
                <textarea
                  value={desc}
                  onChange={(e) => setDesc(e.target.value.slice(0, 1000))}
                  rows={5}
                  placeholder={t('support.descriptionPlaceholder')}
                  className={cx(
                    inputCls,
                    'h-auto py-3 resize-none leading-relaxed',
                    errors.desc && 'ring-2 ring-amethyst',
                  )}
                  aria-invalid={Boolean(errors.desc)}
                />
                {errors.desc && (
                  <p className="text-xs text-amethyst mt-1.5">{errors.desc}</p>
                )}
              </Field>

              <Field
                label={t('support.attachment')}
                hint="Optional · max 10 MB"
              >
                <DropZone
                  file={file}
                  onFile={setFile}
                  accept="image/*,.pdf,.txt,.log"
                  hint="PNG, JPG, PDF or TXT"
                />
              </Field>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-lavender/45">
                  Campus IT Desk · 24/7 Support
                </span>
                <Button type="submit" size="lg">
                  <Send className={cx('size-4', isRTL && 'rotate-180')} /> {t('support.sendTicket')}
                </Button>
              </div>
            </form>
          )}
        </div>

        {/* FAQ & Tickets List */}
        <div className="space-y-6">
          <div className="rounded-3xl bg-navy ring-1 ring-lavender/10 p-3">
            <div className="px-4 pt-3 pb-2">
              <h2 className="text-lg font-bold text-lavender">
                Frequently asked questions
              </h2>
              <p className="text-sm text-lavender/55">
                Quick fixes for the most common technical issues.
              </p>
            </div>
            <div className="mt-1">
              {FAQ.map((f, i) => {
                const isOpen = openFaq === i
                return (
                  <div
                    key={i}
                    className={cx(
                      'rounded-2xl transition-colors',
                      isOpen && 'bg-midnight/50',
                    )}
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      className="w-full flex items-center gap-3 text-left px-4 py-3.5 cursor-pointer group"
                    >
                      <span
                        className={cx(
                          'text-sm font-semibold flex-1',
                          isOpen
                            ? 'text-lavender'
                            : 'text-lavender/80 group-hover:text-amethyst',
                        )}
                      >
                        {f.q}
                      </span>
                      <ChevronDown
                        className={cx(
                          'size-4 shrink-0 text-lavender/50 transition-transform duration-300',
                          isOpen && 'rotate-180 text-amethyst',
                        )}
                      />
                    </button>
                    <div
                      className={cx(
                        'grid transition-all duration-300',
                        isOpen
                          ? 'grid-rows-[1fr] opacity-100'
                          : 'grid-rows-[0fr] opacity-0',
                      )}
                    >
                      <div className="overflow-hidden">
                        <p className="px-4 pb-4 text-sm text-lavender/60 leading-relaxed">
                          {f.a}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Persistent Tickets List */}
          <div className="rounded-3xl bg-navy ring-1 ring-lavender/10 p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-lavender">{t('support.recentTickets')}</h2>
              <span className="text-xs text-lavender/45">{tickets.length}</span>
            </div>
            <div className="space-y-2">
              {tickets.map((tk) => {
                const typeLabel = t(`support.issueTypes.${tk.type}` as any)
                const statusLabel =
                  tk.status === 'open'
                    ? t('support.statusOpen')
                    : tk.status === 'in_progress'
                      ? t('support.statusInProgress')
                      : t('support.statusResolved')

                return (
                  <div
                    key={tk.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-midnight/50"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="text-[13px] font-semibold truncate text-lavender">
                        {tk.subject}
                      </div>
                      <div className="text-[11px] text-lavender/45 mt-0.5">
                        {tk.ticket_code} · {typeLabel} · {timeAgo(tk.at)}
                      </div>
                    </div>
                    <span
                      className={cx(
                        'h-6 px-2 rounded-md text-[11px] font-bold inline-flex items-center shrink-0',
                        tk.status === 'open' && 'bg-violet text-lavender',
                        tk.status === 'in_progress' && 'bg-amethyst text-midnight',
                        tk.status === 'resolved' && 'bg-lavender/10 text-lavender/70',
                      )}
                    >
                      {statusLabel}
                    </span>
                  </div>
                )
              })}
            </div>
            <div className="mt-4 pt-4 border-t border-lavender/10 flex items-center gap-3 text-sm">
              <Mail className="size-4 text-amethyst" />
              <span className="text-lavender/60">
                Prefer email?{' '}
                <span className="font-semibold text-lavender">
                  it-support@psylume.edu
                </span>{' '}
                · Mon–Fri, 8:00–18:00
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
