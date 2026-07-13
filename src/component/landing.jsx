import animationCatalog from './animationCatalog';

function renderSectionHeader(item) {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-6 py-8 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-sm font-bold tracking-[0.25em] text-cyan-200">
          {item.number}
        </p>
        <h2 className="mt-2 text-3xl font-black text-white sm:text-4xl">
          {item.title}
        </h2>
      </div>
      <p className="max-w-xl text-sm font-medium leading-6 text-slate-300">
        {item.description}
      </p>
    </div>
  );
}

function renderStatusBadge(status) {
  const isReady = status === 'ready';
  const tone = isReady
    ? 'border-emerald-300/30 bg-emerald-300/15 text-emerald-100'
    : 'border-amber-200/30 bg-amber-200/15 text-amber-100';

  return (
    <span
      className={`rounded-full border px-3 py-1 text-xs font-black uppercase tracking-[0.16em] ${tone}`}
    >
      {status}
    </span>
  );
}

function renderVariant(variant) {
  return (
    <li
      className="flex items-center justify-between gap-4 rounded-lg border border-white/10 bg-white/5 px-4 py-3"
      key={variant.id}
    >
      <span className="font-bold text-white">{variant.name}</span>
      {renderStatusBadge(variant.status)}
    </li>
  );
}

function renderAnimationSection(item) {
  const PreviewComponent = item.Component;

  return (
    <section
      className="border-b border-white/10 bg-slate-950 even:bg-slate-900"
      key={item.folder}
    >
      {renderSectionHeader(item)}
      <div className="mx-auto grid w-full max-w-6xl gap-5 px-6 pb-14 lg:grid-cols-[minmax(0,1fr)_320px]">
        <PreviewComponent />
        <aside className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">
            {item.folder}
          </p>
          <h3 className="mt-2 text-xl font-black text-white">Variant List</h3>
          <ul className="mt-5 space-y-3">{item.variants.map(renderVariant)}</ul>
        </aside>
      </div>
    </section>
  );
}

export function Landing() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {animationCatalog.map(renderAnimationSection)}
    </main>
  );
}

export default Landing;
