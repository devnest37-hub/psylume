'use client'

import { useState, type FormEvent } from 'react'
import {
  X,
  Mail,
  Lock,
  User,
  Building,
  Loader2,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
} from 'lucide-react'
import { useStore } from '@/context/store'
import { useLanguage } from '@/context/language'
import { cx } from '@/components/ui'

interface AuthModalProps {
  initialTab?: 'signin' | 'signup'
  onClose: () => void
}

export function AuthModal({ initialTab = 'signin', onClose }: AuthModalProps) {
  const { signIn, signUp } = useStore()
  const { isRTL, t } = useLanguage()
  const [tab, setTab] = useState<'signin' | 'signup'>(initialTab)

  // Form states
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [fullName, setFullName] = useState('')
  const [faculty, setFaculty] = useState('')

  // UI status
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (tab === 'signin') {
        if (!email.trim() || !password) {
          setError('Please provide both email and password.')
          setLoading(false)
          return
        }
        const res = await signIn(email.trim(), password)
        if (res.error) {
          setError(res.error)
        } else {
          onClose()
        }
      } else {
        if (!fullName.trim()) {
          setError('Please enter your full name.')
          setLoading(false)
          return
        }
        if (!email.trim()) {
          setError('Please enter a valid email address.')
          setLoading(false)
          return
        }
        if (password.length < 6) {
          setError('Password must be at least 6 characters long.')
          setLoading(false)
          return
        }

        const res = await signUp({
          email: email.trim(),
          password,
          full_name: fullName.trim(),
          role: 'student',
          faculty: faculty.trim() || 'General Studies',
        })
        if (res.error) {
          setError(res.error)
        } else {
          onClose()
        }
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md overflow-hidden rounded-2xl bg-gradient-to-b from-[#102b3f] to-[#062726] border border-white/15 shadow-2xl shadow-black/80 animate-pop text-white"
      >
        {/* Top Header Background Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-48 bg-gradient-to-br from-[#a06cd5]/30 to-[#6247aa]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="relative px-6 pt-6 pb-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6247aa] to-[#a06cd5] flex items-center justify-center shadow-lg shadow-[#6247aa]/40">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-white tracking-tight">
                {tab === 'signin' ? t('auth.signIn') : t('auth.createAccount')}
              </h3>
              <p className="text-xs text-white/60">
                {tab === 'signin'
                  ? 'Psylume — ' + t('common.tagline')
                  : t('auth.createButton')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label={t('common.close')}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="p-6 pb-0">
          <div className="grid grid-cols-2 p-1 rounded-xl bg-black/40 border border-white/10">
            <button
              type="button"
              onClick={() => {
                setTab('signin')
                setError(null)
              }}
              className={`py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                tab === 'signin'
                  ? 'bg-gradient-to-r from-[#6247aa] to-[#a06cd5] text-white shadow-md'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              {t('auth.signIn')}
            </button>
            <button
              type="button"
              onClick={() => {
                setTab('signup')
                setError(null)
              }}
              className={`py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                tab === 'signup'
                  ? 'bg-gradient-to-r from-[#6247aa] to-[#a06cd5] text-white shadow-md'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              {t('auth.createAccount')}
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-200 text-xs flex items-start gap-2 animate-fade-in">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed">{error}</div>
            </div>
          )}

          {tab === 'signup' && (
            <div>
              <label className="block text-xs font-medium text-white/80 mb-1.5">
                {t('auth.fullName')}
              </label>
              <div className="relative">
                <User className={cx('absolute top-1/2 -translate-y-1/2 w-4 h-4 text-white/40', isRTL ? 'right-3' : 'left-3')} />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={t('auth.fullNamePlaceholder')}
                  className={cx(
                    'w-full py-2.5 rounded-xl bg-black/40 border border-white/15 text-sm text-white placeholder-white/35 focus:outline-none focus:border-[#a06cd5] focus:ring-1 focus:ring-[#a06cd5] transition-all',
                    isRTL ? 'pr-9 pl-3' : 'pl-9 pr-3',
                  )}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-white/80 mb-1.5">
              {t('auth.email')}
            </label>
            <div className="relative">
              <Mail className={cx('absolute top-1/2 -translate-y-1/2 w-4 h-4 text-white/40', isRTL ? 'right-3' : 'left-3')} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('auth.emailPlaceholder')}
                className={cx(
                  'w-full py-2.5 rounded-xl bg-black/40 border border-white/15 text-sm text-white placeholder-white/35 focus:outline-none focus:border-[#a06cd5] focus:ring-1 focus:ring-[#a06cd5] transition-all',
                  isRTL ? 'pr-9 pl-3' : 'pl-9 pr-3',
                )}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-white/80 mb-1.5">
              {t('auth.password')}
            </label>
            <div className="relative">
              <Lock className={cx('absolute top-1/2 -translate-y-1/2 w-4 h-4 text-white/40', isRTL ? 'right-3' : 'left-3')} />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className={cx(
                  'w-full py-2.5 rounded-xl bg-black/40 border border-white/15 text-sm text-white placeholder-white/35 focus:outline-none focus:border-[#a06cd5] focus:ring-1 focus:ring-[#a06cd5] transition-all',
                  isRTL ? 'pr-9 pl-10' : 'pl-9 pr-10',
                )}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={cx('absolute top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors cursor-pointer', isRTL ? 'left-3' : 'right-3')}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {tab === 'signup' && (
            <div>
              <label className="block text-xs font-medium text-white/80 mb-1.5">
                {t('auth.faculty')}
              </label>
              <div className="relative">
                <Building className={cx('absolute top-1/2 -translate-y-1/2 w-4 h-4 text-white/40', isRTL ? 'right-3' : 'left-3')} />
                <input
                  type="text"
                  value={faculty}
                  onChange={(e) => setFaculty(e.target.value)}
                  placeholder={t('auth.facultyPlaceholder')}
                  className={cx(
                    'w-full py-2.5 rounded-xl bg-black/40 border border-white/15 text-sm text-white placeholder-white/35 focus:outline-none focus:border-[#a06cd5] focus:ring-1 focus:ring-[#a06cd5] transition-all',
                    isRTL ? 'pr-9 pl-3' : 'pl-9 pr-3',
                  )}
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#6247aa] via-[#a06cd5] to-[#6247aa] bg-[length:200%_auto] hover:bg-right font-semibold text-sm text-white shadow-lg shadow-[#6247aa]/40 disabled:opacity-60 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{t('auth.authenticating')}</span>
                </>
              ) : (
                <>
                  <span>{tab === 'signin' ? t('auth.signInButton') : t('auth.createButton')}</span>
                  <ArrowRight className={cx('w-4 h-4', isRTL && 'rotate-180')} />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-black/40 border-t border-white/10 text-center text-xs text-white/60">
          {tab === 'signin' ? (
            <p>
              {t('auth.noAccount')}{' '}
              <button
                type="button"
                onClick={() => {
                  setTab('signup')
                  setError(null)
                }}
                className="font-semibold text-[#e2cfea] hover:underline cursor-pointer"
              >
                {t('auth.createOneNow')}
              </button>
            </p>
          ) : (
            <p>
              {t('auth.haveAccount')}{' '}
              <button
                type="button"
                onClick={() => {
                  setTab('signin')
                  setError(null)
                }}
                className="font-semibold text-[#e2cfea] hover:underline cursor-pointer"
              >
                {t('auth.signInHere')}
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
