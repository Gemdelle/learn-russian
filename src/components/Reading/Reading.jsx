import { useEffect, useMemo, useRef, useState } from 'react';
import story from '../../data/stories/mourneferra.json';
import mourneferraImg from '../../assets/img/creatures/Mourneferra.png';
import Keyboard from '../Keyboard/Keyboard';
import { charsMatch, resolveRuChar, shouldPreventKey } from '../../utils/russianKeyboard';
import { capitalSrc, isCapitalLetter } from '../../utils/capitals';
import { extractSentenceAt, speakRussian, stopSpeaking } from '../../utils/speech';
import bgSound from '../../assets/sounds/porveldam-bg.mp3';
import keySound from '../../assets/sounds/key.mp3';
import pageSound from '../../assets/sounds/page-turn.mp3';
import creatureSound from '../../assets/sounds/mourneferra.mp3';
import './Reading.scss';

const LEFT_BUDGET = 340;
const RIGHT_BUDGET = 200;

function toRoman(n) {
  return ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'][n - 1] || String(n);
}

function buildPages(chapters) {
  const pages = [];
  let blocks = [];
  let chars = 0;
  let pageIndex = 0;

  const budget = () => (pageIndex % 2 === 0 ? LEFT_BUDGET : RIGHT_BUDGET);

  const flush = () => {
    if (!blocks.length) return;
    pages.push({ blocks });
    blocks = [];
    chars = 0;
    pageIndex += 1;
  };

  chapters.forEach((ch) => {
    if (chars > 0 && chars + ch.title.ru.length > budget()) flush();

    blocks.push({
      kind: 'title',
      id: ch.id,
      ru: ch.title.ru,
      en: ch.title.en,
    });
    chars += ch.title.ru.length;

    ch.paragraphs.forEach((p) => {
      if (chars > 0 && chars + p.ru.length > budget()) flush();

      // Right page: only title + first paragraph; rest goes to next page
      if (pageIndex % 2 === 1 && blocks.some((b) => b.kind === 'p')) {
        flush();
      }

      blocks.push({ kind: 'p', ru: p.ru, en: p.en });
      chars += p.ru.length + 2;
    });

    flush();
  });

  return pages;
}

function pageRuText(page) {
  if (!page) return '';
  return page.blocks.map((b) => b.ru).join('\n\n');
}

function playSound(audio) {
  if (!audio) return;
  try {
    audio.currentTime = 0;
    audio.play().catch(() => {});
  } catch (_) {
    /* ignore autoplay blocks */
  }
}

function charClass(globalIndex, progress) {
  if (globalIndex < progress) return 'typed';
  if (globalIndex === progress) return 'current';
  return 'pending';
}

function TypedBlock({ text, startIndex, progress }) {
  return (
    <span className="typed-block">
      {text.split('').map((char, i) => (
        <span key={i} className={charClass(startIndex + i, progress)}>
          {char}
        </span>
      ))}
    </span>
  );
}

function TitleBlock({ text, startIndex, progress }) {
  const first = text[0] || '';
  const rest = text.slice(1);
  const src = isCapitalLetter(first) ? capitalSrc(first) : null;

  return (
    <span className="typed-block typed-block--title">
      {src ? (
        <span className={`dropcap dropcap--title ${charClass(startIndex, progress)}`}>
          <img src={src} alt={first} className="dropcap__img" />
        </span>
      ) : (
        <span className={charClass(startIndex, progress)}>{first}</span>
      )}
      {rest.split('').map((char, i) => (
        <span key={i} className={charClass(startIndex + 1 + i, progress)}>
          {char}
        </span>
      ))}
    </span>
  );
}

function ParagraphBlock({ ru, en, startIndex, progress }) {
  const first = ru[0] || '';
  const rest = ru.slice(1);
  const src = isCapitalLetter(first) ? capitalSrc(first) : null;
  const firstCls = charClass(startIndex, progress);

  return (
    <p className="chapter__p">
      <span className="chapter__p-main">
        {src && (
          <span className={`dropcap ${firstCls}`}>
            <img src={src} alt={first} className="dropcap__img" />
          </span>
        )}
        <span className="chapter__p-text">
          <TypedBlock
            text={src ? rest : ru}
            startIndex={src ? startIndex + 1 : startIndex}
            progress={progress}
          />
          <span className="en">{en}</span>
        </span>
      </span>
    </p>
  );
}

function Atmosphere() {
  const particles = useMemo(() => {
    return Array.from({ length: 42 }, (_, i) => {
      const side = i % 2 === 0 ? 'left' : 'right';
      const roll = i % 7;
      const kind = roll === 0 || roll === 3 ? 'ash-red' : roll === 1 ? 'blood' : 'ash';
      return {
        id: i,
        kind,
        left: side === 'left' ? `${0.6 + (i % 8) * 1.05}vw` : undefined,
        right: side === 'right' ? `${0.6 + (i % 8) * 1.05}vw` : undefined,
        delay: `${(i * 0.31) % 9}s`,
        duration: `${6.5 + (i % 7)}s`,
        size:
          kind === 'blood'
            ? `${1.5 + (i % 3)}px`
            : kind === 'ash-red'
              ? `${1.2 + (i % 3) * 0.6}px`
              : `${1 + (i % 2)}px`,
      };
    });
  }, []);

  return (
    <div className="atmosphere" aria-hidden>
      {particles.map((p) => (
        <span
          key={p.id}
          className={`atmosphere__particle atmosphere__particle--${p.kind}`}
          style={{
            left: p.left,
            right: p.right,
            animationDelay: p.delay,
            animationDuration: p.duration,
            width: p.size,
            height: p.size,
          }}
        />
      ))}
    </div>
  );
}

