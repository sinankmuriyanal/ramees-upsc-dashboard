'use client'

import { formatDistanceToNow } from 'date-fns'
import type { SubtopicDisplayRow } from '@/lib/types'

interface Props {
  rows: SubtopicDisplayRow[]
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

const SUBJECT_SHORT: Record<string, string> = {
  'Ancient History': 'Anc Hist', 'Medieval History': 'Med Hist', 'Modern History': 'Mod Hist',
  'Art & Culture': 'Art & Cul', 'World History': 'World Hist', 'Geography': 'Geography',
  'Polity': 'Polity', 'International Relations': 'Intl Rel', 'Economy': 'Economy',
  'Social Issues': 'Soc Issues', 'Science & Technology': 'Sci & Tech', 'Environment': 'Environ',
  'Ethics': 'Ethics', 'Security': 'Security', 'Disaster Management': 'Disaster',
}

const STAGES = [
  { key: 'video',   label: 'V', color: '#d97706', bg: '#fef3c7' },
  { key: 'reading', label: 'R', color: '#2563eb', bg: '#dbeafe' },
  { key: 'note',    label: 'N', color: '#16a34a', bg: '#dcfce7' },
  { key: 'summary', label: 'S', color: '#9333ea', bg: '#f3e8ff' },
] as const

function StageChip({ done, label, color, bg }: { done: boolean; label: string; color: string; bg: string }) {
  return (
    <div
      className="w-5 h-5 rounded flex items-center justify-center text-[9px] font-mono font-bold shrink-0"
      style={done ? { backgroundColor: bg, color } : { backgroundColor: '#f1f5f9', color: '#cbd5e1' }}
      title={done ? `${label}: done` : `${label}: not done`}
    >
      {label}
    </div>
  )
}

function SubtopicRow({ row }: { row: SubtopicDisplayRow }) {
  const color = SUBJECT_COLORS[row.subject] ?? DEFAULT_COLOR
  const stagesDone = +row.video + +row.reading + +row.note + +row.summary
  const stagePct = Math.round((stagesDone / 4) * 100)
  const isComplete = row.completion >= 1 || stagesDone === 4

  const timeAgo = row.lastActivity
    ? formatDistanceToNow(new Date(row.lastActivity), { addSuffix: true })
    : null

  return (
    <div className="flex items-start gap-2.5 py-2 px-1 border-b border-border/40 last:border-0 hover:bg-surface-2/70 transition-colors group">

      {/* Subject badge */}
      <div
        className="shrink-0 mt-0.5 px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold tracking-wide w-[76px] text-center leading-tight"
        style={{ backgroundColor: color.bg, color: color.text }}
      >
        {SUBJECT_SHORT[row.subject] ?? row.subject}
      </div>

      {/* Text block: topic / subtopic */}
      <div className="flex-1 min-w-0">
        <div className="text-[10px] font-mono text-muted truncate leading-none mb-0.5">
          {row.topic}
        </div>
        <div className="text-xs font-body text-text truncate leading-snug font-semibold">
          {row.subtopic}
        </div>
        {timeAgo && (
          <div className="text-[9px] font-mono text-dim mt-0.5">{timeAgo}</div>
        )}
      </div>

      {/* Stage chips */}
      <div className="flex items-center gap-1 shrink-0 mt-0.5">
        {STAGES.map(s => (
          <StageChip
            key={s.key}
            done={row[s.key]}
            label={s.label}
            color={s.color}
            bg={s.bg}
          />
        ))}
      </div>

      {/* Stage progress bar */}
      <div className="shrink-0 w-16 mt-1">
        <div className="flex justify-between text-[9px] font-mono text-muted mb-0.5">
          <span>{stagesDone}/4</span>
          <span
            className="font-semibold"
            style={{ color: isComplete ? '#16a34a' : stagePct > 0 ? '#c8930a' : '#b5a892' }}
          >
            {stagePct}%
          </span>
        </div>
        <div className="h-1.5 bg-border rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${stagePct}%`,
              backgroundColor: isComplete ? '#16a34a' : '#c8930a',
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default function TopicAnalysis({ rows }: Props) {
  if (rows.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-muted text-sm font-mono">
        No progress yet — start studying and tick the checkboxes!
      </div>
    )
  }

  return (
    <div>
      {/* Column headers */}
      <div className="flex items-center gap-2.5 px-1 pb-2 border-b border-border">
        <div className="w-[76px] shrink-0 text-[9px] font-mono text-dim uppercase tracking-widest">Subject</div>
        <div className="flex-1 text-[9px] font-mono text-dim uppercase tracking-widest">Topic › Subtopic</div>
        <div className="shrink-0 text-[9px] font-mono text-dim uppercase tracking-widest">Stages</div>
        <div className="w-16 shrink-0 text-[9px] font-mono text-dim uppercase tracking-widest">Progress</div>
      </div>

      {/* Scrollable list */}
      <div className="overflow-y-auto max-h-[520px] pr-0.5">
        {rows.map((r, i) => (
          <SubtopicRow key={`${r.subject}|${r.topic}|${r.subtopic}|${i}`} row={r} />
        ))}
      </div>

      <div className="mt-2 text-[10px] font-mono text-dim text-right">
        {rows.length} subtopics with progress · most recently studied on top
      </div>
    </div>
  )
}
