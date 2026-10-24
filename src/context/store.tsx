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
import {
  type AcademicYear,
  type Format,
  type HistoryEntry,
  type IconKey,
  type Lecture,
  type ModalState,
  type Role,
  type Section,
  type Specialty,
  type SupportTicket,
  type UserProfile,
} from '@/types'
import { buildSeed } from '@/lib/data'
import { isSupabaseConfigured, supabase } from '@/lib/supabase/client'

interface Data {
  years: AcademicYear[]
  specialties: Specialty[]
  sections: Section[]
  lectures: Lecture[]
  bookmarks: string[]
  history: HistoryEntry[]
  tickets: SupportTicket[]
}

export interface Store extends Data {
  // Real Supabase User & Auth Session
  user: UserProfile | null
  role: Role
  setRole: (r: Role) => void
  isAuthenticated: boolean
  isLoadingAuth: boolean
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signUp: (payload: {
    email: string
    password: string
    full_name: string
    role?: Role
    faculty?: string
  }) => Promise<{ error?: string }>
  signOut: () => Promise<void>
  openAuthModal: (tab?: 'signin' | 'signup') => void

  isBookmarked: (id: string) => boolean
  toggleBookmark: (id: string) => void
  recordHistory: (lectureId: string, progress: number) => void
  clearHistory: () => void

  // Academic Years CRUD
  addYear: (y: Omit<AcademicYear, 'id'>) => AcademicYear
  updateYear: (id: string, y: Partial<AcademicYear>) => AcademicYear
  deleteYear: (id: string) => void

  // Specialties CRUD
  addSpecialty: (s: Omit<Specialty, 'id' | 'students' | 'growth'>) => Specialty
  updateSpecialty: (id: string, s: Partial<Specialty>) => Specialty
  deleteSpecialty: (id: string) => void

  // Dynamic Sections CRUD
  addSection: (s: Omit<Section, 'id'>) => Section
  updateSection: (id: string, s: Partial<Section>) => Section
  deleteSection: (id: string) => void

  // Lectures CRUD
  addLecture: (l: Omit<Lecture, 'id' | 'createdAt' | 'views'>) => Lecture
  updateLecture: (id: string, l: Partial<Lecture>) => Lecture
  deleteLecture: (id: string) => void

  // Support Tickets
  addTicket: (t: Omit<SupportTicket, 'id' | 'ticket_code' | 'at' | 'status'>) => SupportTicket

  // Modals & Notifications
  modal: ModalState
  openModal: (m: ModalState) => void
  toasts: { id: number; message: string }[]
  toast: (message: string) => void

