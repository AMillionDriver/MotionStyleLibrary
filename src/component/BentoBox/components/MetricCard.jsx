import { motion } from 'motion/react';

import DataIkan from '../../../data/landing/ikan.json';
import DataKucing from '../../../data/landing/kucing.json';

const totalFish = DataIkan.reduce((total, item) => total + item.quantity, 0);
const totalCats = DataKucing.reduce((total, item) => total + item.quantity, 0);
const regions = new Set(DataKucing.map((item) => item.region)).size;

const metrics = [
  {
    id: 'fish-total',
    label: 'Fish Data',
    value: totalFish,
    accent: 'text-sky-200',
    border: 'border-sky-300/20',
    background: 'bg-sky-950/50',
  },
  {
    id: 'cat-total',
    label: 'Cat Data',
    value: totalCats,
    accent: 'text-rose-200',
    border: 'border-rose-300/20',
    background: 'bg-rose-950/45',
  },
  {
    id: 'region-total',
    label: 'Regions',
    value: regions,
    accent: 'text-emerald-200',
    border: 'border-emerald-300/20',
    background: 'bg-emerald-950/40',
  },
];

function renderMetric(metric) {
  return (
    <motion.article
      className={`rounded-lg border ${metric.border} ${metric.background} p-4`}
      initial={{ opacity: 0, y: 18 }}
      key={metric.id}
      viewport={{ amount: 0.4, once: false }}
      whileHover={{ y: -4 }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <p className={`text-xs font-black uppercase tracking-[0.18em] ${metric.accent}`}>
        {metric.label}
      </p>
      <p className="mt-5 text-4xl font-black tabular-nums text-white">
        {metric.value.toLocaleString('id-ID')}
      </p>
    </motion.article>
  );
}

export default function MetricCard() {
  return (
    <section className="grid gap-3 lg:col-span-2 lg:grid-cols-3">
      {metrics.map(renderMetric)}
    </section>
  );
}
