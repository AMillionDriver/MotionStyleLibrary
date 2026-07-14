import { useEffect, useRef, useState } from 'react';
import { animate, motion, useInView, useMotionValue, useTransform } from 'motion/react';

import renderReplayButton from './ReplayButton';

const targetValue = 72;
const circumference = 2 * Math.PI * 46;

export default function RadialGaugeCard() {
  const [replayKey, setReplayKey] = useState(0);
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { amount: 0.45, once: false });
  const progress = useMotionValue(0);
  const displayValue = useTransform(progress, (latest) => `${Math.round(latest)}%`);
  const dashOffset = useTransform(
    progress,
    (latest) => circumference - (circumference * latest) / 100
  );

  useEffect(() => {
    if (!isInView) {
      return undefined;
    }

    progress.set(0);
    const controls = animate(progress, targetValue, {
      duration: 1.3,
      ease: 'easeOut',
    });

    return () => controls.stop();
  }, [isInView, progress, replayKey]);

  return (
    <article
      className="min-h-72 rounded-lg border border-cyan-200/20 bg-cyan-950/25 p-5"
      ref={cardRef}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-200">
            Radial Gauge
          </p>
          <h3 className="mt-2 text-xl font-black text-white">System Health</h3>
        </div>
        {renderReplayButton(() => setReplayKey((current) => current + 1))}
      </div>

      <div className="mt-8 flex items-center gap-6">
        <div className="relative h-36 w-36">
          <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
            <circle
              className="text-slate-950"
              cx="60"
              cy="60"
              fill="none"
              r="46"
              stroke="currentColor"
              strokeWidth="12"
            />
            <motion.circle
              className="text-cyan-300"
              cx="60"
              cy="60"
              fill="none"
              r="46"
              stroke="currentColor"
              strokeDasharray={circumference}
              strokeLinecap="round"
              strokeWidth="12"
              style={{ strokeDashoffset: dashOffset }}
            />
          </svg>
          <motion.p className="absolute inset-0 flex items-center justify-center text-3xl font-black tabular-nums text-white">
            {displayValue}
          </motion.p>
        </div>
        <p className="max-w-xs text-sm font-medium leading-6 text-cyan-50/75">
          A circular metric that draws the gauge and number together.
        </p>
      </div>
    </article>
  );
}
