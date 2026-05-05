'use client'

import { formatDistanceToNow } from 'date-fns'
import type { TopicEntry } from '@/lib/types'

interface Props {
  topics: TopicEntry[]
}

const SUBJECT_COLORS: Record<string, { bg: string; text: string }> = {
  'Ancient History':         { bg: '#fef3c7', text: '#92400e' },
  'Medieval History':        { bg: '#fde8d0', text: '#7c2d12' },
  'Modern History':          { bg: '#fce7f3', text: '#831843' },
  'Art & Culture':           { bg: '#f3e8ff', text: '#6b21a8' },
  'World History':           { bg: '#ede9fe', text: '#4c1d95' },
  'Geography':               { bg: '#dcfce7', text: '#14532d' },
  'Polity':                  { bg: '#d1fae5', text: '#064e3b' },
  'International Relations': { bg: '#cffafe', text: '#164e63' },
  'Economy':                 { bg: '#dbeafe', text: '#1e3a8a' },
  'Social Issues':           { bg: '#e0e7ff', text: '#312e81' },
  'Science & Technology':    { bg: '#f0fdf4', text: '#166534' },
  'Environment':             { bg: '#ecfdf5', text: '#065f46' },
  'Ethics':                  { bg: '#fdf4ff', text: '#701a75' },
  'Security':                { bg: '#fff1f2', text: '#881337' },
  'Disaster Management':     { bg: '#fff7ed', text: '#7c2d12' },
}

const DEFAULT_COLOR = { bg: '#f1f5f9', text: '#334155' }

function StageIndicator({ done, total, label, color }: { done: number; total: number; label: string; color: string }) {
  const active = done > 0
  return (
    <div className={`flex flex-col items-center gap-0.5 ${active ? '' : 'opacity-30'}`}>
      <div
        className="w-5 h-5 rounded flex items-center justify-center text-[9px] font-mono font-bold"
        style={{ backgroundColor: active ? color : '#e5e7eb', color: active ? '#fff' : '#9ca3af' }}
      >
        {label}
      </div>
      <span className="text-[8px] font-mono text-muted">{done}</span>
    </div>
  )
}

function TopicRow({ topic }: { topic: TopicEntry }) {
  const color = SUBJECT_COLORS[topic.subject] ?? DEFAULT_COLOR
  const pct = topic.completionPct
  const timeAgo = topic.lastActivity
    ? formatDistanceToNow(new Date(topic.lastActivity), { addSuffix: true })
    : null

  return (
    <div className="flex items-center gap-3 py-2.5 px-1 border-b border-border/50 last:border-0 hover:bg-surface-2/60 transition-colors group">
      {/* Subject badge */}
      <div
        className="shrink-0 px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold tracking-wide w-[88px] text-center leading-tight"
        style={{ backgroundColor: color.bg, color: color.text }}
      >
        {topic.subject.replace(' History', ' Hist').replace('International Relations', 'Intl Rel').replace('Science & Technology', 'Sci & Tech').replace('Disaster Management', 'Disaster')}
      </div>

      {/* Topic name */}
      <div className="flex-1 min-w-0">
        <div className="text-xs font-body text-text truncate leading-snug">{topic.topic}</div>
        {timeAgo && (
          <div className="text-[9px] font-mono text-dim mt-0.5">{timeAgo}</div>
        )}
      </div>

      {/* Stage indicators */}
      <div className="flex items-center gap-1 shrink-0">
        <StageIndicator done={topic.videoCount} total={topic.subtopicsTotal} label="V" color="#d97706" />
        <StageIndicator done={topic.readingCount} total={topic.subtopicsTotal} label="R" color="#2563eb" />
        <StageIndicator done={topic.noteCount} total={topic.subtopicsTotal} label="N" color="#16a34a" />
        <StageIndicator done={topic.summaryCount} total={topic.subtopicsTotal} label="S" color="#9333ea" />
      </div>

      {/* MCQ count */}
      <div className="shrink-0 w-12 text-right">
        {topic.mcqStudy > 0 ? (
          <div className="text-[10px] font-mono font-semibold" style={{ color: '#7c3aed' }}>
            {topic.mcqStudy} <span className="text-dim font-normal">MCQ</span>
          </div>
        ) : (
          <div className="text-[10px] font-mono text-dim">—</div>
        )}
      </div>

      {/* Progress bar + pct */}
      <div className="shrink-0 w-20 flex flex-col gap-0.5">
        <div className="flex justify-between text-[9px] font-mono text-muted">
          <span>{topic.subtopicsDone}/{topic.subtopicsTotal}</span>
          <span className="font-semibold" style={{ color: pct === 100 ? '#16a34a' : 'var(--gold)' }}>{pct}%</span>
        </div>
        <div className="h-1.5 bg-border rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${pct}%`,
              backgroundColor: pct === 100 ? '#16a34a' : pct >= 50 ? 'var(--gold-accent)' : '#f59e0b',
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default function TopicAnalysis({ topics }: Props) {
  if (topics.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-muted text-sm font-mono">
        No topic progress yet — start studying!
      </div>
    )
  }

  return (
    <div>
      {/* Column headers */}
      <div className="flex items-center gap-3 px-1 pb-2 border-b border-border">
        <div className="w-[88px] shrink-0 text-[9px] font-mono text-dim uppercase tracking-widest">Subject</div>
        <div className="flex-1 text-[9px] font-mono text-dim uppercase tracking-widest">Topic</div>
        <div className="flex items-center gap-1 shrink-0 text-[9px] font-mono text-dim uppercase tracking-widest">Stages</div>
        <div className="w-12 shrink-0 text-[9px] font-mono text-dim uppercase tracking-widest text-right">MCQ</div>
        <div className="w-20 shrink-0 text-[9px] font-mono text-dim uppercase tracking-widest">Progress</div>
      </div>

      {/* Scrollable rows */}
      <div className="overflow-y-auto max-h-[480px] pr-1">
        {topics.map((t, i) => (
          <TopicRow key={`${t.subject}|${t.topic}|${i}`} topic={t} />
        ))}
      </div>

      <div className="mt-2 text-[10px] font-mono text-dim text-right">
        {topics.length} topics with progress · sorted by most recent activity
      </div>
    </div>
  )
}
