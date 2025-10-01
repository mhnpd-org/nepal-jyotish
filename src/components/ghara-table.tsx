import { GrahaPosition } from "@mhnpd/panchang";
import React from "react";

interface Props {
  data: GrahaPosition[];
  translator: (key: string | number) => string;
}

/**
 * Displays the positions of celestial bodies (Grahas) in a table format.
 * Uses a provided translator function for localization.
 */
export const GrahaTable: React.FC<Props> = ({ data, translator = (key) => String(key) }) => {
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
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              अं.क.शि
            </th>
            <th className="border-2 border-red-700 px-2 py-1">नक्षत्र</th>
            <th className="border-2 border-red-700 px-2 py-1">नक्षत्रेश</th>
            <th className="border-2 border-red-700 px-2 py-1">बक्न / अरत</th>
          </tr>
        </thead>
        
        <tbody>
          {data.map((g, idx) => {
            // Calculate Rashi (sign) index (0-11)
            const rashiIndex = Math.floor(g.longitude / 30);
            
            // Calculate Degrees, Minutes, Seconds within the Rashi
            const rashiDegrees = g.rashiDegrees;
            const degrees = Math.floor(rashiDegrees);
            const minutes = Math.floor((rashiDegrees % 1) * 60);
            const seconds = Math.floor((((rashiDegrees % 1) * 60) % 1) * 60);

            return (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="border-2 border-red-700 px-2 py-1 font-medium">
                  {translator(g.graha)}
                </td>
                <td className="border-2 border-red-700 px-2 py-1 whitespace-nowrap">
                  {/* Rashi (Sign) Index */}
                  {translator(rashiIndex)}
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  {/* Degrees:Minutes:Seconds - translated and padded */}
                  {String(translator(degrees)).padStart(2, "0")}:
                  {String(translator(minutes)).padStart(2, "0")}:
                  {String(translator(seconds)).padStart(2, "0")}
                </td>
                <td className="border-2 border-red-700 px-2 py-1">
                  {translator(g.nakshatra)} ({translator(g.nakshatraPada)})
                </td>
                <td className="border-2 border-red-700 px-2 py-1">
                  {translator(g.rashi)}
                </td>
                <td className="border-2 border-red-700 px-2 py-1">
                  {g.retrograde ? "वक्र" : "-"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};