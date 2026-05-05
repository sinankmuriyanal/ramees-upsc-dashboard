'use client'

import { subDays, format, startOfWeek, eachDayOfInterval, addDays } from 'date-fns'

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
const DAYS = ['', 'Mon', '', 'Wed', '', 'Fri', '']

export default function ActivityCalendar({ activityByDay }: Props) {
  const today = new Date()
  const startDate = startOfWeek(subDays(today, 364), { weekStartsOn: 0 })
  const endDate = today

  const allDays = eachDayOfInterval({ start: startDate, end: endDate })

  // Build weeks: each week is Sun→Sat
  const weeks: Date[][] = []
  let current: Date[] = []
  for (const day of allDays) {
    current.push(day)
    if (current.length === 7) {
      weeks.push(current)
      current = []
    }
  }
  if (current.length > 0) weeks.push(current)

  // Month label positions
  const monthLabels: { label: string; col: number }[] = []
  let lastMonth = -1
  weeks.forEach((week, wi) => {
    const month = week[0].getMonth()
    if (month !== lastMonth) {
      monthLabels.push({ label: MONTHS[month], col: wi })
      lastMonth = month
    }
  })

  const maxCount = Math.max(...Object.values(activityByDay), 1)
  const totalDays = Object.keys(activityByDay).length
  const totalActions = Object.values(activityByDay).reduce((s, v) => s + v, 0)

  return (
    <div>
      <div className="overflow-x-auto pb-2">
        <div style={{ width: 'fit-content' }}>
          {/* Month labels */}
          <div className="flex ml-6 mb-1" style={{ gap: 2 }}>
            {weeks.map((_, wi) => {
              const ml = monthLabels.find(m => m.col === wi)
              return (
                <div key={wi} style={{ width: 11 }} className="text-[9px] text-muted font-mono shrink-0">
                  {ml ? ml.label : ''}
                </div>
              )
            })}
          </div>

          {/* Grid */}
          <div className="flex gap-0.5">
            {/* Day labels */}
            <div className="flex flex-col mr-1" style={{ gap: 2 }}>
              {DAYS.map((d, i) => (
                <div key={i} style={{ height: 11 }} className="text-[9px] text-muted font-mono w-4 text-right leading-none flex items-center justify-end">
                  {d}
                </div>
              ))}
            </div>

            {/* Week columns */}
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col" style={{ gap: 2 }}>
                {Array.from({ length: 7 }).map((_, di) => {
                  const day = week[di]
                  if (!day) return <div key={di} style={{ width: 11, height: 11 }} />
                  const dateStr = format(day, 'yyyy-MM-dd')
                  const count = activityByDay[dateStr] ?? 0
                  const isFuture = day > today
                  return (
                    <div
                      key={di}
                      title={count > 0 ? `${dateStr}: ${count} activities` : dateStr}
                      style={{
                        width: 11,
                        height: 11,
                        borderRadius: 2,
                        backgroundColor: isFuture ? 'transparent' : getColor(count),
                        border: isFuture ? 'none' : count === 0 ? '1px solid #d5ccc0' : 'none',
                        transition: 'background-color 0.2s',
                        cursor: count > 0 ? 'pointer' : 'default',
                      }}
                    />
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend + stats */}
      <div className="flex items-center justify-between mt-3 flex-wrap gap-3">
        <div className="flex items-center gap-3 text-[10px] text-muted font-mono">
          <span>Less</span>
          {[0, 2, 5, 10, 15].map(v => (
            <div key={v} style={{ width: 11, height: 11, borderRadius: 2, backgroundColor: getColor(v), border: v === 0 ? '1px solid #d5ccc0' : 'none' }} />
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
