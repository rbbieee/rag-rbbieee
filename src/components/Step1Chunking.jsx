import React, { useState } from 'react';
import { PRESET_DOCUMENTS } from '../utils/mockData';
import { Sliders, FileText, ArrowRight, Layers, Copy, Check, GitCommit } from 'lucide-react';
import Tooltip from './Tooltip';

export default function Step1Chunking({
  documentText,
  setDocumentText,
  chunkSize,
  setChunkSize,
  overlap,
  setOverlap,
  strategy = 'fixed',
  setStrategy,
  chunks,
  onNextStep
}) {
  const [copiedChunkId, setCopiedChunkId] = useState(null);

  const handleSelectPreset = (preset) => {
    setDocumentText(preset.content);
  };

  const handleCopyChunk = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedChunkId(id);
    setTimeout(() => setCopiedChunkId(null), 1500);
  };

  const totalChars = documentText.length;
  const totalTokens = chunks.reduce((acc, c) => acc + c.tokenCount, 0);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="apple-glass p-6 rounded-3xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-red-500/10 text-[#ff3b30] border border-red-500/20">
                Step 01
              </span>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Document <Tooltip term="Chunking" explanation="Splitting a long document into smaller segments so each piece fits within an embedding model's input window.">Chunking</Tooltip> & <Tooltip term="Tokenization" explanation="Breaking text into individual words or sub-words that the model processes as discrete units.">Tokenization</Tooltip>
              </h2>
            </div>
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
              Split text documents into precise chunks for vector embedding without exceeding <Tooltip term="Context Limits" explanation="The maximum number of tokens an LLM can read in a single prompt, typically 4K to 128K tokens.">context limits</Tooltip>.
            </p>
          </div>

          {/* Apple Style Preset Selector Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Presets:</span>
            {PRESET_DOCUMENTS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className="px-3.5 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 text-xs font-medium border border-white/[0.08] transition-all"
              >
                {preset.title}
              </button>
            ))}
          </div>
        </div>

        {/* Apple Style Stat Metric Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-white/[0.06]">
          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
            <span className="text-[11px] text-slate-400 font-medium">Total Chunks</span>
            <p className="text-lg font-bold font-mono text-white mt-0.5">{chunks.length}</p>
          </div>
          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
            <span className="text-[11px] text-slate-400 font-medium">Character Count</span>
            <p className="text-lg font-bold font-mono text-white mt-0.5">{totalChars}</p>
          </div>
          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
            <span className="text-[11px] text-slate-400 font-medium">Estimated Tokens</span>
            <p className="text-lg font-bold font-mono text-[#ff3b30] mt-0.5">~{totalTokens}</p>
          </div>
          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
            <span className="text-[11px] text-slate-400 font-medium">Active Strategy</span>
            <p className="text-xs font-bold font-mono text-slate-200 mt-1 capitalize">{strategy} Chunking</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Input Textarea & Sliders */}
        <div className="lg:col-span-6 space-y-5">
          {/* Input Document Card */}
          <div className="apple-glass-card p-5 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-200 flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#ff3b30]" />
                Input Document Text
              </label>
              <span className="text-[11px] font-mono text-slate-500">
                UTF-8 Encoded
              </span>
            </div>

            <textarea
              value={documentText}
              onChange={(e) => setDocumentText(e.target.value)}
              placeholder="Paste or write your document text here..."
              rows={8}
              className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-[#ff3b30] font-mono transition-colors resize-y leading-relaxed"
            />
          </div>

          {/* Strategy & Sliders Control Card */}
          <div className="apple-glass-card p-5 rounded-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <div className="flex items-center space-x-2 text-xs font-semibold text-white">
                <Sliders className="w-4 h-4 text-[#ff3b30]" />
                <Tooltip term="Hyperparameters" explanation="Adjustable settings like chunk size, overlap, and strategy that control how the text is split before embedding."><span>Hyperparameter Tuning</span></Tooltip>
              </div>
            </div>

            {/* Chunking Strategy Selector */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium">Chunking Strategy:</span>
                <span className="text-[11px] font-mono text-slate-400 capitalize">{strategy} mode</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setStrategy('fixed')}
                  className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all text-center ${
                    strategy === 'fixed'
                      ? 'bg-[#ff3b30] text-white border-[#ff3b30] shadow-sm font-semibold'
                      : 'bg-white/[0.04] text-slate-300 border-white/[0.08] hover:bg-white/[0.08]'
                  }`}
                >
                  Fixed-Size
                </button>
                <button
                  onClick={() => setStrategy('sentence')}
                  className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all text-center ${
                    strategy === 'sentence'
                      ? 'bg-[#ff3b30] text-white border-[#ff3b30] shadow-sm font-semibold'
                      : 'bg-white/[0.04] text-slate-300 border-white/[0.08] hover:bg-white/[0.08]'
                  }`}
                >
                  Sentence
                </button>
                <button
                  onClick={() => setStrategy('paragraph')}
                  className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all text-center ${
                    strategy === 'paragraph'
                      ? 'bg-[#ff3b30] text-white border-[#ff3b30] shadow-sm font-semibold'
                      : 'bg-white/[0.04] text-slate-300 border-white/[0.08] hover:bg-white/[0.08]'
                  }`}
                >
                  Paragraph
                </button>
              </div>
              <p className="text-[11px] text-slate-400 pt-1 leading-relaxed">
                {strategy === 'fixed' && 'Splits text into fixed character windows with custom overlap.'}
                {strategy === 'sentence' && 'Splits at sentence boundaries (.!?) to avoid cutting sentences in half.'}
                {strategy === 'paragraph' && 'Splits text per paragraph block (blank line breaks).'}
              </p>
            </div>

            {/* Chunk Size Slider (active for fixed & sentence) */}
            {strategy !== 'paragraph' && (
              <div className="space-y-2 pt-2 border-t border-white/[0.04]">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">Chunk Size (Target Length)</span>
                  <span className="font-mono text-[#ff3b30] font-bold bg-white/5 px-2 py-0.5 rounded-md border border-white/10">
                    {chunkSize} chars
                  </span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="500"
                  step="10"
                  value={chunkSize}
                  onChange={(e) => setChunkSize(Number(e.target.value))}
                  className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#ff3b30]"
                />
              </div>
            )}

            {/* Chunk Overlap Slider (active for fixed mode) */}
            {strategy === 'fixed' && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">
                    <Tooltip term="Chunk Overlap" explanation="The number of characters shared between consecutive chunks. Overlap preserves context at chunk boundaries so important sentences are not cut in half.">Chunk Overlap</Tooltip>
                  </span>
                  <span className="font-mono text-amber-400 font-bold bg-white/5 px-2 py-0.5 rounded-md border border-white/10">
                    {overlap} chars
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={Math.min(150, Math.floor(chunkSize * 0.5))}
                  step="5"
                  value={overlap}
                  onChange={(e) => setOverlap(Number(e.target.value))}
                  className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Visual Chunk Cards */}
        <div className="lg:col-span-6 space-y-4">
          <div className="apple-glass-card p-5 rounded-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <div className="flex items-center space-x-2">
                <Layers className="w-4 h-4 text-[#ff3b30]" />
                <h3 className="text-xs font-semibold text-white">Generated Chunks ({strategy})</h3>
              </div>
              <span className="text-[11px] font-mono text-slate-500">
                {chunks.length} Items
              </span>
            </div>

            {/* Chunks List Container */}
            <div className="space-y-3 max-h-[440px] overflow-y-auto pr-1">
              {chunks.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs">
                  Please enter document text to preview chunk outputs.
                </div>
              ) : (
                chunks.map((chunk) => (
                  <div
                    key={chunk.id}
                    className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-white/20 transition-all space-y-2"
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <div className="flex items-center space-x-2">
                        <span className="px-2.5 py-0.5 rounded-md bg-[#ff3b30] text-white font-mono font-bold text-[10px]">
                          Chunk #{chunk.index}
                        </span>
                        <span className="text-slate-400 font-mono text-[10px]">
                          Chars {chunk.startChar}-{chunk.endChar}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 rounded bg-white/5 text-slate-300 font-mono text-[10px] border border-white/10">
                          ~{chunk.tokenCount} tokens
                        </span>

                        <button
                          onClick={() => handleCopyChunk(chunk.text, chunk.id)}
                          className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                        >
                          {copiedChunkId === chunk.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-slate-200 font-mono leading-relaxed bg-black/40 p-3 rounded-lg border border-white/[0.06]">
                      "{chunk.text}"
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Next Step Action Button */}
            {chunks.length > 0 && (
              <button
                onClick={onNextStep}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-[#ff3b30] hover:bg-[#ff453a] text-white font-semibold text-xs shadow-md flex items-center justify-center space-x-2 transition-all"
              >
                <span>Continue to Step 02: Dense Vector Embedding</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
