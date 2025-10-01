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