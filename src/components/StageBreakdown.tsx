'use client'

import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Legend
} from 'recharts'
import type { SubjectProgress } from '@/lib/types'

interface Props {
  subjects: SubjectProgress[]
}

const STAGES = [
  { key: 'videoCount', label: 'Video', color: '#e8b84b' },
  { key: 'readingCount', label: 'Reading', color: '#60a5fa' },
  { key: 'noteCount', label: 'Notes', color: '#4ade80' },
  { key: 'summaryCount', label: 'Summary', color: '#f472b6' },
] as const

const SHORT_NAMES: Record<string, string> = {
  'Ancient History': 'Anc. Hist',
  'Medieval History': 'Med. Hist',
  'Modern History': 'Mod. Hist',
  'Art & Culture': 'Art & Cul',
  'World History': 'World Hist',
  'Geography': 'Geo',
  'Polity': 'Polity',
  'International Relations': 'Intl Rel',
  'Economy': 'Economy',
  'Social Issues': 'Soc. Issues',
  'Science & Technology': 'Sci & Tech',
  'Environment': 'Environ',
  'Ethics': 'Ethics',
  'Security': 'Security',
  'Disaster Management': 'Disaster',
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-surface border border-border rounded px-3 py-2 text-xs font-mono shadow-xl">
      <div className="text-text font-semibold mb-1">{label}</div>
      {payload.map(p => (
        <div key={p.name} style={{ color: p.color }}>{p.name}: {p.value}</div>
      ))}
    </div>
  )
}

function CustomLegend() {
  return (
    <div className="flex items-center justify-center gap-5 mt-2">
      {STAGES.map(s => (
        <div key={s.key} className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: s.color }} />
          <span className="text-xs text-muted font-mono">{s.label}</span>
        </div>
      ))}
    </div>
  )
}

export default function StageBreakdown({ subjects }: Props) {
  const data = subjects
    .filter(s => s.videoCount + s.readingCount + s.noteCount + s.summaryCount > 0)
    .map(s => ({
      name: SHORT_NAMES[s.subject] ?? s.subject,
      Video: s.videoCount,
      Reading: s.readingCount,
      Notes: s.noteCount,
      Summary: s.summaryCount,
    }))

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-muted text-sm font-mono">
        No stage data yet — start studying!
      </div>
    )
  }

  return (
    <div>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }} barGap={1} barCategoryGap="25%">
          <XAxis
            dataKey="name"
            tick={{ fill: '#6a7d94', fontSize: 10, fontFamily: 'var(--font-body)' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#4a5f7a', fontSize: 10, fontFamily: 'var(--font-mono)' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
          {STAGES.map(s => (
            <Bar key={s.key} dataKey={s.label} fill={s.color} radius={[2, 2, 0, 0]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
      <CustomLegend />
    </div>
  )
}
