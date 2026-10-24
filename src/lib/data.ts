import {
  type AcademicYear,
  type Format,
  type HistoryEntry,
  type IconKey,
  type Lecture,
  type Section,
  type Specialty,
  type SupportTicket,
} from '@/types'

export const FORMATS: Format[] = ['MP4', 'PDF', 'DOCX']

export const CATEGORY_META: Record<string, { label: string; blurb: string }> = {
  Cours: {
    label: 'Core Theoretical Lectures',
    blurb: 'Recorded lectures and course notes covering the theoretical core of each module.',
  },
  TD: {
    label: 'Directed Work & Applied Exercises',
    blurb: 'Guided exercise sheets, worked corrections and applied practice sessions.',
  },
  Exam: {
    label: 'Past Exams & Assessments',
    blurb: 'Previous exam papers, midterms and resit sessions with marking schemes.',
  },
  'TP / Lab Work': {
    label: 'Practical Laboratory Sessions',
    blurb: 'Hands-on practicals, software experiments, and clinical protocol walkthroughs.',
  },
}

export const img = (id: string, w = 800) =>
  id.startsWith('http') || id.startsWith('data:')
    ? id
    : `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=70`

export const PHOTOS = {
  hall: 'photo-1606761568499-6d2451b23c66',
  professor: 'photo-1758270704262-ecc82b23dc37',
  talking: 'photo-1758270705482-cee87ea98738',
  attentive: 'photo-1758270705067-0d7edee57af0',
  blackboardGroup: 'photo-1736066330610-c102cab4e942',
  womanBoard: 'photo-1758685847747-597ce085906e',
  formulas: 'photo-1758685734622-3e0a002b2f53',
  elderProf: 'photo-1758685734408-19dd0cc86d2d',
  libraryHall: 'photo-1576164285450-6d26c5b1a2a6',
  libraryReader: 'photo-1544822688-c5f41d2c1972',
  laptopBook: 'photo-1639396104908-a8f2037ad565',
  courthouse: 'photo-1636652966850-5ac4d02370e9',
  brain: 'photo-1617791160536-598cf32026fb',
  camera: 'photo-1612548403247-aa2873e9422d',
  mic: 'photo-1589903308904-1010c2294adc',
  books: 'photo-1550399105-c4db5fb85c18',
  bookStack: 'photo-1491841573634-28140fc7ced7',
  bookshelf: 'photo-1497015289639-54688650d173',
}

export const LECTURE_PHOTOS = [
  PHOTOS.professor,
  PHOTOS.womanBoard,
  PHOTOS.formulas,
  PHOTOS.attentive,
  PHOTOS.blackboardGroup,
  PHOTOS.elderProf,
  PHOTOS.talking,
  PHOTOS.hall,
]

export const SPECIALTY_PHOTOS = [
  PHOTOS.libraryHall,
  PHOTOS.libraryReader,
  PHOTOS.bookshelf,
  PHOTOS.mic,
  PHOTOS.hall,
  PHOTOS.attentive,
]

export const mockAcademicYears: AcademicYear[] = []
export const mockSpecialties: Specialty[] = []
export const mockSections: Section[] = []
export const mockLectures: Lecture[] = []
export const SEED_YEARS: AcademicYear[] = []

// Deterministic string hash utility
export function hash(str: string) {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return (h >>> 0) / 4294967295
}

const MIN = 60_000

export function buildSeed() {
  return {
    years: [] as AcademicYear[],
    specialties: [] as Specialty[],
    sections: [] as Section[],
    lectures: [] as Lecture[],
    bookmarks: [] as string[],
    history: [] as HistoryEntry[],
    tickets: [] as SupportTicket[],
  }
}

export const formatDuration = (sec: number) => {
  const h = Math.floor(sec / 3600)
  const m = Math.floor((sec % 3600) / 60)
  const s = Math.floor(sec % 60)
  const pad = (n: number) => String(n).padStart(2, '0')
  return h ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`
}

export const timeAgo = (ts: number) => {
  const diff = Date.now() - ts
  const m = Math.round(diff / MIN)
  if (m < 1) return 'just now'
  if (m < 60) return `${m} min ago`
  const h = Math.round(m / 60)
  if (h < 24) return `${h} h ago`
  const d = Math.round(h / 24)
  if (d < 7) return `${d} day${d > 1 ? 's' : ''} ago`
  const w = Math.round(d / 7)
  if (w < 5) return `${w} week${w > 1 ? 's' : ''} ago`
  return new Date(ts).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export const compact = (n: number) =>
  n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k` : String(n)

export const initials = (name: string) =>
  name
    .replace(/^(Dr\.|Prof\.|Me\.)\s*/, '')
    .split(' ')
    .filter(Boolean)
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
