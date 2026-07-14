import { useEffect, useRef, useState } from 'react';
import { animate, motion, useInView, useMotionValue, useTransform } from 'motion/react';

import renderReplayButton from './ReplayButton';

const targetValue = 12750000;

function formatCurrency(value) {
  return `Rp ${Math.round(value).toLocaleString('id-ID')}`;
}

export default function CurrencyCounterCard() {
  const [replayKey, setReplayKey] = useState(0);
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { amount: 0.45, once: false });
  const count = useMotionValue(0);
  const displayValue = useTransform(count, formatCurrency);

  useEffect(() => {
    if (!isInView) {
      return undefined;
    }

    count.set(0);
    const controls = animate(count, targetValue, {
      duration: 1.5,
      ease: 'easeOut',
    });

    return () => controls.stop();
  }, [count, isInView, replayKey]);

  return (
    <article
      className="min-h-72 rounded-lg border border-sky-200/20 bg-sky-950/35 p-5"
      ref={cardRef}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-200">
            Currency Counter
          </p>
          <h3 className="mt-2 text-xl font-black text-white">Revenue Pulse</h3>
        </div>
        {renderReplayButton(() => setReplayKey((current) => current + 1))}
      </div>

      <motion.p className="mt-10 text-4xl font-black tabular-nums text-white sm:text-5xl">
        {displayValue}
      </motion.p>
      <p className="mt-4 max-w-sm text-sm font-medium leading-6 text-sky-50/75">
        Formats an animated total with Indonesian currency separators.
      </p>
    </article>
  );
}
