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

      <div className="axo-bento rounded-lg border border-cyan-200/10 bg-slate-950 p-4">
        <div className="axo-card axo-wide axo-rise axo-lift border-white/10 bg-white/5 text-white">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-200">
            Axoloth Utility
          </p>
          <h3 className="mt-3 text-2xl font-black">axo-wide axo-rise axo-lift</h3>
        </div>
        <div className="axo-card axo-tall axo-pop axo-glow border-white/10 bg-white/5 text-white">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-200">
            Tall Utility
          </p>
          <h3 className="mt-3 text-2xl font-black">axo-tall axo-pop</h3>
        </div>
        <div className="axo-card axo-square axo-fade axo-shimmer border-white/10 bg-white/5 text-white">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-200">
            Shimmer
          </p>
          <h3 className="mt-3 text-2xl font-black">axo-shimmer</h3>
        </div>
      </div>
    </div>
  );
}
