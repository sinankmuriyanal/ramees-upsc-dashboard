'use client'

import { useState, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic'
import SyncButton from '@/components/SyncButton'
import OverallRing from '@/components/OverallRing'
import KPICards from '@/components/KPICards'
import type { DashboardData } from '@/lib/types'
import { MOCK_DATA } from '@/lib/mockData'

const SubjectBars   = dynamic(() => import('@/components/SubjectBars'),    { ssr: false })
const TopicAnalysis = dynamic(() => import('@/components/TopicAnalysis'),   { ssr: false })
const ActivityCalendar = dynamic(() => import('@/components/ActivityCalendar'), { ssr: false })

const LS_KEY = 'upsc_dashboard_cache_v2'

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative z-10 bg-surface border border-border rounded-lg p-5 shadow-sm ${className}`}>
      {children}
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[11px] tracking-[0.22em] uppercase text-muted font-display mb-4 flex items-center gap-2">
      <span className="inline-block w-3 h-px" style={{ backgroundColor: 'var(--gold-accent)' }} />
      {children}
      <span className="flex-1 h-px bg-border" />
    </h2>
  )
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData>(MOCK_DATA)
  const [loading, setLoading] = useState(false)
  const [isMock, setIsMock] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      const cached = localStorage.getItem(LS_KEY)
      if (cached) {
        const parsed = JSON.parse(cached) as DashboardData & { _mock?: boolean }
        setData(parsed)
        setIsMock(parsed._mock ?? false)
      }
    } catch { /* ignore */ }
  }, [])

  const sync = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/sync')
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error((body as { error?: string }).error ?? `HTTP ${res.status}`)
      }
      const json = await res.json() as DashboardData & { _mock?: boolean }
      setData(json)
      setIsMock(json._mock ?? false)
      localStorage.setItem(LS_KEY, JSON.stringify(json))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Sync failed')
    } finally {
      setLoading(false)
    }
  }, [])

  return (
    <main className="relative z-10 min-h-screen">
      {/* Header */}
      <header className="relative z-20 border-b border-border bg-surface/80 backdrop-blur-sm sticky top-0 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-3.5 flex items-center justify-between gap-4">
          <div>
            <h1 className="font-display tracking-[0.18em] text-base font-semibold leading-none" style={{ color: 'var(--gold)' }}>
              UPSC COMMAND
            </h1>
            <p className="text-muted text-[10px] tracking-[0.28em] uppercase font-mono mt-0.5">
              Ramees · Civil Services Preparation
            </p>
          </div>
          <SyncButton onSync={sync} loading={loading} lastSynced={data.lastSynced} isMock={isMock} />
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-7 space-y-5">

        {error && (
          <div className="relative z-10 bg-red-50 border border-red-200 text-red-700 text-xs font-mono px-4 py-3 rounded">
            Sync failed: {error}
          </div>
        )}

        {/* KPI row */}
        <KPICards kpis={data.kpis} />

        {/* Hero: Ring + Subject Bars */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-5">
          <Card className="flex flex-col items-center justify-center py-7">
            <SectionTitle>Overall Progress</SectionTitle>
            <OverallRing completed={data.completedSubtopics} total={data.totalSubtopics} pct={data.overallPct} />
          </Card>
          <Card>
            <SectionTitle>Subject Completion</SectionTitle>
            <SubjectBars subjects={data.subjects} />
          </Card>
        </div>

        {/* Topic-wise analysis */}
        <Card>
          <SectionTitle>Topic-wise Analysis</SectionTitle>
          <p className="text-muted text-xs font-mono -mt-2 mb-4">
            Most recently studied topics on top · V = Video · R = Reading · N = Notes · S = Summary
          </p>
          <TopicAnalysis topics={data.topics} />
        </Card>

        {/* Activity calendar */}
        <Card>
          <SectionTitle>Study Activity — Last 12 Months</SectionTitle>
          <ActivityCalendar activityByDay={data.activityByDay} />
        </Card>

        <footer className="relative z-10 text-center text-[10px] text-dim font-mono pb-6 tracking-widest uppercase">
          15 subjects · 272 topics · {data.totalSubtopics.toLocaleString()} subtopics
        </footer>
      </div>
    </main>
  )
}
