// ЙЦУКЕН layout mapped from physical QWERTY key codes
export const LETTERS = [
  { up: 'Ё', down: 'ё', lat: '`', code: 'Backquote' },
  { up: 'Й', down: 'й', lat: 'q', code: 'KeyQ' },
  { up: 'Ц', down: 'ц', lat: 'w', code: 'KeyW' },
  { up: 'У', down: 'у', lat: 'e', code: 'KeyE' },
  { up: 'К', down: 'к', lat: 'r', code: 'KeyR' },
  { up: 'Е', down: 'е', lat: 't', code: 'KeyT' },
  { up: 'Н', down: 'н', lat: 'y', code: 'KeyY' },
  { up: 'Г', down: 'г', lat: 'u', code: 'KeyU' },
  { up: 'Ш', down: 'ш', lat: 'i', code: 'KeyI' },
  { up: 'Щ', down: 'щ', lat: 'o', code: 'KeyO' },
  { up: 'З', down: 'з', lat: 'p', code: 'KeyP' },
  { up: 'Х', down: 'х', lat: '´', code: 'BracketLeft' },
  { up: 'Ъ', down: 'ъ', lat: '+', code: 'BracketRight' },
  { up: 'Ф', down: 'ф', lat: 'a', code: 'KeyA' },
  { up: 'Ы', down: 'ы', lat: 's', code: 'KeyS' },
  { up: 'В', down: 'в', lat: 'd', code: 'KeyD' },
  { up: 'А', down: 'а', lat: 'f', code: 'KeyF' },
  { up: 'П', down: 'п', lat: 'g', code: 'KeyG' },
  { up: 'Р', down: 'р', lat: 'h', code: 'KeyH' },
  { up: 'О', down: 'о', lat: 'j', code: 'KeyJ' },
  { up: 'Л', down: 'л', lat: 'k', code: 'KeyK' },
  { up: 'Д', down: 'д', lat: 'l', code: 'KeyL' },
  { up: 'Ж', down: 'ж', lat: ';', code: 'Semicolon' },
  { up: 'Э', down: 'э', lat: "'", code: 'Quote' },
  { up: 'Я', down: 'я', lat: 'z', code: 'KeyZ' },
  { up: 'Ч', down: 'ч', lat: 'x', code: 'KeyX' },
  { up: 'С', down: 'с', lat: 'c', code: 'KeyC' },
  { up: 'М', down: 'м', lat: 'v', code: 'KeyV' },
  { up: 'И', down: 'и', lat: 'b', code: 'KeyB' },
  { up: 'Т', down: 'т', lat: 'n', code: 'KeyN' },
  { up: 'Ь', down: 'ь', lat: 'm', code: 'KeyM' },
  { up: 'Б', down: 'б', lat: ',', code: 'Comma' },
  { up: 'Ю', down: 'ю', lat: '.', code: 'Period' },
];

export const EXTRA_KEYS = [
  { up: '.', down: '.', lat: '/', code: 'Slash', label: 'punto' },
  { up: '—', down: '-', lat: '-', code: 'Minus', label: 'guion' },
  { up: ',', down: ',', lat: ',', code: 'CommaExtra', label: 'coma' },
];

export const ROWS = [
  LETTERS.slice(0, 13),
  LETTERS.slice(13, 24),
  LETTERS.slice(24),
];

const CODE_MAP = Object.fromEntries(
  [...LETTERS, ...EXTRA_KEYS].map((letter) => [letter.code, letter])
);

CODE_MAP.Space = { up: ' ', down: ' ', lat: ' ', code: 'Space' };

function isUpperCase(e) {
  return e.shiftKey !== e.getModifierState('CapsLock');
}

/** Resolve what Russian char the user meant, regardless of OS keyboard layout. */
export function resolveRuChar(e) {
  if (e.key === ' ' || e.code === 'Space') return ' ';

  // Already Cyrillic from Russian OS layout
  if (/^[А-Яа-яЁё]$/.test(e.key)) return e.key;

  // ё is often on the key left of 1; some layouts report different codes
  if (e.code === 'Backquote' || e.code === 'IntlBackslash' || e.key === '`' || e.key === '~') {
    return isUpperCase(e) ? 'Ё' : 'ё';
  }

  // х: on ES layouts this is often a dead ´ key (BracketLeft). Ignore Shift (¨).
  if (
    e.code === 'BracketLeft' ||
    e.key === '´' ||
    e.key === '¨' ||
    e.key === '[' ||
    e.key === '{' ||
    (e.key === 'Dead' && e.code === 'BracketLeft')
  ) {
    return e.getModifierState('CapsLock') ? 'Х' : 'х';
  }

  // Letter keys on our ЙЦУКЕН map always win (Comma = б, Period = ю)
  const letterMapped = CODE_MAP[e.code];
  if (letterMapped && /[А-Яа-яЁё]/.test(letterMapped.down)) {
    return isUpperCase(e) ? letterMapped.up : letterMapped.down;
  }

  // Russian-style punctuation: / = . and Shift+/ = ,
  if (e.code === 'Slash') {
    return e.shiftKey ? ',' : '.';
  }

  // Literal punctuation from OS or extra keys (Minus, etc.)
  if ([',', '.', '!', '?', ':', ';', '—', '–', '-'].includes(e.key)) {
    return e.key;
  }

  if (letterMapped) {
    return isUpperCase(e) ? letterMapped.up : letterMapped.down;
  }

  return e.key;
}

/** Keys that need preventDefault so OS dead-keys don't swallow the press */
export function shouldPreventKey(e) {
  return (
    e.code === 'BracketLeft' ||
    e.key === 'Dead' ||
    e.key === '´' ||
    e.key === '¨'
  );
}

export function charsMatch(typed, expected) {
  if (!typed || !expected) return false;
  if (typed === expected) return true;

  const a = typed.toLocaleLowerCase('ru-RU');
  const b = expected.toLocaleLowerCase('ru-RU');
  if (a === b) return true;

  // Allow hyphen variants for em dash
  const dashes = new Set(['—', '–', '-']);
  if (dashes.has(typed) && dashes.has(expected)) return true;

  return false;
}
