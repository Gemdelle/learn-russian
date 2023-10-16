import './styles/Keyboard.css'
import { useState, useEffect } from 'react';

export default function Keyboard() {
  const [pressedKey, setPressedKey] = useState({})
  const letters =
    [
      {0:'Й', 1: 'й', 2: 'q'},{0:'Ц', 1: 'ц', 2: 'w'},{0:'У', 1: 'у', 2: 'e'},{0:'К', 1: 'к', 2: 'r'},
      {0:'Е', 1: 'е', 2: 't'},{0:'Н', 1: 'н', 2: 'y'},{0:'Г', 1: 'г', 2: 'u'},{0:'Ш', 1: 'ш', 2: 'i'},
      {0:'Щ', 1: 'щ', 2: 'o'},{0:'З', 1: 'з', 2: 'p'},{0:'Х', 1: 'х', 2: '´'},{0:'Ъ', 1: 'ъ', 2: '+'},
      {0:'Ф', 1: 'ф', 2: 'a'},{0:'Ы', 1: 'ы', 2: 's'},{0:'В', 1: 'в', 2: 'd'},{0:'А', 1: 'а', 2: 'f'},
      {0:'П', 1: 'п', 2: 'g'},{0:'Р', 1: 'р', 2: 'h'},{0:'О', 1: 'о', 2: 'j'},{0:'Л', 1: 'л', 2: 'k'},
      {0:'Д', 1: 'д', 2: 'l'},{0:'Ж', 1: 'ж', 2: 'ñ'},{0:'Э', 1: 'э', 2: '{'},{0:'Я', 1: 'я', 2: 'z'},
      {0:'Ч', 1: 'ч', 2: 'x'},{0:'С', 1: 'с', 2: 'c'},{0:'М', 1: 'м', 2: 'v'},{0:'И', 1: 'и', 2: 'b'},
      {0:'Т', 1: 'т', 2: 'n'},{0:'Ь', 1: 'ь', 2: 'm'},{0:'Б', 1: 'б', 2: ','},{0:'Ю', 1: 'ю', 2: '.'},
    ];
  const phrase = "Привет, как дела?";

  const handleKeyPress = (e) => {
    setPressedKey({ key: e.key.toLowerCase()})
  };

  useEffect(() => {
    document.addEventListener('keypress', handleKeyPress);

    return () => {
      document.removeEventListener('keypress', handleKeyPress);
    };
  }, []);

  return (
    <>
      <div className='keyboard'>
          <Row letters={letters.slice(0,12)} pressedKey={pressedKey}/>
          <Row letters={letters.slice(12,23)} pressedKey={pressedKey}/>
          <Row letters={letters.slice(23)} pressedKey={pressedKey}/>
      </div>
      <BottomText phrase={phrase} pressedKey={pressedKey}/>
    </>
  )
}

function Row({ letters, pressedKey }) {
  return (
    <div className='row'>
      {
        letters.map((letter) => {
          return (
            <Letter key={letter[0]} letter={letter} pressedKey={pressedKey}/>
          )
        })
      }
    </div>
  )
}

function Letter({ letter, pressedKey }) {
  const [wasPressed, setWasPressed] = useState(false)

  useEffect(() => {
    if(pressedKey.key?.toLowerCase() === letter[1]) {
      setWasPressed(true)
    }

    const interval = setInterval(() => {
      setWasPressed(false)
    },500)

    return () => {
      clearInterval(interval)
    }
  }, [letter, pressedKey])

  return (
    <div className={`letter ${wasPressed ? 'active-letter' : ''}`}>
      <span>{letter[0]}</span>
      <span>{letter[2]}</span>
    </div>
  )
}

function BottomText({ phrase, pressedKey }) {
  const phraseArray = phrase.split('')
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    if(activeIndex < phrase.length - 1 ) {
      if(pressedKey.key === phrase[activeIndex].toLowerCase()) {
        const nextValidIndex = phraseArray.findIndex((char, index) => index > activeIndex && /[ЁёА-я]/.test(char));
        if (nextValidIndex !== -1) {
          setActiveIndex(nextValidIndex);
        } else {
          // Completed!! here trigger new phrase to appear
        }
      }
    }
  }, [pressedKey])

  return (
    <div className='bottom-text'>
      {
        phraseArray.map((letter, index) => {
          return(
            <span key={letter + index} className={`${index === activeIndex ? 'active-letter' : ''}`}>{letter}</span>
          )
        })
      }
    </div>
  )
}

