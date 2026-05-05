'use client'

import { useEffect, useState } from 'react'

interface Props {
  completed: number
  total: number
  pct: number
}

const SIZE = 220
const CX = SIZE / 2
const CY = SIZE / 2
const RADIUS = 88
const STROKE = 14
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export default function OverallRing({ completed, total, pct }: Props) {
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 100)
    return () => clearTimeout(t)
  }, [pct])

  const offset = animated ? CIRCUMFERENCE * (1 - pct / 100) : CIRCUMFERENCE

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <div className="relative">
        <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} className="drop-shadow-[0_0_24px_rgba(212,168,67,0.15)]">
          <defs>
            <linearGradient id="ringGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#c8931a" />
              <stop offset="60%" stopColor="#e8b84b" />
              <stop offset="100%" stopColor="#f0c870" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Track */}
          <circle
            cx={CX} cy={CY} r={RADIUS}
            fill="none"
            stroke="#e2d5c4"
            strokeWidth={STROKE}
          />

          {/* Progress arc */}
          <circle
            cx={CX} cy={CY} r={RADIUS}
            fill="none"
            stroke="url(#ringGold)"
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            transform={`rotate(-90 ${CX} ${CY})`}
            style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(0.4, 0, 0.2, 1)' }}
            filter="url(#glow)"
          />

          {/* Inner decorative ring */}
          <circle
            cx={CX} cy={CY} r={RADIUS - STROKE - 8}
            fill="none"
            stroke="#e2d5c4"
            strokeWidth={1}
            strokeDasharray="4 6"
          />
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-5xl font-mono font-bold text-gold leading-none tracking-tight">
            {pct}%
          </span>
          <span className="text-xs text-muted mt-1 tracking-[0.2em] uppercase">Complete</span>
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 w-full text-center">
        <div className="flex-1">
          <div className="text-xl font-mono font-bold text-text">{completed.toLocaleString()}</div>
          <div className="text-[10px] text-muted tracking-widest uppercase mt-0.5">Done</div>
        </div>
        <div className="w-px h-7 bg-border shrink-0" />
        <div className="flex-1">
          <div className="text-xl font-mono font-bold text-text">{(total - completed).toLocaleString()}</div>
          <div className="text-[10px] text-muted tracking-widest uppercase mt-0.5">Remaining</div>
        </div>
        <div className="w-px h-7 bg-border shrink-0" />
        <div className="flex-1">
          <div className="text-xl font-mono font-bold text-text">{total.toLocaleString()}</div>
          <div className="text-[10px] text-muted tracking-widest uppercase mt-0.5">Total</div>
        </div>
      </div>
    </div>
  )
}
