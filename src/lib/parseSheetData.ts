import type { RawSheetData, DashboardData, SubjectProgress, TopicEntry } from './types'

export function parseSheetData(raw: RawSheetData): DashboardData {
  // ── Subject map ──────────────────────────────────────────────
  const subjectMap = new Map<string, SubjectProgress>()

  // ── Topic map ────────────────────────────────────────────────
  const topicMap = new Map<string, TopicEntry>()

  for (const row of raw.subtopics) {
    const { subject, topic } = row
    if (!subject) continue

    // Subject aggregation
    if (!subjectMap.has(subject)) {
      subjectMap.set(subject, { subject, completed: 0, total: 0, pct: 0, videoCount: 0, readingCount: 0, noteCount: 0, summaryCount: 0 })
    }
    const s = subjectMap.get(subject)!
    s.total += 1
    const done = row.completion >= 1 || (row.video && row.reading && row.note && row.summary)
    if (done) s.completed += 1
    if (row.video) s.videoCount += 1
    if (row.reading) s.readingCount += 1
    if (row.note) s.noteCount += 1
    if (row.summary) s.summaryCount += 1

    // Topic aggregation
    if (!topic) continue
    const key = `${subject}||${topic}`
    if (!topicMap.has(key)) {
      topicMap.set(key, { subject, topic, subtopicsDone: 0, subtopicsTotal: 0, completionPct: 0, videoCount: 0, readingCount: 0, noteCount: 0, summaryCount: 0, mcqStudy: 0, lastActivity: null })
    }
    const t = topicMap.get(key)!
    t.subtopicsTotal += 1
    if (done) t.subtopicsDone += 1
    if (row.video) t.videoCount += 1
    if (row.reading) t.readingCount += 1
    if (row.note) t.noteCount += 1
    if (row.summary) t.summaryCount += 1
  }

  // ── Merge MCQ data ───────────────────────────────────────────
  for (const mcqRow of raw.topicsMCQ ?? []) {
    const key = `${mcqRow.subject}||${mcqRow.topic}`
    const t = topicMap.get(key)
    if (t) t.mcqStudy += mcqRow.mcqStudy ?? 0
  }

  // ── Build activity recency per topic ─────────────────────────
  const topicLastActivity = new Map<string, string>()
  for (const entry of raw.activity ?? []) {
    if (!entry.date || !entry.topic) continue
    const key = `${entry.subject}||${entry.topic}`
    const existing = topicLastActivity.get(key)
    if (!existing || entry.date > existing) topicLastActivity.set(key, entry.date)
  }

  // Attach recency and compute pct
  for (const [key, t] of topicMap.entries()) {
    t.completionPct = t.subtopicsTotal > 0 ? Math.round((t.subtopicsDone / t.subtopicsTotal) * 100) : 0
    t.lastActivity = topicLastActivity.get(key) ?? null
  }

  // ── Subject pcts ─────────────────────────────────────────────
  for (const s of subjectMap.values()) {
    s.pct = s.total > 0 ? Math.round((s.completed / s.total) * 100) : 0
  }

  const subjects = Array.from(subjectMap.values()).sort((a, b) => b.pct - a.pct)

  // ── Topics: only those with progress, sorted by recency ──────
  const topics = Array.from(topicMap.values())
    .filter(t => t.subtopicsDone > 0 || t.videoCount > 0)
    .sort((a, b) => {
      if (a.lastActivity && b.lastActivity) return b.lastActivity.localeCompare(a.lastActivity)
      if (a.lastActivity) return -1
      if (b.lastActivity) return 1
      return b.completionPct - a.completionPct
    })

  // ── Activity by day ───────────────────────────────────────────
  const activityByDay: Record<string, number> = {}
  for (const entry of raw.activity ?? []) {
    if (!entry.date) continue
    const day = entry.date.slice(0, 10)
    activityByDay[day] = (activityByDay[day] ?? 0) + 1
  }

  const totalSubtopics = subjects.reduce((s, x) => s + x.total, 0)
  const completedSubtopics = subjects.reduce((s, x) => s + x.completed, 0)
  const mcqsStudied = Array.from(topicMap.values()).reduce((s, t) => s + t.mcqStudy, 0)

  return {
    totalSubtopics,
    completedSubtopics,
    overallPct: totalSubtopics > 0 ? Math.round((completedSubtopics / totalSubtopics) * 100) : 0,
    subjects,
    topics,
    kpis: {
      subjectsCovered: subjects.filter(s => s.completed > 0).length,
      topicsCovered: Array.from(topicMap.values()).filter(t => t.subtopicsDone > 0).length,
      subtopicsDone: completedSubtopics,
      mcqsStudied,
    },
    activityByDay,
    lastSynced: new Date().toISOString(),
  }
}
