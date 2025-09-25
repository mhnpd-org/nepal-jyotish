'use client'
import React from 'react'
import { YoginiDasha, DashaPeriod } from '@mhnpd/panchang'

export interface YoginiDashaTableProps {
  yogini?: YoginiDasha
  english?: boolean
}

// Canonical Yogini Dasha order (36-year cycle)
// Durations (years): Mangala 1, Pingala 2, Dhanya 3, Bhramari 4, Bhadrika 5, Ulka 6, Siddha 7, Sankata 8
// Names mapping (simple transliteration)
const YOGINI_ORDER: { key: string; deva: string; en: string; years: number }[] = [
  { key: 'mangala', deva: 'मंगला', en: 'Mangala', years: 1 },
  { key: 'pingala', deva: 'पिङ्गला', en: 'Pingala', years: 2 },
  { key: 'dhanya', deva: 'धान्या', en: 'Dhanya', years: 3 },
  { key: 'bhramari', deva: 'भ्रमरी', en: 'Bhramari', years: 4 },
  { key: 'bhadrika', deva: 'भद्रिका', en: 'Bhadrika', years: 5 },
  { key: 'ulka', deva: 'उल्का', en: 'Ulka', years: 6 },
  { key: 'siddha', deva: 'सिद्धा', en: 'Siddha', years: 7 },
  { key: 'sankata', deva: 'संकटा', en: 'Sankata', years: 8 },
]

// Convert number digits to Devanagari if needed
const makeLocale = (english?: boolean) => (val: string | number) => {
  if (english) return String(val)
  const map: Record<string, string> = { '0':'०','1':'१','2':'२','3':'३','4':'४','5':'५','6':'६','7':'७','8':'८','9':'९' }
  return String(val).split('').map(c => map[c] ?? c).join('')
}

const Row: React.FC<{ values: (string | number)[] }> = ({ values }) => (
  <tr>
    {values.map((v,i) => (
      <td key={i} className="px-2 py-1 text-center text-sm border border-red-500">{v}</td>
    ))}
  </tr>
)

export const YoginiDashaTable: React.FC<YoginiDashaTableProps> = ({ yogini, english }) => {
  const toLocaleNum = makeLocale(english)

  let periods: DashaPeriod[] = []
  if (yogini?.dashas?.length) {
    // Rotate so current dasha appears first
    const currentKey = String(yogini.currentDasha.ruler).toLowerCase()
    const ordered: DashaPeriod[] = []
    const uniq = new Set<string>()
    for (const p of yogini.dashas) {
      const key = String(p.ruler).toLowerCase()
      if (!uniq.has(key)) { uniq.add(key); ordered.push(p) }
      if (uniq.size === YOGINI_ORDER.length) break
    }
    let idx = ordered.findIndex(p => String(p.ruler).toLowerCase() === currentKey)
    if (idx < 0) idx = 0
    periods = [...ordered.slice(idx), ...ordered.slice(0, idx)]
  } else {
    // Fallback static definitions if no data provided
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
  const headers = periods.map(p => {
    const key = String(p.ruler).toLowerCase()
    const meta = YOGINI_ORDER.find(y => key.includes(y.key))
    return english ? (meta?.en ?? p.ruler.toString()) : (meta?.deva ?? p.ruler.toString())
  })

  // Years row (Varsh)
  const yearsRow = periods.map(p => toLocaleNum(p.durationYears ?? 0))
  // Yog row cumulative years
  const cumulative: number[] = []
  let run = 0
  periods.forEach(p => { run += p.durationYears ?? 0; cumulative.push(run) })
  const yogRow = cumulative.map(toLocaleNum)

  return (
    <div className="space-y-6">
      <h2 className="text-center font-bold text-lg mb-2">
        {english ? 'Yogini Mahadasha Chakra' : 'अथ योगिनी महादशा चक्रम्'}
      </h2>
      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {headers.map((h,i) => (
                <th key={i} className="px-2 py-1 text-xs font-semibold text-center border border-red-500 bg-gray-100">{h}</th>
              ))}
              <th className="px-2 py-1 text-xs font-semibold text-center border border-red-500 bg-gray-100">{english ? 'Unit' : 'इकाई'}</th>
            </tr>
          </thead>
          <tbody>
            <Row values={[...yearsRow, english ? 'Varsh' : 'वर्ष']} />
            <Row values={[...yogRow, english ? 'Yog' : 'योग']} />
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default YoginiDashaTable