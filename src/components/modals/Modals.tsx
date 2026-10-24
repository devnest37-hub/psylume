'use client'

import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import {
  AlertCircle,
  CalendarPlus,
  Check,
  Edit,
  FilePlus2,
  FileText,
  FolderPlus,
  Image as ImageIcon,
  Loader2,
  Plus,
  Sparkles,
  Trash2,
  UploadCloud,
  Video,
} from 'lucide-react'
import { uploadLectureFile } from '@/lib/supabase/storage'
import { useStore } from '@/context/store'
import { useLanguage } from '@/context/language'
import {
  Button,
  ConfirmDialog,
  DropZone,
  Field,
  ICON_KEYS,
  Modal,
  Segmented,
  SpecialtyIcon,
  cx,
  inputCls,
} from '@/components/ui'
import {
  CATEGORY_META,
  LECTURE_PHOTOS,
  SPECIALTY_PHOTOS,
} from '@/lib/data'
import {
  type AcademicYear,
  type Format,
  type IconKey,
  type Lecture,
  type Section,
  type Specialty,
} from '@/types'

import { AuthModal } from './AuthModal'

export function Modals() {
  const { modal, openModal } = useStore()
  const close = () => openModal(null)

  return (
    <>
      {modal?.type === 'auth' && (
        <AuthModal initialTab={modal.tab} onClose={close} />
      )}

      {modal?.type === 'year' && <AddYearModal onClose={close} />}
      {modal?.type === 'edit-year' && <EditYearModal year={modal.year} onClose={close} />}
      {modal?.type === 'delete-year' && <DeleteYearModal year={modal.year} onClose={close} />}

      {modal?.type === 'specialty' && (
        <AddSpecialtyModal onClose={close} yearId={modal.yearId} />
      )}
      {modal?.type === 'edit-specialty' && (
        <EditSpecialtyModal specialty={modal.specialty} onClose={close} />
      )}
      {modal?.type === 'delete-specialty' && (
        <DeleteSpecialtyModal specialty={modal.specialty} onClose={close} />
      )}

      {modal?.type === 'section' && (
        <AddSectionModal
          onClose={close}
          yearId={modal.yearId}
          specialtyId={modal.specialtyId}
        />
      )}
      {modal?.type === 'edit-section' && (
        <EditSectionModal section={modal.section} onClose={close} />
      )}
      {modal?.type === 'delete-section' && (
        <DeleteSectionModal section={modal.section} onClose={close} />
      )}

      {modal?.type === 'lecture' && (
        <AddLectureModal
          onClose={close}
          yearId={modal.yearId}
          specialtyId={modal.specialtyId}
          sectionId={modal.sectionId}
          category={modal.category}
        />
      )}
      {modal?.type === 'edit-lecture' && (
        <EditLectureModal lecture={modal.lecture} onClose={close} />
      )}
      {modal?.type === 'delete-lecture' && (
        <DeleteLectureModal lecture={modal.lecture} onClose={close} />
      )}
    </>
  )
}

function FieldError({ msg }: { msg?: string }) {
  return msg ? <p className="text-xs text-amethyst mt-1.5">{msg}</p> : null
}

/* ───────────────────────── Academic Years ───────────────────────── */

function AddYearModal({ onClose }: { onClose: () => void }) {
  const router = useRouter()
  const { addYear, years } = useStore()
  const { t } = useLanguage()
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [tagline, setTagline] = useState('')
  const [err, setErr] = useState<{ name?: string; code?: string }>({})

  const submit = (e?: FormEvent) => {
    e?.preventDefault()
    const errs: typeof err = {}
    if (!name.trim()) errs.name = 'Give the academic year a name.'
    if (!code.trim()) errs.code = 'Add a short code, e.g. M3 or DU.'
    else if (years.some((y) => y.code.toLowerCase() === code.trim().toLowerCase()))
      errs.code = 'This code is already used.'
    setErr(errs)
    if (Object.keys(errs).length) return

    const y = addYear({
      name: name.trim(),
      code: code.trim().toUpperCase(),
      tagline: tagline.trim() || 'New academic programme',
      sort_order: years.length + 1,
    })
    onClose()
    router.push(`/years/${y.id}`)
  }

  return (
    <Modal
      open
      onClose={onClose}
      title={t('modals.addYearTitle')}
      subtitle={t('modals.addYearSubtitle')}
      icon={<CalendarPlus className="size-5" />}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            {t('modals.cancel')}
          </Button>
          <Button onClick={() => submit()}>
            <Check className="size-4" /> {t('modals.createYear')}
          </Button>
        </>
      }
    >
      <form onSubmit={submit} className="grid grid-cols-[1fr_180px] gap-6">
        <div className="space-y-4">
          <Field label={t('modals.yearName')}>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Doctoral Programme"
              className={inputCls}
            />
            <FieldError msg={err.name} />
          </Field>
          <Field label={t('modals.yearCode')} hint="Max 4 characters">
            <input
              value={code}
              maxLength={4}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g. PhD"
              className={inputCls}
            />
            <FieldError msg={err.code} />
          </Field>
          <Field label={t('modals.yearTagline')} hint="Optional">
            <input
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. Research seminars & thesis supervision"
              className={inputCls}
            />
          </Field>
          <button type="submit" className="hidden" />
        </div>
        <div>
          <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-lavender/45 mb-2">
            Preview
          </div>
          <div className="relative overflow-hidden rounded-2xl bg-midnight/60 ring-1 ring-amethyst/50 p-4 h-[190px]">
            <div className="absolute -right-3 -top-5 font-serif text-[80px] leading-none font-semibold text-amethyst/15">
              {code.toUpperCase() || 'XX'}
            </div>
            <span className="relative inline-flex h-6 px-2 items-center rounded-md bg-violet text-[11px] font-extrabold text-lavender">
              {code.toUpperCase() || 'CODE'}
            </span>
            <div className="relative mt-6 font-bold truncate text-lavender">
              {name || 'Year name'}
            </div>
            <div className="relative text-xs text-lavender/50 line-clamp-2">
              {tagline || 'Tagline appears here'}
            </div>
          </div>
        </div>
      </form>
    </Modal>
  )
}

