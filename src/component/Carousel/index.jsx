import variants from './variants';

function renderSlide(variant) {
  return (
    <article
      className="min-h-48 min-w-56 rounded-lg border border-white/10 bg-slate-800 p-5"
      key={variant.id}
    >
      <p className="text-sm font-black uppercase tracking-[0.18em] text-cyan-200">
        {variant.status}
      </p>
      <h3 className="mt-8 text-2xl font-black text-white">{variant.name}</h3>
    </article>
  );
}

export default function CarouselPreview() {
  return (
    <div className="overflow-hidden rounded-lg border border-white/10 bg-slate-900 p-5">
      <div className="flex gap-4 overflow-x-auto pb-2">{variants.map(renderSlide)}</div>
    </div>
  );
}
