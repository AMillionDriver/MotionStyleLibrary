import { useRef, useState } from 'react';
import { motion, useMotionValueEvent, useScroll, useTransform } from 'motion/react';

import renderReplayButton from './ReplayButton';

export default function ScrollCounterCard() {
  const [replayKey, setReplayKey] = useState(0);
  const [checkpoint, setCheckpoint] = useState(0);
  const cardRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'end start'],
  });
  const displayValue = useTransform(scrollYProgress, (latest) =>
    Math.round(latest * 980).toLocaleString('id-ID')
  );
  const progressWidth = useTransform(scrollYProgress, (latest) => `${latest * 100}%`);

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    setCheckpoint(Math.round(latest * 100));
  });

  return (
    <article
      className="min-h-72 rounded-lg border border-teal-200/20 bg-teal-950/25 p-5"
      ref={cardRef}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-teal-200">
            Scroll Counter
          </p>
          <h3 className="mt-2 text-xl font-black text-white">Viewport Meter</h3>
        </div>
        {renderReplayButton(() => setReplayKey((current) => current + 1))}
      </div>

      <motion.p
        animate={{ scale: [1, 1.04, 1] }}
        className="mt-10 text-6xl font-black tabular-nums text-white"
        key={replayKey}
        transition={{ duration: 0.45 }}
      >
        {displayValue}
      </motion.p>
      <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-950">
        <motion.div
          className="h-full rounded-full bg-teal-300 shadow-lg shadow-teal-400/30"
          style={{ width: progressWidth }}
        />
      </div>
      <p className="mt-4 max-w-sm text-sm font-medium leading-6 text-teal-50/75">
        Reads this card&apos;s scroll progress and maps it into a live counter.
      </p>
      <p className="mt-3 text-xs font-black uppercase tracking-[0.18em] text-teal-200/80">
        Scroll checkpoint {checkpoint}%
      </p>
    </article>
  );
}
