import { zonedTimeToUtc } from "date-fns-tz";

function normalizeTimeFormat(time: string): string {
  return time.length === 5 ? `${time}:00` : time;
}

export function convertToUtcDateTime(date: string, time: string, timezone: string): Date {
  const normalizedTime = normalizeTimeFormat(time);
  const localIsoString = `${date}T${normalizedTime}`;
  return zonedTimeToUtc(localIsoString, timezone);
}