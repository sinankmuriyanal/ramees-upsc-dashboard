'use client'

import { BookOpen, Target, CheckSquare, Brain } from 'lucide-react'
import type { KPIs } from '@/lib/types'

const TOTAL_SUBJECTS = 15
const TOTAL_TOPICS = 272
const TOTAL_SUBTOPICS = 1872

interface CardProps {
  icon: React.ReactNode
  label: string
  value: number
  total?: number
  suffix?: string
  color: string
}

function KPICard({ icon, label, value, total, suffix, color }: CardProps) {
  const pct = total ? Math.round((value / total) * 100) : null

  return (
    <div className="relative z-10 bg-surface border border-border rounded-lg p-4 flex flex-col gap-3 shadow-sm">
      <div className="flex items-start justify-between">
        <div className={`p-2 rounded-md ${color}`}>
          {icon}
        </div>
        {pct !== null && (
          <span className="text-xs font-mono text-muted">{pct}%</span>
        )}
      </div>

      <div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-3xl font-mono font-semibold text-text leading-none">
            {value.toLocaleString()}
          </span>
          {total && (
            <span className="text-sm text-muted font-mono">/ {total.toLocaleString()}</span>
          )}
          {suffix && (
            <span className="text-sm text-muted font-mono">{suffix}</span>
          )}
        </div>
        <div className="text-xs text-muted mt-1 font-body tracking-wide">{label}</div>
      </div>

      {pct !== null && (
        <div className="h-1.5 bg-border rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${pct}%`, backgroundColor: 'var(--gold-accent)' }}
          />
        </div>
      )}
    </div>
  )
}

export default function KPICards({ kpis }: { kpis: KPIs }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <KPICard
        icon={<BookOpen size={16} className="text-amber-700" />}
        label="Subjects Completed"
        value={kpis.subjectsCovered}
        total={TOTAL_SUBJECTS}
        color="bg-amber-50"
      />
      <KPICard
        icon={<Target size={16} className="text-blue-700" />}
        label="Topics Completed"
        value={kpis.topicsCovered}
        total={TOTAL_TOPICS}
        color="bg-blue-50"
      />
      <KPICard
        icon={<CheckSquare size={16} className="text-green-700" />}
        label="Subtopics Completed"
        value={kpis.subtopicsDone}
        total={TOTAL_SUBTOPICS}
        color="bg-green-50"
      />
      <KPICard
        icon={<Brain size={16} className="text-purple-700" />}
        label="MCQs Studied"
        value={kpis.mcqsStudied}
        color="bg-purple-50"
      />
    </div>
  )
}
