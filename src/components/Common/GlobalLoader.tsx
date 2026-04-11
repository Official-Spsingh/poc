
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Logo from './Logo';

const GlobalLoader = () => {
  const [textIndex, setTextIndex] = useState(0);
  const loadingTexts = [
    "Establishing secure connection...",
    "Syncing workspace metadata...",
    "Optimizing data pipelines...",
    "Preparing the studio..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % loadingTexts.length);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[99999] bg-slate-900/40 backdrop-blur-xl flex items-center justify-center selection:bg-transparent"
    >
      <div className="flex flex-col items-center gap-6">
        <div className="relative flex items-center justify-center">
          {/* Soft, expanding pulse rings */}
          <motion.div
            animate={{ scale: [1, 2.5], opacity: [0.5, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut" }}
            className="absolute inline-flex w-16 h-16 rounded-full bg-blue-500/20"
          />
          <motion.div
            animate={{ scale: [1, 2.5], opacity: [0.3, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut", delay: 1.25 }}
            className="absolute inline-flex w-16 h-16 rounded-full bg-emerald-500/20"
          />

          {/* Core Element */}
          <motion.div
            animate={{ scale: [1, 1.05, 1], shadow: ["0 0 20px rgba(59,130,246,0.3)", "0 0 40px rgba(59,130,246,0.6)", "0 0 20px rgba(59,130,246,0.3)"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="relative z-10 w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 flex flex-col items-center justify-center text-white"
          >
            <Logo size={28} className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
          </motion.div>
        </div>

        {/* Sleek Loading Bar */}
        <div className="flex flex-col items-center gap-3">
          <div className="h-[2px] w-32 bg-white/10 rounded-full overflow-hidden relative mb-2">
            <motion.div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-transparent via-blue-400 to-transparent w-full"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={textIndex}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
              className="text-white/80 text-xs font-medium tracking-wide"
            >
              {loadingTexts[textIndex]}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};
export default GlobalLoader