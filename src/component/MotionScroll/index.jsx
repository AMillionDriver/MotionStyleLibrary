import { motion } from 'motion/react';

const foodCards = [
  { symbol: '\u{1F345}', label: 'Tomat', hueA: 340, hueB: 10 },
  { symbol: '\u{1F34A}', label: 'Jeruk', hueA: 20, hueB: 40 },
  { symbol: '\u{1F34B}', label: 'Lemon', hueA: 60, hueB: 90 },
  { symbol: '\u{1F350}', label: 'Pir', hueA: 80, hueB: 120 },
  { symbol: '\u{1F34F}', label: 'Apel', hueA: 100, hueB: 140 },
  { symbol: '\u{1FAD0}', label: 'Blueberry', hueA: 205, hueB: 245 },
  { symbol: '\u{1F346}', label: 'Terong', hueA: 260, hueB: 290 },
  { symbol: '\u{1F347}', label: 'Anggur', hueA: 290, hueB: 320 },
];

const cardVariants = {
  offscreen: {
    y: 180,
    rotate: 0,
  },
  onscreen: {
    y: 0,
    rotate: -6,
    transition: {
      type: 'spring',
      bounce: 0.35,
      duration: 0.8,
    },
  },
};

function renderMotionCard(item, index) {
  const background = `linear-gradient(135deg, hsl(${item.hueA} 90% 52%), hsl(${item.hueB} 92% 58%))`;

  return (
    <motion.article
      className="relative flex min-h-90 items-center justify-center overflow-hidden rounded-lg bg-white/95 p-6 shadow-xl shadow-slate-950/30"
      initial="offscreen"
      key={item.label}
      variants={cardVariants}
      viewport={{ amount: 0.45, once: false }}
      whileInView="onscreen"
    >
      <div className="absolute inset-x-0 bottom-0 h-1/2" style={{ background }} />
      <div className="relative z-10 flex h-56 w-48 flex-col items-center justify-center rounded-lg bg-white shadow-lg">
        <span className="text-7xl leading-none">{item.symbol}</span>
        <p className="mt-4 text-sm font-black uppercase tracking-[0.2em] text-slate-600">
          {String(index + 1).padStart(2, '0')} / {item.label}
        </p>
      </div>
    </motion.article>
  );
}

export default function MotionScrollPreview() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {foodCards.map(renderMotionCard)}
    </div>
  );
}
