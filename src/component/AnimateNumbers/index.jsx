import variants from './variants';

const stats = [
  { id: 'projects', label: 'Projects', value: 24 },
  { id: 'models', label: 'Models', value: 11 },
  { id: 'variants', label: 'Variants', value: 33 },
];

function renderStat(stat) {
  return (
    <article
      className="rounded-lg border border-emerald-200/20 bg-emerald-950/40 p-5"
      key={stat.id}
    >
      <p className="text-sm font-black uppercase tracking-[0.18em] text-emerald-200">
        {stat.label}
      </p>
      <p className="mt-6 text-5xl font-black text-white">{stat.value}</p>
    </article>
  );
}

function renderVariant(variant) {
  return (
    <span
      className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-slate-200"
      key={variant.id}
    >
      {variant.name}
    </span>
  );
}

export default function AnimateNumbersPreview() {
  return (
    <div className="rounded-lg border border-white/10 bg-slate-900 p-5">
      <div className="grid gap-3 sm:grid-cols-3">{stats.map(renderStat)}</div>
      <div className="mt-5 flex flex-wrap gap-2">{variants.map(renderVariant)}</div>
    </div>
  );
}
