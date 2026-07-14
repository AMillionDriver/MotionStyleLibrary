import { useEffect, useRef, useState } from 'react';
import { useInView } from 'motion/react';

import renderReplayButton from './ReplayButton';

const flickerSteps = [
  { opacity: 0.35, blur: 4 },
  { opacity: 1, blur: 18 },
  { opacity: 0.45, blur: 6 },
  { opacity: 0.9, blur: 26 },
  { opacity: 0.6, blur: 10 },
  { opacity: 1, blur: 20 },
];

export default function NeonFlickerCard() {
  const [step, setStep] = useState(flickerSteps.length - 1);
  const [replayKey, setReplayKey] = useState(0);
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { amount: 0.45, once: false });
  const currentStep = flickerSteps[step];

  useEffect(() => {
    if (!isInView) {
      return undefined;
    }

    let nextStep = 0;
    setStep(0);

    const timer = window.setInterval(() => {
      nextStep += 1;
      setStep(Math.min(nextStep, flickerSteps.length - 1));

      if (nextStep >= flickerSteps.length - 1) {
        window.clearInterval(timer);
      }
    }, 110);

    return () => window.clearInterval(timer);
  }, [isInView, replayKey]);

  return (
    <article
      className="min-h-72 overflow-hidden rounded-lg border border-pink-200/20 bg-slate-950 p-5"
      ref={cardRef}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-pink-200">
            Neon Flicker
          </p>
          <h3 className="mt-2 text-xl font-black text-white">Voltage Sign</h3>
        </div>
        {renderReplayButton(() => setReplayKey((current) => current + 1))}
      </div>

      <div className="mt-10 rounded-lg border border-pink-200/20 bg-pink-950/20 p-6">
        <p
          className="text-center text-6xl font-black tabular-nums text-pink-100 transition-all duration-100"
          style={{
            opacity: currentStep.opacity,
            textShadow: `0 0 ${currentStep.blur}px rgba(244, 114, 182, 0.9), 0 0 40px rgba(34, 211, 238, 0.25)`,
          }}
        >
          808
        </p>
      </div>
      <p className="mt-4 max-w-sm text-sm font-medium leading-6 text-pink-50/75">
        Flickers the glow before the number stabilizes like a neon sign.
      </p>
    </article>
  );
}
