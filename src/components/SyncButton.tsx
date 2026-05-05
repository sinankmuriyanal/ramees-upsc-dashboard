'use client'

import { RefreshCw } from 'lucide-react'
import { format } from 'date-fns'

interface Props {
  onSync: () => void
  loading: boolean
  lastSynced: string | null
  isMock: boolean
}

export default function SyncButton({ onSync, loading, lastSynced, isMock }: Props) {
  const timeLabel = lastSynced
    ? format(new Date(lastSynced), 'dd MMM yyyy, HH:mm')
    : 'Never synced'

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={onSync}
        disabled={loading}
        className="flex items-center gap-2 px-4 py-2 bg-amber-50 hover:bg-amber-100 border border-amber-300 hover:border-amber-500 text-amber-800 text-sm font-mono rounded transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
      >
        <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
        {loading ? 'Syncing...' : 'Sync Now'}
      </button>
      <div className="flex items-center gap-1.5 text-[10px] font-mono">
        {isMock && (
          <span className="px-1.5 py-0.5 bg-amber-100 border border-amber-300 text-amber-700 rounded text-[9px] tracking-wide font-semibold">
            DEMO
          </span>
        )}
        <span className="text-muted">{timeLabel}</span>
      </div>
    </div>
  )
}
