import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useEffect, useState } from 'react';

/**
 * Cycles through a list of phrases with a soft vertical blur transition (cuicui-style).
 * With "reduce motion" turned on, the phrases still change, but without the slide and blur.
 */
export default function RotatingWord({ words, interval = 2800 }: { words: string[]; interval?: number }) {
  const [i, setI] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (words.length < 2) return;
    const id = window.setInterval(() => setI((n) => (n + 1) % words.length), reduce ? interval * 1.4 : interval);
    return () => window.clearInterval(id);
  }, [reduce, words.length, interval]);

  return (
    <span className="rotating-word" aria-live="off">
      {/* Screen readers get the full list once instead of a changing word */}
      <span className="sr-only">{words.join(', ')}</span>
      {reduce ? (
        <span aria-hidden="true" className="gradient-text inline-block">
          {words[i]}
        </span>
      ) : (
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={words[i]}
            aria-hidden="true"
            className="gradient-text inline-block"
            initial={{ y: '0.6em', opacity: 0, filter: 'blur(6px)' }}
            animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
            exit={{ y: '-0.6em', opacity: 0, filter: 'blur(6px)' }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            {words[i]}
          </motion.span>
        </AnimatePresence>
      )}
    </span>
  );
}
