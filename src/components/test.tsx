'use client';
import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

/** Planet (Graha) names */
export type Planet =
  | 'Sun'
  | 'Moon'
  | 'Mars'
  | 'Mercury'
  | 'Venus'
  | 'Jupiter'
  | 'Saturn'
  | 'Rahu'
  | 'Ketu';

/** Zodiac signs (Rashi) - Vedic Sanskrit names */
export type Rashi =
  | 'Mesha'      // Aries
  | 'Vrishabha'  // Taurus
  | 'Mithuna'    // Gemini
  | 'Karka'      // Cancer
  | 'Simha'      // Leo
  | 'Kanya'      // Virgo
  | 'Tula'       // Libra
  | 'Vrishchika' // Scorpio
  | 'Dhanus'     // Sagittarius
  | 'Makara'     // Capricorn
  | 'Kumbha'     // Aquarius
  | 'Meena';     // Pisces

/** Nakshatra (lunar mansion) */
export type Nakshatra =
  | 'Ashwini' | 'Bharani' | 'Krittika' | 'Rohini'
  | 'Mrigashira' | 'Ardra' | 'Punarvasu' | 'Pushya'
  | 'Ashlesha' | 'Magha' | 'Purva Phalguni' | 'Uttara Phalguni'
  | 'Hasta' | 'Chitra' | 'Swati' | 'Vishakha'
  | 'Anuradha' | 'Jyeshtha' | 'Mula' | 'Purva Ashadha'
  | 'Uttara Ashadha' | 'Shravana' | 'Dhanishta' | 'Shatabhisha'
  | 'Purva Bhadrapada' | 'Uttara Bhadrapada' | 'Revati';

/** Bhava qualities */
export type BhavaQuality =
  | 'Masculine'
  | 'Feminine'
  | 'Movable'
  | 'Fixed'
  | 'Common';

/** Detailed planet position */
export interface GrahaPosition {
  graha: Planet;
  longitude: number;   // 0°–360°
  latitude: number;
  rashi: Rashi;
  rashiDegrees: number; // 0°–30°
  nakshatra: Nakshatra;
  nakshatraPada: 1 | 2 | 3 | 4;
  house: number;        // 1–12 based on Lagna
  retrograde: boolean;
}

/** House number type */
export type HouseNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

/** Detailed house (Bhava) info */
export interface HousePosition {
  rashi: Rashi;
  grahas: Planet[];
  owner?: Planet;  // Optional for divisional charts
  qualities?: BhavaQuality[];  // Optional for divisional charts
  aspectedBy?: Planet[];  // Optional for divisional charts
}

/** Unified chart props */
export interface ChartProps {
  /** Lagna / Ascendant in degrees (0°–360°) */
  lagna: number;

  /** Planet positions in the chart */
  planets: GrahaPosition[];

  /** Houses with detailed info (optional for divisional charts) */
  houses?: Record<HouseNumber, HousePosition>;

  /** Chart style (diamond, North Indian, South Indian) */
  chartStyle?: 'diamond' | 'north-indian' | 'south-indian';

  /** Optional flags for visualization */
  showDegrees?: boolean;
  showRetrograde?: boolean;
  showNakshatra?: boolean;
} 

// Visual positions for each slot in the North Indian diamond chart with corresponding house numbers
const HOUSE_POSITIONS = [
  { x: 0.5, y: 0.05, textAnchor: "middle", house: 1 }, // House 1 - Top
  { x: 0.25, y: 0.12, textAnchor: "middle", house: 2 }, // House 2 - Top-left
  { x: 0.12, y: 0.25, textAnchor: "middle", house: 3 }, // House 3 - Left-top
  { x: 0.25, y: 0.5, textAnchor: "middle", house: 4 }, // House 4 - Center-left
  { x: 0.12, y: 0.75, textAnchor: "middle", house: 5 }, // House 5 - Left-bottom
  { x: 0.25, y: 0.88, textAnchor: "middle", house: 6 }, // House 6 - Bottom-left
  { x: 0.5, y: 0.95, textAnchor: "middle", house: 7 }, // House 7 - Bottom
  { x: 0.75, y: 0.88, textAnchor: "middle", house: 8 }, // House 8 - Bottom-right
  { x: 0.88, y: 0.75, textAnchor: "middle", house: 9 }, // House 9 - Right-bottom
  { x: 0.75, y: 0.5, textAnchor: "middle", house: 10 }, // House 10 - Center-right
  { x: 0.88, y: 0.25, textAnchor: "middle", house: 11 }, // House 11 - Right-top
  { x: 0.75, y: 0.12, textAnchor: "middle", house: 12 }, // House 12 - Top-right
];

