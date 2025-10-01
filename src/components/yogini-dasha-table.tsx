'use client'
import React from 'react'
import { YoginiDasha, DashaPeriod } from '@mhnpd/panchang'
import { astroTranslate } from '@internal/lib/astro-translator'

export interface YoginiDashaTableProps {
  yogini?: YoginiDasha
}

// Yogini Dasha order (36-year cycle)
const YOGINI_ORDER: { key: string; years: number }[] = [
  { key: 'mangala', years: 1 },
  { key: 'pingala', years: 2 },
  { key: 'dhanya', years: 3 },
  { key: 'bhramari', years: 4 },
  { key: 'bhadrika', years: 5 },
  { key: 'ulka', years: 6 },
  { key: 'siddha', years: 7 },
  { key: 'sankata', years: 8 },
]

// Convert digits to Devanagari
const toLocaleNum = (val: string | number) => {
  const map: Record<string, string> = { '0':'०','1':'१','2':'२','3':'३','4':'४','5':'५','6':'६','7':'७','8':'८','9':'९' }
  return String(val).split('').map(c => map[c] ?? c).join('')
}

const Row: React.FC<{ values: (string | number)[] }> = ({ values }) => (
  <tr>
    {values.map((v,i) => (
      <td key={i} className="border-2 border-red-700 px-2 py-1 text-center text-sm font-bold">{v}</td>
    ))}
  </tr>
)

export const YoginiDashaTable: React.FC<YoginiDashaTableProps> = ({ yogini }) => {
  let periods: DashaPeriod[] = []

  if (yogini?.dashas?.length) {
    // Use provided dashas (ordered & rotated to start with current)
    const currentKey = String(yogini.currentDasha.ruler).toLowerCase()
    const uniq = new Set<string>()
    const ordered: DashaPeriod[] = []
    for (const p of yogini.dashas) {
      const key = String(p.ruler).toLowerCase()
      if (!uniq.has(key)) { uniq.add(key); ordered.push(p) }
      if (uniq.size === YOGINI_ORDER.length) break
    }
    let idx = ordered.findIndex(p => String(p.ruler).toLowerCase() === currentKey)
    if (idx < 0) idx = 0
    periods = [...ordered.slice(idx), ...ordered.slice(0, idx)]
  } else {
    // Fallback to static durations
    periods = YOGINI_ORDER.map(y => ({
      ruler: y.key as unknown as DashaPeriod['ruler'],
      startDate: new Date(),
      endDate: new Date(),
      durationYears: y.years,
      durationMonths: 0,
      durationDays: 0,
    }))
  }

  // Build headers
  const headers = periods.map(p => astroTranslate(String(p.ruler).toLowerCase()) || String(p.ruler))

  // Years row
  const yearsRow = periods.map(p => toLocaleNum(p.durationYears ?? 0))

  // Cumulative योग row
  const cumulative: number[] = []
  let run = 0
  periods.forEach(p => { run += p.durationYears ?? 0; cumulative.push(run) })
  const yogRow = cumulative.map(toLocaleNum)

  return (
    <div className="space-y-6">
      <h2 className="text-center font-bold text-lg text-red-700 mb-2">
        {`अथ ${astroTranslate('yogini')} ${astroTranslate('mahadasha')} चक्रम्`}
      </h2>
      <div className="w-full overflow-x-auto">
        <table className="w-full border-2 border-red-700 border-collapse text-sm text-center">
          <thead className="bg-red-100">
            <tr>
              {headers.map((h,i) => (
                <th key={i} className="border-2 border-red-700 px-2 py-1 text-xs font-bold text-center">{h}</th>
              ))}
              <th className="border-2 border-red-700 px-2 py-1 text-xs font-bold text-center">इकाई</th>
            </tr>
          </thead>
          <tbody>
            <Row values={[...yearsRow, astroTranslate('year') || 'वर्ष']} />
            <Row values={[...yogRow, astroTranslate('yog') || 'योग']} />
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default YoginiDashaTable
