import { PlanetCombinedInfo, PlanetsInTimeFrameResult } from "@mhnpd-org/panchang";
import React from "react";

interface Props {
  planets: PlanetsInTimeFrameResult;
  translator: (key: string | undefined | null) => string;
}

/**
 * Displays the positions of celestial bodies (Grahas) in a table format.
 * Uses a provided translator function for localization.
 */
export const GrahaTable: React.FC<Props> = ({
  planets,
  translator = (key) => String(key)
}) => {
  // Extract an ordered list if needed later (currently rows iterate keys directly)
  // const ordered = Object.values(planets) as PlanetCombinedInfo[];
  return (
    <div className="overflow-x-auto">
      <h2 className="text-center text-xl font-bold text-red-700 mb-2">
        एतस्मयजा ग्रहाणां स्पष्टा
      </h2>

      <table className="w-full border-2 border-red-700 border-collapse text-sm text-center">
        <thead className="bg-red-100">
          <tr>
            <th className="border-2 border-red-700 px-2 py-1">ग्रहः</th>
            <th className="border-2 border-red-700 px-2 py-1">
              <span>रा.</span>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; अं.क.शि
            </th>
            <th className="border-2 border-red-700 px-2 py-1">नक्षत्र</th>
            <th className="border-2 border-red-700 px-2 py-1">नक्षत्रेश</th>
          </tr>
        </thead>

        <tbody>
          {Object.keys(planets).map((key, idx) => {
            const g = planets[key as keyof PlanetsInTimeFrameResult] as PlanetCombinedInfo;
            if (!g) return null;

            // Calculate Degrees, Minutes, Seconds within the Rashi
            const rashiDegrees = g.siderealLonDMS30

            return (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="border-2 border-red-700 px-2 py-1 font-medium">
                  {translator(key)}
                </td>
                <td className="border-2 border-red-700 px-2 py-1 whitespace-nowrap">
                  {/* Rashi (Sign) Index */}
                  {translator(g.rashi)}
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  {/* Degrees:Minutes:Seconds - translated and padded */}
                  {translator(rashiDegrees)}
                </td>
                <td className="border-2 border-red-700 px-2 py-1">
                  {translator(g.nakshatra)} ({translator(`${g.pada}`)})
                </td>
                <td className="border-2 border-red-700 px-2 py-1">
                  {translator(g.rashi)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
