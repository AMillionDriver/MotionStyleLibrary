import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'motion/react';

import renderReplayButton from './ReplayButton';

const morphSequence = ['1', '3', '8', '6'];

export default function MorphingNumberCard() {
  const [displayIndex, setDisplayIndex] = useState(morphSequence.length - 1);
  const [replayKey, setReplayKey] = useState(0);
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { amount: 0.45, once: false });
  const displayValue = morphSequence[displayIndex];

  useEffect(() => {
    if (!isInView) {
      return undefined;
    }

    let nextIndex = 0;
    setDisplayIndex(0);

    const timer = window.setInterval(() => {
      nextIndex += 1;
      setDisplayIndex(Math.min(nextIndex, morphSequence.length - 1));

      if (nextIndex >= morphSequence.length - 1) {
        window.clearInterval(timer);
      }
    }, 260);

    return () => window.clearInterval(timer);
  }, [isInView, replayKey]);

  return (
    <article
      className="min-h-72 overflow-hidden rounded-lg border border-purple-200/20 bg-purple-950/25 p-5"
      ref={cardRef}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-purple-200">
            Morphing Number
          </p>
          <h3 className="mt-2 text-xl font-black text-white">Shape Shift</h3>
        </div>
        {renderReplayButton(() => setReplayKey((current) => current + 1))}
      </div>

      <div className="relative mt-8 flex h-36 items-center justify-center rounded-lg border border-purple-200/20 bg-slate-950">
        <motion.p
          animate={{
            borderRadius: ['18%', '42%', '24%'],
            filter: ['blur(10px)', 'blur(0px)'],
            scale: [0.78, 1.12, 1],
          }}
          className="flex h-28 w-28 items-center justify-center bg-purple-300/15 text-7xl font-black tabular-nums text-white shadow-2xl shadow-purple-400/20"
          key={`${displayValue}-${replayKey}`}
          transition={{ duration: 0.24, ease: 'easeOut' }}
        >
          {displayValue}
        </motion.p>
      </div>
      <p className="mt-4 max-w-sm text-sm font-medium leading-6 text-purple-50/75">
        Simulates a number morph by changing character, blur, scale, and shape.
      </p>
    </article>
  );
}
