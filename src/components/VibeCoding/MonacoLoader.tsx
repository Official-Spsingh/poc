import React from 'react';

const MonacoLoader: React.FC = () => (
  <div
    className="w-full h-full flex flex-col items-center justify-center gap-4"
    style={{ backgroundColor: '#0f172a' }}
  >
    <div className="relative w-10 h-10">
      <div className="absolute inset-0 rounded-full border-2 border-slate-700" />
      <div className="absolute inset-0 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
    </div>
    <div className="flex flex-col items-center gap-1.5">
      <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-300">
        Initializing Editor
      </span>
      <span className="text-[10px] text-slate-600 font-medium">
        Loading language services…
      </span>
    </div>
  </div>
);

export default MonacoLoader;
