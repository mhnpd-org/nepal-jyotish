"use client";
import React from "react";
import { VimshottariDasha } from "@mhnpd-org/panchang";
import { translateSanskritSafe } from "@internal/lib/devanagari";

export interface VimshottariDashaTableProps {
  dasha: VimshottariDasha[];
}

export const VimshottariDashaTable: React.FC<VimshottariDashaTableProps> = ({
  dasha
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-center font-bold text-lg text-red-700 mb-2">
        {`अथ विक्षोत्तरी महादशा चक्रम्`}
      </h2>

      <div className="w-full overflow-x-auto">
        <table className="w-full border-2 border-red-700 border-collapse text-sm text-center">
          <thead className="bg-red-100">
            <tr>
              {dasha.map((k) => (
                <th
                  key={k.dashaLord}
                  className="border-2 border-red-700 px-2 py-1 text-xs font-bold text-center"
                >
                  {translateSanskritSafe(k.dashaLord)}
                </th>
              ))}
              <th className="border-2 border-red-700 px-2 py-1 text-xs font-bold text-center">
                इकाई
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              {dasha.map((cell, i) => (
                <td
                  key={i}
                  className="border-2 border-red-700 px-2 py-1 text-sm font-bold"
                >
                  <p>{translateSanskritSafe(`${cell.remainingYears.toFixed(2)}`)}</p>
                  <p>{translateSanskritSafe(`${cell.remainingMonths.toFixed(0)}`)}</p>
                  <p>{translateSanskritSafe(`${cell.remainingDays.toFixed(0)}`)}</p>
                </td>
              ))}
              <td className="border-2 border-red-700 px-2 py-1 text-sm font-bold">
                <div className="flex flex-col leading-tight">
                  <span>वर्ष</span>
                  <span>मास</span>
                  <span>दिन</span>
                </div>
              </td>
            </tr>

            <tr>
              {dasha.map((v, i) => (
                <td
                  key={i}
                  className="border-2 border-red-700 px-2 py-1 text-sm font-bold"
                >
                  {translateSanskritSafe(`${v.cumulativeYears.toFixed(2)}`)}
                </td>
              ))}
              <td className="border-2 border-red-700 px-2 py-1 text-sm font-bold">
                योग
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
