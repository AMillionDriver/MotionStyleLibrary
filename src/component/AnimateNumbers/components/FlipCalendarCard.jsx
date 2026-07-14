import { useRef, useState } from 'react';
import { motion, useInView } from 'motion/react';

import renderReplayButton from './ReplayButton';

const digits = ['2', '0', '2', '6'];

function renderDigit(digit, index, isInView, replayKey) {
  return (
    <div
      className="relative h-20 w-14 overflow-hidden rounded-lg border border-cyan-200/20 bg-slate-950 shadow-lg shadow-cyan-950/30"
      key={`${digit}-${index}`}
    >
      <div className="absolute inset-x-0 top-1/2 h-px bg-cyan-200/20" />
      <motion.span
        animate={isInView ? { opacity: 1, rotateX: 0, y: 0 } : { opacity: 0, rotateX: -90, y: -18 }}
        className="flex h-full items-center justify-center text-5xl font-black tabular-nums text-white"
        initial={{ opacity: 0, rotateX: -90, y: -18 }}
        key={`${digit}-${index}-${replayKey}`}
        style={{ transformOrigin: '50% 100%' }}
        transition={{
          delay: index * 0.12,
          duration: 0.55,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        {digit}
      </motion.span>
    </div>
  );
}

export default function FlipCalendarCard() {
  const [replayKey, setReplayKey] = useState(0);
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { amount: 0.45, once: false });

  return (
    <article
      className="min-h-72 rounded-lg border border-cyan-200/20 bg-cyan-950/30 p-5"
      ref={cardRef}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-200">
            Flip Calendar
          </p>
          <h3 className="mt-2 text-xl font-black text-white">Year Flip</h3>
        </div>
        {renderReplayButton(() => setReplayKey((current) => current + 1))}
      </div>

      <div className="mt-10 flex gap-3">
        {digits.map((digit, index) => renderDigit(digit, index, isInView, replayKey))}
      </div>
      <p className="mt-6 max-w-sm text-sm font-medium leading-6 text-cyan-50/75">
        Digits flip into place with a calendar-card feel.
      </p>
    </article>
  );
}
