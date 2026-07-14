import { useRef, useState } from 'react';
import { motion, useInView } from 'motion/react';

import renderReplayButton from './ReplayButton';

const targetValue = '5719';
const digitList = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

function renderRollingDigit(digit, index, isInView, replayKey) {
  const digitOffset = Number(digit) * -5;

  return (
    <div
      className="h-20 w-14 overflow-hidden rounded-lg border border-amber-200/20 bg-slate-950"
      key={`${digit}-${index}`}
    >
      <motion.div
        animate={{ y: isInView ? `${digitOffset}rem` : '0rem' }}
        className="flex flex-col"
        initial={{ y: '0rem' }}
        key={`${digit}-${index}-${replayKey}`}
        transition={{
          delay: index * 0.1,
          duration: 0.8,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        {digitList.map((item) => (
          <span
            className="flex h-20 items-center justify-center text-5xl font-black tabular-nums text-white"
            key={item}
          >
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export default function OdometerCard() {
  const [replayKey, setReplayKey] = useState(0);
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { amount: 0.45, once: false });

  return (
    <article
      className="min-h-72 rounded-lg border border-amber-200/20 bg-amber-950/25 p-5"
      ref={cardRef}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-200">Odometer</p>
          <h3 className="mt-2 text-xl font-black text-white">Rolling Digits</h3>
        </div>
        {renderReplayButton(() => setReplayKey((current) => current + 1))}
      </div>

      <div className="mt-10 flex gap-3">
        {targetValue
          .split('')
          .map((digit, index) => renderRollingDigit(digit, index, isInView, replayKey))}
      </div>
      <p className="mt-6 max-w-sm text-sm font-medium leading-6 text-amber-50/75">
        Each digit rolls through a vertical stack like a mechanical counter.
      </p>
    </article>
  );
}
