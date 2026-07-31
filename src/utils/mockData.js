export const PRESET_DOCUMENTS = [
  {
    id: "ai-rag",
    title: "Understanding RAG & Vector Databases",
    category: "AI & Tech",
    content: `Retrieval-Augmented Generation (RAG) is an AI framework that improves Large Language Model (LLM) responses by grounding them on external authoritative knowledge bases. Standard LLMs suffer from knowledge cutoff dates and hallucinations. 

RAG solves this by retrieving relevant text chunks from a vector database using cosine similarity search. When a user asks a question, the system converts both the query and document chunks into dense vector embeddings. The top-K most similar chunks are retrieved and appended to the context window of the LLM prompt.

As a result, the LLM generates accurate, up-to-date responses complete with source citations, without requiring expensive full model retraining.`
  },
  {
    id: "quantum-computing",
    title: "Quantum Superposition & Entanglement",
    category: "Physics",
    content: `Quantum computing utilizes quantum mechanics principles like superposition and entanglement to solve complex computational problems faster than classical computers. Unlike classical bits that represent either 0 or 1, qubits exist in a linear combination of states.

Entanglement links qubits such that the state of one instantly influences another regardless of distance. Quantum algorithms like Shor's algorithm for factoring and Grover's search leverage these quantum phenomena for exponential speedup in cryptographic and optimization calculations.`
  },
  {
    id: "financial-report",
    title: "Quarterly Financial & Revenue Summary",
    category: "Finance",
    content: `In Q3 2026, CloudTech Enterprise recorded a total revenue of $42.5 million, representing a 28% year-over-year growth. The high margin SaaS enterprise subscription tier accounted for 68% of overall revenue ($28.9 million).

Operating expenses increased by 14% to $18.2 million due to expanded R&D investments in client-side AI agent infrastructure and edge vector database indexing. Net income reached $11.4 million with strong cash reserves.`
  }
];

export const PRESET_QUERIES = [
  "How does RAG solve LLM hallucinations and knowledge cutoff?",
  "What is quantum entanglement and how does it work?",
  "What was the total revenue and SaaS percentage in Q3 2026?",
  "Explain vector embeddings and cosine similarity simply."
];
