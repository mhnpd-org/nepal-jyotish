// diamond lagna chart
import * as d3 from "d3";
import React, { useEffect, useRef } from "react";
import type { AstronomicalCalculationResult, SiderealPlanetPosition } from "@internal/types/kundali-types";
import { RASHI } from "@internal/types/zodic";

export type ChartProps = {
  data: AstronomicalCalculationResult;
  title?: string; // Chart title (optional)
  size?: number; // chart width/height in px
};

// Corrected house positions for a standard North Indian chart, read counter-clockwise
// The coordinates are for the central point of each house for text placement.
const HOUSE_POSITIONS = [
  { x: 0.5, y: 0.12, textAnchor: "middle" }, // House 1 - Top
  { x: 0.25, y: 0.12, textAnchor: "middle" }, // House 2 - Top-left
  { x: 0.12, y: 0.25, textAnchor: "middle" }, // House 3 - Top-left square
  { x: 0.12, y: 0.75, textAnchor: "middle" }, // House 4 - Left-side
  { x: 0.25, y: 0.88, textAnchor: "middle" }, // House 5 - Bottom-left square
  { x: 0.5, y: 0.88, textAnchor: "middle" }, // House 6 - Bottom-left
  { x: 0.75, y: 0.88, textAnchor: "middle" }, // House 7 - Bottom
  { x: 0.88, y: 0.75, textAnchor: "middle" }, // House 8 - Bottom-right
  { x: 0.88, y: 0.25, textAnchor: "middle" }, // House 9 - Bottom-right square
  { x: 0.75, y: 0.12, textAnchor: "middle" }, // House 10 - Right-side
  { x: 0.75, y: 0.5, textAnchor: "middle" }, // House 11 - Center-right
  { x: 0.25, y: 0.5, textAnchor: "middle" }, // House 12 - Center-left
];


export default function VedicChart({
  data,
  title = "लग्न",
  size = 400
}: ChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!data) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // clear previous

    const margin = 30;
    const chartSize = size - 2 * margin;
    const centerX = size / 2;
    const centerY = size / 2;
    const halfSize = chartSize / 2;

    // Draw the outer square border
    svg
      .append("rect")
      .attr("x", margin)
      .attr("y", margin)
      .attr("width", chartSize)
      .attr("height", chartSize)
      .attr("fill", "#fdf5e6")
      .attr("stroke", "#000")
      .attr("stroke-width", 2);

    // Draw the diagonal lines to create the diamond pattern
    // Main diagonals from corners to center, creating inner diamond
    svg
      .append("line")
      .attr("x1", margin)
      .attr("y1", margin)
      .attr("x2", centerX)
      .attr("y2", centerY)
      .attr("stroke", "#000")
      .attr("stroke-width", 1);

    svg
      .append("line")
      .attr("x1", margin + chartSize)
      .attr("y1", margin)
      .attr("x2", centerX)
      .attr("y2", centerY)
      .attr("stroke", "#000")
      .attr("stroke-width", 1);

    svg
      .append("line")
      .attr("x1", margin + chartSize)
      .attr("y1", margin + chartSize)
      .attr("x2", centerX)
      .attr("y2", centerY)
      .attr("stroke", "#000")
      .attr("stroke-width", 1);

    svg
      .append("line")
      .attr("x1", margin)
      .attr("y1", margin + chartSize)
      .attr("x2", centerX)
      .attr("y2", centerY)
      .attr("stroke", "#000")
      .attr("stroke-width", 1);

    // Draw the inner diamond shape that touches the midpoints of each side
    const diamondPath = `
      M ${centerX} ${margin}
      L ${margin + chartSize} ${centerY}
      L ${centerX} ${margin + chartSize}
      L ${margin} ${centerY}
      Z
    `;

    svg
      .append("path")
      .attr("d", diamondPath)
      .attr("fill", "none")
      .attr("stroke", "#000")
      .attr("stroke-width", 1);

    // Draw rashi numbers and planets using siderealPositions
    for (let house = 1; house <= 12; house++) {
      const pos = HOUSE_POSITIONS[house - 1];
      const x = margin + pos.x * chartSize;
      const y = margin + pos.y * chartSize;

  // Determine rashi index for this house using RASHI enum
  // RASHI array is 0-based where index 0 = Mesha (Aries). Sidereal zodiacSign is 1-based.
  const rashiIndex = (house - 1) % RASHI.length;

      svg
        .append("text")
        .attr("x", x)
        .attr("y", y - 10) // Position above the center point
        .attr("text-anchor", "middle")
        .attr("font-size", 16)
        .attr("font-weight", "bold")
        .attr("fill", "#000")
        .text(rashiIndex + 1);

      // Find and display planets in this house from siderealPositions
      const planetsInHouse = (data.siderealPositions || []).filter((p: SiderealPlanetPosition) => p.house === house);

      planetsInHouse.forEach((planet: SiderealPlanetPosition, index: number) => {
        const planetY = y + 10 + index * 12;
        const planetText = String(planet.planet);

        svg
          .append("text")
          .attr("x", x)
          .attr("y", planetY)
          .attr("text-anchor", "middle")
          .attr("font-size", 12)
          .attr("fill", "#0066cc")
          .text(planetText);
      });
    }

    // Add chart title
    svg
      .append("text")
      .attr("x", centerX)
      .attr("y", 20)
      .attr("text-anchor", "middle")
      .attr("font-size", 16)
      .attr("font-weight", "bold")
      .attr("fill", "#000")
      .text(title);

  }, [data, title, size]);

  return <svg ref={svgRef} width={size} height={size}></svg>;
}