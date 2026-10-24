export type Role = 'student' | 'instructor' | 'admin'
export type Format = 'MP4' | 'PDF' | 'DOCX'
export type IconKey = 'brain' | 'scale' | 'radio' | 'feather' | 'users' | 'chart' | 'landmark' | 'cpu' | 'book'
export type Language = 'en' | 'ar' | 'fr'

export interface AcademicYear {
  id: string
  name: string
  code: string
  tagline: string
  sort_order?: number
}

export interface Specialty {
  id: string
  name: string
  code: string
  faculty: string
  description: string
  image: string
  icon: IconKey
  iconUrl?: string
  yearIds: string[]
  students: number
  growth: number
  tags: string[]
  instructors: string[]
}

export interface Section {
  id: string
  specialty_id: string
  academic_year_id: string
  name: string
  slug: string
  display_mode: 'video' | 'document' | 'mixed'
  is_default: boolean
  sort_order: number
  created_by?: string
}

export interface Lecture {
  id: string
  title: string
  description: string
  section_id: string
  category: string // Name of section, e.g. "Cours", "TD", "Exam", "TP"
  format: Format
  specialtyId: string
  yearId: string
  instructor: string
  createdAt: number
  duration?: number
  pages?: number
  views: number
  image: string
  sizeMB: number
  module: string
  file_url?: string
}

export interface HistoryEntry {
  lectureId: string
  at: number
  progress: number
}

export type IssueType = 'video' | 'document' | 'account' | 'upload' | 'network' | 'other'

export interface SupportTicket {
  id: string
  ticket_code: string
  subject: string
  type: IssueType
  description: string
  status: 'open' | 'in_progress' | 'resolved'
  at: number
  attachment_url?: string
}

export interface UserProfile {
  id: string
  email: string
  full_name: string
  role: Role
  faculty?: string
  avatar_url?: string
}

export type ModalState =
  | { type: 'auth'; tab?: 'signin' | 'signup' }
  | { type: 'year' }
  | { type: 'edit-year'; year: AcademicYear }
  | { type: 'delete-year'; year: AcademicYear }
  | { type: 'specialty'; yearId?: string }
  | { type: 'edit-specialty'; specialty: Specialty }
  | { type: 'delete-specialty'; specialty: Specialty }
  | { type: 'section'; yearId: string; specialtyId: string }
  | { type: 'edit-section'; section: Section }
  | { type: 'delete-section'; section: Section }
  | { type: 'lecture'; yearId?: string; specialtyId?: string; sectionId?: string; category?: string }
  | { type: 'edit-lecture'; lecture: Lecture }
  | { type: 'delete-lecture'; lecture: Lecture }
  | null

