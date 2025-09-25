'use client'
import React from 'react'
import { TribhaagiDasha, DashaPeriod } from '@mhnpd/panchang'
import { astroTranslate } from '@internal/lib/astro-translator'

export interface TribhaagiDashaTableProps {
  tribhaagi?: TribhaagiDasha
}

// Canonical Tribhaagi / planetary order fallback if data absent
const PLANET_KEYS = ['ketu','shukra','surya','chandra','mangal','rahu','guru','shani','budha'] as const

// Attempt to normalize the ruler to one of the keys above
function normalizeRuler(ruler: DashaPeriod['ruler']): string {
  return String(ruler).trim().toLowerCase()
}

const Row: React.FC<{ values: (string | number | null)[] }> = ({ values }) => (
  <tr>
    {values.map((v, i) => (
      <td key={i} className="px-2 py-1 text-center text-sm border border-red-500">
        {v === null ? '' : v}
      </td>
    ))}
  </tr>
)

export const TribhaagiDashaTable: React.FC<TribhaagiDashaTableProps> = ({ tribhaagi }) => {
  // Build a single cycle of unique rulers (avoid repetition showing multiple cycles)
  let periods: DashaPeriod[] = []
  if (tribhaagi?.mahadashas?.length) {
    const seen = new Set<string>()
    for (const p of tribhaagi.mahadashas) {
      const key = normalizeRuler(p.ruler)
      if (!seen.has(key)) {
        seen.add(key)
        periods.push(p)
      }
      if (seen.size === 9) break // only first complete set of 9 planets
    }
    // Ensure current mahadasha is first (rotate after dedupe)
    if (periods.length) {
      const currentKey = normalizeRuler(tribhaagi.currentMahadasha.ruler)
      const idx = periods.findIndex(p => normalizeRuler(p.ruler) === currentKey)
      if (idx > 0) {
        periods = [...periods.slice(idx), ...periods.slice(0, idx)]
      }
    }
  } else {
    // Fallback placeholder order (planet info keys) if no data
    periods = PLANET_KEYS.map(key => ({
      ruler: key as unknown as DashaPeriod['ruler'],
      startDate: new Date(),
      endDate: new Date(),
      durationYears: 0,
      durationMonths: 0,
      durationDays: 0,
    }))
  }

  const toLocaleNum = (val: string | number) => {
    const map: Record<string, string> = { '0':'०','1':'१','2':'२','3':'३','4':'४','5':'५','6':'६','7':'७','8':'८','9':'९' }
    return String(val).split('').map(ch => map[ch] ?? ch).join('')
  }

  // Build columns
  const headers = periods.map(p => {
    const key = normalizeRuler(p.ruler)
    const translated = astroTranslate(key)
    return translated || key
  })
  const yearsRow = periods.map(p => toLocaleNum(p.durationYears ?? 0))
  const monthsRow = periods.map(p => toLocaleNum(p.durationMonths ?? 0))
  const daysRow = periods.map(p => toLocaleNum(p.durationDays ?? 0))
  // Yog row: cumulative years across sequence
  const cumulativeYears: number[] = []
  let running = 0
  periods.forEach(p => { running += p.durationYears ?? 0; cumulativeYears.push(running) })
  const yogRow = cumulativeYears.map(toLocaleNum)

  const heading = `अथ ${astroTranslate('tribhagi')} ${astroTranslate('mahadasha')} चक्रम्`
  return (
    <div className="space-y-6">
      <h2 className="text-center font-bold text-lg mb-2">{heading}</h2>
      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {headers.map((h, i) => (
                <th key={i} className="px-2 py-1 text-xs font-semibold text-center border border-red-500 bg-gray-100">{h}</th>
              ))}
              <th className="px-2 py-1 text-xs font-semibold text-center border border-red-500 bg-gray-100">इकाई</th>
            </tr>
          </thead>
          <tbody>
            <Row values={[...yearsRow, astroTranslate('year') || 'वर्ष']} />
            <Row values={[...monthsRow, astroTranslate('month') || 'मास']} />
            <Row values={[...daysRow, astroTranslate('day') || 'दिन']} />
            <Row values={[...yogRow, astroTranslate('yog') || 'योग']} />
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default TribhaagiDashaTable