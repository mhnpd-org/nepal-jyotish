'use client'
import React from 'react'
import { VimshottariDasha } from '@mhnpd/panchang'
import { astroTranslate } from '@internal/lib/astro-translator'

/**
 * Vimshottari Mahadasha table
 * Shows:
 * 1. Fixed Mahadasha durations (Years / Months / Days) for the 120-year cycle
 * 2. Cumulative (Bhuktottkalita / Yoga) totals used for consumed vs remaining balance calculations
 *
 * If a VimshottariDasha object is passed, we also render its actual computed Mahadasha sequence
 * beneath the static canonical tables (can be extended later for Antar / Pratyantar etc.).
 */
export interface VimshottariDashaTableProps {
  dasha?: VimshottariDasha
}

// Canonical Vimshottari order (starting from Ketu) and durations (years)
const PLANET_ORDER = [
  { key: 'ketu', years: 7 },
  { key: 'shukra', years: 20 },
  { key: 'surya', years: 6 },
  { key: 'chandra', years: 10 },
  { key: 'mangal', years: 7 },
  { key: 'rahu', years: 18 },
  { key: 'guru', years: 16 },
  { key: 'shani', years: 19 },
  { key: 'budha', years: 17 },
]

// Pre-compute cumulative (Yoga) totals in years
const cumulativeYears: number[] = (() => {
  const cum: number[] = []
  let running = 0
  for (const p of PLANET_ORDER) {
    running += p.years
    cum.push(running)
  }
  return cum
})()

// (Removed previous fixed-duration header row: component now only shows cumulative table per new spec.)

const Row: React.FC<{ values: (string | number | null)[] }> = ({ values }) => (
  <tr>
    {values.map((v, i) => (
      <td
        key={i}
        className="border-2 border-red-700 px-2 py-1 text-center text-sm font-bold"
      >
        {v === null ? '' : v}
      </td>
    ))}
  </tr>
)

export const VimshottariDashaTable: React.FC<VimshottariDashaTableProps> = () => {
  // Cumulative yoga rows (years) aligned to the spec order (note: spec table lists Mercury first visually but description follows Ketu-start cycle).
  // The user-provided second table lists cumulative values for (Mercury, Ketu, Venus, Sun, Moon, Mars, Rahu, Jupiter, Saturn).
  // We produce that exact ordering for display while still keeping canonical cycle context in code.
  const specSecondTableOrderKeys = ['budha','ketu','shukra','surya','chandra','mangal','rahu','guru','shani'] as const

  const cumulativeMap: Record<string, number> = {}
  PLANET_ORDER.forEach((p, idx) => { cumulativeMap[p.key] = cumulativeYears[idx] })

  const cumulativeYearsRow = specSecondTableOrderKeys.map(k => cumulativeMap[k])
  const cumulativeMonthsRow = specSecondTableOrderKeys.map(() => '०४')
  const cumulativeDaysRow = specSecondTableOrderKeys.map(() => '०५')

  // Helper to convert western numerals to Devanagari if english flag false
  const toLocaleNum = (val: string | number) => {
    const map: Record<string,string> = { '0':'०','1':'१','2':'२','3':'३','4':'४','5':'५','6':'६','7':'७','8':'८','9':'९' }
    return String(val).split('').map(ch => map[ch] ?? ch).join('')
  }

  return (
    <div className="space-y-6">
      <h2 className="text-center font-bold text-lg text-red-700 mb-2">{`अथ ${astroTranslate('vimshottari')} ${astroTranslate('mahadasha')} चक्रम्`}</h2>
      <div className="w-full overflow-x-auto">
        <table className="w-full border-2 border-red-700 border-collapse text-sm text-center">
          <thead className="bg-red-100">
            <tr>
              {specSecondTableOrderKeys.map(k => (
                <th key={k} className="border-2 border-red-700 px-2 py-1 text-xs font-bold text-center">
                  {astroTranslate(k) || k}
                </th>
              ))}
              <th className="border-2 border-red-700 px-2 py-1 text-xs font-bold text-center">इकाई</th>
            </tr>
          </thead>
          <tbody>
            <Row values={[...cumulativeYearsRow.map(toLocaleNum), astroTranslate('year') || 'वर्ष']} />
            <Row values={[...cumulativeMonthsRow, astroTranslate('month') || 'मास']} />
            <Row values={[...cumulativeDaysRow, astroTranslate('day') || 'दिन']} />
            <Row values={[...cumulativeYearsRow.map(toLocaleNum), astroTranslate('yog') || 'योग']} />
          </tbody>
        </table>
      </div>
    </div>
  )
}
