import { useEffect, useState } from 'react';

/**
 * Typewriter: types a phrase letter by letter, holds it, backspaces it, then types the next one.
 * Runs with "reduce motion" on too, because nothing moves across the screen; only the caret blink is switched off.
 */
type Props = {
  words: string[];
  typeMs?: number; // delay per typed letter
  deleteMs?: number; // delay per deleted letter
  holdMs?: number; // how long a finished phrase stays
  gapMs?: number; // pause between deleting and typing the next phrase
};

export default function RotatingWord({ words, typeMs = 75, deleteMs = 38, holdMs = 1800, gapMs = 350 }: Props) {
  const [wordIndex, setWordIndex] = useState(0);
  const [text, setText] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (words.length === 0) return;
    const word = words[wordIndex % words.length];
    let delay: number;
    let next: () => void;

    if (!deleting && text === word) {
      // Finished typing: hold, then start deleting (a single phrase just stays).
      if (words.length < 2) return;
      delay = holdMs;
      next = () => setDeleting(true);
    } else if (deleting && text === '') {
      // Finished deleting: short pause, then move to the next phrase.
      delay = gapMs;
      next = () => {
        setDeleting(false);
        setWordIndex((i) => (i + 1) % words.length);
      };
    } else if (deleting) {
      delay = deleteMs;
      next = () => setText(word.slice(0, text.length - 1));
    } else {
      // Small random variation makes the typing feel human rather than mechanical.
      delay = typeMs * (0.6 + Math.random() * 0.8);
      next = () => setText(word.slice(0, text.length + 1));
    }

    const id = window.setTimeout(next, delay);
    return () => window.clearTimeout(id);
  }, [text, deleting, wordIndex, words, typeMs, deleteMs, holdMs, gapMs]);

  return (
    <span className="typewriter">
      {/* Screen readers get the full list once instead of letters changing */}
      <span className="sr-only">{words.join(', ')}</span>
      <span aria-hidden="true" className="gradient-text">
        {text}
      </span>
      <span aria-hidden="true" className="typewriter-caret" />
    </span>
  );
}
