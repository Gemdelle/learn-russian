import React, { useState, useEffect, useCallback } from 'react';
import './styles/Keyboard.css';

const phrases = [
    "В лесу жил маленький кролик по имени Зайка. Однажды он нашел забор и пролез под ним. Там открылся волшебный сад с огромными морковками и сладкими яблоками. Зайка радостно начал их собирать, но вдруг увидел медведя. Напуганный, он быстро вернулся в свою нору, успев скрыться от опасности. С тех пор Зайка продолжал исследовать лес, но стал гораздо осторожнее, понимая, что мир полон как чудес, так и опасностей.",
    "В озере жила черепаха по имени Тортилла, которая была медлительной и спокойной. Однажды в озере появился быстрый утенок, который смеялся над ней. Он предложил ей состязание по плаванию через озеро. Утенок быстро устал и остановился отдохнуть, а черепаха продолжала плыть медленно, но не останавливаясь. В итоге черепаха пришла к финишу первой. Утенок извинился за насмешки, и они стали друзьями, научившись ценить упорство и терпение друг друга."
];
export default function Keyboard() {
    const [pressedKey, setPressedKey] = useState({});
    const [isCapsLock, setIsCapsLock] = useState(false);
    const [isShiftPressed, setIsShiftPressed] = useState(false);
    const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);

    const phrase = phrases[currentPhraseIndex];

    const letters = [
        { 0: 'Й', 1: 'й', 2: 'q' }, { 0: 'Ц', 1: 'ц', 2: 'w' }, { 0: 'У', 1: 'у', 2: 'e' }, { 0: 'К', 1: 'к', 2: 'r' },
        { 0: 'Е', 1: 'е', 2: 't' }, { 0: 'Н', 1: 'н', 2: 'y' }, { 0: 'Г', 1: 'г', 2: 'u' }, { 0: 'Ш', 1: 'ш', 2: 'i' },
        { 0: 'Щ', 1: 'щ', 2: 'o' }, { 0: 'З', 1: 'з', 2: 'p' }, { 0: 'Х', 1: 'х', 2: '´' }, { 0: 'Ъ', 1: 'ъ', 2: '+' },
        { 0: 'Ф', 1: 'ф', 2: 'a' }, { 0: 'Ы', 1: 'ы', 2: 's' }, { 0: 'В', 1: 'в', 2: 'd' }, { 0: 'А', 1: 'а', 2: 'f' },
        { 0: 'П', 1: 'п', 2: 'g' }, { 0: 'Р', 1: 'р', 2: 'h' }, { 0: 'О', 1: 'о', 2: 'j' }, { 0: 'Л', 1: 'л', 2: 'k' },
        { 0: 'Д', 1: 'д', 2: 'l' }, { 0: 'Ж', 1: 'ж', 2: 'ñ' }, { 0: 'Э', 1: 'э', 2: '{' }, { 0: 'Я', 1: 'я', 2: 'z' },
        { 0: 'Ч', 1: 'ч', 2: 'x' }, { 0: 'С', 1: 'с', 2: 'c' }, { 0: 'М', 1: 'м', 2: 'v' }, { 0: 'И', 1: 'и', 2: 'b' },
        { 0: 'Т', 1: 'т', 2: 'n' }, { 0: 'Ь', 1: 'ь', 2: 'm' }, { 0: 'Б', 1: 'б', 2: ',' }, { 0: 'Ю', 1: 'ю', 2: '.' },
    ];

    const handleKeyPress = (e) => {
        if (e.key === 'CapsLock') {
            setIsCapsLock(prev => !prev);
        } else if (e.key === 'Shift') {
            setIsShiftPressed(true);
        } else {
            setPressedKey({ key: e.key });
        }
    };

    const handleKeyRelease = (e) => {
        if (e.key === 'Shift') {
            setIsShiftPressed(false);
        }
    };

    useEffect(() => {
        document.addEventListener('keydown', handleKeyPress);
        document.addEventListener('keyup', handleKeyRelease);

        return () => {
            document.removeEventListener('keydown', handleKeyPress);
            document.removeEventListener('keyup', handleKeyRelease);
        };
    }, []);

    return (
        <>
            <BottomText phrase={phrase} setCurrentPhraseIndex={setCurrentPhraseIndex} pressedKey={pressedKey} />
            <div className='keyboard'>
                <Row
                    letters={letters.slice(0, 12)}
                    pressedKey={pressedKey}
                    isUpperCase={isCapsLock || isShiftPressed}
                />
                <Row
                    letters={letters.slice(12, 23)}
                    pressedKey={pressedKey}
                    isUpperCase={isCapsLock || isShiftPressed}
                />
                <Row
                    letters={letters.slice(23)}
                    pressedKey={pressedKey}
                    isUpperCase={isCapsLock || isShiftPressed}
                />
            </div>
        </>
    );
}

function Row({ letters, pressedKey, isUpperCase }) {
    return (
        <div className='row'>
            {letters.map((letter) => (
                <Letter key={letter[0]} letter={letter} pressedKey={pressedKey} isUpperCase={isUpperCase} />
            ))}
        </div>
    );
}

function Letter({ letter, pressedKey, isUpperCase }) {
    const [wasPressed, setWasPressed] = useState(false);

    useEffect(() => {
        const displayedLetter = isUpperCase ? letter[0] : letter[1];
        if (pressedKey.key === displayedLetter) {
            setWasPressed(true);
        }

        const interval = setInterval(() => {
            setWasPressed(false);
        }, 500);

        return () => {
            clearInterval(interval);
        };
    }, [letter, pressedKey, isUpperCase]);

    return (
        <div className={`letter ${wasPressed ? 'active-letter' : ''}`}>
            <span>{isUpperCase ? letter[0] : letter[1]}</span>
            <span>{letter[2]}</span>
        </div>
    );
}

function BottomText({ phrase, setCurrentPhraseIndex, pressedKey }) {
    const phraseArray = phrase.split('');
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const currentChar = phraseArray[activeIndex];
        if (pressedKey.key && currentChar && pressedKey.key.charCodeAt(0) === currentChar.charCodeAt(0)) {
            const nextValidIndex = phraseArray.findIndex(
                (char, index) => index > activeIndex && /[ЁёА-я]/.test(char)
            );
            if (nextValidIndex !== -1) {
                setActiveIndex(nextValidIndex);
            } else {
                // Phrase completed, change to next phrase
                setCurrentPhraseIndex((prevIndex) => (prevIndex + 1) % phrases.length);
                setActiveIndex(0);
            }
        }
    }, [pressedKey, activeIndex, phraseArray, setCurrentPhraseIndex]);

    return (
        <div className='bottom-text'>
            {phraseArray.map((letter, index) => (
                <span
                    key={letter + index}
                    className={`${
                        index === activeIndex
                            ? 'current'
                            : index < activeIndex
                                ? 'enabled'
                                : 'disable'
                    }`}
                >
                    {letter}
                </span>
            ))}
        </div>
    );
}