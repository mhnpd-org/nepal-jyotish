import { GrahaPosition } from "@mhnpd/panchang";
import React from "react";



interface Props {
  data: GrahaPosition[];
}

export const GrahaTable: React.FC<Props> = ({ data }) => {
  return (
    <div className="overflow-x-auto">
      <h2 className="text-center text-xl font-bold text-red-700 mb-2">
        एतस्मयजा ग्रहाणां स्पष्टा
      </h2>
      <p className="text-center text-sm text-gray-600 mb-4">
        (आकाश-दर्शन पञ्चाङ्गानुसार)
      </p>
      <table className="w-full border border-gray-300 text-sm text-center">
        <thead className="bg-red-100">
          <tr>
            <th className="border px-2 py-1">ग्रहः</th>
            <th className="border px-2 py-1">रा. अं.क.शि</th>
            <th className="border px-2 py-1">नक्षत्र</th>
            <th className="border px-2 py-1">नक्षत्रेश</th>
            <th className="border px-2 py-1">बक्न / अरत</th>
          </tr>
        </thead>
        <tbody>
          {data.map((g, idx) => (
            <tr key={idx} className="hover:bg-gray-50">
              <td className="border px-2 py-1 font-medium">{g.graha}</td>
              <td className="border px-2 py-1">
                {Math.floor(g.longitude / 30)}{" "}
                {String(Math.floor(g.rashiDegrees))
                  .padStart(2, "0")}:
                {String(Math.floor((g.rashiDegrees % 1) * 60)).padStart(2, "0")}:
                {String(Math.floor((((g.rashiDegrees % 1) * 60) % 1) * 60)).padStart(2, "0")}
              </td>
              <td className="border px-2 py-1">
                {g.nakshatra} ({g.nakshatraPada})
              </td>
              <td className="border px-2 py-1">{g.rashi}</td>
              <td className="border px-2 py-1">
                {g.retrograde ? "वक्र" : "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


