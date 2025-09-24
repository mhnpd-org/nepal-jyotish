'use client';
import React from "react";

/** House number type for astrological charts */
export type HouseNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

/** Position data for each house */
export interface HousePosition {
  rashi: string;
  grahas: string[];
}

/** Props for the North Indian Drekkana Chart component */
export interface NorthDrekkanaChartProps {
  lagna: number; // Ascendant degrees (0-360)
  houses: Record<HouseNumber, HousePosition>;
  size?: number; // Chart size in pixels
  title?: string; // Chart title
  debug?: boolean; // Show both chart position and original house numbers
}

/** Predefined positions for each house in the diamond chart */
const HOUSE_POSITIONS = [
  { x: 0.5, y: 0.2, house: 1 }, // Top triangle center
  { x: 0.25, y: 0.12, house: 2 }, // Top-left
  { x: 0.12, y: 0.25, house: 3 }, // Left-top
  { x: 0.25, y: 0.5, house: 4 }, // Left center
  { x: 0.12, y: 0.75, house: 5 }, // Left-bottom
  { x: 0.25, y: 0.88, house: 6 }, // Bottom-left
  { x: 0.5, y: 0.8, house: 7 }, // Bottom triangle center
  { x: 0.75, y: 0.88, house: 8 }, // Bottom-right
  { x: 0.88, y: 0.75, house: 9 }, // Right-bottom
  { x: 0.75, y: 0.5, house: 10 }, // Right center
  { x: 0.88, y: 0.25, house: 11 }, // Right-top
  { x: 0.75, y: 0.12, house: 12 }, // Top-right
];

/**
 * Maps a zodiacal house number to its position in the chart based on lagna
 * @param originalHouse - The original house number (1-12)
 * @param lagnaDegrees - The ascendant degrees (0-360)
 * @returns The chart position for the house
 */
export function getChartHouse(originalHouse: number, lagnaDegrees: number): number {
  const lagnaHouse = Math.floor(lagnaDegrees / 30) + 1; // Convert degrees to house (1-12)
  return ((originalHouse - lagnaHouse + 12) % 12) + 1;
}

/**
 * North Indian Drekkana Chart Component
 * 
 * Renders a traditional North Indian style astrological chart with diamond layout.
 * Features double borders, proper house positioning, and customizable styling.
 */
export const NorthDrekkanaChart: React.FC<NorthDrekkanaChartProps> = ({
  lagna,
  houses,
  size = 400,
  title = "North Indian Drekkana Chart",
  debug = false,
}) => {
  const margin = 30;
  const chartSize = size - 2 * margin;
  const centerX = size / 2;
  const centerY = size / 2;

  // Map houses to their chart positions based on lagna
  const mappedHouses: Record<number, HousePosition & { originalHouse: number }> = {};
  (Object.keys(houses) as unknown as HouseNumber[]).forEach(houseNum => {
    const chartPosition = getChartHouse(houseNum, lagna);
    mappedHouses[chartPosition] = {
      ...houses[houseNum],
      originalHouse: houseNum
    };
  });

  return (
    <svg width={size} height={size} className="north-drekkana-chart">
      {/* Background */}
      <rect
        x={margin}
        y={margin}
        width={chartSize}
        height={chartSize}
        fill="#fdf5e6"
      />
      
      {/* Double border - outer */}
      <rect
        x={margin}
        y={margin}
        width={chartSize}
        height={chartSize}
        fill="none"
        stroke="#000"
        strokeWidth={3}
      />
      
      {/* Double border - inner */}
      <rect
        x={margin + 4}
        y={margin + 4}
        width={chartSize - 8}
        height={chartSize - 8}
        fill="none"
        stroke="#000"
        strokeWidth={1}
      />

      {/* Diagonal lines creating triangular sections */}
      <line 
        x1={margin + 4} 
        y1={margin + 4} 
        x2={centerX} 
        y2={centerY} 
        stroke="#000" 
        strokeWidth={1} 
      />
      <line 
        x1={margin + chartSize - 4} 
        y1={margin + 4} 
        x2={centerX} 
        y2={centerY} 
        stroke="#000" 
        strokeWidth={1} 
      />
      <line 
        x1={margin + chartSize - 4} 
        y1={margin + chartSize - 4} 
        x2={centerX} 
        y2={centerY} 
        stroke="#000" 
        strokeWidth={1} 
      />
      <line 
        x1={margin + 4} 
        y1={margin + chartSize - 4} 
        x2={centerX} 
        y2={centerY} 
        stroke="#000" 
        strokeWidth={1} 
      />

      {/* Inner diamond shape */}
      <path
        d={`M ${centerX} ${margin + 4}
            L ${margin + chartSize - 4} ${centerY}
            L ${centerX} ${margin + chartSize - 4}
            L ${margin + 4} ${centerY} Z`}
        fill="none"
        stroke="#000"
        strokeWidth={1}
      />

      {/* House content rendering */}
      {HOUSE_POSITIONS.map((position) => {
        const houseData = mappedHouses[position.house as HouseNumber];
        const x = margin + position.x * chartSize;
        const y = margin + position.y * chartSize;

        return (
          <g key={`house-${position.house}`} className="house-group">
            {/* House number label */}
            <text 
              x={x} 
              y={y - 12} 
              textAnchor="middle" 
              fontSize={12} 
              fontWeight="bold"
              className="house-number"
            >
              {debug 
                ? `H${position.house}/${houseData?.originalHouse || '?'}` 
                : (houseData?.originalHouse || position.house)
              }
            </text>
            
            {/* Debug info - show rashi in debug mode */}
            {debug && houseData && (
              <text 
                x={x} 
                y={y - 25} 
                textAnchor="middle" 
                fontSize={8} 
                fill="#666"
                className="debug-rashi"
              >
                {houseData.rashi}
              </text>
            )}
            
            {/* House content (rashi and grahas) */}
            {houseData && (
              <>
                <text 
                  x={x} 
                  y={y} 
                  textAnchor="middle" 
                  fontSize={10} 
                  fill="#555"
                  className="rashi-text"
                >
                  {houseData.rashi}
                </text>
                <text 
                  x={x} 
                  y={y + 12} 
                  textAnchor="middle" 
                  fontSize={10} 
                  fill="#0066cc"
                  className="graha-text"
                >
                  {houseData.grahas.join(", ")}
                </text>
              </>
            )}
          </g>
        );
      })}

      {/* Chart title */}
      <text
        x={centerX}
        y={20}
        textAnchor="middle"
        fontSize={14}
        fontWeight="bold"
        className="chart-title"
      >
        {title}
      </text>
    </svg>
  );
};

export default NorthDrekkanaChart;