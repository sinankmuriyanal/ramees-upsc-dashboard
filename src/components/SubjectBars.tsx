'use client'

import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell
} from 'recharts'
import type { SubjectProgress } from '@/lib/types'

interface Props {
  subjects: SubjectProgress[]
}

const SUBJECT_COLORS: Record<string, string> = {
  'Ancient History': '#e8b84b',
  'Medieval History': '#d4a843',
  'Modern History': '#c89830',
  'Art & Culture': '#b8860b',
  'World History': '#a07820',
  'Geography': '#4ade80',
  'Polity': '#34d399',
  'International Relations': '#2dd4bf',
  'Economy': '#60a5fa',
  'Social Issues': '#818cf8',
  'Science & Technology': '#a78bfa',
  'Environment': '#34d399',
  'Ethics': '#f472b6',
  'Security': '#fb923c',
  'Disaster Management': '#f87171',
}

const DEFAULT_COLOR = '#4a6080'

function CustomTooltip({ active, payload }: { active?: boolean; payload?: { payload: SubjectProgress }[] }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="bg-surface border border-border rounded px-3 py-2 text-xs font-mono shadow-xl">
      <div className="text-text font-semibold mb-1">{d.subject}</div>
      <div className="text-gold">{d.completed} / {d.total} subtopics</div>
      <div className="text-muted">{d.pct}% complete</div>
    </div>
  )
}

export default function SubjectBars({ subjects }: Props) {
  const sorted = [...subjects].sort((a, b) => b.pct - a.pct)

  return (
    <ResponsiveContainer width="100%" height={sorted.length * 36 + 20}>
      <BarChart
        data={sorted}
        layout="vertical"
        margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
        barCategoryGap="30%"
      >
        <XAxis
          type="number"
          domain={[0, 100]}
          tickFormatter={v => `${v}%`}
          tick={{ fill: '#9a8878', fontSize: 10, fontFamily: 'var(--font-mono)' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          type="category"
          dataKey="subject"
          width={148}
          tick={{ fill: '#5a4838', fontSize: 11, fontFamily: 'var(--font-body)' }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
        <Bar dataKey="pct" radius={[0, 3, 3, 0]} background={{ fill: '#ede8df', radius: 3 }}>
          {sorted.map((entry) => (
            <Cell
              key={entry.subject}
              fill={SUBJECT_COLORS[entry.subject] ?? DEFAULT_COLOR}
              fillOpacity={entry.pct === 0 ? 0.3 : 1}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