function EditYearModal({ year, onClose }: { year: AcademicYear; onClose: () => void }) {
  const { updateYear } = useStore()
  const { t } = useLanguage()
  const [name, setName] = useState(year.name)
  const [code, setCode] = useState(year.code)
  const [tagline, setTagline] = useState(year.tagline)

  const submit = (e?: FormEvent) => {
    e?.preventDefault()
    if (!name.trim() || !code.trim()) return
    updateYear(year.id, {
      name: name.trim(),
      code: code.trim().toUpperCase(),
      tagline: tagline.trim(),
    })
    onClose()
  }

  return (
    <Modal
      open
      onClose={onClose}
      title={t('modals.editYearTitle')}
      subtitle={`Updating ${year.name}`}
      icon={<Edit className="size-5" />}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            {t('modals.cancel')}
          </Button>
          <Button onClick={() => submit()}>
            <Check className="size-4" /> {t('modals.saveChanges')}
          </Button>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <Field label={t('modals.yearName')}>
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputCls}
          />
        </Field>
        <Field label={t('modals.yearCode')} hint="Max 4 characters">
          <input
            value={code}
            maxLength={4}
            onChange={(e) => setCode(e.target.value)}
            className={inputCls}
          />
        </Field>
        <Field label={t('modals.yearTagline')}>
          <input
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            className={inputCls}
          />
        </Field>
      </form>
    </Modal>
  )
}

function DeleteYearModal({ year, onClose }: { year: AcademicYear; onClose: () => void }) {
  const router = useRouter()
  const { deleteYear } = useStore()
  const { t } = useLanguage()

  return (
    <ConfirmDialog
      open
      onClose={onClose}
      title={`${t('common.delete')} ${year.name}?`}
      message={t('modals.deleteYearWarning')}
      confirmLabel={t('modals.deleteYearTitle')}
      onConfirm={() => {
        deleteYear(year.id)
        onClose()
        router.push('/home')
      }}
    />
  )
}

/* ───────────────────────── Specialties ───────────────────────── */

const FACULTIES = [
  'Faculty of Human Sciences',
  'Faculty of Law & Political Science',
  'Faculty of Communication',
  'Faculty of Letters & Languages',
  'Faculty of Economics & Management',
  'Faculty of Science & Technology',
]

