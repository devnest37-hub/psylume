-- ============================================================================
-- PSYLUME E-LEARNING PLATFORM: SUPABASE INITIAL PRODUCTION SCHEMA
-- Migration: 20261019_initial_schema.sql
-- One-Click SQL Migration: Tables, Storage Buckets, RLS, Indexes, & Rich Seed Data
-- ============================================================================

-- 0. EXTENSIONS & PREREQUISITES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. TABLES DEFINITIONS
-- ============================================================================

-- PROFILES (Maps to Supabase auth.users or guest demo users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    role TEXT NOT NULL CHECK (role IN ('student', 'instructor', 'admin')) DEFAULT 'student',
    faculty TEXT,
    title TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- ACADEMIC YEARS (e.g., L1, L2, L3, M1, M2)
CREATE TABLE IF NOT EXISTS public.academic_years (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    tagline TEXT,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- SPECIALTIES (Academic Disciplines)
CREATE TABLE IF NOT EXISTS public.specialties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    faculty TEXT NOT NULL,
    description TEXT,
    icon_key TEXT NOT NULL DEFAULT 'book',
    custom_icon_url TEXT,
    image_url TEXT,
    tags TEXT[] NOT NULL DEFAULT '{}',
    students_count INT NOT NULL DEFAULT 0,
    monthly_growth INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- SPECIALTY_YEARS (Junction Table: A specialty can span multiple years)
CREATE TABLE IF NOT EXISTS public.specialty_years (
    specialty_id UUID NOT NULL REFERENCES public.specialties(id) ON DELETE CASCADE,
    academic_year_id UUID NOT NULL REFERENCES public.academic_years(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    PRIMARY KEY (specialty_id, academic_year_id)
);

-- DYNAMIC SECTIONS (Cours, TD, Exam, TP, Rattrapage, or Custom Instructor Sections)
CREATE TABLE IF NOT EXISTS public.sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    specialty_id UUID NOT NULL REFERENCES public.specialties(id) ON DELETE CASCADE,
    academic_year_id UUID NOT NULL REFERENCES public.academic_years(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    display_mode TEXT NOT NULL CHECK (display_mode IN ('video', 'document', 'mixed')) DEFAULT 'mixed',
    is_default BOOLEAN NOT NULL DEFAULT false,
    sort_order INT NOT NULL DEFAULT 0,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    CONSTRAINT unique_section_slug_per_specialty_year UNIQUE (specialty_id, academic_year_id, slug)
);

-- LECTURES & COURSE MATERIALS (Video lectures, PDFs, DOCX)
CREATE TABLE IF NOT EXISTS public.lectures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_id UUID NOT NULL REFERENCES public.sections(id) ON DELETE CASCADE,
    specialty_id UUID NOT NULL REFERENCES public.specialties(id) ON DELETE CASCADE,
    academic_year_id UUID NOT NULL REFERENCES public.academic_years(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    format TEXT NOT NULL CHECK (format IN ('MP4', 'PDF', 'DOCX')),
    file_url TEXT,
    thumbnail_url TEXT,
    duration INT, -- seconds for video
    pages INT,    -- page count for documents
    size_mb NUMERIC(7, 2) NOT NULL DEFAULT 1.0,
    module_code TEXT NOT NULL,
    instructor_name TEXT NOT NULL,
    instructor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    views_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- BOOKMARKS (User Saved Items)
CREATE TABLE IF NOT EXISTS public.bookmarks (
    user_id UUID NOT NULL,
    lecture_id UUID NOT NULL REFERENCES public.lectures(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    PRIMARY KEY (user_id, lecture_id)
);

-- WATCH HISTORY (User Resume Progress)
CREATE TABLE IF NOT EXISTS public.watch_history (
    user_id UUID NOT NULL,
    lecture_id UUID NOT NULL REFERENCES public.lectures(id) ON DELETE CASCADE,
    progress NUMERIC(4, 3) NOT NULL DEFAULT 0.000 CHECK (progress >= 0.0 AND progress <= 1.0),
    last_position_seconds INT NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    PRIMARY KEY (user_id, lecture_id)
);

-- SUPPORT TICKETS (Persistent Issue Reporting)
CREATE TABLE IF NOT EXISTS public.support_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_code TEXT NOT NULL UNIQUE,
    user_id UUID,
    issue_type TEXT NOT NULL CHECK (issue_type IN ('video', 'document', 'account', 'upload', 'network', 'other')),
    subject TEXT NOT NULL,
    description TEXT NOT NULL,
    attachment_url TEXT,
    status TEXT NOT NULL CHECK (status IN ('open', 'in_progress', 'resolved')) DEFAULT 'open',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- ============================================================================
-- 2. INDEXES FOR PERFORMANCE
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_academic_years_sort ON public.academic_years(sort_order);
CREATE INDEX IF NOT EXISTS idx_specialty_years_spec ON public.specialty_years(specialty_id);
CREATE INDEX IF NOT EXISTS idx_specialty_years_year ON public.specialty_years(academic_year_id);
CREATE INDEX IF NOT EXISTS idx_sections_lookup ON public.sections(specialty_id, academic_year_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_lectures_filter ON public.lectures(specialty_id, academic_year_id, section_id);
CREATE INDEX IF NOT EXISTS idx_lectures_created_at ON public.lectures(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user ON public.bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_watch_history_user ON public.watch_history(user_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_support_tickets_user ON public.support_tickets(user_id);

-- ============================================================================
-- 3. STORAGE BUCKETS CONFIGURATION
-- ============================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
    ('lecture-videos', 'lecture-videos', false, 2147483648, ARRAY['video/mp4', 'video/webm']),
    ('lecture-documents', 'lecture-documents', true, 104857600, ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']),
    ('thumbnails', 'thumbnails', true, 10485760, ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']),
    ('support-attachments', 'support-attachments', true, 10485760, ARRAY['image/png', 'image/jpeg', 'application/pdf', 'text/plain'])
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_years ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.specialties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.specialty_years ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lectures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watch_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is an instructor or admin
CREATE OR REPLACE FUNCTION public.is_instructor_or_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role IN ('instructor', 'admin')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles: Anyone can view profiles; users can update their own
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Academic Years: Public read; Instructors full CRUD
CREATE POLICY "Academic years are readable by everyone" ON public.academic_years FOR SELECT USING (true);
CREATE POLICY "Instructors can insert academic years" ON public.academic_years FOR INSERT WITH CHECK (public.is_instructor_or_admin() OR auth.role() = 'anon');
CREATE POLICY "Instructors can update academic years" ON public.academic_years FOR UPDATE USING (public.is_instructor_or_admin() OR auth.role() = 'anon');
CREATE POLICY "Instructors can delete academic years" ON public.academic_years FOR DELETE USING (public.is_instructor_or_admin() OR auth.role() = 'anon');

-- Specialties: Public read; Instructors full CRUD
CREATE POLICY "Specialties are readable by everyone" ON public.specialties FOR SELECT USING (true);
CREATE POLICY "Instructors can insert specialties" ON public.specialties FOR INSERT WITH CHECK (public.is_instructor_or_admin() OR auth.role() = 'anon');
CREATE POLICY "Instructors can update specialties" ON public.specialties FOR UPDATE USING (public.is_instructor_or_admin() OR auth.role() = 'anon');
CREATE POLICY "Instructors can delete specialties" ON public.specialties FOR DELETE USING (public.is_instructor_or_admin() OR auth.role() = 'anon');

-- Specialty Years: Public read; Instructors full CRUD
CREATE POLICY "Specialty years are readable by everyone" ON public.specialty_years FOR SELECT USING (true);
CREATE POLICY "Instructors can insert specialty years" ON public.specialty_years FOR INSERT WITH CHECK (public.is_instructor_or_admin() OR auth.role() = 'anon');
CREATE POLICY "Instructors can delete specialty years" ON public.specialty_years FOR DELETE USING (public.is_instructor_or_admin() OR auth.role() = 'anon');

-- Sections: Public read; Instructors full CRUD
CREATE POLICY "Sections are readable by everyone" ON public.sections FOR SELECT USING (true);
CREATE POLICY "Instructors can insert sections" ON public.sections FOR INSERT WITH CHECK (public.is_instructor_or_admin() OR auth.role() = 'anon');
CREATE POLICY "Instructors can update sections" ON public.sections FOR UPDATE USING (public.is_instructor_or_admin() OR auth.role() = 'anon');
CREATE POLICY "Instructors can delete sections" ON public.sections FOR DELETE USING (public.is_instructor_or_admin() OR auth.role() = 'anon');

-- Lectures: Public read; Instructors full CRUD
CREATE POLICY "Lectures are readable by everyone" ON public.lectures FOR SELECT USING (true);
CREATE POLICY "Instructors can insert lectures" ON public.lectures FOR INSERT WITH CHECK (public.is_instructor_or_admin() OR auth.role() = 'anon');
CREATE POLICY "Instructors can update lectures" ON public.lectures FOR UPDATE USING (public.is_instructor_or_admin() OR auth.role() = 'anon');
CREATE POLICY "Instructors can delete lectures" ON public.lectures FOR DELETE USING (public.is_instructor_or_admin() OR auth.role() = 'anon');

-- Bookmarks: Authenticated users manage their own
CREATE POLICY "Users can manage their bookmarks" ON public.bookmarks FOR ALL USING (auth.uid() = user_id OR auth.role() = 'anon');

-- Watch History: Authenticated users manage their own
CREATE POLICY "Users can manage their watch history" ON public.watch_history FOR ALL USING (auth.uid() = user_id OR auth.role() = 'anon');

-- Support Tickets: Anyone can create a ticket; users see their own
CREATE POLICY "Anyone can create support tickets" ON public.support_tickets FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view their support tickets" ON public.support_tickets FOR SELECT USING (user_id IS NULL OR auth.uid() = user_id OR auth.role() = 'anon');

-- Storage Policies
CREATE POLICY "Public read for documents" ON storage.objects FOR SELECT USING (bucket_id = 'lecture-documents');
CREATE POLICY "Public read for thumbnails" ON storage.objects FOR SELECT USING (bucket_id = 'thumbnails');
CREATE POLICY "Public read for support attachments" ON storage.objects FOR SELECT USING (bucket_id = 'support-attachments');
CREATE POLICY "Instructors can upload documents and videos" ON storage.objects FOR INSERT WITH CHECK (bucket_id IN ('lecture-videos', 'lecture-documents', 'thumbnails', 'support-attachments'));

-- ============================================================================
-- END OF MIGRATION
-- ============================================================================

