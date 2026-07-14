import { useRef, useState } from 'react';
import { motion, useInView } from 'motion/react';

import renderReplayButton from './ReplayButton';

const tickerValues = [
  'IDX 7.214,8',
  'BTC 1.043.220.000',
  'USD 16.240',
  'ETH 56.840.000',
  'GOLD 1.924.000',
  'NQ 21.480,5',
];

function renderTickerItem(value, index) {
  return (
    <span
      className="rounded-full border border-amber-200/20 bg-amber-950/40 px-5 py-3 text-sm font-black uppercase tracking-[0.16em] text-amber-100"
      key={`${value}-${index}`}
    >
      {value}
    </span>
  );
}

export default function TickerNumberCard() {
  const [replayKey, setReplayKey] = useState(0);
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { amount: 0.45, once: false });

  return (
    <article
      className="min-h-72 overflow-hidden rounded-lg border border-amber-200/20 bg-amber-950/20 p-5"
      ref={cardRef}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-200">
            Ticker Number
          </p>
          <h3 className="mt-2 text-xl font-black text-white">Market Strip</h3>
        </div>
        {renderReplayButton(() => setReplayKey((current) => current + 1))}
      </div>

      <div className="mt-10 overflow-hidden rounded-lg border border-amber-200/20 bg-slate-950 p-4">
        <motion.div
          animate={isInView ? { x: ['0%', '-42%'] } : { x: '0%' }}
          className="flex min-w-max gap-3"
          initial={{ x: '0%' }}
          key={replayKey}
          transition={{ duration: 2.2, ease: 'easeInOut' }}
        >
          {[...tickerValues, ...tickerValues].map((value, index) => renderTickerItem(value, index))}
        </motion.div>
      </div>
      <p className="mt-4 max-w-sm text-sm font-medium leading-6 text-amber-50/75">
        Slides market-like numeric labels across a compact ticker strip.
      </p>
    </article>
  );
}