function AddSpecialtyModal({ onClose, yearId }: { onClose: () => void; yearId?: string }) {
  const router = useRouter()
  const { addSpecialty, years, specialties, user } = useStore()
  const { t } = useLanguage()
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [faculty, setFaculty] = useState('')
  const [description, setDescription] = useState('')
  const [tagsInput, setTagsInput] = useState('')
  const [icon, setIcon] = useState<IconKey>('book')
  const [image, setImage] = useState(SPECIALTY_PHOTOS[0])
  const [iconUrl, setIconUrl] = useState('')
  const [yearIds, setYearIds] = useState<string[]>(yearId ? [yearId] : [])
  const [err, setErr] = useState<{ name?: string; years?: string }>({})
  const [uploadingCover, setUploadingCover] = useState(false)

  const onCoverFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    setUploadingCover(true)
    try {
      const res = await uploadLectureFile(f, 'thumbnails')
      setImage(res.publicUrl)
    } catch (err) {
      console.error('Failed to upload thumbnail:', err)
    } finally {
      setUploadingCover(false)
    }
  }

  const autoCode = name.replace(/[^a-zA-Z]/g, '').slice(0, 3).toUpperCase()

  const submit = () => {
    const errs: typeof err = {}
    if (!name.trim()) errs.name = 'Name the specialty.'
    else if (
      specialties.some((s) => s.name.toLowerCase() === name.trim().toLowerCase())
    )
      errs.name = 'A specialty with this name already exists.'
    if (yearIds.length === 0) errs.years = 'Attach at least one academic year.'
    setErr(errs)
    if (Object.keys(errs).length) return

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)

    const s = addSpecialty({
      name: name.trim(),
      code: (code || autoCode || 'NEW').toUpperCase(),
      faculty: faculty.trim() || 'General Studies',
      description: description.trim() || `Core curriculum and resources for ${name.trim()}.`,
      icon,
      iconUrl: iconUrl || undefined,
      image,
      yearIds,
      tags: tags.length ? tags : ['Curriculum', 'Core'],
      instructors: user?.full_name ? [user.full_name] : [],
    })
    onClose()
    const targetYear = yearId && yearIds.includes(yearId) ? yearId : yearIds[0]
    router.push(`/years/${targetYear}/specialties/${s.id}`)
  }

  return (
    <Modal
      open
      onClose={onClose}
      width="max-w-2xl"
      title={t('modals.addSpecialtyTitle')}
      subtitle={
        yearId
          ? `${t('modals.addSpecialtySubtitle')} (${years.find((y) => y.id === yearId)?.name})`
          : t('modals.addSpecialtySubtitle')
      }
      icon={<FolderPlus className="size-5" />}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            {t('modals.cancel')}
          </Button>
          <Button onClick={submit}>
            <Check className="size-4" /> {t('modals.createSpecialty')}
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        <div className="grid grid-cols-[1fr_120px] gap-3">
          <Field label={t('modals.specialtyName')}>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Political Science"
              className={inputCls}
            />
            <FieldError msg={err.name} />
          </Field>
          <Field label={t('modals.specialtyCode')}>
            <input
              value={code}
              maxLength={4}
              onChange={(e) => setCode(e.target.value)}
              placeholder={autoCode || 'POL'}
              className={cx(inputCls, 'uppercase')}
            />
          </Field>
        </div>

        <Field label={t('modals.specialtyFaculty')} hint="Type anything or select">
          <input
            value={faculty}
            onChange={(e) => setFaculty(e.target.value)}
            list="faculty-suggestions"
            placeholder="e.g. Faculty of Engineering, School of Arts…"
            className={inputCls}
          />
          <datalist id="faculty-suggestions">
            {FACULTIES.map((f) => (
              <option key={f} value={f} />
            ))}
          </datalist>
        </Field>

        <Field label="Short description" hint="Optional">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            placeholder="One sentence shown on specialty cards."
            className={cx(inputCls, 'h-auto py-3 resize-none')}
          />
        </Field>

        <Field label="Tags" hint="Comma-separated e.g. Clinical, Neuroscience, Lab">
          <input
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="e.g. AI, Systems, Web"
            className={inputCls}
          />
        </Field>

        <Field label="Academic years">
          <div className="flex flex-wrap gap-2">
            {years.map((y) => {
              const on = yearIds.includes(y.id)
              return (
                <button
                  type="button"
                  key={y.id}
                  aria-pressed={on}
                  onClick={() =>
                    setYearIds((ids) =>
                      on ? ids.filter((i) => i !== y.id) : [...ids, y.id],
                    )
                  }
                  className={cx(
                    'h-9 px-3 rounded-lg text-xs font-bold ring-1 inline-flex items-center gap-1.5 transition-colors cursor-pointer',
                    on
                      ? 'bg-violet ring-amethyst text-lavender'
                      : 'ring-lavender/15 text-lavender/65 hover:ring-amethyst/60',
                  )}
                >
                  {on && <Check className="size-3.5" />}
                  {y.code} · {y.name}
                </button>
              )
            })}
          </div>
          <FieldError msg={err.years} />
        </Field>

        <div className="grid grid-cols-2 gap-5">
          <Field label="Icon">
            <div className="grid grid-cols-5 gap-1.5">
              {ICON_KEYS.map((k) => (
                <button
                  type="button"
                  key={k}
                  onClick={() => {
                    setIcon(k)
                    setIconUrl('')
                  }}
                  aria-label={k}
                  className={cx(
                    'aspect-square rounded-xl grid place-items-center ring-1 transition-colors cursor-pointer',
                    icon === k && !iconUrl
                      ? 'bg-violet ring-amethyst text-lavender'
                      : 'ring-lavender/15 text-lavender/60 hover:text-amethyst',
                  )}
                >
                  <SpecialtyIcon icon={k} className="size-4" />
                </button>
              ))}
            </div>
          </Field>
          <Field label="Cover photo" hint={uploadingCover ? 'Uploading cover to cloud…' : 'Pick or upload custom'}>
            <div className="space-y-2">
              <label className="flex items-center gap-2 h-8 px-3 rounded-lg bg-navy ring-1 ring-lavender/15 hover:ring-amethyst/40 text-xs font-semibold text-amethyst cursor-pointer w-fit transition-all">
                {uploadingCover ? (
                  <Loader2 className="size-3.5 animate-spin text-amethyst" />
                ) : (
                  <UploadCloud className="size-3.5" />
                )}
                <span>{uploadingCover ? 'Uploading…' : 'Upload custom cover'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={onCoverFile}
                  disabled={uploadingCover}
                  className="hidden"
                />
              </label>

              <div className="grid grid-cols-3 gap-2">
                {SPECIALTY_PHOTOS.map((ph) => (
                  <button
                    type="button"
                    key={ph}
                    onClick={() => setImage(ph)}
                    className={cx(
                      'aspect-video rounded-xl overflow-hidden ring-2 transition-all cursor-pointer relative',
                      image === ph
                        ? 'ring-amethyst scale-[1.03]'
                        : 'ring-transparent opacity-60 hover:opacity-100',
                    )}
                  >
                    <img src={ph} alt="" className="size-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </Field>
        </div>
      </div>
    </Modal>
  )
}

function EditSpecialtyModal({
  specialty,
  onClose,
}: {
  specialty: Specialty
  onClose: () => void
}) {
  const { updateSpecialty, years } = useStore()
  const { t } = useLanguage()
  const [name, setName] = useState(specialty.name)
  const [code, setCode] = useState(specialty.code)
  const [faculty, setFaculty] = useState(specialty.faculty)
  const [description, setDescription] = useState(specialty.description)
  const [tagsInput, setTagsInput] = useState(specialty.tags.join(', '))
  const [yearIds, setYearIds] = useState<string[]>(specialty.yearIds)
  const [image, setImage] = useState(specialty.image)
  const [uploadingCover, setUploadingCover] = useState(false)

  const onCoverFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    setUploadingCover(true)
    try {
      const res = await uploadLectureFile(f, 'thumbnails')
      setImage(res.publicUrl)
    } catch (err) {
      console.error('Failed to upload thumbnail:', err)
    } finally {
      setUploadingCover(false)
    }
  }

  const submit = () => {
    if (!name.trim()) return
    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)

    updateSpecialty(specialty.id, {
      name: name.trim(),
      code: code.trim().toUpperCase(),
      faculty: faculty.trim(),
      description: description.trim(),
      tags,
      yearIds,
      image,
    })
    onClose()
  }

  return (
    <Modal
      open
      onClose={onClose}
      width="max-w-2xl"
      title={`${t('common.edit')} ${specialty.name}`}
      subtitle={t('modals.editSpecialtySubtitle')}
      icon={<Edit className="size-5" />}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            {t('modals.cancel')}
          </Button>
          <Button onClick={submit}>
            <Check className="size-4" /> {t('modals.saveChanges')}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-[1fr_120px] gap-3">
          <Field label={t('modals.specialtyName')}>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputCls}
            />
          </Field>
          <Field label={t('modals.specialtyCode')}>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className={cx(inputCls, 'uppercase')}
            />
          </Field>
        </div>
        <Field label={t('modals.specialtyFaculty')}>
          <input
            value={faculty}
            onChange={(e) => setFaculty(e.target.value)}
            className={inputCls}
          />
        </Field>
        <Field label={t('modals.specialtyDesc')}>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className={cx(inputCls, 'h-auto py-3 resize-none')}
          />
        </Field>
        <Field label="Tags" hint="Comma-separated">
          <input
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            className={inputCls}
          />
        </Field>
        <Field
          label={t('modals.chooseCover')}
          hint={uploadingCover ? 'Uploading cover to cloud…' : 'Pick or upload custom'}
        >
          <div className="space-y-2">
            <label className="flex items-center gap-2 h-8 px-3 rounded-lg bg-navy ring-1 ring-lavender/15 hover:ring-amethyst/40 text-xs font-semibold text-amethyst cursor-pointer w-fit transition-all">
              {uploadingCover ? (
                <Loader2 className="size-3.5 animate-spin text-amethyst" />
              ) : (
                <UploadCloud className="size-3.5" />
              )}
              <span>{uploadingCover ? 'Uploading…' : 'Upload custom cover'}</span>
              <input
                type="file"
                accept="image/*"
                onChange={onCoverFile}
                disabled={uploadingCover}
                className="hidden"
              />
            </label>

            <div className="grid grid-cols-3 gap-2">
              {SPECIALTY_PHOTOS.map((ph) => (
                <button
                  type="button"
                  key={ph}
                  onClick={() => setImage(ph)}
                  className={cx(
                    'aspect-video rounded-xl overflow-hidden ring-2 transition-all cursor-pointer relative',
                    image === ph
                      ? 'ring-amethyst scale-[1.03]'
                      : 'ring-transparent opacity-60 hover:opacity-100',
                  )}
                >
                  <img src={ph} alt="" className="size-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </Field>
        <Field label={t('nav.years')}>
          <div className="flex flex-wrap gap-2">
            {years.map((y) => {
              const on = yearIds.includes(y.id)
              return (
                <button
                  type="button"
                  key={y.id}
                  onClick={() =>
                    setYearIds((ids) =>
                      on ? ids.filter((i) => i !== y.id) : [...ids, y.id],
                    )
                  }
                  className={cx(
                    'h-9 px-3 rounded-lg text-xs font-bold ring-1 inline-flex items-center gap-1.5 cursor-pointer',
                    on
                      ? 'bg-violet ring-amethyst text-lavender'
                      : 'ring-lavender/15 text-lavender/65 hover:ring-amethyst/60',
                  )}
                >
                  {on && <Check className="size-3.5" />}
                  {y.code} · {y.name}
                </button>
              )
            })}
          </div>
        </Field>
      </div>
    </Modal>
  )
}

function DeleteSpecialtyModal({
  specialty,
  onClose,
}: {
  specialty: Specialty
  onClose: () => void
}) {
  const router = useRouter()
  const { deleteSpecialty } = useStore()
  const { t } = useLanguage()

  return (
    <ConfirmDialog
      open
      onClose={onClose}
      title={`${t('common.delete')} ${specialty.name}?`}
      message={t('modals.deleteSpecialtyWarning')}
      confirmLabel={t('modals.deleteSpecialtyTitle')}
      onConfirm={() => {
        deleteSpecialty(specialty.id)
        onClose()
        router.push('/home')
      }}
    />
  )
}

/* ───────────────────────── Dynamic Sections ───────────────────────── */

function AddSectionModal({
  yearId,
  specialtyId,
  onClose,
}: {
  yearId: string
  specialtyId: string
  onClose: () => void
}) {
  const { addSection, sections } = useStore()
  const { t } = useLanguage()
  const [name, setName] = useState('')
  const [displayMode, setDisplayMode] = useState<'video' | 'document' | 'mixed'>('mixed')

  const submit = () => {
    if (!name.trim()) return
    const slugStr = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-')
    addSection({
      name: name.trim(),
      slug: slugStr,
      specialty_id: specialtyId,
      academic_year_id: yearId,
      display_mode: displayMode,
      is_default: false,
      sort_order: sections.length + 1,
    })
    onClose()
  }

  return (
    <Modal
      open
      onClose={onClose}
      title={t('modals.addSectionTitle')}
      subtitle={t('modals.addSectionSubtitle')}
      icon={<FolderPlus className="size-5" />}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            {t('modals.cancel')}
          </Button>
          <Button onClick={submit}>
            <Check className="size-4" /> {t('modals.createSection')}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Field label={t('modals.sectionName')} hint="e.g. TP / Practical Labs, Resits, Project">
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. TP / Lab Work"
            className={inputCls}
          />
        </Field>
        <Field label={t('modals.sectionDisplayMode')}>
          <Segmented<'video' | 'document' | 'mixed'>
            value={displayMode}
            onChange={setDisplayMode}
            options={[
              { value: 'video', label: 'Video-oriented', hint: 'Best for recorded sessions' },
              { value: 'document', label: 'Document-oriented', hint: 'Best for exercise sheets & PDFs' },
              { value: 'mixed', label: 'Mixed format', hint: 'Supports MP4, PDF, and DOCX' },
            ]}
          />
        </Field>
      </div>
    </Modal>
  )
}

function EditSectionModal({
  section,
  onClose,
}: {
  section: Section
  onClose: () => void
}) {
  const { updateSection } = useStore()
  const { t } = useLanguage()
  const [name, setName] = useState(section.name)
  const [displayMode, setDisplayMode] = useState(section.display_mode)

  const submit = () => {
    if (!name.trim()) return
    updateSection(section.id, {
      name: name.trim(),
      display_mode: displayMode,
    })
    onClose()
  }

  return (
    <Modal
      open
      onClose={onClose}
      title={t('modals.editSectionTitle')}
      subtitle={`Updating section ${section.name}`}
      icon={<Edit className="size-5" />}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            {t('modals.cancel')}
          </Button>
          <Button onClick={submit}>
            <Check className="size-4" /> {t('modals.saveChanges')}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Field label={t('modals.sectionName')}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputCls}
          />
        </Field>
        <Field label={t('modals.sectionDisplayMode')}>
          <Segmented<'video' | 'document' | 'mixed'>
            value={displayMode}
            onChange={setDisplayMode}
            options={[
              { value: 'video', label: 'Video-oriented' },
              { value: 'document', label: 'Document-oriented' },
              { value: 'mixed', label: 'Mixed format' },
            ]}
          />
        </Field>
      </div>
    </Modal>
  )
}

function DeleteSectionModal({
  section,
  onClose,
}: {
  section: Section
  onClose: () => void
}) {
  const { deleteSection } = useStore()
  const { t } = useLanguage()

  return (
    <ConfirmDialog
      open
      onClose={onClose}
      title={`${t('common.delete')} ${section.name}?`}
      message={t('modals.deleteSectionWarning')}
      confirmLabel={t('modals.deleteSectionTitle')}
      onConfirm={() => {
        deleteSection(section.id)
        onClose()
      }}
    />
  )
}

/* ───────────────────────── Lectures ───────────────────────── */

const ACCEPT: Record<Format, string> = {
  MP4: 'video/mp4,video/*',
  PDF: 'application/pdf',
  DOCX: '.docx,.doc,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document',
}

function AddLectureModal({
  onClose,
  yearId: initialYear,
  specialtyId: initialSpec,
  sectionId: initialSecId,
  category: initialCat,
}: {
  onClose: () => void
  yearId?: string
  specialtyId?: string
  sectionId?: string
  category?: string
}) {
  const router = useRouter()
  const { addLecture, years, specialties, sections, lectures, role, user } = useStore()
  const { t } = useLanguage()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [format, setFormat] = useState<Format>('MP4')
  const [yearId, setYearId] = useState(initialYear ?? years[0]?.id ?? '')
  const [specialtyId, setSpecialtyId] = useState(initialSpec ?? '')
  const [sectionId, setSectionId] = useState(initialSecId ?? '')
  const [file, setFile] = useState<File | null>(null)
  const [err, setErr] = useState<{ title?: string; specialty?: string; file?: string }>({})
  const [publishing, setPublishing] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const contextual = Boolean(initialYear && initialSpec)

  const yearSpecs = useMemo(
    () => specialties.filter((s) => s.yearIds.includes(yearId)),
    [specialties, yearId],
  )

  useEffect(() => {
    if (!yearSpecs.some((s) => s.id === specialtyId)) {
      setSpecialtyId(yearSpecs[0]?.id ?? '')
    }
  }, [yearSpecs, specialtyId])

  const availableSections = useMemo(
    () =>
      sections.filter(
        (sec) => sec.specialty_id === specialtyId && sec.academic_year_id === yearId,
      ),
    [sections, specialtyId, yearId],
  )

  useEffect(() => {
    if (!availableSections.some((s) => s.id === sectionId)) {
      setSectionId(availableSections[0]?.id ?? '')
    }
  }, [availableSections, sectionId])

  const activeSection = availableSections.find((s) => s.id === sectionId)

  const onFile = (f: File | null) => {
    setFile(f)
    setUploadError(null)
    if (!f) return
    const ext = f.name.split('.').pop()?.toLowerCase()
    if (ext === 'mp4') setFormat('MP4')
    else if (ext === 'pdf') setFormat('PDF')
    else if (ext === 'docx' || ext === 'doc') setFormat('DOCX')
    if (!title) setTitle(f.name.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' '))
  }

  const submit = async () => {
    const errs: typeof err = {}
    if (title.trim().length < 3) errs.title = 'Add a descriptive title.'
    if (!specialtyId) errs.specialty = 'Pick a specialty for this year.'
    if (!file) errs.file = 'Attach a file, or use the sample file.'
    setErr(errs)
    if (Object.keys(errs).length) return

    const s = specialties.find((x) => x.id === specialtyId)!
    const level = Math.max(1, years.findIndex((y) => y.id === yearId) + 1)
    const count = lectures.filter(
      (l) => l.specialtyId === specialtyId && l.yearId === yearId,
    ).length

    setPublishing(true)
    setUploadProgress(15)
    setUploadError(null)

    try {
      const bucket = format === 'MP4' ? 'lecture-videos' : 'lecture-documents'
      const uploadRes = await uploadLectureFile(file!, bucket, (pct) => {
        setUploadProgress(pct)
      })

      const lecture = addLecture({
        title: title.trim(),
        description:
          description.trim() ||
          CATEGORY_META[activeSection?.name || 'Cours']?.blurb ||
          'Comprehensive course material for this module.',
        section_id: sectionId || availableSections[0]?.id || `sec-${specialtyId}-${yearId}-cours`,
        category: activeSection?.name || 'Cours',
        format,
        specialtyId,
        yearId,
        instructor:
          user?.full_name ||
          (s.instructors && s.instructors.length > 0 ? s.instructors[0] : 'Instructor'),
        duration: undefined,
        pages: undefined,
        image: s.image || LECTURE_PHOTOS[0],
        sizeMB:
          uploadRes.sizeMB ||
          (file?.size ? Math.max(1, Math.round(file.size / 1024 / 1024)) : 0),
        module: `${s.code}-${level}${String(count + 4).padStart(2, '0')}`,
        file_url: uploadRes.publicUrl,
      })

      onClose()
      router.push(`/years/${yearId}/specialties/${specialtyId}?section=${lecture.section_id}`)
    } catch (e: unknown) {
      console.error('Storage upload error:', e)
      setUploadError(e instanceof Error ? e.message : 'Upload failed.')
      setPublishing(false)
    }
  }

  return (
    <Modal
      open
      onClose={onClose}
      width="max-w-2xl"
      title={t('modals.addLectureTitle')}
      subtitle={
        contextual
          ? `${t('modals.addLectureSubtitle')} (${specialties.find((s) => s.id === initialSpec)?.name} · ${years.find((y) => y.id === initialYear)?.name})`
          : t('modals.addLectureSubtitle')
      }
      icon={<FilePlus2 className="size-5" />}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            {t('modals.cancel')}
          </Button>
          <Button onClick={submit} disabled={publishing}>
            {publishing ? (
              <>
                <span className="size-4 rounded-full border-2 border-lavender/30 border-t-lavender animate-spin" />{' '}
                {t('common.loading')}
              </>
            ) : (
              <>
                <Check className="size-4" /> {t('modals.createLecture')}
              </>
            )}
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        <Field label={t('modals.lectureTitle')}>
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Lecture 4 — Working Memory Models"
            className={inputCls}
          />
          <FieldError msg={err.title} />
        </Field>

        <Field label={t('modals.lectureDesc')} hint="Optional">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="What students will learn, prerequisites, related readings…"
            className={cx(inputCls, 'h-auto py-3 resize-none leading-relaxed')}
          />
        </Field>

        {!contextual && (
          <div className="grid grid-cols-2 gap-3">
            <Field label={t('modals.selectYear')}>
              <select
                value={yearId}
                onChange={(e) => setYearId(e.target.value)}
                className={cx(inputCls, 'cursor-pointer')}
              >
                {years.map((y) => (
                  <option key={y.id} value={y.id}>
                    {y.code} · {y.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label={t('modals.selectSpecialty')}>
              <select
                value={specialtyId}
                onChange={(e) => setSpecialtyId(e.target.value)}
                className={cx(inputCls, 'cursor-pointer')}
                disabled={!yearSpecs.length}
              >
                {yearSpecs.length === 0 && (
                  <option value="">No specialties in this year</option>
                )}
                {yearSpecs.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
              <FieldError msg={err.specialty} />
            </Field>
          </div>
        )}

        <Field label={t('modals.selectSection')}>
          <select
            value={sectionId}
            onChange={(e) => setSectionId(e.target.value)}
            className={cx(inputCls, 'cursor-pointer')}
          >
            {availableSections.map((sec) => (
              <option key={sec.id} value={sec.id}>
                {sec.name} ({sec.display_mode})
              </option>
            ))}
          </select>
        </Field>

        <Field label={t('modals.lectureFormat')}>
          <Segmented<Format>
            value={format}
            onChange={(f) => {
              setFormat(f)
              if (file && !file.name.toLowerCase().endsWith(f.toLowerCase()))
                setFile(null)
            }}
            options={[
              {
                value: 'MP4',
                label: 'MP4',
                hint: 'Video lecture',
                icon: <Video className="size-4 text-amethyst" />,
              },
              {
                value: 'PDF',
                label: 'PDF',
                hint: 'Portable document',
                icon: <FileText className="size-4 text-amethyst" />,
              },
              {
                value: 'DOCX',
                label: 'DOCX',
                hint: 'Word document',
                icon: <FileText className="size-4 text-amethyst" />,
              },
            ]}
          />
        </Field>

        <Field
          label="Upload file"
          hint={format === 'MP4' ? 'Up to 2 GB' : 'Up to 100 MB'}
        >
          <DropZone
            file={file}
            onFile={onFile}
            accept={ACCEPT[format]}
            hint={`Accepted: .${format.toLowerCase()}`}
          />
          {file && (
            <div className="mt-2.5 p-3 rounded-xl bg-midnight/80 ring-1 ring-lavender/15 flex items-center justify-between text-xs animate-fade-in">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="size-8 rounded-lg bg-violet/40 grid place-items-center text-amethyst shrink-0">
                  <FileText className="size-4" />
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-lavender truncate">{file.name}</div>
                  <div className="text-[11px] text-lavender/50">
                    Format: {format} · Size: {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </div>
                </div>
              </div>
              {!publishing && (
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="text-xs font-semibold text-lavender/50 hover:text-red-300 cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>
          )}

          {uploadError && (
            <div className="mt-2.5 p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="size-4 text-red-400 shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}

          {publishing && (
            <div className="mt-3 p-4 rounded-xl bg-midnight/90 ring-1 ring-amethyst/30 space-y-2 animate-fade-in">
              <div className="flex items-center justify-between text-xs font-semibold text-lavender">
                <span className="flex items-center gap-2">
                  <Loader2 className="size-3.5 animate-spin text-amethyst" />
                  {uploadProgress < 100
                    ? `Uploading ${format} to cloud storage…`
                    : 'Finalizing database record…'}
                </span>
                <span className="tabular-nums text-amethyst font-bold">{uploadProgress}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-navy overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-violet to-amethyst transition-all duration-300 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mt-2">
            <FieldError msg={err.file} />
            {!file && !publishing && (
              <button
                type="button"
                onClick={() => {
                  const ext = format.toLowerCase()
                  onFile(
                    new File(
                      [
                        new Uint8Array(
                          1024 * 1024 * (format === 'MP4' ? 48 : 2),
                        ),
                      ],
                      `sample_${(activeSection?.name || 'lecture').toLowerCase()}_material.${ext}`,
                    ),
                  )
                }}
                className="ml-auto inline-flex items-center gap-1.5 text-xs font-semibold text-amethyst hover:text-lavender cursor-pointer"
              >
                <Sparkles className="size-3.5" /> Use sample .{format.toLowerCase()} file
              </button>
            )}
          </div>
        </Field>
      </div>
    </Modal>
  )
}

function EditLectureModal({
  lecture,
  onClose,
}: {
  lecture: Lecture
  onClose: () => void
}) {
  const { updateLecture, sections } = useStore()
  const [title, setTitle] = useState(lecture.title)
  const [description, setDescription] = useState(lecture.description)
  const [instructor, setInstructor] = useState(lecture.instructor)
  const [sectionId, setSectionId] = useState(lecture.section_id)
  const [newFile, setNewFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const relevantSections = sections.filter(
    (s) =>
      s.specialty_id === lecture.specialtyId &&
      s.academic_year_id === lecture.yearId,
  )

  const submit = async () => {
    if (!title.trim()) return
    const activeSec = relevantSections.find((s) => s.id === sectionId)

    let fileUrl = lecture.file_url
    let format = lecture.format
    let sizeMB = lecture.sizeMB

    if (newFile) {
      setUploading(true)
      setUploadProgress(20)
      setUploadError(null)
      try {
        const ext = newFile.name.split('.').pop()?.toLowerCase()
        const newFormat = ext === 'mp4' ? 'MP4' : ext === 'docx' ? 'DOCX' : 'PDF'
        const bucket = newFormat === 'MP4' ? 'lecture-videos' : 'lecture-documents'
        const uploadRes = await uploadLectureFile(newFile, bucket, (p) =>
          setUploadProgress(p),
        )
        fileUrl = uploadRes.publicUrl
        format = newFormat
        sizeMB =
          uploadRes.sizeMB || Math.max(1, Math.round(newFile.size / (1024 * 1024)))
      } catch (err) {
        setUploadError(err instanceof Error ? err.message : 'File upload failed')
        setUploading(false)
        return
      }
    }

    updateLecture(lecture.id, {
      title: title.trim(),
      description: description.trim(),
      instructor: instructor.trim(),
      section_id: sectionId,
      category: activeSec?.name || lecture.category,
      file_url: fileUrl,
      format,
      sizeMB,
    })
    onClose()
  }

  const { t } = useLanguage()

  return (
    <Modal
      open
      onClose={onClose}
      title={t('modals.editLectureTitle')}
      subtitle={`${t('common.edit')}: ${lecture.title}`}
      icon={<Edit className="size-5" />}
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={uploading}>
            {t('modals.cancel')}
          </Button>
          <Button onClick={submit} disabled={uploading}>
            {uploading ? (
              <>
                <Loader2 className="size-4 animate-spin text-lavender" /> {t('common.loading')}
              </>
            ) : (
              <>
                <Check className="size-4" /> {t('modals.saveChanges')}
              </>
            )}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Field label={t('modals.lectureTitle')}>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={inputCls}
          />
        </Field>
        <Field label={t('modals.lectureDesc')}>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className={cx(inputCls, 'h-auto py-3 resize-none')}
          />
        </Field>
        <Field label={t('modals.selectSection')}>
          <select
            value={sectionId}
            onChange={(e) => setSectionId(e.target.value)}
            className={cx(inputCls, 'cursor-pointer')}
          >
            {relevantSections.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label={t('modals.lectureInstructor')}>
          <input
            value={instructor}
            onChange={(e) => setInstructor(e.target.value)}
            className={inputCls}
          />
        </Field>

        <Field
          label={t('modals.uploadFile')}
          hint={newFile ? `${(newFile.size / 1048576).toFixed(2)} MB` : 'Optional'}
        >
          <div className="space-y-2">
            <label className="flex items-center gap-2 h-9 px-3 rounded-lg bg-navy ring-1 ring-lavender/15 hover:ring-amethyst/40 text-xs font-semibold text-amethyst cursor-pointer w-fit transition-all">
              <UploadCloud className="size-4" />
              <span>{newFile ? newFile.name : t('modals.dragAndDrop')}</span>
              <input
                type="file"
                accept=".mp4,.pdf,.docx,.doc"
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (f) setNewFile(f)
                }}
                disabled={uploading}
                className="hidden"
              />
            </label>

            {uploadError && (
              <div className="p-2.5 rounded-lg bg-red-500/15 border border-red-500/30 text-red-200 text-xs flex items-center gap-2">
                <AlertCircle className="size-3.5 text-red-400 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            {uploading && (
              <div className="p-3 rounded-xl bg-midnight/90 ring-1 ring-amethyst/30 space-y-1.5 animate-fade-in">
                <div className="flex items-center justify-between text-xs font-semibold text-lavender">
                  <span className="flex items-center gap-1.5">
                    <Loader2 className="size-3.5 animate-spin text-amethyst" />
                    {t('common.loading')}
                  </span>
                  <span className="tabular-nums text-amethyst font-bold">{uploadProgress}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-navy overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-violet to-amethyst transition-all duration-300 rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </Field>
      </div>
    </Modal>
  )
}

function DeleteLectureModal({
  lecture,
  onClose,
}: {
  lecture: Lecture
  onClose: () => void
}) {
  const router = useRouter()
  const { deleteLecture } = useStore()
  const { t } = useLanguage()

  return (
    <ConfirmDialog
      open
      onClose={onClose}
      title={`${t('common.delete')} “${lecture.title}”?`}
      message={t('modals.deleteLectureWarning')}
      confirmLabel={t('modals.deleteLectureTitle')}
      onConfirm={() => {
        deleteLecture(lecture.id)
        onClose()
        router.push(
          `/years/${lecture.yearId}/specialties/${lecture.specialtyId}?section=${lecture.section_id}`,
        )
      }}
    />
  )
}
