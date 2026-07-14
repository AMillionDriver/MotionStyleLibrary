import { useRef, useState } from 'react';
import { motion, useInView } from 'motion/react';

import renderReplayButton from './ReplayButton';

const pixels = [
  { id: 'p01', active: false },
  { id: 'p02', active: true },
  { id: 'p03', active: true },
  { id: 'p04', active: true },
  { id: 'p05', active: false },
  { id: 'p06', active: true },
  { id: 'p07', active: false },
  { id: 'p08', active: false },
  { id: 'p09', active: false },
  { id: 'p10', active: true },
  { id: 'p11', active: false },
  { id: 'p12', active: false },
  { id: 'p13', active: false },
  { id: 'p14', active: true },
  { id: 'p15', active: false },
  { id: 'p16', active: false },
  { id: 'p17', active: false },
  { id: 'p18', active: true },
  { id: 'p19', active: false },
  { id: 'p20', active: false },
  { id: 'p21', active: false },
  { id: 'p22', active: true },
  { id: 'p23', active: false },
  { id: 'p24', active: false },
  { id: 'p25', active: false },
  { id: 'p26', active: true },
  { id: 'p27', active: true },
  { id: 'p28', active: true },
  { id: 'p29', active: true },
  { id: 'p30', active: true },
  { id: 'p31', active: false },
  { id: 'p32', active: false },
  { id: 'p33', active: false },
  { id: 'p34', active: false },
  { id: 'p35', active: false },
];

function renderPixel(pixel, position, isInView, replayKey) {
  const delay = pixel.active ? position * 0.025 : 0;

  return (
    <motion.span
      animate={pixel.active && isInView ? { opacity: 1, scale: 1 } : { opacity: 0.08, scale: 0.8 }}
      className="aspect-square rounded bg-orange-300"
      initial={{ opacity: 0.08, scale: 0.8 }}
      key={`${pixel.id}-${replayKey}`}
      transition={{ delay, duration: 0.22 }}
    />
  );
}

export default function PixelRevealCard() {
  const [replayKey, setReplayKey] = useState(0);
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { amount: 0.45, once: false });

  return (
    <article
      className="min-h-72 rounded-lg border border-orange-200/20 bg-orange-950/25 p-5"
      ref={cardRef}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-200">
            Pixel Reveal
          </p>
          <h3 className="mt-2 text-xl font-black text-white">Block Number</h3>
        </div>
        {renderReplayButton(() => setReplayKey((current) => current + 1))}
      </div>

      <div className="mt-8 w-40 rounded-lg border border-orange-200/20 bg-slate-950 p-4">
        <div className="grid grid-cols-5 gap-2">
          {pixels.map((pixel, position) => renderPixel(pixel, position, isInView, replayKey))}
        </div>
      </div>
      <p className="mt-4 max-w-sm text-sm font-medium leading-6 text-orange-50/75">
        Builds a numeric shape from glowing pixel blocks.
      </p>
    </article>
  );
}
