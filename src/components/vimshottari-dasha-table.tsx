'use client'
import React from 'react'
import { VimshottariDasha } from '@mhnpd/panchang'
import { astroTranslate } from '@internal/lib/astro-translator'

export interface VimshottariDashaTableProps {
  dasha?: VimshottariDasha
}

// Canonical Vimshottari order (starting from Ketu)
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

// cumulative years
const cumulativeYears: number[] = (() => {
  let running = 0
  return PLANET_ORDER.map(p => (running += p.years))
})()

const toLocaleNum = (val: string | number) => {
  const map: Record<string, string> = {
    '0': '०','1': '१','2': '२','3': '३','4': '४',
    '5': '५','6': '६','7': '७','8': '८','9': '९'
  }
  return String(val).split('').map(ch => map[ch] ?? ch).join('')
}

export const VimshottariDashaTable: React.FC<VimshottariDashaTableProps> = ({dasha}) => {
  console.log(dasha)
  // Spec display order (Budha first)
  const specOrder = ['budha','ketu','shukra','surya','chandra','mangal','rahu','guru','shani'] as const

  const yearsMap: Record<string, number> = {}
  PLANET_ORDER.forEach((p, idx) => { yearsMap[p.key] = p.years })

  const yogaMap: Record<string, number> = {}
  PLANET_ORDER.forEach((p, idx) => { yogaMap[p.key] = cumulativeYears[idx] })

  // Compact rows: each cell has barsa/mas/din stacked
  const durationRow = specOrder.map(k => (
    <div key={k} className="flex flex-col leading-tight">
      <span>{toLocaleNum(yearsMap[k])}</span>
      <span>०० {astroTranslate('month') || 'मास'}</span>
      <span>०० {astroTranslate('day') || 'दिन'}</span>
    </div>
  ))

  const yogaRow = specOrder.map(k => toLocaleNum(yogaMap[k]))

  return (
    <div className="space-y-6">
      <h2 className="text-center font-bold text-lg text-red-700 mb-2">
        {`अथ ${astroTranslate('vimshottari')} ${astroTranslate('mahadasha')} चक्रम्`}
      </h2>

      <div className="w-full overflow-x-auto">
        <table className="w-full border-2 border-red-700 border-collapse text-sm text-center">
          <thead className="bg-red-100">
            <tr>
              {specOrder.map(k => (
                <th key={k} className="border-2 border-red-700 px-2 py-1 text-xs font-bold text-center">
                  {astroTranslate(k) || k}
                </th>
              ))}
              <th className="border-2 border-red-700 px-2 py-1 text-xs font-bold text-center">इकाई</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              {durationRow.map((cell, i) => (
                <td key={i} className="border-2 border-red-700 px-2 py-1 text-sm font-bold">{cell}</td>
              ))}
              <td className="border-2 border-red-700 px-2 py-1 text-sm font-bold">
                <div className="flex flex-col leading-tight">
                  <span>{astroTranslate('year') || 'वर्ष'}</span>
                  <span>{astroTranslate('month') || 'मास'}</span>
                  <span>{astroTranslate('day') || 'दिन'}</span>
                </div>
              </td>
            </tr>

            <tr>
              {yogaRow.map((v, i) => (
                <td key={i} className="border-2 border-red-700 px-2 py-1 text-sm font-bold">{v}</td>
              ))}
              <td className="border-2 border-red-700 px-2 py-1 text-sm font-bold">{astroTranslate('yog') || 'योग'}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}