// Helper function to return Vedic Sanskrit rashi names (already in Vedic format)
const getVedicRashiName = (vedicRashi: Rashi): string => {
  return vedicRashi;
};

const SAMPLE_DATA: ChartProps = {
  lagna: 258.72985963098745,
  planets: [
    { graha: "Sun", longitude: 156.3388495960453, latitude: 0, rashi: "Simha", rashiDegrees: 6.338849596045293, nakshatra: "Uttara Phalguni", nakshatraPada: 3, house: 9, retrograde: false },
    { graha: "Moon", longitude: 205.648133470978, latitude: 0, rashi: "Tula", rashiDegrees: 25.648133470977996, nakshatra: "Vishakha", nakshatraPada: 2, house: 11, retrograde: false },
    { graha: "Mars", longitude: 45.92556877499692, latitude: 0, rashi: "Vrishabha", rashiDegrees: 15.925568774996918, nakshatra: "Rohini", nakshatraPada: 2, house: 6, retrograde: true },
    { graha: "Mercury", longitude: 138.53644437565163, latitude: 0, rashi: "Simha", rashiDegrees: 18.536444375651627, nakshatra: "Purva Phalguni", nakshatraPada: 2, house: 9, retrograde: true },
    { graha: "Jupiter", longitude: 103.30809191854644, latitude: 0, rashi: "Karka", rashiDegrees: 13.308091918546438, nakshatra: "Pushya", nakshatraPada: 3, house: 8, retrograde: true },
    { graha: "Venus", longitude: 146.1202823234114, latitude: 0, rashi: "Simha", rashiDegrees: 26.120282323411402, nakshatra: "Purva Phalguni", nakshatraPada: 4, house: 9, retrograde: true },
    { graha: "Saturn", longitude: 264.97948333020577, latitude: 0, rashi: "Dhanus", rashiDegrees: 24.979483330205767, nakshatra: "Purva Ashadha", nakshatraPada: 4, house: 1, retrograde: true },
    { graha: "Rahu", longitude: 281.09700085916813, latitude: 0, rashi: "Makara", rashiDegrees: 11.097000859168134, nakshatra: "Shravana", nakshatraPada: 1, house: 2, retrograde: true },
    { graha: "Ketu", longitude: 101.09700085916813, latitude: 0, rashi: "Karka", rashiDegrees: 11.097000859168134, nakshatra: "Pushya", nakshatraPada: 3, house: 8, retrograde: true },
  ],
  houses: {
    1: { rashi: "Mesha", grahas: [], owner: "Mars", qualities: ["Masculine", "Movable"], aspectedBy: [] },
    2: { rashi: "Vrishabha", grahas: ["Mars"], owner: "Venus", qualities: ["Feminine", "Fixed"], aspectedBy: [] },
    3: { rashi: "Mithuna", grahas: [], owner: "Mercury", qualities: ["Masculine", "Common"], aspectedBy: ["Saturn"] },
    4: { rashi: "Karka", grahas: ["Jupiter", "Ketu"], owner: "Moon", qualities: ["Feminine", "Movable"], aspectedBy: [] },
    5: { rashi: "Simha", grahas: ["Sun", "Mercury", "Venus"], owner: "Sun", qualities: ["Masculine", "Fixed"], aspectedBy: ["Mars"] },
    6: { rashi: "Kanya", grahas: [], owner: "Mercury", qualities: ["Feminine", "Common"], aspectedBy: ["Saturn"] },
    7: { rashi: "Tula", grahas: ["Moon"], owner: "Venus", qualities: ["Masculine", "Movable"], aspectedBy: [] },
    8: { rashi: "Vrishchika", grahas: [], owner: "Mars", qualities: ["Feminine", "Fixed"], aspectedBy: ["Mars", "Jupiter"] },
    9: { rashi: "Dhanus", grahas: ["Saturn"], owner: "Jupiter", qualities: ["Masculine", "Common"], aspectedBy: ["Mars"] },
    10: { rashi: "Makara", grahas: ["Rahu"], owner: "Saturn", qualities: ["Feminine", "Movable"], aspectedBy: ["Jupiter"] },
    11: { rashi: "Kumbha", grahas: [], owner: "Saturn", qualities: ["Masculine", "Fixed"], aspectedBy: ["Sun", "Mercury", "Venus", "Saturn"] },
    12: { rashi: "Meena", grahas: [], owner: "Jupiter", qualities: ["Feminine", "Common"], aspectedBy: ["Jupiter"] },
  },
};

