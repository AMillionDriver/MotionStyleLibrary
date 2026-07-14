import CountUpCard from './components/CountUpCard';
import CurrencyCounterCard from './components/CurrencyCounterCard';
import DigitalClockCard from './components/DigitalClockCard';
import FlipCalendarCard from './components/FlipCalendarCard';
import GlitchNumberCard from './components/GlitchNumberCard';
import MatrixDigitsCard from './components/MatrixDigitsCard';
import MorphingNumberCard from './components/MorphingNumberCard';
import NeonFlickerCard from './components/NeonFlickerCard';
import OdometerCard from './components/OdometerCard';
import ParticleNumberCard from './components/ParticleNumberCard';
import PercentageFillCard from './components/PercentageFillCard';
import PixelRevealCard from './components/PixelRevealCard';
import RadialGaugeCard from './components/RadialGaugeCard';
import ScrollCounterCard from './components/ScrollCounterCard';
import SlotMachineCard from './components/SlotMachineCard';
import SplitFlapCard from './components/SplitFlapCard';
import StepperNumberCard from './components/StepperNumberCard';
import TimerCountdownCard from './components/TimerCountdownCard';
import TickerNumberCard from './components/TickerNumberCard';
import variants from './variants';

function renderPlannedVariant(variant) {
  if (variant.status === 'ready') {
    return null;
  }

  return (
    <span
      className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-slate-300"
      key={variant.id}
    >
      {variant.name}
    </span>
  );
}

export default function AnimateNumbersPreview() {
  const plannedVariants = variants.filter((variant) => variant.status !== 'ready');

  return (
    <div className="space-y-5 rounded-lg border border-white/10 bg-slate-900 p-5">
      <div className="grid gap-4 xl:grid-cols-2">
        <CountUpCard />
        <CurrencyCounterCard />
        <TimerCountdownCard />
        <DigitalClockCard />
        <PercentageFillCard />
        <RadialGaugeCard />
        <StepperNumberCard />
        <ScrollCounterCard />
        <TickerNumberCard />
        <SlotMachineCard />
        <SplitFlapCard />
        <ParticleNumberCard />
        <MorphingNumberCard />
        <NeonFlickerCard />
        <MatrixDigitsCard />
        <PixelRevealCard />
        <FlipCalendarCard />
        <GlitchNumberCard />
        <OdometerCard />
      </div>

      <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
          Next planned models
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {plannedVariants.length > 0 ? (
            plannedVariants.map(renderPlannedVariant)
          ) : (
            <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-4 py-2 text-sm font-bold text-emerald-100">
              All initial animated number models are ready
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
