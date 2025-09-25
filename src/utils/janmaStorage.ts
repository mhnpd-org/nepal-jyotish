import { JanmaDetails } from '@mhnpd/panchang';

// Key used in localStorage
const STORAGE_KEY = 'janma.form.v1';

export type JanmaForm = {
  name?: string;
  datetime: string; // YYYY-MM-DDTHH:mm (HTML datetime-local)
  latitude: string;
  longitude: string;
  place?: string;
  timezone: string;
};

/**
 * Save the janma form to localStorage. This will overwrite any existing value.
 */
export function saveJanmaForm(form: JanmaForm): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
  } catch (e) {
    // ignore quota / private mode issues
    console.warn('Failed to save janma form to localStorage', e);
  }
}

/**
 * Load the janma form previously saved, or null if none.
 */
export function loadJanmaForm(): JanmaForm | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as JanmaForm;
  } catch (e) {
    console.warn('Failed to read janma form from localStorage', e);
    return null;
  }
}

/**
 * Remove saved janma form from storage.
 */
export function clearJanmaForm(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn('Failed to clear janma form from localStorage', e);
  }
}

/**
 * Build and return a JanmaDetails object from saved form (or provided override).
 * Behavior:
 * - If `JanmaDetails` from '@mhnpd/panchang' is a function/factory, we call it
 *   with a normalized payload and return the result.
 * - Otherwise we return a plain object cast to `JanmaDetails`.
 *
 * Note: We make reasonable assumptions about the expected shape: numeric
 * latitude/longitude and an ISO-ish datetime string. Adjust mapping if the
 * upstream `JanmaDetails` expects different field names.
 */
export function getJanmaDetails(override?: JanmaForm): JanmaDetails | null {
  const form = override ?? loadJanmaForm();
  if (!form) return null;
  // form.datetime is expected in HTML datetime-local format: YYYY-MM-DDTHH:mm
  const dtRaw = form.datetime;
  if (!dtRaw) {
    console.warn('getJanmaDetails: missing datetime in stored form');
    return null;
  }

  let dateStr = '';
  let timeStr = '';

  // accept either 'T' or space as separator (some inputs may use a space)
  const parts = dtRaw.split(/T|\s/);
  if (parts.length >= 1) {
    dateStr = (parts[0] || '').trim();
  }

  if (parts.length >= 2 && parts[1]) {
    // parts[1] may be HH:mm or HH:mm:ss or include fractions. Normalize to HH:mm:ss
    const rawTime = parts[1].split('.')[0]; // drop fraction if present
    const timeParts = rawTime.split(':');
    if (timeParts.length === 2) {
      timeStr = `${timeParts[0].padStart(2, '0')}:${timeParts[1].padStart(2, '0')}:00`;
    } else if (timeParts.length >= 3) {
      // keep HH:mm:ss
      timeStr = `${timeParts[0].padStart(2, '0')}:${timeParts[1].padStart(2, '0')}:${timeParts[2].padStart(2, '0')}`;
    }
  }

  // Validate dateStr format YYYY-MM-DD; try to coerce if possible
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateStr)) {
    // attempt to parse with Date as a last resort
    const parsed = new Date(dtRaw);
    if (!isNaN(parsed.getTime())) {
      // toISOString gives UTC date; use local date portion to be safe
      const iso = parsed.toISOString();
      dateStr = iso.slice(0, 10);
    } else {
      console.warn(`getJanmaDetails: Invalid dateStr format (expected YYYY-MM-DD): ${dateStr}`);
      return null;
    }
  }

  // Fallback sensible defaults if time parsing failed
  if (!timeStr) {
    timeStr = '00:00:00';
  }

  // Validate numeric coordinates
  const lon = Number(form.longitude);
  const lat = Number(form.latitude);
  if (!isFinite(lon) || !isFinite(lat)) {
    console.warn('getJanmaDetails: invalid numeric coordinates', { longitude: form.longitude, latitude: form.latitude });
    return null;
  }

  const node: JanmaDetails = {
    dateStr,
    timeStr,
    timeZone: form.timezone,
    longitude: lon,
    latitude: lat,
  };

  return node;
}
