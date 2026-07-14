import { motion } from 'motion/react';

import DataKucing from '../../../data/landing/kucing.json';

const featuredCat = DataKucing.reduce(
  (current, item) => (item.quantity > current.quantity ? item : current),
  DataKucing[0]
);

export default function TallProfileCard() {
  return (
    <motion.article
      className="rounded-lg border border-amber-200/20 bg-amber-950/25 p-6 lg:row-span-2"
      initial={{ opacity: 0, y: 18 }}
      viewport={{ amount: 0.4, once: false }}
      whileHover={{ y: -4 }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-200">Tall Profile</p>
      <div className="mt-8 flex h-28 w-28 items-center justify-center rounded-full border border-amber-200/30 bg-slate-950 text-4xl font-black text-amber-100">
        {featuredCat.name
          .split(' ')
          .map((word) => word[0])
          .join('')
          .slice(0, 2)}
      </div>
      <h3 className="mt-6 text-3xl font-black text-white">{featuredCat.name}</h3>
      <p className="mt-2 text-sm font-bold text-amber-100">{featuredCat.region}</p>
      <div className="mt-8 rounded-lg border border-white/10 bg-white/5 p-4">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Quantity</p>
        <p className="mt-3 text-5xl font-black tabular-nums text-white">{featuredCat.quantity}</p>
      </div>
      <p className="mt-6 text-sm font-medium leading-6 text-amber-50/75">
        Tall cards are useful for featured profiles, hero items, and content that needs vertical
        focus.
      </p>
    </motion.article>
  );
}
