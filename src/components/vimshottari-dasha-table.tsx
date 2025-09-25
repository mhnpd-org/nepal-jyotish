'use client'
import React from 'react'
import { VimshottariDasha } from '@mhnpd/panchang'

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
  english?: boolean
}

// Canonical Vimshottari order (starting from Ketu) and durations (years)
const PLANET_ORDER = [
  { key: 'ketu', deva: 'केतु', en: 'Ketu', years: 7 },
  { key: 'shukra', deva: 'शुक्र', en: 'Venus', years: 20 },
  { key: 'surya', deva: 'सूर्य', en: 'Sun', years: 6 },
  { key: 'chandra', deva: 'चन्द्र', en: 'Moon', years: 10 },
  { key: 'mangal', deva: 'मंगल', en: 'Mars', years: 7 },
  { key: 'rahu', deva: 'राहु', en: 'Rahu', years: 18 },
  { key: 'guru', deva: 'बृहस्पति', en: 'Jupiter', years: 16 },
  { key: 'shani', deva: 'शनि', en: 'Saturn', years: 19 },
  { key: 'budha', deva: 'बुध', en: 'Mercury', years: 17 },
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
        className="px-2 py-1 text-center text-sm border border-red-500"
      >
        {v === null ? '' : v}
      </td>
    ))}
  </tr>
)

export const VimshottariDashaTable: React.FC<VimshottariDashaTableProps> = ({ english }) => {
  // Cumulative yoga rows (years) aligned to the spec order (note: spec table lists Mercury first visually but description follows Ketu-start cycle).
  // The user-provided second table lists cumulative values for (Mercury, Ketu, Venus, Sun, Moon, Mars, Rahu, Jupiter, Saturn).
  // We produce that exact ordering for display while still keeping canonical cycle context in code.
  const specSecondTableOrderKeys = ['budha','ketu','shukra','surya','chandra','mangal','rahu','guru','shani'] as const

  const cumulativeMap: Record<string, number> = {}
  PLANET_ORDER.forEach((p, idx) => { cumulativeMap[p.key] = cumulativeYears[idx] })

  const cumulativeYearsRow = specSecondTableOrderKeys.map(k => cumulativeMap[k])
  const cumulativeMonthsRow = specSecondTableOrderKeys.map(() => (english ? '4' : '४'))
  const cumulativeDaysRow = specSecondTableOrderKeys.map(() => (english ? '5' : '५'))

  // Helper to convert western numerals to Devanagari if english flag false
  const toLocaleNum = (val: string | number) => {
    if (english) return String(val)
    const map: Record<string,string> = { '0':'०','1':'१','2':'२','3':'३','4':'४','5':'५','6':'६','7':'७','8':'८','9':'९' }
    return String(val).split('').map(ch => map[ch] ?? ch).join('')
  }

  return (
    <div className="space-y-6">
      <h2 className="text-center font-bold text-lg mb-2">
        {english ? 'Bhuktonita Vimshottari Mahadasha Chakra' : 'अथ भुक्तोनित विंशोत्तरी महादशा चक्रम्'}
      </h2>
      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {specSecondTableOrderKeys.map(k => {
                const planet = PLANET_ORDER.find(p => p.key === k)!
                return (
                  <th key={k} className="px-2 py-1 text-xs font-semibold text-center border border-red-500 bg-gray-100">
                    {english ? planet.en : planet.deva}
                  </th>
                )
              })}
              <th className="px-2 py-1 text-xs font-semibold text-center border border-red-500 bg-gray-100">{english ? 'Unit' : 'इकाई'}</th>
            </tr>
          </thead>
          <tbody>
            {/* Years (Varsh / वर्ष) */}
            <Row values={[...cumulativeYearsRow.map(toLocaleNum), english ? 'Varsh' : 'वर्ष']} />
            {/* Months (Mahina / महिना) */}
            <Row values={[...cumulativeMonthsRow, english ? 'Mahina' : 'महिना']} />
            {/* Days (Din / दिन) */}
            <Row values={[...cumulativeDaysRow, english ? 'Din' : 'दिन']} />
            {/* Yoga (Yog / योग) duplicate cumulative years for clarity unless spec changes */}
            <Row values={[...cumulativeYearsRow.map(toLocaleNum), english ? 'Yog' : 'योग']} />
          </tbody>
        </table>
      </div>
    </div>
  )
}
