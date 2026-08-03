import React from 'react';
import { Hash, ArrowRight, Activity, HelpCircle, Sparkles } from 'lucide-react';
import Tooltip from './Tooltip';

export default function Step2Embedding({ chunks, embeddings, onNextStep }) {
  // Apple HIG System Red alpha scaling
  const getCellColor = (val) => {
    if (val === undefined) return 'bg-white/[0.02] text-slate-600';
    if (val > 0.5) return 'bg-[#ff3b30] text-white font-bold shadow-sm';
    if (val > 0.2) return 'bg-red-500/40 text-white border border-red-500/30';
    if (val > 0) return 'bg-red-500/20 text-red-200 border border-red-500/20';
    if (val > -0.2) return 'bg-white/[0.04] text-slate-400 border border-white/[0.06]';
    return 'bg-white/[0.02] text-slate-500 border border-white/[0.04]';
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="apple-glass p-6 rounded-3xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-red-500/10 text-[#ff3b30] border border-red-500/20">
              Step 02
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">
              <Tooltip term="Dense Vector" explanation="A compact numerical array where every dimension holds a meaningful value, unlike sparse vectors where most values are zero.">Dense Vector</Tooltip> <Tooltip term="Embedding" explanation="A mathematical representation of text as a point in high-dimensional space, where similar meanings are placed closer together.">Embedding</Tooltip> Matrix
            </h2>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            Chunk text is mapped to an 8-dimensional dense vector capturing semantic document orientation.
          </p>
        </div>

        {/* L2 Norm Badge */}
        <div className="flex items-center space-x-3 px-3.5 py-2 rounded-xl bg-white/[0.06] border border-white/[0.08] font-mono text-xs text-slate-300">
          <Sparkles className="w-4 h-4 text-[#ff3b30]" />
          <span><Tooltip term="L2 Normalization" explanation="Scaling each vector so its total length equals 1.0. This ensures cosine similarity only measures the angle (direction) between vectors, not their magnitude.">L2 Unit Vector</Tooltip> (||V|| = 1.0)</span>
        </div>
      </div>

      {/* Main Matrix Panel */}
      <div className="apple-glass-card p-6 rounded-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-[#ff3b30]" />
            <h3 className="text-xs font-semibold text-white">8-Dimensional Vector Matrix</h3>
          </div>
          <div className="flex items-center space-x-4 text-[11px] text-slate-400 font-mono">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-[#ff3b30] inline-block" />
              High (+1.0)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-white/5 inline-block border border-white/10" />
              Neutral / Low (-1.0)
            </span>
          </div>
        </div>

        {/* Matrix Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-white/[0.06] text-slate-400">
                <th className="pb-3 px-3 font-semibold">Chunk</th>
                <th className="pb-3 px-3 font-semibold max-w-[200px]">Snippet</th>
                {[0, 1, 2, 3, 4, 5, 6, 7].map((dim) => (
                  <th key={dim} className="pb-3 px-2 text-center text-[11px]">
                    dim_{dim}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {chunks.map((chunk, idx) => {
                const vec = embeddings[idx] || [];
                return (
                  <tr key={chunk.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-3">
                      <span className="px-2 py-1 rounded bg-white/10 text-white font-bold border border-white/10 text-[11px]">
                        Chunk #{chunk.index}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-300 truncate max-w-[200px]">
                      "{chunk.text}"
                    </td>
                    {vec.map((val, dIdx) => (
                      <td key={dIdx} className="py-3 px-1 text-center">
                        <div
                          className={`py-1.5 px-2 rounded-lg text-[10px] transition-transform hover:scale-105 ${getCellColor(
                            val
                          )}`}
                        >
                          {val > 0 ? `+${val.toFixed(2)}` : val.toFixed(2)}
                        </div>
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Informational Explanation Card */}
        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-start space-x-3 text-xs text-slate-300">
          <HelpCircle className="w-4 h-4 text-[#ff3b30] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-white">How embeddings work</p>
            <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
              Production RAG systems use models like OpenAI text-embedding-3-small to compress text into 1536 dimensions. This visualizer compresses text into 8 dimensions locally for fast, interactive rendering.
            </p>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={onNextStep}
          className="w-full py-3 px-4 rounded-xl bg-[#ff3b30] hover:bg-[#ff453a] text-white font-semibold text-xs shadow-md flex items-center justify-center space-x-2 transition-all"
        >
          <span>Continue to Step 03: Vector Search & Cosine Similarity</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
