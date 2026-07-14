import ListCard from './components/ListCard';
import MetricCard from './components/MetricCard';
import TallProfileCard from './components/TallProfileCard';
import WideFeatureCard from './components/WideFeatureCard';

export default function BentoBoxPreview() {
  return (
    <div className="space-y-4">
      <div className="axo-bento rounded-lg border border-white/10 bg-slate-900 p-4">
        <div className="axo-wide axo-rise">
          <MetricCard />
        </div>
        <div className="axo-wide axo-rise axo-lift axo-glow" style={{ '--axo-delay': '80ms' }}>
          <WideFeatureCard />
        </div>
        <div className="axo-tall axo-pop axo-lift" style={{ '--axo-delay': '120ms' }}>
          <TallProfileCard />
        </div>
        <div className="axo-large axo-fade axo-lift" style={{ '--axo-delay': '160ms' }}>
          <ListCard />
        </div>
      </div>

      <div className="axo-theme-dark axo-bento rounded-lg border border-cyan-200/10 bg-slate-950 p-4">
        <div className="axo-card axo-surface axo-wide axo-rise axo-lift">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-200">
            Dark Surface
          </p>
          <h3 className="mt-3 text-2xl font-black">axo-surface</h3>
        </div>
        <div className="axo-card axo-contrast axo-tall axo-pop axo-glow">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
            Dark Contrast
          </p>
          <h3 className="mt-3 text-2xl font-black">axo-contrast</h3>
        </div>
        <div className="axo-card axo-surface axo-square axo-fade axo-shimmer">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-200">Shimmer</p>
          <h3 className="mt-3 text-2xl font-black">axo-shimmer</h3>
        </div>
      </div>

      <div className="axo-theme-light axo-bento rounded-lg border border-slate-200 bg-white p-4">
        <div className="axo-card axo-surface axo-wide axo-rise axo-lift">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
            Light Surface
          </p>
          <h3 className="mt-3 text-2xl font-black">white bg, soft card</h3>
        </div>
        <div className="axo-card axo-contrast axo-tall axo-pop axo-glow">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
            Light Contrast
          </p>
          <h3 className="mt-3 text-2xl font-black">light bg, dark card</h3>
        </div>
        <div className="axo-card axo-surface axo-square axo-fade">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Neutral</p>
          <h3 className="mt-3 text-2xl font-black">theme marker</h3>
        </div>
      </div>
    </div>
  );
}
