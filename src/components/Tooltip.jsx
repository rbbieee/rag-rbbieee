import React, { useState } from 'react';

export default function Tooltip({ term, explanation, children }) {
  const [visible, setVisible] = useState(false);

  return (
    <span
      className="relative inline-flex items-center cursor-help"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      <span className="border-b border-dotted border-slate-500 hover:border-[#ff3b30] transition-colors">
        {children || term}
      </span>

      {visible && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 pointer-events-none">
          <span className="block w-56 px-3 py-2.5 rounded-xl bg-[#1c1c1e] border border-white/[0.12] shadow-xl text-[11px] text-slate-200 leading-relaxed font-sans font-normal text-left">
            <span className="block font-semibold text-white mb-0.5">{term}</span>
            {explanation}
          </span>
          <span className="block w-2.5 h-2.5 bg-[#1c1c1e] border-r border-b border-white/[0.12] rotate-45 absolute left-1/2 -translate-x-1/2 -bottom-[5px]" />
        </span>
      )}
    </span>
  );
}
