import { JanmaDetails, validateJanmaDetails } from "@mhnpd/panchang";
import { getEncodedItem, setEncodedItem, type JsonValue } from "./storage";
import { JanmaFormValues } from "@internal/app/astro/janma/page";

const KEY = "janmaDetails";

/**
 * Retrieve previously stored form details. Older versions of the code
 * double-stringified the payload, so we detect and transparently fix that
 * by attempting a second JSON.parse if the first result is a string that
 * looks like a serialized object/array.
 */
export function getFormDetails<T extends JsonValue = JsonValue>():
  | T
  | undefined {
  const raw = getEncodedItem<JsonValue>(KEY);
  if (typeof raw === "string") {
    const trimmed = raw.trim();
    if (
      (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
      (trimmed.startsWith("[") && trimmed.endsWith("]"))
    ) {
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

export const formatToDDMMYYYY = (date: Date | string): string => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};

export function getJanmaDetails(): JanmaDetails | undefined {
  const form = getFormDetails() as JanmaFormValues | undefined;
  if (!form || !form.dateOfBirth || !/^\d{4}-\d{2}-\d{2}$/.test(form.dateOfBirth)) {
    return undefined; // insufficient data
  }

  const janmaDetails = {
    dateStr: form.dateOfBirth,
    timeStr: form.timeOfBirth || "00:00:00",
    latitude: form.placeOfBirth?.lat,
    longitude: form.placeOfBirth?.long,
    timeZone: "Asia/Kathmandu"
  } as JanmaDetails;

  try {
    validateJanmaDetails(janmaDetails);
  } catch {
    return undefined; // validation failed
  }
  return janmaDetails;
}
