import React, { useState, useEffect } from 'react';
import { Cpu, CheckCircle2, RotateCcw, BookOpen, AlertTriangle, Sparkles } from 'lucide-react';
import { generateSimulatedLLMResponse } from '../utils/ragEngine';

export default function Step5LLMGeneration({
  retrievedChunks,
  query,
  onReset
}) {
  const fullResponse = generateSimulatedLLMResponse(retrievedChunks, query);
  const [displayedResponse, setDisplayedResponse] = useState('');
  const [isStreaming, setIsStreaming] = useState(true);
  const [highlightedChunkId, setHighlightedChunkId] = useState(null);

  // Typewriter streaming effect
  useEffect(() => {
    setDisplayedResponse('');
    setIsStreaming(true);

    let idx = 0;
    const interval = setInterval(() => {
      if (idx < fullResponse.length) {
        setDisplayedResponse((prev) => prev + fullResponse.charAt(idx));
        idx++;
      } else {
        setIsStreaming(false);
        clearInterval(interval);
      }
    }, 16);

    return () => clearInterval(interval);
  }, [fullResponse]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="apple-glass p-6 rounded-3xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Step 05
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Grounded LLM Response & Citations
            </h2>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            The LLM model generates a grounded response using retrieved source documents complete with interactive citation chips.
          </p>
        </div>

        {/* Reset Action */}
        <button
          onClick={onReset}
          className="flex items-center space-x-2 px-4 py-2 rounded-full bg-white/[0.08] hover:bg-white/[0.15] text-slate-200 hover:text-white border border-white/[0.1] transition-all text-xs font-medium shrink-0"
        >
          <RotateCcw className="w-4 h-4 text-[#ff3b30]" />
          <span>New Simulation</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Live Stream Output Box */}
        <div className="lg:col-span-7 space-y-4">
          <div className="apple-glass-card p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-[#ff3b30]" />
                <h3 className="text-xs font-semibold text-white">Live LLM Generation Stream</h3>
              </div>
              <span className="flex items-center space-x-2 text-[11px] font-mono">
                <span className={`w-2 h-2 rounded-full ${isStreaming ? 'bg-[#ff3b30] animate-ping' : 'bg-emerald-400'}`} />
                <span className={isStreaming ? 'text-[#ff3b30] font-bold' : 'text-emerald-400 font-bold'}>
                  {isStreaming ? 'STREAMING...' : 'COMPLETED'}
                </span>
              </span>
            </div>

            {/* Generated Stream Console */}
            <div className="p-5 rounded-xl bg-black/50 border border-white/10 font-sans text-xs text-slate-100 leading-relaxed min-h-[160px] relative">
              <p className="whitespace-pre-wrap font-medium">
                {displayedResponse}
                {isStreaming && <span className="inline-block w-2 h-4 bg-[#ff3b30] ml-1 animate-pulse" />}
              </p>
            </div>

            {/* Citation Badges */}
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-2.5">
              <div className="flex items-center space-x-2 text-xs font-semibold text-slate-200">
                <BookOpen className="w-4 h-4 text-[#ff3b30]" />
                <span>Verified Source Attribution</span>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {retrievedChunks.map((chunk) => {
                  const isHighlighted = highlightedChunkId === chunk.id;
                  return (
                    <button
                      key={chunk.id}
                      onClick={() => setHighlightedChunkId(isHighlighted ? null : chunk.id)}
                      className={`px-3.5 py-1.5 rounded-full font-mono text-xs font-semibold transition-all border ${
                        isHighlighted
                          ? 'bg-[#ff3b30] text-white border-transparent shadow-sm'
                          : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
                      }`}
                    >
                      [Source Chunk #{chunk.index} - {(chunk.similarity * 100).toFixed(1)}%]
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Source Inspection & Comparison */}
        <div className="lg:col-span-5 space-y-4">
          {highlightedChunkId ? (
            <div className="apple-glass-card p-5 rounded-2xl space-y-3 border-l-4 border-l-[#ff3b30]">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
                <span>Source Document Inspection</span>
                <span className="font-mono text-[10px] text-[#ff3b30] font-bold">Verified Match</span>
              </div>
              {retrievedChunks
                .filter((c) => c.id === highlightedChunkId)
                .map((chunk) => (
                  <div key={chunk.id} className="space-y-2">
                    <p className="text-xs font-mono text-slate-200 bg-black/40 p-3.5 rounded-xl border border-white/10 leading-relaxed">
                      "{chunk.text}"
                    </p>
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                      <span>Position: Chars {chunk.startChar}-{chunk.endChar}</span>
                      <span className="text-[#ff3b30] font-bold">Similarity: {(chunk.similarity * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="apple-glass-card p-5 rounded-2xl space-y-4">
              <h3 className="text-xs font-semibold text-white border-b border-white/[0.06] pb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Why RAG is superior to standard LLMs
              </h3>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-1">
                  <div className="flex items-center space-x-2 text-rose-400 font-semibold">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Standard LLM (Without RAG)</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Prone to hallucinations, lacks private organization data, and is limited to pre-training cutoff dates.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-white/[0.06] border border-white/[0.1] space-y-1">
                  <div className="flex items-center space-x-2 text-slate-200 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#ff3b30]" />
                    <span>RAG Grounded Model (rag-rbbieee)</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Responses are always grounded in verified document facts with transparent, auditable citations.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
