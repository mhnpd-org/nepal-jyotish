export const RASHI = [
  'Mesha',
  'Vrishabha',
  'Mithuna',
  'Karka',
  'Simha',
  'Kanya',
  'Tula',
  'Vrischika',
  'Dhanu',
  'Makara',
  'Kumbha',
  'Meena',
] as const;

export type Rashi = (typeof RASHI)[number];

export default RASHI;

export const NAKSHATRA = [
  'Ashwini','Bharani','Krittika','Rohini','Mrigashirsha','Ardra','Punarvasu','Pushya','Ashlesha','Magha','PurvaPhalguni','UttaraPhalguni','Hasta','Chitra','Swati','Vishakha','Anuradha','Jyeshta','Mula','PurvaAshadha','UttaraAshadha','Shravana','Dhanishta','Shatabhisha','PurvaBhadrapada','UttaraBhadrapada','Revati'
] as const;

export type Nakshatra = (typeof NAKSHATRA)[number];

export const HOUSE_LABELS = [
  '1st House','2nd House','3rd House','4th House','5th House','6th House','7th House','8th House','9th House','10th House','11th House','12th House'
] as const;

export type House = (typeof HOUSE_LABELS)[number];