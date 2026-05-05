'use client'

import { subDays, format, startOfWeek, eachDayOfInterval } from 'date-fns'

interface Props {
  activityByDay: Record<string, number>
}

function getColor(count: number): string {
  if (count === 0) return '#ede8df'
  if (count <= 2) return '#fde68a'
  if (count <= 5) return '#f59e0b'
  if (count <= 10) return '#c8930a'
  return '#8b6210'
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', '']

export default function ActivityCalendar({ activityByDay }: Props) {
  const today = new Date()
  const startDate = startOfWeek(subDays(today, 364), { weekStartsOn: 0 })

  const allDays = eachDayOfInterval({ start: startDate, end: today })

  // Build weeks array
  const weeks: (Date | null)[][] = []
  let current: (Date | null)[] = []
  for (const day of allDays) {
    current.push(day)
    if (current.length === 7) { weeks.push(current); current = [] }
  }
  // Pad last week to 7
  if (current.length > 0) {
    while (current.length < 7) current.push(null)
    weeks.push(current)
  }

  // Month label: first week of each month
  const monthAt: Record<number, string> = {}
  let lastMonth = -1
  weeks.forEach((week, wi) => {
    const firstDay = week.find(d => d !== null) as Date | undefined
    if (!firstDay) return
    const m = firstDay.getMonth()
    if (m !== lastMonth) { monthAt[wi] = MONTHS[m]; lastMonth = m }
  })

  const totalDays = Object.keys(activityByDay).length
  const totalActions = Object.values(activityByDay).reduce((s, v) => s + v, 0)

  // CSS grid: 1 column for day labels + N columns for weeks, all equal width
  const gridCols = `20px repeat(${weeks.length}, 1fr)`

  return (
    <div>
      {/* Month labels row */}
      <div
        style={{ display: 'grid', gridTemplateColumns: gridCols, gap: '2px', marginBottom: '4px' }}
      >
        <div /> {/* spacer under day labels */}
        {weeks.map((week, wi) => (
          <div key={wi} style={{ fontSize: 9, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', lineHeight: 1, overflow: 'hidden' }}>
            {monthAt[wi] ?? ''}
          </div>
        ))}
      </div>

      {/* 7 day rows */}
      {Array.from({ length: 7 }).map((_, di) => (
        <div
          key={di}
          style={{
            display: 'grid',
            gridTemplateColumns: gridCols,
            gap: '2px',
            marginBottom: di < 6 ? '2px' : 0,
          }}
        >
          {/* Day label */}
          <div style={{
            fontSize: 9,
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-mono)',
            textAlign: 'right',
            lineHeight: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            paddingRight: 3,
          }}>
            {DAY_LABELS[di]}
          </div>

          {/* Week cells */}
          {weeks.map((week, wi) => {
            const day = week[di]
            if (!day) {
              return <div key={wi} style={{ aspectRatio: '1' }} />
            }
            const dateStr = format(day, 'yyyy-MM-dd')
            const count = activityByDay[dateStr] ?? 0
            const isFuture = day > today
            return (
              <div
                key={wi}
                title={count > 0 ? `${dateStr}: ${count} ${count === 1 ? 'activity' : 'activities'}` : dateStr}
                style={{
                  aspectRatio: '1',
                  borderRadius: 2,
                  backgroundColor: isFuture ? 'transparent' : getColor(count),
                  border: !isFuture && count === 0 ? '1px solid #d5ccc0' : 'none',
                  cursor: count > 0 ? 'pointer' : 'default',
                  minWidth: 0,
                }}
              />
            )
          })}
        </div>
      ))}

      {/* Legend + stats */}
      <div className="flex items-center justify-between mt-3 flex-wrap gap-3">
        <div className="flex items-center gap-2 text-[10px] text-muted font-mono">
          <span>Less</span>
          {[0, 2, 5, 10, 15].map(v => (
            <div key={v} style={{ width: 11, height: 11, borderRadius: 2, backgroundColor: getColor(v), border: v === 0 ? '1px solid #d5ccc0' : 'none', flexShrink: 0 }} />
          ))}
          <span>More</span>
        </div>
        <div className="flex items-center gap-4 text-[10px] font-mono">
          <span className="text-muted">{totalDays} <span className="text-text">active days</span></span>
          <span className="text-muted">{totalActions.toLocaleString()} <span className="text-text">total activities</span></span>
        </div>
      </div>
    </div>
  )
}