  // Mobile Navigation
  mobileMenuOpen: boolean
  setMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const Ctx = createContext<Store | null>(null)
const STORAGE_KEY = 'psylume:clean:v3'

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') +
  '-' +
  Math.random().toString(36).slice(2, 6)

function asyncSync(promiseLike: PromiseLike<unknown>) {
  Promise.resolve(promiseLike).catch((err) => {
    console.warn('Supabase sync notice:', err)
  })
}

function loadInitial(): { data: Data; role: Role } {
  const emptyData: Data = {
    years: [],
    specialties: [],
    sections: [],
    lectures: [],
    bookmarks: [],
    history: [],
    tickets: [],
  }

  if (typeof window === 'undefined') {
    return { data: emptyData, role: 'student' }
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      return {
        data: {
          years: parsed.data?.years || [],
          specialties: parsed.data?.specialties || [],
          sections: parsed.data?.sections || [],
          lectures: parsed.data?.lectures || [],
          bookmarks: parsed.data?.bookmarks || [],
          history: parsed.data?.history || [],
          tickets: parsed.data?.tickets || [],
        },
        role: parsed.role || 'student',
      }
    }
  } catch {
    /* ignore parse errors */
  }
  return { data: emptyData, role: 'student' }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const initial = useRef(loadInitial()).current
  const [data, setData] = useState<Data>(initial.data)
  const [role, setRoleState] = useState<Role>(initial.role)
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isLoadingAuth, setIsLoadingAuth] = useState(true)
  const [modal, openModal] = useState<ModalState>(null)
  const [toasts, setToasts] = useState<{ id: number; message: string }[]>([])
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Synchronize non-auth state with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ data, role }))
    } catch {
      /* ignore quota errors */
    }
  }, [data, role])

  const toast = useCallback((message: string) => {
    const id = Date.now() + Math.random()
    setToasts((t) => [...t.slice(-2), { id, message }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3400)
  }, [])

  // Helper to fetch user profile and synchronize with state
  const fetchAndApplyProfile = useCallback(
    async (userId: string, email: string) => {
      if (!isSupabaseConfigured || !supabase) return
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle()

        if (profile) {
          const u: UserProfile = {
            id: profile.id,
            email,
            full_name: profile.full_name || 'University Member',
            role: (profile.role as Role) || 'student',
            faculty: profile.faculty || undefined,
            avatar_url: profile.avatar_url || undefined,
          }
          setUser(u)
          setRoleState(u.role)
        } else {
          const { data: userData } = await supabase.auth.getUser()
          const meta = userData?.user?.user_metadata || {}
          const u: UserProfile = {
            id: userId,
            email,
            full_name: meta.full_name || email.split('@')[0],
            role: (meta.role as Role) || 'student',
            faculty: meta.faculty,
            avatar_url: meta.avatar_url,
          }
          setUser(u)
          setRoleState(u.role)
        }
      } catch (err) {
        console.warn('Error loading user profile:', err)
      } finally {
        setIsLoadingAuth(false)
      }
    },
    [],
  )

  // Auth State Listener: connects directly to live Supabase Auth
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setIsLoadingAuth(false)
      return
    }

    // 1. Check existing session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchAndApplyProfile(session.user.id, session.user.email || '')
      } else {
        setUser(null)
        setIsLoadingAuth(false)
      }
    })

    // 2. Listen to real-time auth changes (Sign In, Sign Out, Token Refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        await fetchAndApplyProfile(session.user.id, session.user.email || '')
      } else {
        setUser(null)
        setRoleState('student')
        setIsLoadingAuth(false)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [fetchAndApplyProfile])

  // Sync academic content from Supabase
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return

    async function syncSupabase() {
      try {
        const [yearsRes, specRes, specYearsRes, secRes, lecRes] = await Promise.all([
          supabase!.from('academic_years').select('*').order('sort_order', { ascending: true }),
          supabase!.from('specialties').select('*'),
          supabase!.from('specialty_years').select('*'),
          supabase!.from('sections').select('*').order('sort_order', { ascending: true }),
          supabase!.from('lectures').select('*').order('created_at', { ascending: false }),
        ])

        const specYears =
          (specYearsRes.data as { specialty_id: string; academic_year_id: string }[]) || []

        interface DbSpecialty {
          id: string
          code: string
          name: string
          faculty: string
          description?: string
          icon_key?: string
          custom_icon_url?: string
          image_url?: string
          tags?: string[]
          students_count?: number
          monthly_growth?: number
        }

        const mappedSpecialties: Specialty[] = ((specRes.data as DbSpecialty[]) || []).map((s) => ({
          id: s.id,
          code: s.code,
          name: s.name,
          faculty: s.faculty,
          description: s.description || '',
          icon: (s.icon_key as IconKey) || 'book',
          iconUrl: s.custom_icon_url || undefined,
          image: s.image_url || '',
          yearIds: specYears.filter((sy) => sy.specialty_id === s.id).map((sy) => sy.academic_year_id),
          students: s.students_count || 0,
          growth: s.monthly_growth || 0,
          tags: s.tags || [],
          instructors: s.tags && s.tags.length > 0 ? s.tags : [],
        }))

        interface DbLecture {
          id: string
          title: string
          description?: string
          section_id: string
          category?: string
          format: Format
          specialty_id: string
          academic_year_id: string
          instructor_name?: string
          created_at?: string
          duration?: number
          pages?: number
          views_count?: number
          thumbnail_url?: string
          size_mb?: number
          module_code?: string
          file_url?: string
        }

        const mappedLectures: Lecture[] = ((lecRes.data as DbLecture[]) || []).map((l) => ({
          id: l.id,
          title: l.title,
          description: l.description || '',
          section_id: l.section_id,
          category: l.category || 'Cours',
          format: l.format,
          specialtyId: l.specialty_id,
          yearId: l.academic_year_id,
          instructor: l.instructor_name || 'Instructor',
          createdAt: l.created_at ? new Date(l.created_at).getTime() : Date.now(),
          duration: l.duration || undefined,
          pages: l.pages || undefined,
          views: l.views_count || 0,
          image: l.thumbnail_url || '',
          sizeMB: l.size_mb || 0,
          module: l.module_code || '',
          file_url: l.file_url || undefined,
        }))

        // Legitimately apply Supabase tables (even when completely empty)
        setData((prev) => ({
          ...prev,
          years: (yearsRes.data as AcademicYear[]) || [],
          specialties: mappedSpecialties,
          sections: (secRes.data as Section[]) || [],
          lectures: mappedLectures,
        }))
      } catch (err) {
        console.warn('Supabase initial fetch notice:', err)
      }
    }

    syncSupabase()
  }, [])

  // ===================== AUTH METHODS =====================

  const signIn = useCallback(
    async (email: string, password: string) => {
      if (!isSupabaseConfigured || !supabase) {
        return { error: 'Database authentication service is not configured.' }
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return { error: error.message }
      }

      if (data.user) {
        await fetchAndApplyProfile(data.user.id, data.user.email || email)
        toast('Signed in successfully')
      }
      return {}
    },
    [fetchAndApplyProfile, toast],
  )

  const signUp = useCallback(
    async (payload: {
      email: string
      password: string
      full_name: string
      role?: Role
      faculty?: string
    }) => {
      if (!isSupabaseConfigured || !supabase) {
        return { error: 'Database authentication service is not configured.' }
      }

      const { data, error } = await supabase.auth.signUp({
        email: payload.email,
        password: payload.password,
        options: {
          data: {
            full_name: payload.full_name,
            role: payload.role,
            faculty: payload.faculty || 'General Studies',
          },
        },
      })

      if (error) {
        return { error: error.message }
      }

      if (data.user) {
        await fetchAndApplyProfile(data.user.id, data.user.email || payload.email)
        toast(`Account created! Welcome, ${payload.full_name}`)
      }
      return {}
    },
    [fetchAndApplyProfile, toast],
  )

  const signOut = useCallback(async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut()
    }
    setUser(null)
    setRoleState('student')
    toast('Signed out successfully')
  }, [toast])

  const openAuthModal = useCallback((tab: 'signin' | 'signup' = 'signin') => {
    openModal({ type: 'auth', tab })
  }, [])

  const setRole = useCallback(
    (newRole: Role) => {
      setRoleState(newRole)
      if (user) {
        setUser((u) => (u ? { ...u, role: newRole } : null))
        if (isSupabaseConfigured && supabase) {
          asyncSync(supabase.from('profiles').update({ role: newRole }).eq('id', user.id))
        }
      }
    },
    [user],
  )

  // ===================== CRUD OPERATIONS =====================

  // Academic Years
  const addYear = useCallback(
    (y: Omit<AcademicYear, 'id'>) => {
      const year: AcademicYear = { ...y, id: slug(y.name) }
      setData((d) => ({ ...d, years: [...d.years, year] }))
      toast(`“${y.name}” added to academic years`)

      if (isSupabaseConfigured && supabase) {
        asyncSync(supabase.from('academic_years').insert(year))
      }
      return year
    },
    [toast],
  )

  const updateYear = useCallback(
    (id: string, y: Partial<AcademicYear>) => {
      let updated: AcademicYear | undefined
      setData((d) => {
        const nextYears = d.years.map((item) => {
          if (item.id === id) {
            updated = { ...item, ...y }
            return updated
          }
          return item
        })
        return { ...d, years: nextYears }
      })
      toast(`Academic year updated`)

      if (isSupabaseConfigured && supabase) {
        asyncSync(supabase.from('academic_years').update(y).eq('id', id))
      }
      return updated!
    },
    [toast],
  )

  const deleteYear = useCallback(
    (id: string) => {
      setData((d) => ({
        ...d,
        years: d.years.filter((y) => y.id !== id),
        sections: d.sections.filter((s) => s.academic_year_id !== id),
        lectures: d.lectures.filter((l) => l.yearId !== id),
      }))
      toast('Academic year removed')

      if (isSupabaseConfigured && supabase) {
        asyncSync(supabase.from('academic_years').delete().eq('id', id))
      }
    },
    [toast],
  )

  // Specialties
  const addSpecialty = useCallback(
    (s: Omit<Specialty, 'id' | 'students' | 'growth'>) => {
      const spec: Specialty = {
        ...s,
        id: slug(s.name),
        students: 0,
        growth: 0,
      }

      const defaultSecs: Section[] = spec.yearIds.flatMap((yid) => [
        {
          id: `sec-${spec.id}-${yid}-cours`,
          specialty_id: spec.id,
          academic_year_id: yid,
          name: 'Cours',
          slug: 'cours',
          display_mode: 'video' as const,
          is_default: true,
          sort_order: 1,
        },
        {
          id: `sec-${spec.id}-${yid}-td`,
          specialty_id: spec.id,
          academic_year_id: yid,
          name: 'TD',
          slug: 'td',
          display_mode: 'document' as const,
          is_default: true,
          sort_order: 2,
        },
        {
          id: `sec-${spec.id}-${yid}-exam`,
          specialty_id: spec.id,
          academic_year_id: yid,
          name: 'Exam',
          slug: 'exam',
          display_mode: 'mixed' as const,
          is_default: true,
          sort_order: 3,
        },
      ])

      setData((d) => ({
        ...d,
        specialties: [...d.specialties, spec],
        sections: [...d.sections, ...defaultSecs],
      }))
      toast(`Specialty “${s.name}” created`)

      if (isSupabaseConfigured && supabase) {
        asyncSync(
          supabase.from('specialties').insert({
            id: spec.id,
            code: spec.code,
            name: spec.name,
            faculty: spec.faculty,
            description: spec.description,
            icon_key: spec.icon,
            custom_icon_url: spec.iconUrl,
            image_url: spec.image,
            tags: spec.tags,
            students_count: 0,
            monthly_growth: 0,
          }),
        )
        for (const yid of spec.yearIds) {
          asyncSync(
            supabase.from('specialty_years').insert({
              specialty_id: spec.id,
              academic_year_id: yid,
            }),
          )
        }
        for (const sec of defaultSecs) {
          asyncSync(supabase.from('sections').insert(sec))
        }
      }
      return spec
    },
    [toast],
  )

  const updateSpecialty = useCallback(
    (id: string, s: Partial<Specialty>) => {
      let updated: Specialty | undefined
      setData((d) => {
        const nextSpecs = d.specialties.map((item) => {
          if (item.id === id) {
            updated = { ...item, ...s }
            return updated
          }
          return item
        })
        return { ...d, specialties: nextSpecs }
      })
      toast('Specialty updated')

      if (isSupabaseConfigured && supabase) {
        const payload: Record<string, unknown> = {}
        if (s.name) payload.name = s.name
        if (s.code) payload.code = s.code
        if (s.faculty) payload.faculty = s.faculty
        if (s.description) payload.description = s.description
        if (s.icon) payload.icon_key = s.icon
        if (s.iconUrl !== undefined) payload.custom_icon_url = s.iconUrl
        if (s.image) payload.image_url = s.image
        if (s.tags) payload.tags = s.tags
        asyncSync(supabase.from('specialties').update(payload).eq('id', id))

        if (s.yearIds) {
          asyncSync(
            supabase
              .from('specialty_years')
              .delete()
              .eq('specialty_id', id)
              .then(() => {
                const rows = s.yearIds!.map((yid) => ({
                  specialty_id: id,
                  academic_year_id: yid,
                }))
                if (rows.length > 0) {
                  return supabase!.from('specialty_years').insert(rows)
                }
              }),
          )
        }
      }
      return updated!
    },
    [toast],
  )

  const deleteSpecialty = useCallback(
    (id: string) => {
      setData((d) => ({
        ...d,
        specialties: d.specialties.filter((s) => s.id !== id),
        sections: d.sections.filter((s) => s.specialty_id !== id),
        lectures: d.lectures.filter((l) => l.specialtyId !== id),
      }))
      toast('Specialty deleted')

      if (isSupabaseConfigured && supabase) {
        asyncSync(supabase.from('specialties').delete().eq('id', id))
      }
    },
    [toast],
  )

  // Dynamic Sections
  const addSection = useCallback(
    (s: Omit<Section, 'id'>) => {
      const sec: Section = { ...s, id: slug(s.name) }
      setData((d) => ({ ...d, sections: [...d.sections, sec] }))
      toast(`Section “${sec.name}” added`)

      if (isSupabaseConfigured && supabase) {
        asyncSync(
          supabase.from('sections').insert({
            id: sec.id,
            specialty_id: sec.specialty_id,
            academic_year_id: sec.academic_year_id,
            name: sec.name,
            slug: sec.slug,
            display_mode: sec.display_mode,
            is_default: sec.is_default,
            sort_order: sec.sort_order,
          }),
        )
      }
      return sec
    },
    [toast],
  )

  const updateSection = useCallback(
    (id: string, s: Partial<Section>) => {
      let updated: Section | undefined
      setData((d) => {
        const nextSecs = d.sections.map((item) => {
          if (item.id === id) {
            updated = { ...item, ...s }
            return updated
          }
          return item
        })
        return { ...d, sections: nextSecs }
      })
      toast('Section updated')

      if (isSupabaseConfigured && supabase) {
        asyncSync(supabase.from('sections').update(s).eq('id', id))
      }
      return updated!
    },
    [toast],
  )

  const deleteSection = useCallback(
    (id: string) => {
      setData((d) => ({
        ...d,
        sections: d.sections.filter((sec) => sec.id !== id),
        lectures: d.lectures.filter((lec) => lec.section_id !== id),
      }))
      toast('Section removed')

      if (isSupabaseConfigured && supabase) {
        asyncSync(supabase.from('sections').delete().eq('id', id))
      }
    },
    [toast],
  )

  // Lectures & Course Materials
  const addLecture = useCallback(
    (l: Omit<Lecture, 'id' | 'createdAt' | 'views'>) => {
      const lec: Lecture = {
        ...l,
        id: slug(l.title),
        createdAt: Date.now(),
        views: 0,
      }
      setData((d) => ({ ...d, lectures: [lec, ...d.lectures] }))
      toast(`Added “${lec.title}”`)

      if (isSupabaseConfigured && supabase) {
        asyncSync(
          supabase.from('lectures').insert({
            id: lec.id,
            section_id: lec.section_id,
            specialty_id: lec.specialtyId,
            academic_year_id: lec.yearId,
            title: lec.title,
            description: lec.description,
            format: lec.format,
            duration: lec.duration,
            pages: lec.pages,
            size_mb: lec.sizeMB,
            module_code: lec.module,
            instructor_name: lec.instructor,
            thumbnail_url: lec.image,
            file_url: lec.file_url,
          }),
        )
      }
      return lec
    },
    [toast],
  )

  const updateLecture = useCallback(
    (id: string, l: Partial<Lecture>) => {
      let updated: Lecture | undefined
      setData((d) => {
        const nextLecs = d.lectures.map((item) => {
          if (item.id === id) {
            updated = { ...item, ...l }
            return updated
          }
          return item
        })
        return { ...d, lectures: nextLecs }
      })
      toast('Lecture details updated')

      if (isSupabaseConfigured && supabase) {
        const payload: Record<string, unknown> = {}
        if (l.title) payload.title = l.title
        if (l.description) payload.description = l.description
        if (l.module) payload.module_code = l.module
        if (l.instructor) payload.instructor_name = l.instructor
        if (l.image) payload.thumbnail_url = l.image
        if (l.duration !== undefined) payload.duration = l.duration
        if (l.pages !== undefined) payload.pages = l.pages
        if (l.file_url) payload.file_url = l.file_url
        if (l.format) payload.format = l.format
        if (l.sizeMB !== undefined) payload.size_mb = l.sizeMB
        if (l.section_id) payload.section_id = l.section_id
        asyncSync(supabase.from('lectures').update(payload).eq('id', id))
      }
      return updated!
    },
    [toast],
  )

  const deleteLecture = useCallback(
    (id: string) => {
      setData((d) => ({
        ...d,
        lectures: d.lectures.filter((l) => l.id !== id),
        bookmarks: d.bookmarks.filter((b) => b !== id),
        history: d.history.filter((h) => h.lectureId !== id),
      }))
      toast('Content deleted')

      if (isSupabaseConfigured && supabase) {
        asyncSync(supabase.from('lectures').delete().eq('id', id))
      }
    },
    [toast],
  )

  // Bookmarks
  const toggleBookmark = useCallback(
    (id: string) => {
      let active = false
      setData((d) => {
        const exists = d.bookmarks.includes(id)
        active = !exists
        return {
          ...d,
          bookmarks: exists ? d.bookmarks.filter((x) => x !== id) : [...d.bookmarks, id],
        }
      })
      toast(active ? 'Saved to bookmarks' : 'Removed from bookmarks')

      if (isSupabaseConfigured && supabase) {
        if (active) {
          asyncSync(
            supabase.from('bookmarks').insert({
              user_id: user?.id || '00000000-0000-0000-0000-000000000002',
              lecture_id: id,
            }),
          )
        } else {
          asyncSync(supabase.from('bookmarks').delete().eq('lecture_id', id))
        }
      }
    },
    [toast, user?.id],
  )

  // History
  const recordHistory = useCallback(
    (lectureId: string, progress: number) => {
      setData((d) => {
        const filtered = d.history.filter((h) => h.lectureId !== lectureId)
        return {
          ...d,
          history: [{ lectureId, at: Date.now(), progress }, ...filtered],
        }
      })

      if (isSupabaseConfigured && supabase) {
        asyncSync(
          supabase.from('watch_history').upsert({
            user_id: user?.id || '00000000-0000-0000-0000-000000000002',
            lecture_id: lectureId,
            progress: Number(progress.toFixed(3)),
            updated_at: new Date().toISOString(),
          }),
        )
      }
    },
    [user?.id],
  )

  const clearHistory = useCallback(() => {
    setData((d) => ({ ...d, history: [] }))
    toast('Watch history cleared')
  }, [toast])

  // Support Tickets
  const addTicket = useCallback(
    (t: Omit<SupportTicket, 'id' | 'ticket_code' | 'at' | 'status'>) => {
      const ticket: SupportTicket = {
        ...t,
        id: `ticket-${Date.now()}`,
        ticket_code: `LYC-${48200 + Math.floor(Math.random() * 800)}`,
        status: 'open',
        at: Date.now(),
      }
      setData((d) => ({ ...d, tickets: [ticket, ...d.tickets] }))
      toast(`Ticket ${ticket.ticket_code} submitted successfully`)

      if (isSupabaseConfigured && supabase) {
        asyncSync(
          supabase.from('support_tickets').insert({
            id: ticket.id,
            ticket_code: ticket.ticket_code,
            issue_type: ticket.type,
            subject: ticket.subject,
            description: ticket.description,
            status: ticket.status,
            user_id: user?.id || null,
          }),
        )
      }
      return ticket
    },
    [toast, user?.id],
  )

  const store = useMemo<Store>(
    () => ({
      ...data,
      user,
      role,
      setRole,
      isAuthenticated: Boolean(user),
      isLoadingAuth,
      signIn,
      signUp,
      signOut,
      openAuthModal,
      isBookmarked: (id) => data.bookmarks.includes(id),
      toggleBookmark,
      recordHistory,
      clearHistory,
      addYear,
      updateYear,
      deleteYear,
      addSpecialty,
      updateSpecialty,
      deleteSpecialty,
      addSection,
      updateSection,
      deleteSection,
      addLecture,
      updateLecture,
      deleteLecture,
      addTicket,
      modal,
      openModal,
      toasts,
      toast,
      mobileMenuOpen,
      setMobileMenuOpen,
    }),
    [
      data,
      user,
      role,
      setRole,
      isLoadingAuth,
      signIn,
      signUp,
      signOut,
      openAuthModal,
      toggleBookmark,
      recordHistory,
      clearHistory,
      addYear,
      updateYear,
      deleteYear,
      addSpecialty,
      updateSpecialty,
      deleteSpecialty,
      addSection,
      updateSection,
      deleteSection,
      addLecture,
      updateLecture,
      deleteLecture,
      addTicket,
      modal,
      toasts,
      toast,
      mobileMenuOpen,
    ],
  )

  return <Ctx.Provider value={store}>{children}</Ctx.Provider>
}

export function useStore() {
  const s = useContext(Ctx)
  if (!s) throw new Error('useStore must be used inside StoreProvider')
  return s
}

export function useLookup() {
  const { years, specialties, sections } = useStore()
  return {
    year: (id: string) => years.find((y) => y.id === id),
    specialty: (id: string) => specialties.find((s) => s.id === id),
    section: (id: string) => sections.find((s) => s.id === id),
  }
}
