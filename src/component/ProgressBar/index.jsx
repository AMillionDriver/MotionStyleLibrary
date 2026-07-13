import { motion, useScroll } from 'motion/react';

export default function ProgressBarPreview() {
  const { scrollYProgress } = useScroll();

  return (
    <div className="relative min-h-48 overflow-hidden rounded-lg border border-cyan-200/20 bg-slate-900 p-6">
      <motion.div
        className="fixed left-0 top-0 z-50 h-1 w-full origin-left bg-cyan-300"
        style={{ scaleX: scrollYProgress }}
      />
      <div className="flex h-full flex-col justify-between gap-8">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.2em] text-cyan-200">
            Scroll Progress
          </p>
          <h3 className="mt-3 text-3xl font-black text-white">Top bar aktif</h3>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-slate-700">
          <motion.div
            className="h-full origin-left rounded-full bg-cyan-300"
            style={{ scaleX: scrollYProgress }}
          />
        </div>
      </div>
    </div>
  );
}
