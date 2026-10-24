import { type Lecture } from '@/types'
import { hash } from '@/lib/data'

export type Block =
  | { type: 'h'; text: string }
  | { type: 'p'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'q'; label: string; text: string; points?: number }
  | { type: 'note'; text: string }

export interface DocPage {
  cover?: boolean
  blocks: Block[]
}

const SECTIONS = [
  'Introduction and scope',
  'Key concepts and definitions',
  'Historical development of the field',
  'Theoretical frameworks',
  'Methodological considerations',
  'Case study',
  'Critical perspectives',
  'Contemporary debates',
  'Synthesis and key takeaways',
  'Further reading',
]

const PARAGRAPHS = [
  (t: string) =>
    `This section situates ${t} within the wider curriculum. We begin by clarifying the vocabulary used throughout the module, since many of the disagreements found in the literature stem from authors using the same terms in subtly different ways.`,
  (t: string) =>
    `A useful way to approach ${t} is to distinguish between descriptive claims, which state how things are, and normative claims, which state how things ought to be. Keeping these registers separate will strengthen your written arguments considerably.`,
  () =>
    `The foundational texts offer competing accounts. Rather than memorising each position in isolation, map them against one another: identify the question each author is trying to answer, the evidence they mobilise and the assumptions they leave unstated.`,
  () =>
    `Empirical studies over the past two decades have refined these early models. Larger samples, better measurement instruments and comparative designs have shown that several classic findings hold only under specific conditions.`,
  () =>
    `When preparing for the assessment, focus on your ability to apply concepts to unfamiliar material. Examiners consistently reward answers that define terms precisely, build a clear structure and support each claim with a relevant example.`,
  (t: string) =>
    `Finally, consider the limits of ${t}. Every framework illuminates some phenomena while obscuring others; recognising those blind spots is a mark of mature, critical engagement with the discipline.`,
  () =>
    `The table of definitions at the end of this chapter summarises the key terms. You are encouraged to complete it with your own examples drawn from the TD sessions and the recommended readings.`,
]

const BULLETS = [
  ['Define the core concept in your own words', 'Identify its main theoretical origin', 'Give one contemporary application'],
  ['Compare two competing models', 'Assess the quality of the supporting evidence', 'State the main limitation of each'],
  ['Summarise the argument in five sentences', 'Link it to a previous lecture', 'Prepare one question for the TD session'],
]

const ascii = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[—–]/g, '-')
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[^\x20-\x7e]/g, '')

export function buildDocument(l: Lecture, specialty: string, year: string): DocPage[] {
  const topic = l.title.replace(/^(TD \d+ — |Final Exam — |Midterm Assessment — |Resit Session — )/, '').replace(/ \(.*\)$/, '')
  const pick = (seed: string, n: number) => Math.floor(hash(l.id + seed) * n)
  const pages: DocPage[] = [
    {
      cover: true,
      blocks: [
        { type: 'p', text: `${specialty} · ${year}` },
        { type: 'h', text: l.title },
        { type: 'p', text: l.instructor },
      ],
    },
  ]
  const n = l.pages ?? 6
  for (let p = 1; p < n; p++) {
    const blocks: Block[] = []
    if (l.category === 'Cours') {
      blocks.push({ type: 'h', text: `${p}. ${SECTIONS[(p - 1) % SECTIONS.length]}` })
      blocks.push({ type: 'p', text: PARAGRAPHS[pick('a' + p, PARAGRAPHS.length)](topic.toLowerCase()) })
      blocks.push({ type: 'p', text: PARAGRAPHS[pick('b' + p, PARAGRAPHS.length)](topic.toLowerCase()) })
      blocks.push({ type: 'list', items: BULLETS[pick('c' + p, BULLETS.length)] })
      blocks.push({ type: 'p', text: PARAGRAPHS[pick('d' + p, PARAGRAPHS.length)](topic.toLowerCase()) })
    } else if (l.category === 'TD') {
      blocks.push({ type: 'h', text: `Exercise ${p}` })
      blocks.push({
        type: 'p',
        text: `Read the supporting document carefully, then answer the following questions. Justify each answer with reference to the concepts introduced in the lecture on ${topic.toLowerCase()}.`,
      })
      ;['a', 'b', 'c'].forEach((k, i) =>
        blocks.push({
          type: 'q',
          label: `${p}.${k}`,
          text: [
            'Identify the main concept at stake and define it precisely.',
            'Apply the framework from the lecture to the case presented above.',
            'Discuss one limitation of your analysis and how you would address it.',
          ][i],
        }),
      )
      blocks.push({ type: 'note', text: 'Method reminder: start with a definition, then structure your answer in two clearly announced parts.' })
      blocks.push({ type: 'p', text: PARAGRAPHS[pick('t' + p, PARAGRAPHS.length)](topic.toLowerCase()) })
    } else {
      if (p === 1) {
        blocks.push({ type: 'h', text: 'Instructions for candidates' })
        blocks.push({
          type: 'list',
          items: [
            'Duration: 2 hours. Calculators and unauthorised materials are strictly prohibited.',
            'Answer ALL questions in Part A and TWO questions from Part B.',
            'Marks for each question are indicated in brackets. Total: 20 points.',
            'Write legibly; clarity of argument is assessed.',
          ],
        })
        blocks.push({ type: 'note', text: 'Examiner comment: the strongest scripts defined their terms in the first paragraph and kept a clear plan throughout.' })
      } else {
        blocks.push({ type: 'h', text: `${p <= 3 ? 'Part A' : 'Part B'} — Question ${p - 1}` })
        blocks.push({ type: 'q', label: `Q${p - 1}`, text: `With reference to ${topic.toLowerCase()}, critically assess the claim that theory must always precede observation.`, points: 4 + (p % 3) * 2 })
        blocks.push({ type: 'p', text: PARAGRAPHS[pick('e' + p, PARAGRAPHS.length)](topic.toLowerCase()) })
        blocks.push({ type: 'q', label: `Q${p - 1}b`, text: 'Illustrate your answer with one example studied during the semester.', points: 2 })
      }
    }
    pages.push({ blocks })
  }
  return pages
}

