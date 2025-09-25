'use client'
import React from 'react'
import { TribhaagiDasha, DashaPeriod } from '@mhnpd/panchang'

export interface TribhaagiDashaTableProps {
  tribhaagi?: TribhaagiDasha
  english?: boolean
}

// Reuse planet display names consistent with Vimshottari component
const PLANET_INFO: Record<string, { deva: string; en: string }> = {
  ketu: { deva: 'केतु', en: 'Ketu' },
  shukra: { deva: 'शुक्र', en: 'Venus' },
  surya: { deva: 'सूर्य', en: 'Sun' },
  chandra: { deva: 'चन्द्र', en: 'Moon' },
  mangal: { deva: 'मंगल', en: 'Mars' },
  rahu: { deva: 'राहु', en: 'Rahu' },
  guru: { deva: 'बृहस्पति', en: 'Jupiter' },
  shani: { deva: 'शनि', en: 'Saturn' },
  budha: { deva: 'बुध', en: 'Mercury' },
}

// Attempt to normalize the ruler to one of the keys above
function normalizeRuler(ruler: DashaPeriod['ruler']): string {
  const raw = String(ruler).toLowerCase()
  // Handle possible enum-like values (e.g., 'KETU')
  const match = Object.keys(PLANET_INFO).find(k => raw.includes(k))
  return match ?? raw
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

export const TribhaagiDashaTable: React.FC<TribhaagiDashaTableProps> = ({ tribhaagi, english }) => {
  // If tribhaagi data is provided, rotate sequence starting from currentMahadasha ruler
  let periods: DashaPeriod[] = []
  if (tribhaagi?.mahadashas?.length) {
    // Find index of current Mahadasha ruler within full list and rotate so it appears first
    const currentKey = normalizeRuler(tribhaagi.currentMahadasha.ruler)
    const idx = tribhaagi.mahadashas.findIndex(p => normalizeRuler(p.ruler) === currentKey)
    if (idx >= 0) {
      periods = [...tribhaagi.mahadashas.slice(idx), ...tribhaagi.mahadashas.slice(0, idx)]
    } else {
      periods = tribhaagi.mahadashas
    }
  } else {
    // Fallback placeholder order (canonical Vimshottari order) if no data
    periods = Object.keys(PLANET_INFO).map(key => ({
      // Fallback placeholder ruler typed loosely as Planet | string
      ruler: key as unknown as TribhaagiDasha['nakshatraLord'],
      startDate: new Date(),
      endDate: new Date(),
      durationYears: 0,
      durationMonths: 0,
      durationDays: 0,
    }))
  }

  const toLocaleNum = (val: string | number) => {
    if (english) return String(val)
    const map: Record<string, string> = { '0':'०','1':'१','2':'२','3':'३','4':'४','5':'५','6':'६','7':'७','8':'८','9':'९' }
    return String(val).split('').map(ch => map[ch] ?? ch).join('')
  }

  // Build columns
  const headers = periods.map(p => {
    const key = normalizeRuler(p.ruler)
    const info = PLANET_INFO[key] || { deva: key, en: key }
    return english ? info.en : info.deva
  })
  const yearsRow = periods.map(p => toLocaleNum(p.durationYears ?? 0))
  const monthsRow = periods.map(p => toLocaleNum(p.durationMonths ?? 0))
  const daysRow = periods.map(p => toLocaleNum(p.durationDays ?? 0))
  // Yog row: cumulative years across sequence
  const cumulativeYears: number[] = []
  let running = 0
  periods.forEach(p => { running += p.durationYears ?? 0; cumulativeYears.push(running) })
  const yogRow = cumulativeYears.map(toLocaleNum)

  return (
    <div className="space-y-6">
      <h2 className="text-center font-bold text-lg mb-2">
        {english ? 'Tribhagi (Ashtottari) Mahadasha Chakra' : 'अथ त्रिभागी महादशा चक्रम्'}
      </h2>
      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {headers.map((h, i) => (
                <th key={i} className="px-2 py-1 text-xs font-semibold text-center border border-red-500 bg-gray-100">{h}</th>
              ))}
              <th className="px-2 py-1 text-xs font-semibold text-center border border-red-500 bg-gray-100">{english ? 'Unit' : 'इकाई'}</th>
            </tr>
          </thead>
          <tbody>
            <Row values={[...yearsRow, english ? 'Varsh' : 'वर्ष']} />
            <Row values={[...monthsRow, english ? 'Mahina' : 'महिना']} />
            <Row values={[...daysRow, english ? 'Din' : 'दिन']} />
            <Row values={[...yogRow, english ? 'Yog' : 'योग']} />
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default TribhaagiDashaTable