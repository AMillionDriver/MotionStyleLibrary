import { useEffect, useRef, useState } from 'react';
import { useInView } from 'motion/react';

import renderReplayButton from './ReplayButton';

const targetValue = '404-729';
const matrixChars = ['0', '1', '3', '7', '9', '#', '/', '*'];

function makeMatrixValue() {
  return targetValue
    .split('')
    .map((character) => {
      if (character === '-') {
        return character;
      }

      const randomIndex = Math.floor(Math.random() * matrixChars.length);
      return matrixChars[randomIndex];
    })
    .join('');
}

export default function MatrixDigitsCard() {
  const [displayValue, setDisplayValue] = useState(targetValue);
  const [replayKey, setReplayKey] = useState(0);
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { amount: 0.45, once: false });

  useEffect(() => {
    if (!isInView) {
      return undefined;
    }

    let tick = 0;

    const timer = window.setInterval(() => {
      tick += 1;

      if (tick >= 20) {
        window.clearInterval(timer);
        setDisplayValue(targetValue);
        return;
      }

      setDisplayValue(makeMatrixValue());
    }, 50);

    return () => window.clearInterval(timer);
  }, [isInView, replayKey]);

  return (
    <article
      className="min-h-72 overflow-hidden rounded-lg border border-green-200/20 bg-green-950/20 p-5"
      ref={cardRef}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-green-200">
            Matrix Digits
          </p>
          <h3 className="mt-2 text-xl font-black text-white">Code Lock</h3>
        </div>
        {renderReplayButton(() => setReplayKey((current) => current + 1))}
      </div>

      <div className="mt-10 rounded-lg border border-green-200/20 bg-slate-950 px-5 py-8">
        <p className="font-mono text-5xl font-black tabular-nums text-green-200 [text-shadow:0_0_18px_rgba(134,239,172,0.45)]">
          {displayValue}
        </p>
      </div>
      <p className="mt-4 max-w-sm text-sm font-medium leading-6 text-green-50/75">
        Cycles through noisy code digits before resolving to the final sequence.
      </p>
    </article>
  );
}
