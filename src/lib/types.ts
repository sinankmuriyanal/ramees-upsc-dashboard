export interface SubtopicRow {
  slNo: number
  subject: string
  topic: string
  subtopic: string
  video: boolean
  reading: boolean
  note: boolean
  summary: boolean
  completion: number
}

export interface TopicMCQRow {
  subject: string
  topic: string
  mcqStudy: number
  mcqPractice: number
}

export interface ActivityEntry {
  date: string
  subject: string
  topic: string
  subtopic: string
  action: string
}

export interface RawSheetData {
  subtopics: SubtopicRow[]
  topicsMCQ: TopicMCQRow[]
  activity: ActivityEntry[]
}

export interface SubjectProgress {
  subject: string
  completed: number
  total: number
  pct: number
  videoCount: number
  readingCount: number
  noteCount: number
  summaryCount: number
}

export interface TopicEntry {
  subject: string
  topic: string
  subtopicsDone: number
  subtopicsTotal: number
  completionPct: number
  videoCount: number
  readingCount: number
  noteCount: number
  summaryCount: number
  mcqStudy: number
  lastActivity: string | null
}

export interface KPIs {
  subjectsCovered: number
  topicsCovered: number
  subtopicsDone: number
  mcqsStudied: number
}

export interface SubtopicDisplayRow {
  subject: string
  topic: string
  subtopic: string
  video: boolean
  reading: boolean
  note: boolean
  summary: boolean
  completion: number
  lastActivity: string | null
}

export interface DashboardData {
  totalSubtopics: number
  completedSubtopics: number
  overallPct: number
  subjects: SubjectProgress[]
  topics: TopicEntry[]
  subtopicRows: SubtopicDisplayRow[]
  kpis: KPIs
  activityByDay: Record<string, number>
  lastSynced: string | null
}
