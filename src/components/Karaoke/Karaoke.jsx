import React, { useState, useEffect, useRef } from 'react';
import './styles/Karaoke.css';
import audioFile from '../../assets/audios/el_zorro_eldric_cap_01.wav';

const lyricsData = [
    { time: 0, text: "Жил-был величественный лис по имени Эльдрик, который обитал в роскошном дворце." },
    { time: 5, text: "Эльдрик был владельцем огромного дворца, множества земель и колоссального богатства." },
    { time: 11, text: "Однажды днем лис решил исследовать уголок сада, который всегда избегал, где росли колючки." },
    { time: 18, text: "Он пробирался осторожно, избегая шипов, но один из них зацепил его и оцарапал лапу." },
    { time: 24, text: "Боль была резкой, и на мгновение лис подумал вернуться." },
    { time: 29, text: "Но что-то блестящее среди колючек привлекло его внимание." },
    { time: 33, text: "Это был маленький зеленый камень, спрятанный среди трав." },
    { time: 37, text: "С раненой лапой лис осторожно взял камень." },
    { time: 41, text: "Когда он вышел из колючего уголка, он почувствовал, что получил что-то более ценное, чем все его богатства:" },
    { time: 48, text: "мужество столкнуться с неизвестным." }
];

const Karaoke = () => {
    const [currentTime, setCurrentTime] = useState(0);
    const [storyText, setStoryText] = useState([]);
    const audioRef = useRef(null);
    const lastAddedTimeRef = useRef(null);

    useEffect(() => {
        const updateCurrentTime = () => {
            if (audioRef.current) {
                setCurrentTime(audioRef.current.currentTime);
            }
        };

        const interval = setInterval(updateCurrentTime, 100);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const currentLine = lyricsData.find((line, index) =>
            currentTime >= line.time &&
            (index === lyricsData.length - 1 || currentTime < lyricsData[index + 1].time)
        );

        if (currentLine && lastAddedTimeRef.current !== currentLine.time) {
            setStoryText(prevText => [...prevText, { id: currentLine.time, text: currentLine.text }]);
            lastAddedTimeRef.current = currentLine.time;
        }
    }, [currentTime]);

    return (
        <div>
            <audio ref={audioRef} controls autoPlay preload="auto">
                <source src={audioFile} type="audio/wav" />
                Your browser does not support the audio element.
            </audio>
            <div className="lyrics">
                {storyText.map(line => (
                    <span key={line.id} className="fade-in">{line.text} </span>
                ))}
            </div>
        </div>
    );
};

export default Karaoke;
