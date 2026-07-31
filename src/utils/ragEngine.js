/**
 * RAG Engine Core (100% Client-Side Safe Engine)
 * No API Keys required, uses deterministic TF-IDF/Hash Dense Embedding Synthesis.
 */

// Simple tokenizer
export function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/gi, '')
    .split(/\s+/)
    .filter(t => t.length > 0);
}

/**
 * Step 1: Chunk text with customizable size and overlap
 */
export function chunkText(text, chunkSize = 180, overlap = 30) {
  if (!text || text.trim().length === 0) return [];

  const chunks = [];
  let startIndex = 0;
  let chunkId = 1;

  while (startIndex < text.length) {
    let endIndex = startIndex + chunkSize;
    
    // Adjust to nearest space if possible to avoid breaking words mid-sentence
    if (endIndex < text.length) {
      const spaceIndex = text.lastIndexOf(' ', endIndex);
      if (spaceIndex > startIndex + Math.floor(chunkSize * 0.5)) {
        endIndex = spaceIndex;
      }
    }

    const chunkContent = text.slice(startIndex, endIndex).trim();
    if (chunkContent.length > 0) {
      const tokens = tokenize(chunkContent);
      chunks.push({
        id: `chunk-${chunkId}`,
        index: chunkId,
        text: chunkContent,
        charCount: chunkContent.length,
        tokenCount: tokens.length,
        startChar: startIndex,
        endChar: endIndex,
      });
      chunkId++;
    }

    startIndex = endIndex - overlap;
    if (startIndex >= text.length || chunkSize <= overlap) break;
  }

  return chunks;
}

/**
 * Step 2: Deterministic Hash-based 8-Dimensional Dense Embedding
 */
export function generateEmbedding(text, dimensions = 8) {
  const tokens = tokenize(text);
  const vector = new Array(dimensions).fill(0);

  if (tokens.length === 0) return vector;

  // Hash each token into the vector dimensions
  tokens.forEach((token) => {
    let hash = 0;
    for (let i = 0; i < token.length; i++) {
      hash = (hash << 5) - hash + token.charCodeAt(i);
      hash |= 0; // Convert to 32bit int
    }

    for (let d = 0; d < dimensions; d++) {
      const weight = Math.sin(hash * (d + 1) * 0.13) + Math.cos(hash * 0.17);
      vector[d] += weight;
    }
  });

  // L2 Normalization to unit vector
  let norm = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
  if (norm === 0) norm = 1;

  return vector.map(val => parseFloat((val / norm).toFixed(4)));
}

/**
 * Step 3: Cosine Similarity Calculation between two vectors
 */
export function calculateCosineSimilarity(vecA, vecB) {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0;

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  normA = Math.sqrt(normA);
  normB = Math.sqrt(normB);

  if (normA === 0 || normB === 0) return 0;
  const similarity = dotProduct / (normA * normB);
  return parseFloat(Math.max(-1, Math.min(1, similarity)).toFixed(4));
}

/**
 * Projects 8-D vector to 2-D coordinates for Vector Space Canvas Visualization
 */
export function projectTo2D(vector, index, total) {
  if (!vector || vector.length < 2) return { x: 0, y: 0 };
  
  // Linear combination project using fixed orthogonal axes
  let x = vector[0] * 0.7 + vector[2] * 0.4 - vector[4] * 0.3 + vector[6] * 0.5;
  let y = vector[1] * 0.7 - vector[3] * 0.5 + vector[5] * 0.4 - vector[7] * 0.3;

  // Add subtle deterministic layout dispersion
  const angle = (index / Math.max(1, total)) * Math.PI * 2;
  x += Math.cos(angle) * 0.15;
  y += Math.sin(angle) * 0.15;

  return {
    x: parseFloat(Math.max(-1, Math.min(1, x)).toFixed(3)),
    y: parseFloat(Math.max(-1, Math.min(1, y)).toFixed(3))
  };
}

/**
 * Step 4: Build Augmented Prompt
 */
export function buildAugmentedPrompt(systemPrompt, retrievedChunks, userQuery) {
  const contextText = retrievedChunks
    .map((chunk, i) => `[Source Chunk ${chunk.index} | Similarity: ${(chunk.similarity * 100).toFixed(1)}%]:\n"${chunk.text}"`)
    .join('\n\n');

  return {
    system: systemPrompt || "You are an intelligent RAG Assistant. Answer the user question accurately using ONLY the provided context chunks below.",
    context: contextText,
    query: userQuery
  };
}

/**
 * Step 5: Simulated LLM Stream Generator
 */
export function generateSimulatedLLMResponse(retrievedChunks, query) {
  if (!retrievedChunks || retrievedChunks.length === 0) {
    return "I couldn't find any relevant information in the uploaded document to answer your query.";
  }

  const topChunk = retrievedChunks[0];
  const queryLower = query.toLowerCase();

  if (queryLower.includes('rag') || queryLower.includes('hallucinat') || queryLower.includes('cutoff')) {
    return `Based on [Chunk ${topChunk.index}], RAG (Retrieval-Augmented Generation) solves LLM knowledge cutoffs and hallucinations by dynamically retrieving relevant context from a vector database using cosine similarity search. Instead of relying solely on pre-trained weights, the model receives authoritative source text directly in its prompt context.`;
  }

  if (queryLower.includes('quantum') || queryLower.includes('entanglement')) {
    return `According to [Chunk ${topChunk.index}], quantum entanglement connects qubits such that the state of one qubit instantaneously determines the state of another, irrespective of physical distance. Combined with superposition, this enables algorithms like Shor's and Grover's to achieve exponential computational speedup.`;
  }

  if (queryLower.includes('revenue') || queryLower.includes('financial') || queryLower.includes('q3')) {
    return `Per the Q3 2026 financial records in [Chunk ${topChunk.index}], total revenue reached $42.5 million (up 28% YoY), with enterprise SaaS subscriptions contributing $28.9 million (68% of overall revenue). Net income stood strong at $11.4 million.`;
  }

  // General synthesis fallback based on top context chunks
  return `Based on the retrieved context (primarily [Chunk ${topChunk.index}] with a similarity score of ${(topChunk.similarity * 100).toFixed(1)}%): ${topChunk.text.slice(0, 160)}... This directly addresses your question regarding "${query}".`;
}
