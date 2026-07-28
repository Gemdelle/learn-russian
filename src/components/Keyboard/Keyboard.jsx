import { useEffect, useState } from 'react';
import { EXTRA_KEYS, ROWS } from '../../utils/russianKeyboard';
import './Keyboard.scss';

function KeyButton({ letter, pressedCode, expectedChar, upper, onVirtualKey }) {
  const expectedLower = expectedChar.toLocaleLowerCase('ru-RU');
  const dashExpected = expectedChar === '—' || expectedChar === '–' || expectedChar === '-';
  const active = pressedCode === letter.code;
  const expected =
    expectedLower === letter.down.toLocaleLowerCase('ru-RU') ||
    (dashExpected && (letter.down === '-' || letter.up === '—'));
  const shown = upper ? letter.up : letter.down;

  return (
    <button
      type="button"
      className={`key ${active ? 'is-active' : ''} ${expected ? 'is-expected' : ''}`}
      onMouseDown={(e) => e.preventDefault()}
      onClick={() => onVirtualKey?.(shown)}
    >
      <span className="key__ru">{shown}</span>
      <span className="key__lat">{letter.lat}</span>
    </button>
  );
}

export default function Keyboard({ expectedChar = '', onVirtualKey }) {
  const [pressedCode, setPressedCode] = useState('');
  const [upper, setUpper] = useState(false);

  useEffect(() => {
    const syncCase = (e) => {
      setUpper(e.shiftKey !== e.getModifierState('CapsLock'));
    };
    const onDown = (e) => {
      syncCase(e);
      setPressedCode(e.code);
    };
    const onUp = (e) => {
      syncCase(e);
      setPressedCode('');
    };
    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);
    return () => {
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
    };
  }, []);

  return (
    <div className="keyboard-inner">
      <div className="keyboard-main">
        {ROWS.map((row, i) => (
          <div className="keyboard-row" key={i}>
            {row.map((letter) => (
              <KeyButton
                key={letter.code}
                letter={letter}
                pressedCode={pressedCode}
                expectedChar={expectedChar}
                upper={upper}
                onVirtualKey={onVirtualKey}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="keyboard-extra">
        {EXTRA_KEYS.map((letter) => (
          <KeyButton
            key={letter.code}
            letter={letter}
            pressedCode={pressedCode}
            expectedChar={expectedChar}
            upper={upper}
            onVirtualKey={onVirtualKey}
          />
        ))}
      </div>
    </div>
  );
}
