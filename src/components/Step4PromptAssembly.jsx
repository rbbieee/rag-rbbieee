import React, { useState } from 'react';
import { FileText, Terminal, ArrowRight, Copy, Check, MessageSquare, ShieldAlert } from 'lucide-react';

export default function Step4PromptAssembly({
  systemPrompt,
  setSystemPrompt,
  retrievedChunks,
  query,
  augmentedPrompt,
  onNextStep
}) {
  const [copied, setCopied] = useState(false);

  const fullPromptText = `=== SYSTEM INSTRUCTION ===\n${augmentedPrompt.system}\n\n=== RETRIEVED CONTEXT CHUNKS ===\n${augmentedPrompt.context}\n\n=== USER QUERY ===\n${augmentedPrompt.query}`;

  const estimatedTokens = Math.ceil(fullPromptText.length / 4);

  const handleCopy = () => {
    navigator.clipboard.writeText(fullPromptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="apple-glass p-6 rounded-3xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-red-500/10 text-[#ff3b30] border border-red-500/20">
              Step 04
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Context Injection & Prompt Assembly
            </h2>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            Retrieved context chunks are dynamically injected into the LLM prompt template as verified grounding data.
          </p>
        </div>

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className="flex items-center space-x-2 px-4 py-2 rounded-full bg-white/[0.08] hover:bg-white/[0.15] text-slate-200 hover:text-white border border-white/[0.1] transition-all text-xs font-medium shrink-0"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-[#ff3b30]" />}
          <span>{copied ? 'Copied to Clipboard!' : 'Copy Assembled Prompt'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Modular Prompt Blocks */}
        <div className="lg:col-span-6 space-y-4">
          {/* Block 1: System Instruction */}
          <div className="apple-glass-card p-5 rounded-2xl space-y-2 border-l-4 border-l-[#ff3b30]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-[#ff3b30]" />
                1. System Instruction Persona
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Editable</span>
            </div>
            <textarea
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              rows={3}
              className="w-full bg-black/40 border border-white/10 rounded-xl p-3.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-[#ff3b30] transition-colors"
            />
          </div>

          {/* Block 2: Context Chunks */}
          <div className="apple-glass-card p-5 rounded-2xl space-y-3 border-l-4 border-l-[#ff453a]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-[#ff453a]" />
                2. Injected Grounding Context ({retrievedChunks.length} Chunks)
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Retrieved Facts</span>
            </div>

            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {retrievedChunks.map((chunk) => (
                <div key={chunk.id} className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="font-semibold text-slate-200">
                      [Source Chunk #{chunk.index}]
                    </span>
                    <span className="text-[#ff3b30] text-[10px] font-bold">
                      {(chunk.similarity * 100).toFixed(1)}% Match
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 font-mono leading-relaxed">
                    "{chunk.text}"
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Block 3: User Query */}
          <div className="apple-glass-card p-5 rounded-2xl space-y-2 border-l-4 border-l-red-500">
            <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-red-400" />
              3. User Query
            </span>
            <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 font-mono text-xs text-white">
              "{query}"
            </div>
          </div>
        </div>

        {/* Right Column: Full Raw Payload */}
        <div className="lg:col-span-6 space-y-4">
          <div className="apple-glass-card p-5 rounded-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <div className="flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-[#ff3b30]" />
                <h3 className="text-xs font-semibold text-white">Assembled API Payload</h3>
              </div>
              <span className="text-[11px] font-mono text-slate-500">
                ~{estimatedTokens} Tokens Total
              </span>
            </div>

            {/* Raw Code View */}
            <div className="p-4 rounded-xl bg-black/60 border border-white/10 font-mono text-[11px] text-slate-300 max-h-[380px] overflow-y-auto whitespace-pre-wrap leading-relaxed">
              <span className="text-slate-500 font-bold">// --- SYSTEM INSTRUCTION ---</span>{"\n"}
              {augmentedPrompt.system}{"\n\n"}
              <span className="text-[#ff3b30] font-bold">// --- RETRIEVED GROUNDING CONTEXT ---</span>{"\n"}
              {augmentedPrompt.context}{"\n\n"}
              <span className="text-slate-300 font-bold">// --- USER QUERY ---</span>{"\n"}
              {augmentedPrompt.query}
            </div>

            {/* Next Step Action Button */}
            <button
              onClick={onNextStep}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-[#ff3b30] hover:bg-[#ff453a] text-white font-semibold text-xs shadow-md flex items-center justify-center space-x-2 transition-all"
            >
              <span>Continue to Step 05: Execute LLM Stream & Citations</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
