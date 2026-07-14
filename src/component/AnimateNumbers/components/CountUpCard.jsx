import { useEffect, useRef, useState } from 'react';
import { animate, motion, useInView, useMotionValue, useTransform } from 'motion/react';

import renderReplayButton from './ReplayButton';

const targetValue = 12840;

export default function CountUpCard() {
  const [replayKey, setReplayKey] = useState(0);
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { amount: 0.45, once: false });
  const count = useMotionValue(0);
  const displayValue = useTransform(count, (latest) => Math.round(latest).toLocaleString('id-ID'));

  useEffect(() => {
    if (!isInView) {
      return undefined;
    }

    count.set(0);
    const controls = animate(count, targetValue, {
      duration: 1.4,
      ease: 'easeOut',
    });

    return () => controls.stop();
  }, [count, isInView, replayKey]);

  return (
    <article
      className="min-h-72 rounded-lg border border-emerald-200/20 bg-emerald-950/35 p-5"
      ref={cardRef}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-200">Count Up</p>
          <h3 className="mt-2 text-xl font-black text-white">Live Metrics</h3>
        </div>
        {renderReplayButton(() => setReplayKey((current) => current + 1))}
      </div>

      <motion.p className="mt-10 text-6xl font-black tabular-nums text-white">
        {displayValue}
      </motion.p>
      <p className="mt-4 max-w-sm text-sm font-medium leading-6 text-emerald-50/75">
        Counts smoothly from zero into a dashboard-style target value.
      </p>
    </article>
  );
}
