import mapping from '@internal/i18n/astro-sanskrit.json';

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
  translate(term: string | null | undefined): string {
    if (!term) return '';
    const key = term.toString().trim().toLowerCase();
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

export function astroTranslate(term: string | null | undefined) {
  return defaultTranslator.translate(term);
}

export function astroTranslateAll(terms: Array<string | null | undefined>) {
  return defaultTranslator.translateAll(terms);
}

export function extendAstroTranslations(entries: Record<string, string>) {
  defaultTranslator.extend(entries);
}
