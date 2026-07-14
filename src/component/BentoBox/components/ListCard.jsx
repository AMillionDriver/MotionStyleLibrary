import { motion } from 'motion/react';

import DataIkan from '../../../data/landing/ikan.json';
import DataKucing from '../../../data/landing/kucing.json';

const listItems = [
  ...DataIkan.slice(0, 4).map((item) => ({
    id: `fish-${item.id}`,
    label: item.name,
    meta: item.type ?? 'Animal',
    quantity: item.quantity,
    tone: 'text-sky-200',
  })),
  ...DataKucing.slice(0, 5).map((item) => ({
    id: `cat-${item.id}`,
    label: item.name,
    meta: item.region,
    quantity: item.quantity,
    tone: 'text-rose-200',
  })),
];

function renderListItem(item) {
  return (
    <li
      className="flex items-center justify-between gap-4 rounded-lg border border-white/10 bg-white/5 px-4 py-3"
      key={item.id}
    >
      <span className="min-w-0">
        <span className="block truncate font-bold text-white">{item.label}</span>
        <span className={`mt-1 block text-xs font-black uppercase tracking-[0.16em] ${item.tone}`}>
          {item.meta}
        </span>
      </span>
      <span className="rounded-full bg-white/10 px-3 py-1 text-sm font-black tabular-nums text-white">
        {item.quantity}
      </span>
    </li>
  );
}

export default function ListCard() {
  return (
    <motion.article
      className="rounded-lg border border-white/10 bg-slate-950 p-5 lg:col-span-3"
      initial={{ opacity: 0, y: 18 }}
      viewport={{ amount: 0.4, once: false }}
      whileHover={{ y: -4 }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
            List Card
          </p>
          <h3 className="mt-2 text-2xl font-black text-white">Compact Data Rows</h3>
        </div>
        <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-slate-200">
          {listItems.length} rows
        </span>
      </div>

      <ul className="mt-5 grid max-h-96 gap-3 overflow-y-auto pr-2 md:grid-cols-2">
        {listItems.map(renderListItem)}
      </ul>
    </motion.article>
  );
}
