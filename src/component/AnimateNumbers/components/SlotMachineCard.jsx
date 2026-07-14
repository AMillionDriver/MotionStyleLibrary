import { useRef, useState } from 'react';
import { motion, useInView } from 'motion/react';

import renderReplayButton from './ReplayButton';

const reels = [
  ['1', '8', '3', '9', '0', '7'],
  ['4', '0', '6', '2', '9', '7'],
  ['8', '5', '1', '3', '6', '7'],
];

function renderReel(values, index, isInView, replayKey) {
  const finalOffset = (values.length - 1) * -5;

  return (
    <div
      className="h-20 w-16 overflow-hidden rounded-lg border border-yellow-200/20 bg-slate-950"
      key={`reel-${index}`}
    >
      <motion.div
        animate={isInView ? { y: `${finalOffset}rem` } : { y: '0rem' }}
        className="flex flex-col"
        initial={{ y: '0rem' }}
        key={`${index}-${replayKey}`}
        transition={{
          delay: index * 0.18,
          duration: 1 + index * 0.18,
          ease: [0.2, 0.8, 0.2, 1],
        }}
      >
        {values.map((value) => (
          <span
            className="flex h-20 items-center justify-center text-5xl font-black tabular-nums text-yellow-100"
            key={value}
          >
            {value}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export default function SlotMachineCard() {
  const [replayKey, setReplayKey] = useState(0);
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { amount: 0.45, once: false });

  return (
    <article
      className="min-h-72 rounded-lg border border-yellow-200/20 bg-yellow-950/20 p-5"
      ref={cardRef}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-yellow-200">
            Slot Machine
          </p>
          <h3 className="mt-2 text-xl font-black text-white">Lucky Reels</h3>
        </div>
        {renderReplayButton(() => setReplayKey((current) => current + 1))}
      </div>

      <div className="mt-10 flex gap-3">
        {reels.map((values, index) => renderReel(values, index, isInView, replayKey))}
      </div>
      <p className="mt-6 max-w-sm text-sm font-medium leading-6 text-yellow-50/75">
        Three reels spin at staggered speeds and land on the final sequence.
      </p>
    </article>
  );
}
