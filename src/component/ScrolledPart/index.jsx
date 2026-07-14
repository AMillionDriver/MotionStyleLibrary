import variants from './variants';

function renderBlock(variant) {
  return (
    <article className="rounded-lg border border-white/10 bg-white/5 p-5" key={variant.id}>
      <p className="text-sm font-black uppercase tracking-[0.18em] text-slate-400">planned</p>
      <h3 className="mt-5 text-2xl font-black text-white">{variant.name}</h3>
    </article>
  );
}

export default function ScrolledPartPreview() {
  return (
    <div className="rounded-lg border border-white/10 bg-slate-900 p-5">
      <div className="grid gap-3 sm:grid-cols-3">{variants.map(renderBlock)}</div>
    </div>
  );
}
