import { useEffect, useMemo, useRef, useState } from 'react';
import { Box } from '@mui/material';
import { motion } from 'motion/react';
import gsap, { useGSAP } from '../../lib/gsapCompat';

const MotionSpan = motion.span;

export function TypingEffectText({
  phrases,
  className,
  component = 'span',
  typingSpeed = 52,
  deletingSpeed = 30,
  pauseMs = 1800,
  loop = true,
  cursor = '|',
  sx,
}) {
  const words = useMemo(() => {
    if (Array.isArray(phrases) && phrases.length > 0) return phrases;
    if (typeof phrases === 'string' && phrases.trim()) return [phrases];
    return [''];
  }, [phrases]);

  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const wrapperRef = useRef(null);

  useGSAP(
    (context) => {
      gsap.from(
        '.typing-effect-content',
        {
          y: 8,
          opacity: 0,
          duration: 0.5,
          ease: 'power2.out',
        },
        context.scope
      );
    },
    { scope: wrapperRef, dependencies: [currentPhraseIndex] }
  );

  useEffect(() => {
    const activePhrase = words[currentPhraseIndex] ?? '';
    const interval = window.setInterval(
      () => {
        if (!isDeleting && displayText === activePhrase) {
          window.clearInterval(interval);
          window.setTimeout(() => {
            if (loop || currentPhraseIndex < words.length - 1) {
              setIsDeleting(true);
            }
          }, pauseMs);
          return;
        }

        if (isDeleting && displayText.length === 0) {
          window.clearInterval(interval);
          setIsDeleting(false);
          setCurrentPhraseIndex((prev) => {
            if (prev >= words.length - 1) return loop ? 0 : prev;
            return prev + 1;
          });
          return;
        }

        const nextLength = isDeleting ? displayText.length - 1 : displayText.length + 1;
        setDisplayText(activePhrase.slice(0, Math.max(0, nextLength)));
      },
      isDeleting ? deletingSpeed : typingSpeed
    );

    return () => window.clearInterval(interval);
  }, [
    currentPhraseIndex,
    deletingSpeed,
    displayText,
    isDeleting,
    loop,
    pauseMs,
    typingSpeed,
    words,
  ]);

  return (
    <Box ref={wrapperRef} component={component} className={className} sx={sx}>
      <span className="typing-effect-content">{displayText}</span>
      <MotionSpan
        className="typing-effect-cursor"
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut' }}
        aria-hidden
      >
        {cursor}
      </MotionSpan>
    </Box>
  );
}
