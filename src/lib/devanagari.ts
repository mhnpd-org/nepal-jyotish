/** Utility helpers for Sanskrit / Devanagari presentation */
import { translateToSanskrit } from '@mhnpd/panchang';

// Map arabic numerals to Devanagari digits
const DIGIT_MAP: Record<string,string> = {"0":"०","1":"१","2":"२","3":"३","4":"४","5":"५","6":"६","7":"७","8":"८","9":"९"};

/** Convert any ASCII digits in a string to Devanagari numerals */
export function toDevanagariDigits(input: string): string {
  return input.replace(/\d/g, d => DIGIT_MAP[d] ?? d);
}

/** Attempt Sanskrit translation then convert digits; safe fallback */
export function translateSanskritSafe(value: string | undefined | null): string {
  if (!value) return '';
  try {
    const t = translateToSanskrit(value) || value;
    return toDevanagariDigits(t);
  } catch {
    return toDevanagariDigits(value);
  }
}

/** Create a fixed-width placeholder using NBSPs to preserve layout */
export function placeholder(width = 12): string {
  return new Array(width + 1).join('\u00A0');
}