/** Builds a small but valid multi-page PDF from the generated document. */
export function buildPdf(pages: DocPage[], title: string): Blob {
  const wrap = (text: string, width: number) => {
    const words = ascii(text).split(' ')
    const out: string[] = []
    let line = ''
    for (const w of words) {
      if ((line + ' ' + w).trim().length > width) {
        out.push(line.trim())
        line = w
      } else line += ' ' + w
    }
    if (line.trim()) out.push(line.trim())
    return out
  }
  const esc = (s: string) => s.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)')

  const streams = pages.map((page, i) => {
    const ops: string[] = ['BT', '56 780 Td']
    const line = (txt: string, size: number, lead: number) => ops.push(`/F1 ${size} Tf (${esc(txt)}) Tj 0 -${lead} Td`)
    if (page.cover) {
      ops.push('0 -160 Td')
      line(ascii(page.blocks[0].type === 'p' ? page.blocks[0].text : ''), 11, 30)
      wrap(page.blocks[1].type === 'h' ? page.blocks[1].text : title, 40).forEach((l) => line(l, 22, 28))
      line(' ', 11, 16)
      line(ascii(page.blocks[2].type === 'p' ? page.blocks[2].text : ''), 12, 16)
    } else {
      for (const b of page.blocks) {
        if (b.type === 'h') {
          line(' ', 8, 6)
          wrap(b.text, 60).forEach((l) => line(l, 14, 20))
        } else if (b.type === 'p' || b.type === 'note') {
          wrap(b.type === 'note' ? `Note: ${b.text}` : b.text, 92).forEach((l) => line(l, 10, 14))
          line(' ', 8, 6)
        } else if (b.type === 'list') {
          b.items.forEach((it) => wrap(`- ${it}`, 88).forEach((l) => line(l, 10, 14)))
          line(' ', 8, 6)
        } else if (b.type === 'q') {
          wrap(`${b.label}. ${b.text}${b.points ? ` (${b.points} pts)` : ''}`, 88).forEach((l) => line(l, 10, 14))
        }
      }
    }
    ops.push('ET', `BT /F1 8 Tf 56 40 Td (${esc(ascii(title).slice(0, 80))}  -  page ${i + 1} / ${pages.length}) Tj ET`)
    return ops.join('\n')
  })

  const objs: string[] = []
  const pageIds = pages.map((_, i) => 4 + i * 2)
  objs[1] = '<< /Type /Catalog /Pages 2 0 R >>'
  objs[2] = `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(' ')}] /Count ${pages.length} >>`
  objs[3] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>'
  streams.forEach((s, i) => {
    const pid = 4 + i * 2
    objs[pid] = `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R >> >> /Contents ${pid + 1} 0 R >>`
    objs[pid + 1] = `<< /Length ${s.length} >>\nstream\n${s}\nendstream`
  })
  let out = '%PDF-1.4\n'
  const offsets: number[] = []
  for (let i = 1; i < objs.length; i++) {
    offsets[i] = out.length
    out += `${i} 0 obj\n${objs[i]}\nendobj\n`
  }
  const xref = out.length
  out += `xref\n0 ${objs.length}\n0000000000 65535 f \n`
  for (let i = 1; i < objs.length; i++) out += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`
  out += `trailer\n<< /Size ${objs.length} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`
  return new Blob([out], { type: 'application/pdf' })
}

/** Word opens HTML documents saved with the msword MIME type. */
export function buildWordDoc(pages: DocPage[], title: string): Blob {
  const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;')
  const body = pages
    .map((p) =>
      p.blocks
        .map((b) => {
          if (b.type === 'h') return p.cover ? `<h1>${esc(b.text)}</h1>` : `<h2>${esc(b.text)}</h2>`
          if (b.type === 'p') return `<p>${esc(b.text)}</p>`
          if (b.type === 'note') return `<p><i>${esc(b.text)}</i></p>`
          if (b.type === 'list') return `<ul>${b.items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>`
          return `<p><b>${esc(b.label)}.</b> ${esc(b.text)}${b.points ? ` <i>(${b.points} pts)</i>` : ''}</p>`
        })
        .join(''),
    )
    .join('<br style="page-break-before:always" />')
  const html = `<html><head><meta charset="utf-8"><title>${esc(title)}</title></head><body style="font-family:Calibri,sans-serif">${body}</body></html>`
  return new Blob(['\ufeff', html], { type: 'application/msword' })
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export const fileSlug = (l: Lecture) =>
  `${l.module}_${ascii(l.title)
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_|_$/g, '')
    .slice(0, 48)}`

export interface Chapter {
  at: number
  title: string
  bullets: string[]
}

export function buildChapters(l: Lecture): Chapter[] {
  const d = l.duration ?? 3600
  const topic = l.title.replace(/^TD \d+ — /, '')
  const defs: [number, string, string[]][] =
    l.category === 'TD'
      ? [
          [0, 'Session overview', ['Objectives of today’s directed work', 'Method reminders', 'How the correction is organised']],
          [0.14, 'Exercise 1 — correction', ['Reading the question carefully', 'Expected definitions', 'Common mistakes observed']],
          [0.42, 'Exercise 2 — correction', ['Applying the framework step by step', 'Structuring a two-part answer', 'Model answer walkthrough']],
          [0.72, 'Exercise 3 — guided practice', ['Work in pairs for 10 minutes', 'Peer review using the marking grid', 'Collective debrief']],
          [0.9, 'Wrap-up & homework', ['Key points to retain', 'Preparation for next TD', 'Office hours and forum']],
        ]
      : [
          [0, 'Introduction & learning objectives', [`Why ${topic.split(':')[0]} matters`, 'Course outline and assessment', 'Required readings for this week']],
          [0.12, 'Key concepts and definitions', ['Core vocabulary of the module', 'Distinguishing related notions', 'Common misconceptions']],
          [0.33, 'Theoretical framework', ['Founding authors and texts', 'Main assumptions of the model', 'Strengths and blind spots']],
          [0.58, 'Case studies & applications', ['Worked example from recent research', 'Comparing two contexts', 'What the evidence shows']],
          [0.82, 'Synthesis & exam tips', ['Five points to remember', 'How this topic is examined', 'Link to the next lecture']],
        ]
  return defs.map(([p, title, bullets]) => ({ at: Math.round(p * d), title, bullets }))
}

export const CAPTIONS = [
  'So let us start by recalling where we left off last week.',
  'The key distinction here is between the concept and its measurement.',
  'Write this definition down — it comes up in nearly every exam.',
  'Notice how the second author responds directly to the first.',
  'If we apply this to the case study, three things become clear.',
  'This is exactly the kind of example you can reuse in your essays.',
  'Let us pause and check that this step is clear before moving on.',
  'In the TD session you will practise this with real material.',
]
