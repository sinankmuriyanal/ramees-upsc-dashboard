import type { DashboardData } from './types'
import { subDays, format } from 'date-fns'

const today = new Date()

const TOPIC_DATA = [
  { subject: 'Ancient History', topic: 'Pre Historic Cultures in India', done: 9, total: 9, v: 9, r: 9, n: 7, s: 5, mcq: 15, daysAgo: 1 },
  { subject: 'Ancient History', topic: 'Pastoral & Farming Communities', done: 5, total: 6, v: 5, r: 5, n: 4, s: 3, mcq: 12, daysAgo: 3 },
  { subject: 'Ancient History', topic: 'Indus Valley Civilization', done: 8, total: 10, v: 8, r: 7, n: 6, s: 4, mcq: 15, daysAgo: 5 },
  { subject: 'Medieval History', topic: 'The Delhi Sultanate', done: 7, total: 12, v: 7, r: 6, n: 5, s: 3, mcq: 10, daysAgo: 7 },
  { subject: 'Medieval History', topic: 'The Mughal Empire', done: 6, total: 14, v: 6, r: 5, n: 4, s: 2, mcq: 8, daysAgo: 9 },
  { subject: 'Ancient History', topic: 'Vedic Society', done: 4, total: 8, v: 4, r: 3, n: 2, s: 1, mcq: 5, daysAgo: 10 },
  { subject: 'Modern History', topic: 'British Conquest of India', done: 5, total: 10, v: 5, r: 4, n: 3, s: 1, mcq: 6, daysAgo: 12 },
  { subject: 'Medieval History', topic: 'Bhakti & Sufi Movements', done: 4, total: 8, v: 4, r: 4, n: 3, s: 2, mcq: 7, daysAgo: 14 },
  { subject: 'Modern History', topic: 'Revolt of 1857', done: 3, total: 7, v: 3, r: 3, n: 2, s: 1, mcq: 4, daysAgo: 17 },
  { subject: 'Ancient History', topic: 'The Mauryan Empire', done: 6, total: 11, v: 6, r: 5, n: 3, s: 2, mcq: 9, daysAgo: 19 },
  { subject: 'Geography', topic: 'Physical Features of India', done: 4, total: 9, v: 4, r: 3, n: 2, s: 1, mcq: 3, daysAgo: 22 },
  { subject: 'Modern History', topic: 'Indian National Congress', done: 2, total: 8, v: 2, r: 2, n: 1, s: 0, mcq: 2, daysAgo: 25 },
  { subject: 'World History', topic: 'French Revolution', done: 3, total: 6, v: 3, r: 2, n: 1, s: 0, mcq: 4, daysAgo: 28 },
  { subject: 'Art & Culture', topic: 'Architecture — Ancient', done: 3, total: 10, v: 3, r: 2, n: 1, s: 0, mcq: 0, daysAgo: 31 },
  { subject: 'International Relations', topic: 'India–China Relations', done: 2, total: 7, v: 2, r: 1, n: 0, s: 0, mcq: 0, daysAgo: 35 },
]

const SUBJECT_TOTALS: Record<string, { total: number }> = {
  'Ancient History': { total: 110 },
  'Medieval History': { total: 185 },
  'Modern History': { total: 165 },
  'Art & Culture': { total: 180 },
  'World History': { total: 110 },
  'Geography': { total: 200 },
  'Polity': { total: 170 },
  'International Relations': { total: 100 },
  'Economy': { total: 200 },
  'Social Issues': { total: 100 },
  'Science & Technology': { total: 310 },
  'Environment': { total: 260 },
  'Ethics': { total: 120 },
  'Security': { total: 180 },
  'Disaster Management': { total: 35 },
}

function buildMockSubjects() {
  const subjectCompletions: Record<string, { done: number; v: number; r: number; n: number; s: number }> = {}
  for (const t of TOPIC_DATA) {
    if (!subjectCompletions[t.subject]) subjectCompletions[t.subject] = { done: 0, v: 0, r: 0, n: 0, s: 0 }
    subjectCompletions[t.subject].done += t.done
    subjectCompletions[t.subject].v += t.v
    subjectCompletions[t.subject].r += t.r
    subjectCompletions[t.subject].n += t.n
    subjectCompletions[t.subject].s += t.s
  }

  return Object.entries(SUBJECT_TOTALS).map(([name, { total }]) => {
    const c = subjectCompletions[name] ?? { done: 0, v: 0, r: 0, n: 0, s: 0 }
    return {
      subject: name,
      completed: c.done,
      total,
      pct: Math.round((c.done / total) * 100),
      videoCount: c.v,
      readingCount: c.r,
      noteCount: c.n,
      summaryCount: c.s,
    }
  }).sort((a, b) => b.pct - a.pct)
}

function buildActivityDays(): Record<string, number> {
  const days: Record<string, number> = {}
  const pattern = [5, 8, 0, 12, 6, 0, 0, 9, 7, 4, 0, 11, 8, 0, 0, 6, 5, 3, 0, 10, 7, 0, 0, 8, 9, 5, 0, 0, 6, 4]
  for (let i = 0; i < 90; i++) {
    const count = pattern[i % pattern.length]
    if (count > 0) days[format(subDays(today, 89 - i), 'yyyy-MM-dd')] = count
  }
  return days
}

const subjects = buildMockSubjects()
const totalSubtopics = subjects.reduce((s, x) => s + x.total, 0)
const completedSubtopics = subjects.reduce((s, x) => s + x.completed, 0)

export const MOCK_DATA: DashboardData = {
  totalSubtopics,
  completedSubtopics,
  overallPct: Math.round((completedSubtopics / totalSubtopics) * 100),
  subjects,
  topics: TOPIC_DATA.map(t => ({
    subject: t.subject,
    topic: t.topic,
    subtopicsDone: t.done,
    subtopicsTotal: t.total,
    completionPct: Math.round((t.done / t.total) * 100),
    videoCount: t.v,
    readingCount: t.r,
    noteCount: t.n,
    summaryCount: t.s,
    mcqStudy: t.mcq,
    lastActivity: format(subDays(today, t.daysAgo), 'yyyy-MM-dd'),
  })),
  subtopicRows: TOPIC_DATA.flatMap((t, ti) =>
    Array.from({ length: Math.min(t.done + 2, t.total) }, (_, si) => {
      const stages = si < t.done
      return {
        subject: t.subject,
        topic: t.topic,
        subtopic: `Subtopic ${si + 1}`,
        video: stages || si < t.v,
        reading: stages || si < t.r,
        note: stages || si < t.n,
        summary: stages || si < t.s,
        completion: si < t.done ? 1 : 0,
        lastActivity: si === 0 ? format(subDays(today, t.daysAgo), 'yyyy-MM-dd') : null,
      }
    })
  ).sort((a, b) => {
    if (a.lastActivity && b.lastActivity) return b.lastActivity.localeCompare(a.lastActivity)
    if (a.lastActivity) return -1
    if (b.lastActivity) return 1
    return 0
  }),
  kpis: {
    subjectsCovered: subjects.filter(s => s.total > 0 && s.completed === s.total).length,
    topicsCovered: TOPIC_DATA.filter(t => t.done === t.total).length,
    subtopicsDone: completedSubtopics,
    mcqsStudied: TOPIC_DATA.reduce((s, t) => s + t.mcq, 0),
  },
  activityByDay: buildActivityDays(),
  lastSynced: null,
}
