let voicesReady = false;

function loadVoices() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return [];
  return window.speechSynthesis.getVoices();
}

if (typeof window !== 'undefined' && window.speechSynthesis) {
  loadVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    voicesReady = true;
    loadVoices();
  };
}

function pickRussianVoice() {
  const voices = loadVoices();
  return (
    voices.find((v) => v.lang.toLowerCase().startsWith('ru')) ||
    voices.find((v) => /russia|русский|russian/i.test(v.name)) ||
    null
  );
}

export function speakRussian(text) {
  if (!text || typeof window === 'undefined' || !window.speechSynthesis) return;

  const cleaned = text.replace(/\n+/g, ' ').replace(/\s+/g, ' ').trim();
  if (!cleaned) return;

  window.speechSynthesis.cancel();

  const utter = new SpeechSynthesisUtterance(cleaned);
  utter.lang = 'ru-RU';
  utter.rate = 0.9;
  const voice = pickRussianVoice();
  if (voice) utter.voice = voice;

  // Voices sometimes load late — retry once
  if (!voice && !voicesReady) {
    window.speechSynthesis.onvoiceschanged = () => {
      voicesReady = true;
      const retry = pickRussianVoice();
      if (retry) utter.voice = retry;
      window.speechSynthesis.speak(utter);
    };
    return;
  }

  window.speechSynthesis.speak(utter);
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}

const SENTENCE_END = /[.!?…]/;

export function extractSentenceAt(text, endIndex) {
  if (endIndex < 0 || endIndex >= text.length) return '';
  if (!SENTENCE_END.test(text[endIndex])) return '';

  let start = endIndex;
  while (start > 0) {
    const prev = text[start - 1];
    if (SENTENCE_END.test(prev) || prev === '\n') break;
    start -= 1;
  }

  while (start <= endIndex && /\s/.test(text[start])) start += 1;
  return text.slice(start, endIndex + 1).trim();
}
