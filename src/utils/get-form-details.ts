import { JanmaDetails } from "@mhnpd/panchang";
import { getEncodedItem, setEncodedItem, type JsonValue } from "./storage";

const KEY = "janmaDetails";

/**
 * Retrieve previously stored form details. Older versions of the code
 * double-stringified the payload, so we detect and transparently fix that
 * by attempting a second JSON.parse if the first result is a string that
 * looks like a serialized object/array.
 */
export function getFormDetails<T extends JsonValue = JsonValue>(): T | undefined {
  const raw = getEncodedItem<JsonValue>(KEY);
  if (typeof raw === "string") {
    const trimmed = raw.trim();
    if ((trimmed.startsWith("{") && trimmed.endsWith("}")) || (trimmed.startsWith("[") && trimmed.endsWith("]"))) {
      try {
        return JSON.parse(trimmed) as T; // migrate old double-encoded value
      } catch {
        // fall through and return raw as-is
      }
    }
  }
  return raw as T | undefined;
}

/**
 * Store form details. We pass the object directly to the encoded storage
 * helper (which already JSON.stringifies) instead of pre-stringifying.
 */
// Accept any value that can be JSON.stringify-ed; we trust caller.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function setFormDetails(details: any) {
  setEncodedItem(KEY, details as JsonValue);
}

export function getJanmaDetails(): JanmaDetails | null {
  const form = getFormDetails();
  if (!form || typeof form !== "object" || Array.isArray(form)) { return null }

  type SavedForm = {
    dateOfBirth?: unknown;
    timeOfBirth?: unknown;
    placeOfBirth?: {
      latitude?: unknown;
      longitude?: unknown;
    };
  };

  const f = form as SavedForm;

  const dateStr = typeof f.dateOfBirth === "string" ? f.dateOfBirth : undefined;
  const timeStr = typeof f.timeOfBirth === "string" ? f.timeOfBirth : undefined;

  // Support both { latitude, longitude } and legacy / district shape { lat, long }
  // DistrictOfNepal provides lat/long, whereas earlier expectation was latitude/longitude.
  // We gracefully fall back so previously saved data works.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const place: any = f.placeOfBirth;
  const latRaw = place?.latitude ?? place?.lat;
  const lonRaw = place?.longitude ?? place?.long;

  const latitude = typeof latRaw === "number"
    ? latRaw
    : (typeof latRaw === "string" && latRaw.trim() !== "" ? Number(latRaw) : undefined);

  const longitude = typeof lonRaw === "number"
    ? lonRaw
    : (typeof lonRaw === "string" && lonRaw.trim() !== "" ? Number(lonRaw) : undefined);

  if (!dateStr || latitude == null || Number.isNaN(latitude) || longitude == null || Number.isNaN(longitude)) {
    return null;
  }

  return {
    dateStr,
    timeStr,
    latitude,
    longitude,
    timeZone: "Asia/Kathmandu"
  } as JanmaDetails;
}
