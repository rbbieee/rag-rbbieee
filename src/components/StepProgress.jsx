import React from 'react';
import { Scissors, Hash, Target, FileText, Cpu, Check } from 'lucide-react';

const STEPS = [
  { id: 1, num: '01', name: 'Chunking', icon: Scissors },
  { id: 2, num: '02', name: 'Embedding', icon: Hash },
  { id: 3, num: '03', name: 'Vector Search', icon: Target },
  { id: 4, num: '04', name: 'Prompt Assembly', icon: FileText },
  { id: 5, num: '05', name: 'LLM Response', icon: Cpu },
];

export default function StepProgress({ currentStep, setStep }) {
  return (
    <div className="w-full bg-black/60 border-b border-white/[0.08] px-4 py-3 backdrop-blur-2xl sticky top-14 z-30">
      <div className="max-w-7xl mx-auto">
        <div className="apple-segmented grid grid-cols-2 md:grid-cols-5 gap-1.5">
          {STEPS.map((step) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;

            return (
              <button
                key={step.id}
                onClick={() => setStep(step.id)}
                className={`flex items-center space-x-2.5 px-3 py-2 rounded-xl transition-all duration-200 text-left ${
                  isActive
                    ? 'bg-white/[0.12] text-white shadow-md border border-white/10'
                    : isCompleted
                    ? 'text-slate-300 hover:bg-white/[0.06]'
                    : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.04]'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-mono shrink-0 transition-colors ${
                    isActive
                      ? 'bg-[#ff3b30] text-white font-bold shadow-sm'
                      : isCompleted
                      ? 'bg-white/10 text-slate-300'
                      : 'bg-white/5 text-slate-500'
                  }`}
                >
                  {isCompleted ? <Check className="w-3.5 h-3.5" /> : step.num}
                </div>

                <div className="min-w-0 flex-1 truncate">
                  <p className={`text-xs font-medium truncate ${isActive ? 'text-white font-semibold' : ''}`}>
                    {step.name}
                  </p>
                </div>

                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ff3b30] shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
