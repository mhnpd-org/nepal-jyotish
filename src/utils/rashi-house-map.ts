import {HouseNumber, Rashi} from '@mhnpd/panchang/enum';

export const RashiHouseMap: Record<Rashi, HouseNumber> = {
  [Rashi.MESH]: 1,        // Aries
  [Rashi.VRISHABH]: 2,    // Taurus
  [Rashi.MITHUN]: 3,      // Gemini
  [Rashi.KARK]: 4,       // Cancer
  [Rashi.SINGH]: 5,       // Leo
  [Rashi.KANYA]: 6,       // Virgo
  [Rashi.TULA]: 7,        // Libra
  [Rashi.VRISCHIK]: 8,    // Scorpio
  [Rashi.DHANU]: 9,       // Sagittarius
  [Rashi.MAKAR]: 10,      // Capricorn
  [Rashi.KUMBH]: 11,     // Aquarius
  [Rashi.MEEN]: 12,       // Pisces
} as const;