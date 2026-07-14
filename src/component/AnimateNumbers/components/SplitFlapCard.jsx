import { useRef, useState } from 'react';
import { motion, useInView } from 'motion/react';

import renderReplayButton from './ReplayButton';

const flapCharacters = ['2', '4', '8', '1'];

function renderFlap(character, index, isInView, replayKey) {
  return (
    <div
      className="relative h-20 w-16 overflow-hidden rounded-lg border border-slate-700 bg-slate-950"
      key={`${character}-${index}`}
    >
      <div className="absolute inset-x-0 top-0 h-1/2 border-b border-slate-700 bg-slate-900" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-slate-950" />
      <motion.span
        animate={isInView ? { opacity: 1, rotateX: 0 } : { opacity: 0, rotateX: -95 }}
        className="relative z-10 flex h-full items-center justify-center font-mono text-5xl font-black tabular-nums text-white"
        initial={{ opacity: 0, rotateX: -95 }}
        key={`${character}-${index}-${replayKey}`}
        style={{ transformOrigin: '50% 100%' }}
        transition={{
          delay: index * 0.14,
          duration: 0.5,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        {character}
      </motion.span>
    </div>
  );
}

export default function SplitFlapCard() {
  const [replayKey, setReplayKey] = useState(0);
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { amount: 0.45, once: false });

  return (
    <article
      className="min-h-72 rounded-lg border border-slate-500/30 bg-slate-950 p-5"
      ref={cardRef}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-300">Split Flap</p>
          <h3 className="mt-2 text-xl font-black text-white">Departure Board</h3>
        </div>
        {renderReplayButton(() => setReplayKey((current) => current + 1))}
      </div>

      <div className="mt-10 flex gap-3">
        {flapCharacters.map((character, index) =>
          renderFlap(character, index, isInView, replayKey)
        )}
      </div>
      <p className="mt-6 max-w-sm text-sm font-medium leading-6 text-slate-300">
        A mechanical board style where each number flips into position.
      </p>
    </article>
  );
}
