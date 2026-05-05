'use client'

import { subDays, format, eachDayOfInterval } from 'date-fns'

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

const DAY_ABBR = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function ActivityCalendar({ activityByDay }: Props) {
  const today = new Date()
  const days = eachDayOfInterval({ start: subDays(today, 29), end: today })

  const totalDays = Object.keys(activityByDay).length
  const totalActions = Object.values(activityByDay).reduce((s, v) => s + v, 0)

  return (
    <div>
      {/* 30-day grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(30, 1fr)', gap: 4 }}>
        {days.map(day => {
          const dateStr = format(day, 'yyyy-MM-dd')
          const count = activityByDay[dateStr] ?? 0
          const isToday = dateStr === format(today, 'yyyy-MM-dd')
          const dayNum = format(day, 'd')
          const dayName = DAY_ABBR[day.getDay()]

          return (
            <div
              key={dateStr}
              className="flex flex-col items-center gap-1"
              title={count > 0 ? `${dateStr}: ${count} ${count === 1 ? 'activity' : 'activities'}` : dateStr}
            >
              {/* Day name */}
              <span style={{
                fontSize: 8,
                fontFamily: 'var(--font-mono)',
                color: isToday ? 'var(--gold)' : 'var(--text-muted)',
                fontWeight: isToday ? 700 : 400,
                lineHeight: 1,
              }}>
                {dayName}
              </span>

              {/* Colour cell */}
              <div style={{
                aspectRatio: '1',
                width: '100%',
                borderRadius: 3,
                backgroundColor: getColor(count),
                border: count === 0
                  ? isToday ? '1.5px solid var(--gold-accent)' : '1px solid #d5ccc0'
                  : 'none',
                boxShadow: isToday ? '0 0 0 1.5px var(--gold-accent)' : 'none',
              }} />

              {/* Date number */}
              <span style={{
                fontSize: 8,
                fontFamily: 'var(--font-mono)',
                color: isToday ? 'var(--gold)' : 'var(--text-muted)',
                fontWeight: isToday ? 700 : 400,
                lineHeight: 1,
              }}>
                {dayNum}
              </span>
            </div>
          )
        })}
      </div>

      {/* Legend + stats */}
      <div className="flex items-center justify-between mt-4 flex-wrap gap-3">
        <div className="flex items-center gap-2 text-[10px] text-muted font-mono">
          <span>Less</span>
          {[0, 2, 5, 10, 15].map(v => (
            <div key={v} style={{ width: 11, height: 11, borderRadius: 2, flexShrink: 0, backgroundColor: getColor(v), border: v === 0 ? '1px solid #d5ccc0' : 'none' }} />
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
