import { useEffect, useRef, useState } from 'react';
import { useInView } from 'motion/react';

import renderReplayButton from './ReplayButton';

const targetTime = '14:26:08';

function randomTime() {
  const hours = Math.floor(Math.random() * 24);
  const minutes = Math.floor(Math.random() * 60);
  const seconds = Math.floor(Math.random() * 60);

  return [hours, minutes, seconds].map((item) => String(item).padStart(2, '0')).join(':');
}

export default function DigitalClockCard() {
  const [displayTime, setDisplayTime] = useState(targetTime);
  const [isScanning, setIsScanning] = useState(false);
  const [replayKey, setReplayKey] = useState(0);
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { amount: 0.45, once: false });

  useEffect(() => {
    if (!isInView) {
      return undefined;
    }

    let tick = 0;
    setIsScanning(true);

    const timer = window.setInterval(() => {
      tick += 1;

      if (tick >= 14) {
        window.clearInterval(timer);
        setDisplayTime(targetTime);
        setIsScanning(false);
        return;
      }

      setDisplayTime(randomTime());
    }, 80);

    return () => window.clearInterval(timer);
  }, [isInView, replayKey]);

  return (
    <article
      className="min-h-72 rounded-lg border border-lime-200/20 bg-lime-950/20 p-5"
      ref={cardRef}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-lime-200">
            Digital Clock
          </p>
          <h3 className="mt-2 text-xl font-black text-white">Time Lock</h3>
        </div>
        {renderReplayButton(() => setReplayKey((current) => current + 1))}
      </div>

      <div className="mt-10 rounded-lg border border-lime-200/20 bg-slate-950 px-4 py-6">
        <p
          className="font-mono text-5xl font-black tabular-nums text-lime-100"
          style={{
            textShadow: isScanning
              ? '0 0 18px rgba(190, 242, 100, 0.65)'
              : '0 0 10px rgba(190, 242, 100, 0.25)',
          }}
        >
          {displayTime}
        </p>
      </div>
      <p className="mt-4 max-w-sm text-sm font-medium leading-6 text-lime-50/75">
        Rapidly scans clock values before settling on a fixed demo time.
      </p>
    </article>
  );
}
