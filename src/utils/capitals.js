const PREFIX_TO_LETTER = {
  E_REVERSED: 'Э',
  HARD_SIGN: 'Ъ',
  SOFT_SIGN: 'Ь',
  Y_SHORT: 'Й',
  SHCH: 'Щ',
  YO: 'Ё',
  ZH: 'Ж',
  TS: 'Ц',
  CH: 'Ч',
  SH: 'Ш',
  KH: 'Х',
  YU: 'Ю',
  YA: 'Я',
  A: 'А',
  B: 'Б',
  V: 'В',
  G: 'Г',
  D: 'Д',
  E: 'Е',
  Z: 'З',
  I: 'И',
  K: 'К',
  L: 'Л',
  M: 'М',
  N: 'Н',
  O: 'О',
  P: 'П',
  R: 'Р',
  S: 'С',
  T: 'Т',
  U: 'У',
  F: 'Ф',
  Y: 'Ы',
};

const prefixes = Object.keys(PREFIX_TO_LETTER).sort((a, b) => b.length - a.length);

const ctx = require.context('../assets/img/capitals', false, /\.png$/);

/** Map of Cyrillic uppercase letter -> image URL */
export const CAPITALS = {};

ctx.keys().forEach((path) => {
  const file = path.replace('./', '');
  const prefix = prefixes.find((p) => file.startsWith(`${p}_`));
  if (!prefix) return;
  const letter = PREFIX_TO_LETTER[prefix];
  CAPITALS[letter] = ctx(path);
});

export function capitalSrc(char) {
  if (!char) return null;
  const upper = char.toLocaleUpperCase('ru-RU');
  if (CAPITALS[upper]) return CAPITALS[upper];

  // Latin letters that share a capital plate with Cyrillic lookalikes
  const latinToCyr = {
    A: 'А',
    B: 'В',
    E: 'Е',
    K: 'К',
    M: 'М',
    H: 'Н',
    O: 'О',
    P: 'Р',
    C: 'С',
    T: 'Т',
    X: 'Х',
  };
  const mapped = latinToCyr[char.toUpperCase()];
  return mapped ? CAPITALS[mapped] || null : null;
}

export function isCapitalLetter(char) {
  return /[A-ZА-ЯЁ]/.test(char);
}

/** @deprecated use isCapitalLetter — kept for hot-reload compatibility */
export const isCyrillicCapital = isCapitalLetter;
