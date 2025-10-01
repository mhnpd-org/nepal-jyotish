"use client";
import React from "react";
import { astroTranslate } from "@internal/lib/astro-translator";
import { BhavaChart, VargasChart } from "@mhnpd/panchang";
import { translateSanskritSafe } from "@internal/lib/devanagari";

/** Props for the North Indian Drekkana Chart component */
export interface NorthDrekkanaChartProps {
  houses: BhavaChart[] | VargasChart[];
  size?: number; // Chart size in pixels
  title?: string; // Chart title
  hideRashi?: boolean; // Option to hide rashi names
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
  { x: 0.75, y: 0.12, house: 12 } // Top-right
];

/**
 * Maps a zodiacal house number to its position in the chart based on lagna
 * @param originalHouse - The original house number (1-12)
 * @param lagnaDegrees - The ascendant degrees (0-360)
 * @returns The chart position for the house
 */
export function getChartHouse(
  originalHouse: number,
  lagnaDegrees: number
): number {
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
  houses,
  size = 400,
  title = "North Indian Drekkana Chart",
  hideRashi = true,
  debug = false
}) => {
  const margin = 30;
  const chartSize = size - 2 * margin;
  const centerX = size / 2;
  const centerY = size / 2;
  // Dynamically scale emblem (Ganesh) sizing relative to overall chart size
  // Previous hard-coded values: clip 70, circle 75, image 140 (for size=400)
  // New sizing reduces footprint ~25% while keeping proportions
  const emblemRadius = size * 0.14; // Outer visible circular border radius
  const clipRadius = emblemRadius - 5; // Slightly smaller for inner clip & image crop
  const imageSize = clipRadius * 2; // Image fits exactly inside clip circle

  return (
    <svg width={size} height={size} className="north-drekkana-chart">
      {/* Background with muted white gradient */}
      <defs>
        <radialGradient id="backgroundGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fefefe" />
          <stop offset="100%" stopColor="#f5f5f4" />
        </radialGradient>

        {/* Circular clipping path for Ganesh image */}
        <clipPath id="circularClip">
          <circle cx={centerX} cy={centerY} r={clipRadius} />
        </clipPath>
      </defs>

      <rect
        x={margin}
        y={margin}
        width={chartSize}
        height={chartSize}
        fill="url(#backgroundGradient)"
      />

      {/* Double border - outer */}
      <rect
        x={margin}
        y={margin}
        width={chartSize}
        height={chartSize}
        fill="none"
        stroke="#dc2626"
        strokeWidth={4}
      />

      {/* Double border - inner */}
      <rect
        x={margin + 4}
        y={margin + 4}
        width={chartSize - 8}
        height={chartSize - 8}
        fill="none"
        stroke="#b91c1c"
        strokeWidth={2}
      />

      {/* Diagonal lines creating triangular sections */}
      <line
        x1={margin + 4}
        y1={margin + 4}
        x2={centerX}
        y2={centerY}
        stroke="#dc2626"
        strokeWidth={2}
      />
      <line
        x1={margin + chartSize - 4}
        y1={margin + 4}
        x2={centerX}
        y2={centerY}
        stroke="#dc2626"
        strokeWidth={2}
      />
      <line
        x1={margin + chartSize - 4}
        y1={margin + chartSize - 4}
        x2={centerX}
        y2={centerY}
        stroke="#dc2626"
        strokeWidth={2}
      />
      <line
        x1={margin + 4}
        y1={margin + chartSize - 4}
        x2={centerX}
        y2={centerY}
        stroke="#dc2626"
        strokeWidth={2}
      />

      {/* Inner diamond shape */}
      <path
        d={`M ${centerX} ${margin + 4}
            L ${margin + chartSize - 4} ${centerY}
            L ${centerX} ${margin + chartSize - 4}
            L ${margin + 4} ${centerY} Z`}
        fill="none"
        stroke="#dc2626"
        strokeWidth={3}
      />

      {/* Circular white background for Ganesh image */}
      <circle
        cx={centerX}
        cy={centerY}
        r={emblemRadius}
        fill="#ffffff"
        className="ganesh-backdrop"
      />

      {/* Ganesh background image in center - circular clipped */}
      <image
        x={centerX - imageSize / 2}
        y={centerY - imageSize / 2}
        width={imageSize}
        height={imageSize}
        href="/ganesh.png"
        clipPath="url(#circularClip)"
        className="ganesh-background"
      />

      {/* Circular border around Ganesh image */}
      <circle
        cx={centerX}
        cy={centerY}
        r={emblemRadius}
        fill="none"
        stroke="#dc2626"
        strokeWidth={3}
        className="ganesh-border"
      />

      {/* House content rendering */}
      {HOUSE_POSITIONS.map((position) => {
        const { house } = position;
        const x = margin + position.x * chartSize;
        const y = margin + position.y * chartSize;
        const houseData = houses.find((h) => h.northChartHouseNumber === house);
        if (!houseData) return null;
        const rashi = translateSanskritSafe(houseData.rashi!);
        const rashiNumber = translateSanskritSafe(`${houseData.rashiNumber!}`);
        const grahas = houseData?.planets || [];

        return (
          <g key={`house-${house}`} className="house-group">
            {/* House number label - Original House styling */}
            <text
              x={x}
              y={y - 15}
              textAnchor="middle"
              fontSize={14}
              fontWeight="600"
              fill="#8b4513"
              className="house-number"
              style={{ textShadow: "0 1px 2px rgba(0,0,0,0.1)" }}
            >
              {rashiNumber}
            </text>

            {/* Debug info - show rashi in debug mode */}
            {debug && houseData && (
              <text
                x={x}
                y={y - 28}
                textAnchor="middle"
                fontSize={8}
                fill="#718096"
                className="debug-rashi"
              >
                {rashi}
              </text>
            )}

            {/* House content (rashi and grahas) */}
              <>
                {/* Rashi styling */}
                <text
                  x={x}
                  y={y}
                  textAnchor="middle"
                  fontSize={12}
                  fontWeight="500"
                  fill="#cd5c5c"
                  className="rashi-text"
                  style={{ textShadow: "0 1px 2px rgba(0,0,0,0.1)" }}
                >
                  {!hideRashi && <>{rashi}</>}
                </text>
                {/* Planets styling */}
                <text
                  x={x}
                  y={y + 16}
                  textAnchor="middle"
                  fontSize={11}
                  fontWeight="500"
                  fill="#a0522d"
                  className="graha-text"
                  style={{ textShadow: "0 1px 2px rgba(0,0,0,0.1)" }}
                >
                  {grahas.map(g => translateSanskritSafe(g)).join(", ")}
                </text>
              </>
          </g>
        );
      })}

      {/* Chart title */}
      <text
        x={centerX}
        y={22}
        textAnchor="middle"
        fontSize={16}
        fontWeight="600"
        fill="#8b4513"
        className="chart-title"
        style={{ textShadow: "0 2px 4px rgba(0,0,0,0.1)" }}
      >
        {astroTranslate(title.toLowerCase()) || title}
      </text>
    </svg>
  );
};

export default NorthDrekkanaChart;