export const DiamondChart: React.FC<ChartProps & { size?: number; title?: string }> = ({ 
  lagna, 
  planets = [], 
  houses, 
  showDegrees = false, 
  showRetrograde = true, 
  showNakshatra = false, 
  size = 400, 
  title = "North Indian Lagna Chart" 
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // clear previous

    const margin = 30;
    const chartSize = size - 2 * margin;
    const centerX = size / 2;
    const centerY = size / 2;

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

    // North Indian Diamond Chart Layout
    // In this chart, the Lagna (1st house) rotates based on ascendant sign
    // The houses are arranged counter-clockwise starting from a calculated position
    
    // Console log the lagna information for debugging
    console.log("=== CHART PLOTTING DEBUG ===");
    console.log("Using STANDARD North Indian Diamond Chart layout...");
    console.log("TOP=House1, TopRight=House12, Right=House11, etc.");
    console.log("Lagna degrees:", lagna);
    const lagnaRashiIndex = Math.floor((lagna % 360) / 30);
    const rashiNames = ['Mesha', 'Vrishabha', 'Mithuna', 'Karka', 'Simha', 'Kanya',
                       'Tula', 'Vrishchika', 'Dhanus', 'Makara', 'Kumbha', 'Meena'];
    const lagnaRashi = rashiNames[lagnaRashiIndex];
    console.log("Lagna Rashi:", lagnaRashi, "at index:", lagnaRashiIndex);
    
    // Debug planet positions vs house calculations
    console.log("=== PLANET POSITION VERIFICATION ===");
    planets.forEach(planet => {
      const planetRashiIndex = Math.floor((planet.longitude % 360) / 30);
      const planetRashi = rashiNames[planetRashiIndex];
      const calculatedHouse = ((planetRashiIndex - lagnaRashiIndex + 12) % 12) + 1;
      
      console.log(`${planet.graha}:`, {
        longitude: planet.longitude,
        calculatedRashiIndex: planetRashiIndex,
        calculatedRashi: planetRashi,
        dataRashi: planet.rashi,
        calculatedHouse: calculatedHouse,
        dataHouse: planet.house,
        match: calculatedHouse === planet.house && planetRashi === getVedicRashiName(planet.rashi)
      });
    });
    
    // North Indian Diamond Chart Layout now stored directly in HOUSE_POSITIONS array
    // Each position object contains both coordinates and the corresponding house number
    
    // Render all 12 positions with correct North Indian house order
    for (let positionIndex = 0; positionIndex < 12; positionIndex++) {
      const pos = HOUSE_POSITIONS[positionIndex]; // Visual position in diamond
      // Get the house number directly from the position object
      const house = pos.house as HouseNumber;
      const x = margin + pos.x * chartSize;
      const y = margin + pos.y * chartSize;
      const housePosition = houses?.[house];
      
      // Debug: Log each house position and its rashi with DETAILED position info
      const positionNames = [
        'TOP', 'TOP-RIGHT', 'RIGHT-TOP', 'RIGHT-BOTTOM', 
        'BOTTOM-RIGHT', 'BOTTOM', 'BOTTOM-LEFT', 'LEFT-BOTTOM',
        'LEFT-TOP', 'TOP-LEFT', 'CENTER-RIGHT', 'CENTER-LEFT'
      ];
      
      console.log(`=== POSITION ${positionIndex} (${positionNames[positionIndex]}) ===`);
      console.log(`Current House: ${house}`);
      console.log(`Current Rashi: ${housePosition?.rashi || 'N/A'}`);
      
      // Get all planets for this house
      const planetsInHouse = planets.filter(p => p.house === house);
      const planetsFromHouseData = housePosition?.grahas || [];
      const allPlanets = [...planetsInHouse.map(p => p.graha), ...planetsFromHouseData];
      const uniquePlanets = [...new Set(allPlanets)];
      
      console.log(`Planets: ${uniquePlanets.join(', ') || 'None'}`);
      console.log(`Coordinates: (${pos.x}, ${pos.y})`);
      
      // FINAL CORRECT North Indian chart expectations
      const standardExpectations = {
        0: { shouldBe: "House 1", content: "Lagna/Ascendant" }, // TOP
        1: { shouldBe: "House 12", content: "Vyaya Bhava" },   // Top-right
        2: { shouldBe: "House 11", content: "Labha Bhava" },   // Right-top
        3: { shouldBe: "House 9", content: "Dharma Bhava" },   // Right-bottom
        4: { shouldBe: "House 8", content: "Ayu Bhava" },      // Bottom-right
        5: { shouldBe: "House 7", content: "Kalatra Bhava" },  // Bottom
        6: { shouldBe: "House 6", content: "Ari Bhava" },      // Bottom-left
        7: { shouldBe: "House 5", content: "Putra Bhava" },    // Left-bottom
        8: { shouldBe: "House 3", content: "Sahaja Bhava" },   // Left-top
        9: { shouldBe: "House 2", content: "Dhana Bhava" },    // Top-left
        10: { shouldBe: "House 10", content: "Karma Bhava" },  // Center-right
        11: { shouldBe: "House 4", content: "Sukha Bhava" }    // Center-left
      };
      
      const expected = standardExpectations[positionIndex as keyof typeof standardExpectations];
      console.log(`STANDARD EXPECTS: ${expected?.shouldBe} (${expected?.content})`);
      console.log(`CURRENTLY SHOWING: House ${house} with ${housePosition?.rashi || 'N/A'} (${uniquePlanets.join(', ') || 'None'})`);
      
      // Check if this matches the standard
      const expectedHouseNum = parseInt(expected?.shouldBe?.split(' ')[1] || '0');
      const isCorrectHouse = house === expectedHouseNum;
      console.log(`MATCH: ${isCorrectHouse ? '✅ CORRECT' : '❌ WRONG'}`);
      console.log('---');

      // Add hover effect with D3-based styling (no React state to avoid redraws)
      svg
        .append("circle")
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", 30)
        .attr("fill", "transparent")
        .attr("stroke", "none")
        .style("cursor", "pointer")
        .on("mouseenter", function() {
          d3.select(this).attr("fill", "#ffe0b2");
        })
        .on("mouseleave", function() {
          d3.select(this).attr("fill", "transparent");
        });

      // Display position index for debugging (top line in red)
      svg
        .append("text")
        .attr("x", x)
        .attr("y", y - 30)
        .attr("text-anchor", "middle")
        .attr("font-size", 10)
        .attr("font-weight", "bold")
        .attr("fill", "#ff0000")
        .text(`Pos${positionIndex}`);

      // Display house number (middle line in black)
      svg
        .append("text")
        .attr("x", x)
        .attr("y", y - 15)
        .attr("text-anchor", "middle")
        .attr("font-size", 14)
        .attr("font-weight", "bold")
        .attr("fill", "#000")
        .text(`House${house}`);
        
      // Since we now get house directly from HOUSE_POSITIONS, no need for comparison
      // The house should always match the expected value from the position object

      // Display rashi (zodiac sign) for this house in Vedic Sanskrit names
      if (housePosition?.rashi) {
        svg
          .append("text")
          .attr("x", x)
          .attr("y", y - 5)
          .attr("text-anchor", "middle")
          .attr("font-size", 9)
          .attr("fill", "#666")
          .text(getVedicRashiName(housePosition.rashi));
      }

      // Collect all planets for this house (from both sources)
      // First get planets from the planet array that belong to this house
      const planetsFromArray = planets.filter(planet => planet.house === house);
      
      // Then get planets listed in the house data
      const planetsFromHouse = housePosition?.grahas || [];
      
      // Create a comprehensive list avoiding duplicates
      const allPlanetsInHouse = [...planetsFromArray];
      
      // Add planets from houses data that aren't already in planets array
      planetsFromHouse.forEach(grahaName => {
        if (!planetsFromArray.some(p => p.graha === grahaName)) {
          // Create a minimal planet object for house-only planets
          allPlanetsInHouse.push({
            graha: grahaName as Planet,
            longitude: 0,
            latitude: 0,
            rashi: housePosition?.rashi || "Mesha",
            rashiDegrees: 0,
            nakshatra: "Ashwini",
            nakshatraPada: 1,
            house: house,
            retrograde: false
          });
        }
      });

      // Display all planets in the house with better spacing
      allPlanetsInHouse.forEach((planet, index) => {
        let planetText = planet.graha;
        
        // Add retrograde indicator if enabled
        if (showRetrograde && planet.retrograde) {
          planetText += " (R)";
        }
        
        // Add degrees if enabled (only for planets with position data)
        if (showDegrees && planet.longitude > 0) {
          planetText += ` ${planet.rashiDegrees.toFixed(0)}°`;
        }

        // Better vertical spacing to avoid overlap (adjusted for rashi text)
        const planetY = y + 10 + index * 12;

        svg
          .append("text")
          .attr("x", x)
          .attr("y", planetY)
          .attr("text-anchor", "middle")
          .attr("font-size", 11)
          .attr("font-weight", "bold")
          .attr("fill", planet.retrograde ? "#cc6600" : "#0066cc")
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

    // Add lagna degree information with rashi
    if (lagna && typeof lagna === 'number') {
      const lagnaRashiIndex = Math.floor((lagna % 360) / 30);
      const rashiNames = ['Mesha', 'Vrishabha', 'Mithuna', 'Karka', 'Simha', 'Kanya',
                         'Tula', 'Vrishchika', 'Dhanus', 'Makara', 'Kumbha', 'Meena'];
      const lagnaRashi = rashiNames[lagnaRashiIndex];
      const rashiDegrees = lagna % 30;
      
      console.log("=== LAGNA INFO AT BOTTOM ===");
      console.log("Final Lagna display:", `${rashiDegrees.toFixed(1)}° ${lagnaRashi} (${lagna.toFixed(1)}°)`);
      console.log("Chart plotting complete.");
      
      svg
        .append("text")
        .attr("x", centerX)
        .attr("y", size - 10)
        .attr("text-anchor", "middle")
        .attr("font-size", 12)
        .attr("fill", "#666")
        .text(`Lagna: ${rashiDegrees.toFixed(1)}° ${lagnaRashi} (${lagna.toFixed(1)}°)`);
    }

  }, [lagna, planets, houses, showDegrees, showRetrograde, showNakshatra, size, title]);

  return <svg ref={svgRef} width={size} height={size}></svg>;
};

// Demo component using sample data
export const DiamondChartDemo: React.FC<{ size?: number }> = ({ size = 400 }) => {
  return (
    <DiamondChart 
      {...SAMPLE_DATA}
      size={size}
      showRetrograde={true}
      showDegrees={false}
    />
  );
};
