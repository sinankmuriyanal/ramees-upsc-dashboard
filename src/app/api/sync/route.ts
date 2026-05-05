import { NextResponse } from 'next/server'
import { parseSheetData } from '@/lib/parseSheetData'
import { MOCK_DATA } from '@/lib/mockData'
import type { RawSheetData } from '@/lib/types'

export async function GET() {
  const url = process.env.APPS_SCRIPT_URL

  if (!url) {
    return NextResponse.json({ ...MOCK_DATA, _mock: true })
  }

  try {
    const res = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      // No cache — always fresh when user clicks Sync
      cache: 'no-store',
    })

    if (!res.ok) {
      throw new Error(`Apps Script returned ${res.status}`)
    }

    const raw: RawSheetData = await res.json()
    const data = parseSheetData(raw)
    return NextResponse.json(data)
  } catch (err) {
    console.error('Sync error:', err)
    return NextResponse.json(
      { error: 'Failed to fetch from Google Sheets. Check APPS_SCRIPT_URL.' },
      { status: 502 }
    )
  }
}
