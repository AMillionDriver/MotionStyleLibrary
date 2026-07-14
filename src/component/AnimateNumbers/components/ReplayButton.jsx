export default function renderReplayButton(onReplay) {
  return (
    <button
      className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-slate-100 transition hover:border-cyan-200/50 hover:bg-cyan-200/15 focus:outline-none focus:ring-2 focus:ring-cyan-200/60"
      onClick={onReplay}
      type="button"
    >
      Replay
    </button>
  );
}
