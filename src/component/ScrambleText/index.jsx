import variants from './variants';

function renderVariant(variant) {
  return (
    <span
      className="rounded-full border border-violet-200/20 bg-violet-950/50 px-4 py-2 text-sm font-bold text-violet-100"
      key={variant.id}
    >
      {variant.name}
    </span>
  );
}

export default function ScrambleTextPreview() {
  return (
    <div className="rounded-lg border border-violet-200/20 bg-slate-900 p-6">
      <p className="text-sm font-black uppercase tracking-[0.2em] text-violet-200">S#R@MBL3</p>
      <h3 className="mt-4 text-4xl font-black text-white">Text reveal lab</h3>
      <div className="mt-8 flex flex-wrap gap-2">{variants.map(renderVariant)}</div>
    </div>
  );
}
