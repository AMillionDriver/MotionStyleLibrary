import variants from './variants';

function renderTickerItem(variant) {
  return (
    <span
      className="rounded-full border border-amber-200/20 bg-amber-950/40 px-5 py-3 text-sm font-black uppercase tracking-[0.16em] text-amber-100"
      key={variant.id}
    >
      {variant.name}
    </span>
  );
}

export default function TickerPreview() {
  return (
    <div className="overflow-hidden rounded-lg border border-amber-200/20 bg-slate-900 p-6">
      <div className="flex min-w-max gap-3">{variants.map(renderTickerItem)}</div>
      <div className="mt-5 h-2 rounded-full bg-amber-200/30" />
    </div>
  );
}
