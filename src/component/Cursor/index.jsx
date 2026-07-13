import variants from './variants';

function renderVariant(variant) {
  return (
    <span
      className="rounded-full border border-cyan-200/20 bg-cyan-950/40 px-4 py-2 text-sm font-bold text-cyan-100"
      key={variant.id}
    >
      {variant.name}
    </span>
  );
}

export default function CursorPreview() {
  return (
    <div className="relative min-h-64 overflow-hidden rounded-lg border border-white/10 bg-slate-900 p-6">
      <div className="absolute right-10 top-10 h-24 w-24 rounded-full border border-cyan-200/30 bg-cyan-300/10" />
      <div className="absolute right-20 top-20 h-4 w-4 rounded-full bg-cyan-200" />
      <p className="text-sm font-black uppercase tracking-[0.2em] text-cyan-200">
        Pointer effects
      </p>
      <h3 className="mt-4 max-w-sm text-4xl font-black text-white">
        Cursor interaction preview
      </h3>
      <div className="mt-8 flex flex-wrap gap-2">{variants.map(renderVariant)}</div>
    </div>
  );
}
