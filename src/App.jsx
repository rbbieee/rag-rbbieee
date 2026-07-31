import React, { useState, useMemo } from 'react';
import Navbar from './components/Navbar';
import StepProgress from './components/StepProgress';
import Step1Chunking from './components/Step1Chunking';
import Step2Embedding from './components/Step2Embedding';
import Step3VectorSearch from './components/Step3VectorSearch';
import Step4PromptAssembly from './components/Step4PromptAssembly';
import Step5LLMGeneration from './components/Step5LLMGeneration';
import CodeSnippetModal from './components/CodeSnippetModal';

import { PRESET_DOCUMENTS, PRESET_QUERIES } from './utils/mockData';
import {
  chunkText,
  generateEmbedding,
  calculateCosineSimilarity,
  projectTo2D,
  buildAugmentedPrompt
} from './utils/ragEngine';

export default function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [documentText, setDocumentText] = useState(PRESET_DOCUMENTS[0].content);
  const [chunkSize, setChunkSize] = useState(180);
  const [overlap, setOverlap] = useState(30);

  const [query, setQuery] = useState(PRESET_QUERIES[0]);
  const [topK, setTopK] = useState(3);
  const [systemPrompt, setSystemPrompt] = useState(
    'You are an intelligent RAG Assistant. Answer the user question accurately using ONLY the provided context chunks below.'
  );

  const [selectedChunkIndex, setSelectedChunkIndex] = useState(0);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);

  // 1. Chunking computation
  const chunks = useMemo(() => {
    return chunkText(documentText, chunkSize, overlap);
  }, [documentText, chunkSize, overlap]);

  // 2. Dense Vector Embeddings matrix computation
  const embeddings = useMemo(() => {
    return chunks.map((c) => generateEmbedding(c.text, 8));
  }, [chunks]);

  // 3. 2D Coordinates Projection for Canvas
  const chunkCoords = useMemo(() => {
    return embeddings.map((emb, idx) => projectTo2D(emb, idx, chunks.length));
  }, [embeddings, chunks.length]);

  // 4. Query Embedding & 2D Projection
  const queryEmbedding = useMemo(() => {
    return generateEmbedding(query, 8);
  }, [query]);

  const queryCoord = useMemo(() => {
    return projectTo2D(queryEmbedding, 99, 100);
  }, [queryEmbedding]);

  // 5. Cosine Similarity Calculation & Top-K Ranking
  const searchResults = useMemo(() => {
    return chunks
      .map((c, idx) => ({
        chunkIdx: idx,
        chunk: c,
        similarity: calculateCosineSimilarity(queryEmbedding, embeddings[idx] || []),
      }))
      .sort((a, b) => b.similarity - a.similarity);
  }, [chunks, queryEmbedding, embeddings]);

  // Top-K Retrieved Chunks
  const retrievedChunks = useMemo(() => {
    return searchResults
      .slice(0, Math.min(topK, searchResults.length))
      .map((r) => ({
        ...r.chunk,
        similarity: r.similarity,
      }));
  }, [searchResults, topK]);

  // 6. Augmented Prompt Assembly Payload
  const augmentedPrompt = useMemo(() => {
    return buildAugmentedPrompt(systemPrompt, retrievedChunks, query);
  }, [systemPrompt, retrievedChunks, query]);

  const handleReset = () => {
    setCurrentStep(1);
    setSelectedChunkIndex(0);
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-slate-100 font-sans">
      {/* Navbar Header */}
      <Navbar onOpenCodeModal={() => setIsCodeModalOpen(true)} />

      {/* Interactive 5-Step Progress Stepper */}
      <StepProgress currentStep={currentStep} setStep={setCurrentStep} />

      {/* Main Pipeline Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentStep === 1 && (
          <Step1Chunking
            documentText={documentText}
            setDocumentText={setDocumentText}
            chunkSize={chunkSize}
            setChunkSize={setChunkSize}
            overlap={overlap}
            setOverlap={setOverlap}
            chunks={chunks}
            onNextStep={() => setCurrentStep(2)}
          />
        )}

        {currentStep === 2 && (
          <Step2Embedding
            chunks={chunks}
            embeddings={embeddings}
            onNextStep={() => setCurrentStep(3)}
          />
        )}

        {currentStep === 3 && (
          <Step3VectorSearch
            query={query}
            setQuery={setQuery}
            topK={topK}
            setTopK={setTopK}
            chunks={chunks}
            chunkCoords={chunkCoords}
            queryCoord={queryCoord}
            searchResults={searchResults}
            selectedChunkIndex={selectedChunkIndex}
            setSelectedChunkIndex={setSelectedChunkIndex}
            onNextStep={() => setCurrentStep(4)}
          />
        )}

        {currentStep === 4 && (
          <Step4PromptAssembly
            systemPrompt={systemPrompt}
            setSystemPrompt={setSystemPrompt}
            retrievedChunks={retrievedChunks}
            query={query}
            augmentedPrompt={augmentedPrompt}
            onNextStep={() => setCurrentStep(5)}
          />
        )}

        {currentStep === 5 && (
          <Step5LLMGeneration
            retrievedChunks={retrievedChunks}
            query={query}
            onReset={handleReset}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.08] bg-black/80 py-4 text-center text-xs text-slate-400 font-sans">
        <p>rag-rbbieee RAG Visualizer</p>
      </footer>

      {/* Source Code Reference Modal */}
      <CodeSnippetModal
        isOpen={isCodeModalOpen}
        onClose={() => setIsCodeModalOpen(false)}
      />
    </div>
  );
}
