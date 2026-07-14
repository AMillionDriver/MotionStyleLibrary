import { useEffect, useRef, useState } from 'react';
import { useInView } from 'motion/react';

import renderReplayButton from './ReplayButton';

const startSeconds = 15;

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

export default function TimerCountdownCard() {
  const [seconds, setSeconds] = useState(startSeconds);
  const [replayKey, setReplayKey] = useState(0);
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { amount: 0.45, once: false });

  useEffect(() => {
    if (!isInView) {
      return undefined;
    }

    let nextValue = startSeconds;
    setSeconds(startSeconds);

    const timer = window.setInterval(() => {
      nextValue = Math.max(nextValue - 1, 0);
      setSeconds(nextValue);

      if (nextValue === 0) {
        window.clearInterval(timer);
      }
    }, 120);

    return () => window.clearInterval(timer);
  }, [isInView, replayKey]);

  return (
    <article
      className="min-h-72 rounded-lg border border-rose-200/20 bg-rose-950/30 p-5"
      ref={cardRef}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-rose-200">
            Timer Countdown
          </p>
          <h3 className="mt-2 text-xl font-black text-white">Launch Timer</h3>
        </div>
        {renderReplayButton(() => setReplayKey((current) => current + 1))}
      </div>

      <p className="mt-10 font-mono text-6xl font-black tabular-nums text-white">
        {formatTime(seconds)}
      </p>
      <div className="mt-5 h-2 overflow-hidden rounded-full bg-rose-950">
        <div
          className="h-full rounded-full bg-rose-300 transition-all duration-100"
          style={{ width: `${(seconds / startSeconds) * 100}%` }}
        />
      </div>
      <p className="mt-4 max-w-sm text-sm font-medium leading-6 text-rose-50/75">
        Runs a fast demo countdown from 00:15 into 00:00.
      </p>
    </article>
  );
}
