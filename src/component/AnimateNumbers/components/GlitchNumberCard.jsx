import { useEffect, useRef, useState } from 'react';
import { useInView } from 'motion/react';

import renderReplayButton from './ReplayButton';

const targetValue = '73,920';
const glitchDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '#', '%'];

function makeGlitchValue() {
  return targetValue
    .split('')
    .map((character) => {
      if (character === ',') {
        return character;
      }

      const index = Math.floor(Math.random() * glitchDigits.length);
      return glitchDigits[index];
    })
    .join('');
}

export default function GlitchNumberCard() {
  const [displayValue, setDisplayValue] = useState(targetValue);
  const [isGlitching, setIsGlitching] = useState(false);
  const [replayKey, setReplayKey] = useState(0);
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { amount: 0.45, once: false });

  useEffect(() => {
    if (!isInView) {
      return undefined;
    }

    let tick = 0;
    setIsGlitching(true);

    const timer = window.setInterval(() => {
      tick += 1;

      if (tick >= 18) {
        window.clearInterval(timer);
        setDisplayValue(targetValue);
        setIsGlitching(false);
        return;
      }

      setDisplayValue(makeGlitchValue());
    }, 55);

    return () => window.clearInterval(timer);
  }, [isInView, replayKey]);

  const textShadow = isGlitching
    ? '2px 0 #22d3ee, -2px 0 #f43f5e, 0 0 24px rgba(34, 211, 238, 0.4)'
    : '0 0 18px rgba(34, 211, 238, 0.2)';

  return (
    <article
      className="relative min-h-72 overflow-hidden rounded-lg border border-fuchsia-200/20 bg-slate-950 p-5"
      ref={cardRef}
    >
      <div className="absolute right-0 top-0 h-28 w-28 bg-fuchsia-400/10 blur-2xl" />
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-fuchsia-200">
            Glitch Number
          </p>
          <h3 className="mt-2 text-xl font-black text-white">Signal Readout</h3>
        </div>
        {renderReplayButton(() => setReplayKey((current) => current + 1))}
      </div>

      <div className="relative mt-10">
        <p className="text-6xl font-black tabular-nums text-white" style={{ textShadow }}>
          {displayValue}
        </p>
        <p className="absolute left-1 top-0 text-6xl font-black tabular-nums text-cyan-300/25">
          {displayValue}
        </p>
      </div>
      <p className="relative mt-6 max-w-sm text-sm font-medium leading-6 text-fuchsia-50/75">
        Scrambles digits for a noisy tech readout before locking onto the final number.
      </p>
    </article>
  );
}
