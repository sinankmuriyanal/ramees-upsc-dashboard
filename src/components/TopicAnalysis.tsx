'use client'

import { formatDistanceToNow } from 'date-fns'
import type { SubtopicDisplayRow } from '@/lib/types'

interface Props {
  rows: SubtopicDisplayRow[]
}

const STAGES = [
  { key: 'video'   as const, label: 'V', color: '#d97706', bg: '#fef3c7' },
  { key: 'reading' as const, label: 'R', color: '#2563eb', bg: '#dbeafe' },
  { key: 'note'    as const, label: 'N', color: '#16a34a', bg: '#dcfce7' },
  { key: 'summary' as const, label: 'S', color: '#9333ea', bg: '#f3e8ff' },
]

function StageChip({ done, label, color, bg }: { done: boolean; label: string; color: string; bg: string }) {
  return (
    <div
      className="w-5 h-5 rounded flex items-center justify-center text-[9px] font-mono font-bold shrink-0"
      style={done ? { backgroundColor: bg, color } : { backgroundColor: '#f1f5f9', color: '#cbd5e1' }}
      title={label}
    >
      {label}
    </div>
  )
}

function SubtopicRow({ row }: { row: SubtopicDisplayRow }) {
  const stagesDone = +row.video + +row.reading + +row.note + +row.summary
  const stagePct   = Math.round((stagesDone / 4) * 100)
  const isComplete = row.completion >= 1 || stagesDone === 4
  const timeAgo    = row.lastActivity
    ? formatDistanceToNow(new Date(row.lastActivity), { addSuffix: true })
    : null

  return (
    <div className="flex items-center gap-2 sm:gap-3 py-2.5 px-1 border-b border-border/40 last:border-0 hover:bg-surface-2/60 transition-colors">

      {/* Subtopic name + recency */}
      <div className="flex-1 min-w-0">
        <div className="text-xs sm:text-sm font-body text-text font-medium leading-snug line-clamp-2 sm:truncate">
          {row.subtopic}
        </div>
        {timeAgo && (
          <div className="text-[9px] font-mono text-dim mt-0.5 hidden sm:block">{timeAgo}</div>
        )}
      </div>

      {/* Stage chips */}
      <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
        {STAGES.map(s => (
          <StageChip key={s.key} done={row[s.key]} label={s.label} color={s.color} bg={s.bg} />
        ))}
      </div>

      {/* Progress bar + pct */}
      <div className="shrink-0 w-12 sm:w-16">
        <div className="flex justify-between text-[9px] font-mono text-muted mb-0.5">
          <span className="hidden sm:inline">{stagesDone}/4</span>
          <span
            className="font-semibold ml-auto"
            style={{ color: isComplete ? '#16a34a' : stagePct > 0 ? '#c8930a' : '#b5a892' }}
          >
            {stagePct}%
          </span>
        </div>
        <div className="h-1.5 bg-border rounded-full overflow-hidden">
          <div
            className="h-full rounded-full"
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
      <div className="flex items-center justify-center h-28 text-muted text-sm font-mono">
        No progress yet — start studying!
      </div>
    )
  }

  return (
    <div>
      {/* Column headers */}
      <div className="flex items-center gap-2 sm:gap-3 px-1 pb-2 border-b border-border">
        <div className="flex-1 text-[9px] font-mono text-dim uppercase tracking-widest">Subtopic</div>
        <div className="shrink-0 text-[9px] font-mono text-dim uppercase tracking-widest">Stages</div>
        <div className="w-12 sm:w-16 shrink-0 text-[9px] font-mono text-dim uppercase tracking-widest text-right">Done</div>
      </div>

      {/* Rows */}
      <div className="overflow-y-auto max-h-[480px]">
        {rows.map((r, i) => (
          <SubtopicRow key={`${r.subtopic}|${i}`} row={r} />
        ))}
      </div>

      <div className="mt-2 text-[10px] font-mono text-dim text-right">
        {rows.length} subtopics with progress · most recently studied on top
      </div>
    </div>
  )
}
