import { useRef, useState } from 'react';
import { motion, useInView } from 'motion/react';

import renderReplayButton from './ReplayButton';

const particlePoints = [
  [12, 20],
  [24, 12],
  [38, 10],
  [52, 14],
  [63, 24],
  [58, 38],
  [44, 48],
  [31, 58],
  [20, 70],
  [15, 86],
  [31, 91],
  [48, 90],
  [62, 82],
  [82, 16],
  [98, 11],
  [114, 14],
  [127, 26],
  [129, 42],
  [117, 52],
  [100, 55],
  [84, 56],
  [86, 72],
  [96, 86],
  [113, 92],
  [130, 88],
];

function renderParticle(point, index, isInView, replayKey) {
  const [x, y] = point;
  const startX = 70 + ((index % 5) - 2) * 8;
  const startY = 54 + (Math.floor(index / 5) - 2) * 6;

  return (
    <motion.span
      animate={
        isInView ? { opacity: 1, scale: 1, x, y } : { opacity: 0, scale: 0.2, x: startX, y: startY }
      }
      className="absolute left-0 top-0 h-3 w-3 rounded-full bg-cyan-200 shadow-lg shadow-cyan-300/40"
      initial={{ opacity: 0, scale: 0.2, x: startX, y: startY }}
      key={`${index}-${replayKey}`}
      transition={{
        delay: index * 0.018,
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1],
      }}
    />
  );
}

export default function ParticleNumberCard() {
  const [replayKey, setReplayKey] = useState(0);
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { amount: 0.45, once: false });

  return (
    <article
      className="min-h-72 rounded-lg border border-cyan-200/20 bg-slate-950 p-5"
      ref={cardRef}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-200">
            Particle Number
          </p>
          <h3 className="mt-2 text-xl font-black text-white">Dot Field</h3>
        </div>
        {renderReplayButton(() => setReplayKey((current) => current + 1))}
      </div>

      <div className="relative mt-8 h-32 w-40 rounded-lg border border-cyan-200/20 bg-cyan-950/20">
        {particlePoints.map((point, index) => renderParticle(point, index, isInView, replayKey))}
      </div>
      <p className="mt-4 max-w-sm text-sm font-medium leading-6 text-cyan-50/75">
        Particles fly out from the center and assemble into a numeric mark.
      </p>
    </article>
  );
}