function Page({ page, progress, textOffset }) {
  if (!page) return null;

  let offset = textOffset;

  return (
    <section className="chapter">
      {page.blocks.map((block, i) => {
        if (i > 0) offset += 2;
        const start = offset;
        offset += block.ru.length;

        if (block.kind === 'title') {
          return (
            <h2 className="chapter__title" key={`t-${block.id}-${i}`}>
              <span className="chapter__title-row">
                <span className="chapter__num">{toRoman(block.id)}.</span>
                <TitleBlock
                  text={block.ru}
                  startIndex={start}
                  progress={progress}
                />
                <span className="chapter__title-en">{block.en}</span>
              </span>
            </h2>
          );
        }

        return (
          <ParagraphBlock
            key={`p-${i}`}
            ru={block.ru}
            en={block.en}
            startIndex={start}
            progress={progress}
          />
        );
      })}
    </section>
  );
}

export default function Reading() {
  const pages = useMemo(() => buildPages(story.chapters), []);

  const pageMeta = useMemo(() => {
    let cursor = 0;
    return pages.map((page, index) => {
      const text = pageRuText(page);
      const start = cursor;
      const end = start + text.length;
      cursor = end + (index < pages.length - 1 ? 2 : 0);
      return { page, text, start, end };
    });
  }, [pages]);

  const spreads = useMemo(() => {
    const result = [];
    for (let i = 0; i < pageMeta.length; i += 2) {
      result.push({
        left: pageMeta[i],
        right: pageMeta[i + 1] || null,
      });
    }
    return result;
  }, [pageMeta]);

  const fullTarget = useMemo(
    () => pageMeta.map((p) => p.text).join('\n\n'),
    [pageMeta]
  );

  const [spreadIndex, setSpreadIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [creatureAnim, setCreatureAnim] = useState('');

  const bgRef = useRef(null);
  const keyRef = useRef(null);
  const pageRef = useRef(null);
  const creatureAudioRef = useRef(null);
  const creatureRef = creatureAudioRef;
  const prevProgress = useRef(0);
  const bgStarted = useRef(false);

  const spread = spreads[spreadIndex];
  const left = spread.left;
  const right = spread.right;
  const expectedChar = fullTarget[progress] || '';

  useEffect(() => {
    keyRef.current = new Audio(keySound);
    keyRef.current.volume = 0.45;
    pageRef.current = new Audio(pageSound);
    pageRef.current.volume = 0.55;
    creatureAudioRef.current = new Audio(creatureSound);
    creatureAudioRef.current.volume = 0.7;

    const audio = bgRef.current;
    if (audio) {
      audio.loop = true;
      audio.volume = 0.55;
      audio.preload = 'auto';
    }

    let retries = 0;
    let retryId;

    const tryStartBg = () => {
      const el = bgRef.current;
      if (!el || (bgStarted.current && !el.paused)) return;
      el.loop = true;
      const playPromise = el.play();
      if (playPromise && typeof playPromise.then === 'function') {
        playPromise
          .then(() => {
            bgStarted.current = true;
            if (retryId) clearInterval(retryId);
          })
          .catch(() => {});
      }
    };

    tryStartBg();
    retryId = setInterval(() => {
      retries += 1;
      tryStartBg();
      if (retries > 10 || bgStarted.current) clearInterval(retryId);
    }, 700);

    const unlock = () => {
      tryStartBg();
    };
    window.addEventListener('pointerdown', unlock);
    window.addEventListener('keydown', unlock);
    window.addEventListener('touchstart', unlock);
    window.addEventListener('click', unlock);

    return () => {
      clearInterval(retryId);
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
      window.removeEventListener('touchstart', unlock);
      window.removeEventListener('click', unlock);
      if (bgRef.current) {
        bgRef.current.pause();
      }
    };
  }, []);

  useEffect(() => {
    const actions = ['shift-left', 'shift-right', 'tremble'];
    let timeoutId;
    let cancelled = false;

    const schedule = () => {
      const wait = 28000 + Math.random() * 14000; // ~28–42s
      timeoutId = setTimeout(() => {
        if (cancelled) return;
        const action = actions[Math.floor(Math.random() * actions.length)];
        setCreatureAnim(action);
        playSound(creatureRef.current);
        setTimeout(() => {
          if (!cancelled) setCreatureAnim('');
        }, 1400);
        schedule();
      }, wait);
    };

    timeoutId = setTimeout(() => {
      if (cancelled) return;
      schedule();
    }, 25000);

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, []);

  const ensureBg = () => {
    if (!bgRef.current) return;
    if (bgStarted.current && !bgRef.current.paused) return;
    bgRef.current
      .play()
      .then(() => {
        bgStarted.current = true;
      })
      .catch(() => {});
  };

  const advanceProgress = (from) => {
    ensureBg();
    playSound(keyRef.current);

    let next = from + 1;
    while (next < fullTarget.length && fullTarget[next] === '\n') next += 1;

    const finishedPage = pageMeta.some(
      (p) => from < p.end && next >= p.end
    );
    if (finishedPage) playSound(pageRef.current);

    const typedChar = fullTarget[from];
    if (typedChar && /[.!?…]/.test(typedChar)) {
      const sentence = extractSentenceAt(fullTarget, from);
      if (sentence) speakRussian(sentence);
    }

    setProgress(next);
  };

  const restartReading = () => {
    stopSpeaking();
    setProgress(0);
    setSpreadIndex(0);
    setCreatureAnim('');
  };

  const readTypedSoFar = () => {
    ensureBg();
    const typed = fullTarget.slice(0, progress);
    if (!typed.trim()) return;
    speakRussian(typed);
  };

  useEffect(() => {
    return () => stopSpeaking();
  }, []);

  useEffect(() => {
    if (progress < fullTarget.length && fullTarget[progress] === '\n') {
      setProgress((p) => p + 1);
    }
  }, [progress, fullTarget]);

  useEffect(() => {
    if (!spreads.length) return;
    let idx = spreads.findIndex((s) => {
      const end = s.right ? s.right.end : s.left.end;
      return progress <= end;
    });
    if (idx < 0) idx = spreads.length - 1;
    if (idx !== spreadIndex) setSpreadIndex(idx);
  }, [progress, spreads, spreadIndex]);

  useEffect(() => {
    prevProgress.current = progress;
  }, [progress]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Backspace') {
        e.preventDefault();
        setProgress((p) => {
          let next = p - 1;
          while (next >= 0 && fullTarget[next] === '\n') next -= 1;
          return Math.max(0, next);
        });
        return;
      }

      if (e.key === 'ArrowRight' && spreadIndex < spreads.length - 1) {
        const nextSpread = spreads[spreadIndex + 1];
        setSpreadIndex(spreadIndex + 1);
        setProgress(nextSpread.left.start);
        return;
      }

      if (e.key === 'ArrowLeft' && spreadIndex > 0) {
        const prevSpread = spreads[spreadIndex - 1];
        setSpreadIndex(spreadIndex - 1);
        setProgress(prevSpread.left.start);
        return;
      }

      // Cancel OS dead-key (´) so BracketLeft can register as х
      if (shouldPreventKey(e)) e.preventDefault();

      if (e.key.length !== 1 && e.code !== 'Space' && e.key !== 'Dead') return;

      const expected = fullTarget[progress];
      if (!expected || expected === '\n') return;

      const typed = resolveRuChar(e);
      if (!charsMatch(typed, expected)) return;

      e.preventDefault();
      advanceProgress(progress);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  const onVirtualKey = (char) => {
    const expected = fullTarget[progress];
    if (!expected || expected === '\n') return;
    if (!charsMatch(char, expected)) return;
    advanceProgress(progress);
  };

  const onCreatureClick = () => {
    ensureBg();
    playSound(creatureRef.current);
    setCreatureAnim('tremble');
    setTimeout(() => setCreatureAnim(''), 1100);
  };

  const nameRest = story.name.slice(1);
  const mSrc = capitalSrc('M');
  const creatureClass = creatureAnim ? `creature is-${creatureAnim}` : 'creature';

  return (
    <div className="reading" onPointerDown={ensureBg}>
      <audio
        ref={bgRef}
        src={bgSound}
        loop
        preload="auto"
        autoPlay
      />
      <Atmosphere />

      <div className="story-title">
        <h1 className="story-title__line">
          {mSrc ? (
            <img src={mSrc} alt="M" className="story-title__cap" />
          ) : (
            <span>M</span>
          )}
          <span className="story-title__name">{nameRest}</span>
          <span className="story-title__epithet">{story.epithet}</span>
          <span className="story-title__actions">
            <button
              type="button"
              className="story-title__btn"
              onClick={restartReading}
              title="Restart"
              aria-label="Restart"
            >
              ↻
            </button>
            <button
              type="button"
              className="story-title__btn"
              onClick={readTypedSoFar}
              title="Read"
              aria-label="Read typed text"
            >
              ▶
            </button>
          </span>
        </h1>
      </div>

      <div className="story-container">
        <div className="page-left">
          <Page page={left.page} progress={progress} textOffset={left.start} />
        </div>
        <div className="page-right">
          {right && (
            <Page page={right.page} progress={progress} textOffset={right.start} />
          )}
        </div>
      </div>

      <div className="keyboard">
        <Keyboard expectedChar={expectedChar} onVirtualKey={onVirtualKey} />
      </div>

      <button
        type="button"
        className={creatureClass}
        onClick={onCreatureClick}
        aria-label={story.name}
      >
        <img src={mourneferraImg} alt={story.name} />
      </button>
    </div>
  );
}
