import React, { useState } from 'react';
import { X, Code2, Copy, Check } from 'lucide-react';

export default function CodeSnippetModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('js');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const jsCode = `// 1. Text Chunking
function chunkText(text, chunkSize = 180, overlap = 30) {
  const chunks = [];
  let startIndex = 0;
  while (startIndex < text.length) {
    let endIndex = startIndex + chunkSize;
    const chunkContent = text.slice(startIndex, endIndex);
    chunks.push(chunkContent);
    startIndex = endIndex - overlap;
  }
  return chunks;
}

// 2. Cosine Similarity Calculation
function cosineSimilarity(vecA, vecB) {
  let dotProduct = 0, normA = 0, normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// 3. Vector Search & Top-K Retrieval
function searchTopK(queryEmbedding, chunkEmbeddings, topK = 3) {
  return chunkEmbeddings
    .map((emb, idx) => ({
      index: idx,
      similarity: cosineSimilarity(queryEmbedding, emb)
    }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, topK);
}`;

  const pythonCode = `# Python RAG Logic Implementation (LangChain / LlamaIndex Equivalent)
import numpy as np

def cosine_similarity(vec_a, vec_b):
    dot_product = np.dot(vec_a, vec_b)
    norm_a = np.linalg.norm(vec_a)
    norm_b = np.linalg.norm(vec_b)
    return dot_product / (norm_a * norm_b)

def vector_search(query_vec, doc_vectors, top_k=3):
    scores = [cosine_similarity(query_vec, doc_vec) for doc_vec in doc_vectors]
    top_indices = np.argsort(scores)[::-1][:top_k]
    return [(idx, scores[idx]) for idx in top_indices]

# Prompt Augmentation
def build_rag_prompt(system_prompt, context_chunks, user_query):
    context_str = "\\n".join([f"[Chunk {i}]: {c}" for i, c in enumerate(context_chunks)])
    return f"{system_prompt}\\n\\nContext:\\n{context_str}\\n\\nQuestion: {user_query}"`;

  const codeToDisplay = activeTab === 'js' ? jsCode : pythonCode;

  const handleCopy = () => {
    navigator.clipboard.writeText(codeToDisplay);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl apple-glass p-6 rounded-3xl space-y-4 shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
          <div className="flex items-center space-x-2">
            <Code2 className="w-5 h-5 text-[#ff3b30]" />
            <h3 className="text-sm font-semibold text-white">RAG Engine Code Reference</h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 text-slate-300 hover:text-white hover:bg-white/20 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab & Copy Action */}
        <div className="flex items-center justify-between">
          <div className="flex space-x-2 apple-segmented p-1">
            <button
              onClick={() => setActiveTab('js')}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
                activeTab === 'js'
                  ? 'bg-[#ff3b30] text-white shadow-sm font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              JavaScript / React
            </button>
            <button
              onClick={() => setActiveTab('python')}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
                activeTab === 'python'
                  ? 'bg-[#ff3b30] text-white shadow-sm font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Python / NumPy
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-mono transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[#ff3b30]" />}
            <span>{copied ? 'Copied!' : 'Copy Code'}</span>
          </button>
        </div>

        {/* Code Content */}
        <div className="p-4.5 rounded-2xl bg-black/60 border border-white/10 font-mono text-xs text-slate-200 overflow-x-auto leading-relaxed shadow-inner">
          <pre>{codeToDisplay}</pre>
        </div>
      </div>
    </div>
  );
}
