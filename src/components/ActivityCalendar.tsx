'use client'

import { subDays, format, startOfWeek, addDays, eachDayOfInterval } from 'date-fns'

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

const DAY_HEADERS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function ActivityCalendar({ activityByDay }: Props) {
  const today = new Date()
  const todayStr = format(today, 'yyyy-MM-dd')

  // Start from Monday of the week that is 4 weeks back — always gives 4 clean rows
  const startDate = startOfWeek(subDays(today, 27), { weekStartsOn: 1 })
  const allDays = eachDayOfInterval({ start: startDate, end: addDays(startDate, 27) })

  // Split into 4 weeks of 7 days
  const weeks = [0, 1, 2, 3].map(w => allDays.slice(w * 7, w * 7 + 7))

  const totalDays = Object.keys(activityByDay).length
  const totalActions = Object.values(activityByDay).reduce((s, v) => s + v, 0)

  return (
    <div>
      {/* Day-of-week headers */}
      <div className="grid grid-cols-7 gap-1.5 mb-1.5">
        {DAY_HEADERS.map(d => (
          <div key={d} className="text-center text-[9px] font-mono text-muted">
            {d}
          </div>
        ))}
      </div>

      {/* 4 week rows */}
      <div className="flex flex-col gap-1.5">
        {weeks.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7 gap-1.5">
            {week.map(day => {
              const dateStr = format(day, 'yyyy-MM-dd')
              const count = activityByDay[dateStr] ?? 0
              const isToday = dateStr === todayStr
              const isFuture = day > today

              return (
                <div
                  key={dateStr}
                  title={count > 0 ? `${dateStr}: ${count} ${count === 1 ? 'activity' : 'activities'}` : dateStr}
                  className="flex flex-col items-center gap-0.5"
                >
                  <div
                    className="w-full rounded"
                    style={{
                      aspectRatio: '1',
                      backgroundColor: isFuture ? 'transparent' : getColor(count),
                      border: isFuture ? 'none' : count === 0
                        ? isToday ? '1.5px solid var(--gold-accent)' : '1px solid #d5ccc0'
                        : 'none',
                      outline: isToday ? '2px solid var(--gold-accent)' : 'none',
                      outlineOffset: 1,
                    }}
                  />
                  <span className="text-[8px] font-mono leading-none"
                    style={{ color: isToday ? 'var(--gold)' : 'var(--text-dim)' }}>
                    {format(day, 'd')}
                  </span>
                </div>
              )
            })}
          </div>
        ))}
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
        <div className="flex items-center gap-3 text-[10px] font-mono flex-wrap">
          <span className="text-muted">{totalDays} <span className="text-text">active days</span></span>
          <span className="text-muted">{totalActions.toLocaleString()} <span className="text-text">total activities</span></span>
        </div>
      </div>
    </div>
  )
}
