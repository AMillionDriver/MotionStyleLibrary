import { useEffect, useRef, useState } from 'react';
import { animate, motion, useInView, useMotionValue, useTransform } from 'motion/react';

import renderReplayButton from './ReplayButton';

const targetValue = 86;

export default function PercentageFillCard() {
  const [replayKey, setReplayKey] = useState(0);
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { amount: 0.45, once: false });
  const progress = useMotionValue(0);
  const displayValue = useTransform(progress, (latest) => `${Math.round(latest)}%`);
  const progressWidth = useTransform(progress, (latest) => `${latest}%`);

  useEffect(() => {
    if (!isInView) {
      return undefined;
    }

    progress.set(0);
    const controls = animate(progress, targetValue, {
      duration: 1.2,
      ease: 'easeOut',
    });

    return () => controls.stop();
  }, [isInView, progress, replayKey]);

  return (
    <article
      className="min-h-72 rounded-lg border border-violet-200/20 bg-violet-950/30 p-5"
      ref={cardRef}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-violet-200">
            Percentage Fill
          </p>
          <h3 className="mt-2 text-xl font-black text-white">Capacity Meter</h3>
        </div>
        {renderReplayButton(() => setReplayKey((current) => current + 1))}
      </div>

      <motion.p className="mt-10 text-6xl font-black tabular-nums text-white">
        {displayValue}
      </motion.p>
      <div className="mt-5 h-4 overflow-hidden rounded-full bg-slate-950">
        <motion.div
          className="h-full rounded-full bg-violet-300 shadow-lg shadow-violet-400/30"
          style={{ width: progressWidth }}
        />
      </div>
      <p className="mt-4 max-w-sm text-sm font-medium leading-6 text-violet-50/75">
        Number and fill bar climb together into a final progress value.
      </p>
    </article>
  );
}
