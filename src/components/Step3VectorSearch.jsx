import React from 'react';
import VectorCanvas2D from './VectorCanvas2D';
import { PRESET_QUERIES } from '../utils/mockData';
import { Target, Search, Sliders, ArrowRight, Calculator, Trophy } from 'lucide-react';
import Tooltip from './Tooltip';

export default function Step3VectorSearch({
  query,
  setQuery,
  topK,
  setTopK,
  chunks,
  chunkCoords,
  queryCoord,
  searchResults,
  selectedChunkIndex,
  setSelectedChunkIndex,
  onNextStep
}) {
  const topKIndices = searchResults.slice(0, topK).map((r) => r.chunkIdx);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="apple-glass p-6 rounded-3xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-red-500/10 text-[#ff3b30] border border-red-500/20">
              Step 03
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Vector Search & <Tooltip term="Cosine Similarity" explanation="A metric that measures the angle between two vectors. A score of 1.0 means identical direction (perfect match), 0 means unrelated.">Cosine Similarity</Tooltip>
            </h2>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            Calculate cosine similarity between the query vector and document chunk vectors to retrieve the <Tooltip term="Top-K" explanation="The K highest-scoring chunks selected as relevant context. A higher K includes more context but may add noise.">Top-K</Tooltip> relevant context.
          </p>
        </div>

        {/* Preset Query Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Queries:</span>
          {PRESET_QUERIES.map((pq, idx) => (
            <button
              key={idx}
              onClick={() => setQuery(pq)}
              className="px-3 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 text-xs font-medium border border-white/[0.08] transition-all truncate max-w-[200px]"
            >
              {pq}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Query Bar & Vector Canvas */}
        <div className="lg:col-span-6 space-y-5">
          {/* Apple Search Bar Card */}
          <div className="apple-glass-card p-5 rounded-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <label className="text-xs font-semibold text-slate-200 flex items-center gap-2">
                <Search className="w-4 h-4 text-[#ff3b30]" />
                User Query
              </label>
              <span className="text-[11px] font-mono text-slate-500">
                Live Embedding
              </span>
            </div>

            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type query to search in vector space..."
                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-4 pr-10 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-[#ff3b30] font-medium transition-colors"
              />
              <Search className="w-4 h-4 text-slate-500 absolute right-3.5 top-3.5" />
            </div>

            {/* Top-K Segmented Pill */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-slate-400 font-medium"><Tooltip term="Top-K" explanation="The number of most similar chunks retrieved from the vector database to use as grounding context for the LLM.">Top-K Retrieved Context</Tooltip>:</span>
              <div className="flex items-center space-x-1.5 apple-segmented p-1">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    onClick={() => setTopK(num)}
                    className={`w-7 h-7 rounded-lg text-xs font-semibold font-mono transition-all ${
                      topK === num
                        ? 'bg-[#ff3b30] text-white shadow-sm font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Vector Canvas 2D */}
          <VectorCanvas2D
            chunks={chunks}
            chunkCoords={chunkCoords}
            queryCoord={queryCoord}
            topKIndices={topKIndices}
            selectedChunkIndex={selectedChunkIndex}
            setSelectedChunkIndex={setSelectedChunkIndex}
          />
        </div>

        {/* Right Column: Search Results Ranking */}
        <div className="lg:col-span-6 space-y-4">
          <div className="apple-glass-card p-5 rounded-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <div className="flex items-center space-x-2">
                <Trophy className="w-4 h-4 text-[#ff3b30]" />
                <h3 className="text-xs font-semibold text-white">Top-{topK} Similarity Ranking</h3>
              </div>
              <span className="text-[11px] font-mono text-slate-500">
                Sorted by Cosine Score
              </span>
            </div>

            {/* Formula Card */}
            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] font-mono text-[11px] text-slate-300 space-y-1">
              <span className="text-[#ff3b30] font-semibold text-[10px] uppercase tracking-wider block">Cosine Formula:</span>
              <p className="text-white font-semibold">sim(Q, C) = (Q · C) / (||Q|| × ||C||)</p>
            </div>

            {/* Results Cards List */}
            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {searchResults.slice(0, topK).map((res, rank) => {
                const isSelected = selectedChunkIndex === res.chunkIdx;
                const simPercent = (res.similarity * 100).toFixed(1);

                return (
                  <div
                    key={res.chunk.id}
                    onClick={() => setSelectedChunkIndex(res.chunkIdx)}
                    className={`p-4 rounded-xl transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-white/[0.08] border-[#ff3b30] shadow-md'
                        : 'bg-white/[0.03] border-white/[0.06] hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2.5 py-0.5 rounded-md font-mono text-[10px] font-bold ${
                          rank === 0 ? 'bg-[#ff3b30] text-white' : 'bg-white/10 text-slate-300'
                        }`}>
                          Rank #{rank + 1}
                        </span>
                        <span className="text-xs font-semibold text-slate-200">
                          Chunk #{res.chunk.index}
                        </span>
                      </div>

                      <span className="font-mono text-xs font-extrabold text-[#ff3b30]">
                        {simPercent}%
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-black/40 rounded-full h-1.5 mb-2 overflow-hidden border border-white/[0.06]">
                      <div
                        className="bg-[#ff3b30] h-1.5 rounded-full"
                        style={{ width: `${Math.max(0, simPercent)}%` }}
                      />
                    </div>

                    <p className="text-xs text-slate-300 font-mono leading-relaxed line-clamp-2 bg-black/40 p-2.5 rounded-lg border border-white/[0.04]">
                      "{res.chunk.text}"
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Action Next Step */}
            <button
              onClick={onNextStep}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-[#ff3b30] hover:bg-[#ff453a] text-white font-semibold text-xs shadow-md flex items-center justify-center space-x-2 transition-all"
            >
              <span>Continue to Step 04: Prompt Assembly</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
