'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { Globe, Check, ChevronDown } from 'lucide-react'
import {
  translations,
  type Language,
  type TranslationDict,
} from '@/lib/i18n/translations'
import { cx } from '@/components/ui'

export type { Language, TranslationDict }

export interface LanguageContextType {
  lang: Language
  setLang: (l: Language) => void
  dir: 'ltr' | 'rtl'
  isRTL: boolean
  dict: TranslationDict
  t: (path: string, params?: Record<string, string | number>) => string
}

const STORAGE_LANG_KEY = 'psylume_lang'

const LanguageCtx = createContext<LanguageContextType | null>(null)

export const LANGUAGES: {
  code: Language
  label: string
  nativeName: string
  flag: string
  dir: 'ltr' | 'rtl'
}[] = [
  { code: 'en', label: 'English', nativeName: 'English', flag: '🇬🇧', dir: 'ltr' },
  { code: 'ar', label: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', dir: 'rtl' },
  { code: 'fr', label: 'French', nativeName: 'Français', flag: '🇫🇷', dir: 'ltr' },
]

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>('en')
  const [isInitialized, setIsInitialized] = useState(false)

  // Load language preference from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_LANG_KEY) as Language
      if (saved && (saved === 'en' || saved === 'ar' || saved === 'fr')) {
        setLangState(saved)
      } else {
        // Detect browser language if available
        const browser = navigator.language?.toLowerCase()
        if (browser.startsWith('ar')) setLangState('ar')
        else if (browser.startsWith('fr')) setLangState('fr')
        else setLangState('en')
      }
    } catch {
      // Fallback
    } finally {
      setIsInitialized(true)
    }
  }, [])

  const setLang = useCallback((l: Language) => {
    setLangState(l)
    try {
      localStorage.setItem(STORAGE_LANG_KEY, l)
    } catch {
      /* ignore storage errors */
    }
  }, [])

  const dir: 'ltr' | 'rtl' = lang === 'ar' ? 'rtl' : 'ltr'
  const isRTL = dir === 'rtl'

  // Synchronize HTML attributes on mount & lang change
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang
      document.documentElement.dir = dir
    }
  }, [lang, dir])

  const dict = translations[lang] || translations.en

  // Helper translation lookup with parameter interpolation
  const t = useCallback(
    (path: string, params?: Record<string, string | number>): string => {
      const keys = path.split('.')
      let curr: any = dict

      for (const k of keys) {
        if (curr && typeof curr === 'object' && k in curr) {
          curr = curr[k]
        } else {
          // Fallback to English dictionary
          let fallback: any = translations.en
          for (const fk of keys) {
            if (fallback && typeof fallback === 'object' && fk in fallback) {
              fallback = fallback[fk]
            } else {
              fallback = path
              break
            }
          }
          curr = fallback
          break
        }
      }

      if (typeof curr !== 'string') {
        return path
      }

      let res = curr
      if (params) {
        for (const [k, v] of Object.entries(params)) {
          res = res.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v))
        }
      }
      return res
    },
    [dict],
  )

  const value = useMemo(
    () => ({
      lang,
      setLang,
      dir,
      isRTL,
      dict,
      t,
    }),
    [lang, setLang, dir, isRTL, dict, t],
  )

  return (
    <LanguageCtx.Provider value={value}>
      <div dir={dir} className={isRTL ? 'rtl-context' : 'ltr-context'}>
        {children}
      </div>
    </LanguageCtx.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageCtx)
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return ctx
}

/**
 * Interactive Language Switcher Component
 * Supports dropdown with flags, labels, and keyboard/click-outside navigation.
 */
export function LanguageSwitcher({
  variant = 'header',
  className,
}: {
  variant?: 'header' | 'landing' | 'compact'
  className?: string
}) {
  const { lang, setLang, isRTL } = useLanguage()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const current = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0]

  return (
    <div ref={ref} className={cx('relative shrink-0', className)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label="Select language"
        className={cx(
          'flex items-center gap-2 rounded-xl transition-all cursor-pointer font-semibold',
          variant === 'header' &&
            'h-10 px-3 bg-navy ring-1 ring-lavender/15 hover:ring-amethyst/40 text-lavender text-xs',
          variant === 'landing' &&
            'h-9 px-3 bg-white/5 hover:bg-white/10 ring-1 ring-white/15 text-lavender text-xs backdrop-blur-md',
          variant === 'compact' &&
            'size-9 p-0 justify-center bg-navy ring-1 ring-lavender/15 hover:ring-amethyst/40 text-lavender text-xs',
        )}
      >
        <span className="text-sm select-none">{current.flag}</span>
        {variant !== 'compact' && (
          <span className="font-bold tracking-wide">{current.nativeName}</span>
        )}
        <ChevronDown
          className={cx(
            'size-3.5 text-lavender/50 transition-transform duration-200',
            open && 'rotate-180',
          )}
        />
      </button>

      {open && (
        <div
          className={cx(
            'absolute top-12 w-44 rounded-2xl bg-[#102b3f] ring-1 ring-white/15 shadow-2xl p-1.5 animate-pop z-50 text-white',
            isRTL ? 'left-0 origin-top-left' : 'right-0 origin-top-right',
          )}
        >
          <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-lavender/40 border-b border-white/10 mb-1">
            Language / اللغة / Langue
          </div>
          <div className="space-y-0.5">
            {LANGUAGES.map((item) => {
              const active = item.code === lang
              return (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => {
                    setLang(item.code)
                    setOpen(false)
                  }}
                  className={cx(
                    'w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer',
                    active
                      ? 'bg-violet text-white shadow-sm'
                      : 'text-lavender/80 hover:bg-white/5 hover:text-white',
                  )}
                >
                  <span className="flex items-center gap-2.5">
                    <span className="text-base select-none">{item.flag}</span>
                    <span>{item.nativeName}</span>
                  </span>
                  {active && <Check className="size-3.5 text-white stroke-[2.5]" />}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
