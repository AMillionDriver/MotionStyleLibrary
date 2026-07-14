import variants from './variants';

function renderLine(variant) {
  return (
    <li
      className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-3"
      key={variant.id}
    >
      <span className="h-2 w-2 rounded-full bg-cyan-200" />
      <span className="font-bold text-white">{variant.name}</span>
    </li>
  );
}

export default function TypeWriterPreview() {
  return (
    <div className="rounded-lg border border-white/10 bg-slate-900 p-6">
      <p className="font-mono text-sm uppercase tracking-[0.2em] text-cyan-200">typing...</p>
      <h3 className="mt-4 font-mono text-3xl font-black text-white">Build animation models_</h3>
      <ul className="mt-8 grid gap-3 sm:grid-cols-3">{variants.map(renderLine)}</ul>
    </div>
  );
}
