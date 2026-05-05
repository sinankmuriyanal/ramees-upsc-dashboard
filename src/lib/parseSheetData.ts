import type { RawSheetData, DashboardData, SubjectProgress, TopicEntry, SubtopicDisplayRow } from './types'

export function parseSheetData(raw: RawSheetData): DashboardData {
  const subjectMap = new Map<string, SubjectProgress>()
  const topicMap = new Map<string, TopicEntry>()

  for (const row of raw.subtopics) {
    const { subject, topic } = row
    if (!subject) continue

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

  for (const mcqRow of raw.topicsMCQ ?? []) {
    const t = topicMap.get(`${mcqRow.subject}||${mcqRow.topic}`)
    if (t) t.mcqStudy += mcqRow.mcqStudy ?? 0
  }

  // ── Build recency maps ────────────────────────────────────────
  // Per topic
  const topicLastActivity = new Map<string, string>()
  // Per subtopic
  const subtopicLastActivity = new Map<string, string>()

  for (const entry of raw.activity ?? []) {
    if (!entry.date) continue
    const topicKey = `${entry.subject}||${entry.topic}`
    const existing = topicLastActivity.get(topicKey)
    if (!existing || entry.date > existing) topicLastActivity.set(topicKey, entry.date)

    if (entry.subtopic) {
      const subKey = `${entry.subject}||${entry.topic}||${entry.subtopic}`
      const existingSub = subtopicLastActivity.get(subKey)
      if (!existingSub || entry.date > existingSub) subtopicLastActivity.set(subKey, entry.date)
    }
  }

  for (const [key, t] of topicMap.entries()) {
    t.completionPct = t.subtopicsTotal > 0 ? Math.round((t.subtopicsDone / t.subtopicsTotal) * 100) : 0
    t.lastActivity = topicLastActivity.get(key) ?? null
  }

  for (const s of subjectMap.values()) {
    s.pct = s.total > 0 ? Math.round((s.completed / s.total) * 100) : 0
  }

  const subjects = Array.from(subjectMap.values()).sort((a, b) => b.pct - a.pct)

  const topics = Array.from(topicMap.values())
    .filter(t => t.subtopicsDone > 0 || t.videoCount > 0)
    .sort((a, b) => {
      if (a.lastActivity && b.lastActivity) return b.lastActivity.localeCompare(a.lastActivity)
      if (a.lastActivity) return -1
      if (b.lastActivity) return 1
      return b.completionPct - a.completionPct
    })

  // ── Subtopic display rows ─────────────────────────────────────
  // Only rows with any stage done, sorted by recency then by completion
  const subtopicRows: SubtopicDisplayRow[] = raw.subtopics
    .filter(r => r.subject && r.topic && r.subtopic && (r.video || r.reading || r.note || r.summary || r.completion > 0))
    .map(r => ({
      subject: r.subject,
      topic: r.topic,
      subtopic: r.subtopic,
      video: r.video,
      reading: r.reading,
      note: r.note,
      summary: r.summary,
      completion: r.completion,
      lastActivity: subtopicLastActivity.get(`${r.subject}||${r.topic}||${r.subtopic}`) ?? null,
    }))
    .sort((a, b) => {
      if (a.lastActivity && b.lastActivity) return b.lastActivity.localeCompare(a.lastActivity)
      if (a.lastActivity) return -1
      if (b.lastActivity) return 1
      // Fallback: more stages done = higher
      const stagesA = +a.video + +a.reading + +a.note + +a.summary
      const stagesB = +b.video + +b.reading + +b.note + +b.summary
      return stagesB - stagesA
    })

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
    subtopicRows,
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
