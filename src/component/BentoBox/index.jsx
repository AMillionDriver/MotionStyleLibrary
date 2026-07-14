import DataIkan from '../../data/landing/ikan.json';
import DataKucing from '../../data/landing/kucing.json';

function renderFishCard(item) {
  return (
    <article
      className="rounded-lg border border-sky-300/20 bg-sky-950/70 p-5 shadow-lg shadow-sky-950/30"
      key={item.id}
    >
      <p className="text-sm font-bold uppercase tracking-[0.18em] text-sky-200">
        #{String(item.id).padStart(2, '0')}
      </p>
      <h3 className="mt-4 text-2xl font-black text-white">{item.name}</h3>
      <div className="mt-5 flex items-end justify-between gap-4">
        <p className="text-sm font-semibold text-slate-300">{item.type ?? 'Animal'}</p>
        <p className="text-4xl font-black text-cyan-200">{item.quantity}</p>
      </div>
    </article>
  );
}

function renderCatCard(item) {
  return (
    <article className="rounded-lg border border-rose-200/20 bg-rose-950/60 p-5" key={item.id}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-rose-200">{item.region}</p>
          <h3 className="mt-2 text-xl font-black text-white">{item.name}</h3>
        </div>
        <span className="rounded-full bg-amber-200 px-3 py-1 text-sm font-black text-slate-950">
          {item.quantity}
        </span>
      </div>
      <p className="mt-5 text-sm font-semibold uppercase tracking-[0.2em] text-rose-100/80">
        {item.type}
      </p>
    </article>
  );
}

export default function BentoBoxPreview() {
  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{DataIkan.map(renderFishCard)}</div>

      <div className="grid max-h-[420px] gap-3 overflow-y-auto pr-2 sm:grid-cols-2 xl:grid-cols-3">
        {DataKucing.map(renderCatCard)}
      </div>
    </div>
  );
}
