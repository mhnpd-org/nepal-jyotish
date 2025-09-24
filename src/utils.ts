export function getChartHouse(originalHouse: number, lagnaDegrees: number) {
  const lagnaHouse = Math.floor(lagnaDegrees / 30) + 1; // 1-12
  // Formula to map original house to chart house
  return ((originalHouse - lagnaHouse + 12) % 12) + 1;
}