import { motion } from 'motion/react';

import DataIkan from '../../../data/landing/ikan.json';
import DataKucing from '../../../data/landing/kucing.json';

const totalFish = DataIkan.reduce((total, item) => total + item.quantity, 0);
const totalCats = DataKucing.reduce((total, item) => total + item.quantity, 0);
const combinedTotal = totalFish + totalCats;
const fishShare = Math.round((totalFish / combinedTotal) * 100);
const catShare = 100 - fishShare;

export default function WideFeatureCard() {
  return (
    <motion.article
      className="relative overflow-hidden rounded-lg border border-cyan-200/20 bg-slate-950 p-6 lg:col-span-2"
      initial={{ opacity: 0, y: 18 }}
      viewport={{ amount: 0.4, once: false }}
      whileHover={{ y: -4 }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <div className="absolute right-0 top-0 h-40 w-40 bg-cyan-300/10 blur-3xl" />
      <div className="relative">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-200">Wide Feature</p>
        <h3 className="mt-3 max-w-xl text-3xl font-black text-white">
          Mixed animal dataset dashboard
        </h3>
        <p className="mt-4 max-w-xl text-sm font-medium leading-6 text-slate-300">
          A wide card works well for summaries, key insights, and visual comparison between
          datasets.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div>
            <div className="flex justify-between text-xs font-black uppercase tracking-[0.16em] text-sky-200">
              <span>Fish</span>
              <span>{fishShare}%</span>
            </div>
            <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-800">
              <div className="h-full rounded-full bg-sky-300" style={{ width: `${fishShare}%` }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-black uppercase tracking-[0.16em] text-rose-200">
              <span>Cats</span>
              <span>{catShare}%</span>
            </div>
            <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-800">
              <div className="h-full rounded-full bg-rose-300" style={{ width: `${catShare}%` }} />
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
