import mapping from '@internal/i18n/astro-sanskrit.json';

// Mapping of ASCII digits to Devanagari digits
const DEVANAGARI_DIGITS: Record<string, string> = {
  '0': '०',
  '1': '१',
  '2': '२',
  '3': '३',
  '4': '४',
  '5': '५',
  '6': '६',
  '7': '७',
  '8': '८',
  '9': '९'
};

/**
 * AstroTranslator maps any known astronomical / astrological term (planet, rashi, nakshatra, etc.)
 * from any supported input spelling to a normalized Sanskrit (IAST-ish lowercase) form.
 * - Input is lowercased & trimmed before lookup.
 * - If a term is not found, the original (lowercased) string is returned.
 */
export class AstroTranslator {
  private dict: Record<string, string>;

  constructor(extra?: Record<string, string>) {
    this.dict = {...mapping, ...(extra || {})};
  }

  /** Translate a single term to Sanskrit; returns lowercased input if missing */
  translate(term: string | number | null | undefined): string {
    if (!term) return '';
    const key = term.toString().trim().toLowerCase();
    // If the term is purely numeric (e.g. "108"), convert digits to Devanagari and return
    if (/^[0-9]+$/.test(key)) {
      return key.replace(/\d/g, d => DEVANAGARI_DIGITS[d as keyof typeof DEVANAGARI_DIGITS]);
    }
    return this.dict[key] || key;
  }

  /** Translate an array of terms */
  translateAll(terms: Array<string | null | undefined>): string[] {
    return terms.map(t => this.translate(t));
  }

  /** Add or override mappings at runtime */
  extend(entries: Record<string, string>) {
    for (const [k, v] of Object.entries(entries)) {
      this.dict[k.toLowerCase()] = v.toLowerCase();
    }
  }
}

// Singleton default instance
const defaultTranslator = new AstroTranslator();

export function astroTranslate(term: string | number | null | undefined) {
  return defaultTranslator.translate(term);
}

export function astroTranslateAll(terms: Array<string | null | undefined>) {
  return defaultTranslator.translateAll(terms);
}

export function extendAstroTranslations(entries: Record<string, string>) {
  defaultTranslator.extend(entries);
}
