import { useEffect, useRef, useState } from 'react';
import { animate, motion, useInView, useMotionValue, useTransform } from 'motion/react';

import renderReplayButton from './ReplayButton';

const initialTarget = 42;

function clampValue(value) {
  return Math.min(Math.max(value, 0), 99);
}

export default function StepperNumberCard() {
  const [target, setTarget] = useState(initialTarget);
  const [replayKey, setReplayKey] = useState(0);
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { amount: 0.45, once: false });
  const count = useMotionValue(0);
  const displayValue = useTransform(count, (latest) => String(Math.round(latest)).padStart(2, '0'));

  useEffect(() => {
    if (!isInView) {
      return undefined;
    }

    count.set(0);
    const controls = animate(count, target, {
      duration: 0.75,
      ease: 'easeOut',
    });

    return () => controls.stop();
  }, [count, isInView, replayKey, target]);

  return (
    <article
      className="min-h-72 rounded-lg border border-indigo-200/20 bg-indigo-950/25 p-5"
      ref={cardRef}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-indigo-200">
            Stepper Number
          </p>
          <h3 className="mt-2 text-xl font-black text-white">Quantity Control</h3>
        </div>
        {renderReplayButton(() => setReplayKey((current) => current + 1))}
      </div>

      <div className="mt-9 flex items-center gap-4">
        <button
          aria-label="Decrease stepper value"
          className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/10 text-3xl font-black text-white transition hover:border-indigo-200/50 hover:bg-indigo-200/15 focus:outline-none focus:ring-2 focus:ring-indigo-200/60"
          onClick={() => setTarget((current) => clampValue(current - 7))}
          type="button"
        >
          -
        </button>
        <motion.p className="min-w-32 text-center text-6xl font-black tabular-nums text-white">
          {displayValue}
        </motion.p>
        <button
          aria-label="Increase stepper value"
          className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/10 text-3xl font-black text-white transition hover:border-indigo-200/50 hover:bg-indigo-200/15 focus:outline-none focus:ring-2 focus:ring-indigo-200/60"
          onClick={() => setTarget((current) => clampValue(current + 7))}
          type="button"
        >
          +
        </button>
      </div>
      <p className="mt-6 max-w-sm text-sm font-medium leading-6 text-indigo-50/75">
        Plus and minus controls animate the number into its next step.
      </p>
    </article>
  );
}
