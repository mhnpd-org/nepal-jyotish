'use client';
import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";

export type Planet = string;
export type Rashi = string;
export type BhavaQuality = string;

export interface BhavaData {
  rashi: Rashi;
  grahas: Planet[];
  owner: Planet;
  qualities: BhavaQuality[];
  aspectedBy: Planet[];
}

export interface BhavasChartData {
  bhavas: Record<number, BhavaData>; // 1..12
}

interface ChartProps {
  data: BhavasChartData;
  size?: number; // chart width/height
  title?: string;
}

interface HouseShape {
  id: number; // 1..12
  points: string; // polygon points
  center: { x: number; y: number };
}

// Diamond/North Indian chart coordinates
const DIAMOND_HOUSES: HouseShape[] = [
  { id: 1, points: "200,0 266,66 200,133 133,66", center: { x: 200, y: 50 } },
  { id: 2, points: "266,66 333,133 266,200 200,133", center: { x: 266, y: 100 } },
  { id: 3, points: "200,133 266,200 200,266 133,200", center: { x: 200, y: 200 } },
  { id: 4, points: "133,200 66,266 0,200 66,133", center: { x: 100, y: 200 } },
  { id: 5, points: "0,66 66,133 0,200 -66,133", center: { x: 50, y: 100 } },
  { id: 6, points: "200,0 266,66 200,133 133,66", center: { x: 200, y: 50 } },
  { id: 7, points: "266,66 333,133 266,200 200,133", center: { x: 266, y: 100 } },
  { id: 8, points: "200,133 266,200 200,266 133,200", center: { x: 200, y: 200 } },
  { id: 9, points: "133,200 66,266 0,200 66,133", center: { x: 100, y: 200 } },
  { id: 10, points: "0,66 66,133 0,200 -66,133", center: { x: 50, y: 100 } },
  { id: 11, points: "200,0 266,66 200,133 133,66", center: { x: 200, y: 50 } },
  { id: 12, points: "266,66 333,133 266,200 200,133", center: { x: 266, y: 100 } },
];

export const DiamondBhavaChart: React.FC<ChartProps> = ({
  data,
  size = 400,
  title = "Bhava Chart",
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [hoveredHouse, setHoveredHouse] = useState<number | null>(null);

  useEffect(() => {
    if (!data) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = 20;
    const chartSize = size - 2 * margin;

    // Draw outer border
    svg
      .append("rect")
      .attr("x", margin)
      .attr("y", margin)
      .attr("width", chartSize)
      .attr("height", chartSize)
      .attr("fill", "#fdf5e6")
      .attr("stroke", "#000")
      .attr("stroke-width", 2);

    // Draw houses
    DIAMOND_HOUSES.forEach((houseShape, index) => {
      const houseNumber = houseShape.id;

      const houseData = data.bhavas[houseNumber];
      const fillColor = hoveredHouse === houseNumber ? "#ffe0b2" : "#fdf5e6";

      // House polygon
      svg
        .append("polygon")
        .attr("points", houseShape.points)
        .attr("fill", fillColor)
        .attr("stroke", "#000")
        .attr("stroke-width", 1)
        .on("mouseenter", () => setHoveredHouse(houseNumber))
        .on("mouseleave", () => setHoveredHouse(null));

      // House number
      svg
        .append("text")
        .attr("x", houseShape.center.x)
        .attr("y", houseShape.center.y - 10)
        .attr("text-anchor", "middle")
        .attr("font-size", 16)
        .attr("font-weight", "bold")
        .text(houseNumber);

      // Planets in this house
      if (houseData?.grahas) {
        houseData.grahas.forEach((planet, idx) => {
          svg
            .append("text")
            .attr("x", houseShape.center.x)
            .attr("y", houseShape.center.y + idx * 14)
            .attr("text-anchor", "middle")
            .attr("font-size", 12)
            .attr("fill", "#0066cc")
            .text(planet);
        });
      }

      // Optional: Show Rashi owner or qualities
      if (houseData?.owner) {
        svg
          .append("text")
          .attr("x", houseShape.center.x)
          .attr("y", houseShape.center.y + 50)
          .attr("text-anchor", "middle")
          .attr("font-size", 10)
          .attr("fill", "#a52a2a")
          .text(`Owner: ${houseData.owner}`);
      }
    });

    // Chart title
    svg
      .append("text")
      .attr("x", size / 2)
      .attr("y", margin)
      .attr("text-anchor", "middle")
      .attr("font-size", 18)
      .attr("font-weight", "bold")
      .text(title);
  }, [data, hoveredHouse, size, title]);

  return <svg ref={svgRef} width={size} height={size}></svg>;
};
