import React, { useState, useEffect, useCallback, useRef } from 'react';
import './styles/Reading.css';

export default function Reading() {
    const [pressedKey, setPressedKey] = useState({});
    const [isCapsLock, setIsCapsLock] = useState(false);
    const [isShiftPressed, setIsShiftPressed] = useState(false);
    const [currentWordIndex, setCurrentWordIndex] = useState(-1);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [voices, setVoices] = useState([]);
    const [selectedVoice, setSelectedVoice] = useState(null);
    const utteranceRef = useRef(null);
    const [currentCharIndex, setCurrentCharIndex] = useState(0);
    const maxSpeechChars = 200;

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

    const phrase = "В лесу жил маленький кролик по имени Зайка. Однажды он нашел забор и пролез под ним. Там открылся волшебный сад с огромными морковками и сладкими яблоками. Зайка радостно начал их собирать, но вдруг увидел медведя. Напуганный, он быстро вернулся в свою нору, успев скрыться от опасности. С тех пор Зайка продолжал исследовать лес, но стал гораздо осторожнее, понимая, что мир полон как чудес, так и опасностей.";

    const words = phrase.split(/\s+/);

    useEffect(() => {
        const loadVoices = () => {
            const availableVoices = window.speechSynthesis.getVoices();
            const russianVoices = availableVoices.filter(voice => voice.lang.startsWith('ru'));
            setVoices(russianVoices);
            if (russianVoices.length > 0) {
                setSelectedVoice(russianVoices[0]);
            }
        };

        loadVoices();

        if (window.speechSynthesis.onvoiceschanged !== undefined) {
            window.speechSynthesis.onvoiceschanged = loadVoices;
        }
    }, []);

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

    const speakPhrase = useCallback(() => {
        if (isSpeaking) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
            setCurrentWordIndex(-1);
            setCurrentCharIndex(0);
            return;
        }

        if (!selectedVoice) {
            alert("Please select a voice first.");
            return;
        }

        setIsSpeaking(true);
        setCurrentWordIndex(0);
        setCurrentCharIndex(0);

        const speakChunk = (startIndex) => {
            const endIndex = Math.min(startIndex + maxSpeechChars, phrase.length);
            const chunk = phrase.substring(startIndex, endIndex);

            const utterance = new SpeechSynthesisUtterance(chunk);
            utterance.voice = selectedVoice;
            utterance.lang = 'ru-RU';

            utteranceRef.current = utterance;

            utterance.onboundary = (event) => {
                const globalCharIndex = startIndex + event.charIndex;
                setCurrentCharIndex(globalCharIndex);

                const wordIndex = words.findIndex((word, index) => {
                    const wordStartChar = words.slice(0, index).join(' ').length;
                    const wordEndChar = wordStartChar + word.length;
                    return globalCharIndex >= wordStartChar && globalCharIndex < wordEndChar;
                });
                setCurrentWordIndex(wordIndex);
            };

            utterance.onend = () => {
                if (endIndex < phrase.length) {
                    speakChunk(endIndex);
                } else {
                    setIsSpeaking(false);
                    setCurrentWordIndex(-1);
                    setCurrentCharIndex(0);
                }
            };
            window.utterances = [];
            window.utterances.push(utterance);
            window.speechSynthesis.speak(utterance);
        };

        speakChunk(0);
    }, [phrase, isSpeaking, words, selectedVoice]);

    useEffect(() => {
        return () => {
            if (utteranceRef.current) {
                window.speechSynthesis.cancel();
            }
        };
    }, []);

    return (
        <>
            <VoiceSelector voices={voices} selectedVoice={selectedVoice} onVoiceChange={setSelectedVoice} />
            <BottomText
                words={words}
                pressedKey={pressedKey}
                currentWordIndex={currentWordIndex}
                currentCharIndex={currentCharIndex}
            />
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
            <button onClick={speakPhrase} className="speak-button" disabled={!selectedVoice}>
                {isSpeaking ? 'Stop Reading' : 'Read Phrase'}
            </button>
        </>
    );
}

function VoiceSelector({ voices, selectedVoice, onVoiceChange }) {
    return (
        <div className="voice-selector">
            <label htmlFor="voice-select">Select a Russian voice: </label>
            <select
                id="voice-select"
                value={selectedVoice ? selectedVoice.name : ''}
                onChange={(e) => onVoiceChange(voices.find(voice => voice.name === e.target.value))}
            >
                {voices.length === 0 && <option value="">No Russian voices available</option>}
                {voices.map((voice) => (
                    <option key={voice.name} value={voice.name}>
                        {voice.name} ({voice.lang})
                    </option>
                ))}
            </select>
        </div>
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

function BottomText({ words, pressedKey, currentWordIndex, currentCharIndex }) {
    return (
        <div className='bottom-text'>
            {words.map((word, index) => {
                const wordStartIndex = words.slice(0, index).join(' ').length + (index > 0 ? 1 : 0);
                const wordEndIndex = wordStartIndex + word.length;
                const isCurrentWord = currentCharIndex >= wordStartIndex && currentCharIndex < wordEndIndex;

                return (
                    <span
                        key={word + index}
                        className={isCurrentWord ? 'current' : ''}
                    >
                        {isCurrentWord ? (
                            <>
                                <span className="spoken">{word.slice(0, currentCharIndex - wordStartIndex)}</span>
                                <span className="speaking">{word.slice(currentCharIndex - wordStartIndex)}</span>
                            </>
                        ) : (
                            word
                        )}
                        {' '}
                    </span>
                );
            })}
        </div>
    );
}