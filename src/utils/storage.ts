/**
 * Simple Base64 wrapper around localStorage for storing & retrieving values.
 * Values are JSON stringified, Base64 encoded on write and reversed on read.
 * Safe to import in Next.js Server Components: runtime checks guard `window`.
 */

type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonValue[] | { [k: string]: JsonValue };

/** Detect if we can use localStorage (browser + not blocked). */
function isLocalStorageUsable(): boolean {
	if (typeof window === 'undefined') return false;
	try {
		const testKey = '__ls_test__';
		window.localStorage.setItem(testKey, '1');
		window.localStorage.removeItem(testKey);
		return true;
	} catch {
		return false;
	}
}

function encodeBase64(raw: string): string {
	try {
		if (typeof window !== 'undefined' && typeof window.btoa === 'function') {
			// Handle possible unicode by first converting to UTF-8 bytes via encodeURIComponent
			return window.btoa(unescape(encodeURIComponent(raw)));
		}
	} catch {
		// fall through to Buffer implementation
	}
	return Buffer.from(raw, 'utf-8').toString('base64');
}

function decodeBase64(b64: string): string {
	try {
		if (typeof window !== 'undefined' && typeof window.atob === 'function') {
			const ascii = window.atob(b64);
			// Reconstruct unicode
			return decodeURIComponent(escape(ascii));
		}
	} catch {
		// fall through
	}
	return Buffer.from(b64, 'base64').toString('utf-8');
}

/**
 * Store a value under a key. Value is JSON serialized then Base64 encoded.
 * Silently no-ops if storage is not available.
 */
export function setEncodedItem(key: string, value: JsonValue): void {
	if (!isLocalStorageUsable()) return;
	try {
		const json = JSON.stringify(value);
		const encoded = encodeBase64(json);
		window.localStorage.setItem(key, encoded);
	} catch {
		// swallow errors intentionally (quota, circular JSON, etc.)
	}
}

/** Retrieve and decode a stored value. Returns undefined if missing or invalid. */
export function getEncodedItem<T extends JsonValue = JsonValue>(key: string): T | undefined {
	if (!isLocalStorageUsable()) return undefined;
	try {
		const stored = window.localStorage.getItem(key);
		if (stored == null) return undefined;
		const json = decodeBase64(stored);
		return JSON.parse(json) as T;
	} catch {
		return undefined; // bad JSON or decode error
	}
}

/** Remove an item (whether encoded or not). */
export function removeItem(key: string): void {
	if (!isLocalStorageUsable()) return;
	try {
		window.localStorage.removeItem(key);
	} catch {
		/* ignore */
	}
}

/** Convenience: clear all stored keys (careful!). */
export function clearAll(): void {
	if (!isLocalStorageUsable()) return;
	try {
		window.localStorage.clear();
	} catch {
		/* ignore */
	}
}

/** Check if a key currently exists in storage. */
export function hasItem(key: string): boolean {
	if (!isLocalStorageUsable()) return false;
	try {
		return window.localStorage.getItem(key) !== null;
	} catch {
		return false;
	}
}

export const encodedStorage = {
	set: setEncodedItem,
	get: getEncodedItem,
	remove: removeItem,
	clear: clearAll,
	has: hasItem,
};

export default encodedStorage;

