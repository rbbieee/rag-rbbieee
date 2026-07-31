# rag-rbbieee

An interactive RAG (Retrieval-Augmented Generation) visualizer built with React, Vite, Tailwind CSS, and HTML5 Canvas.

## Features

- **Step 1: Document Chunking**: Split documents with custom chunk size and overlap sliders.
- **Step 2: Vector Embedding**: View the 8D dense vector matrix for each text chunk.
- **Step 3: Vector Search**: Search query vectors with cosine similarity and 2D canvas visualization.
- **Step 4: Prompt Assembly**: Inspect the assembled prompt payload (System + Context + Query).
- **Step 5: LLM Generation**: Watch simulated streaming output with verified source citations.

## Privacy and Security

- **100% Client-Side**: Runs completely inside your browser.
- **No API Keys Needed**: Uses local deterministic vector logic for fast visualization.
- **Safe Codebase**: No `eval()`, `exec()`, or dynamic server code.

## Quickstart

```bash
# Clone the repository
git clone https://github.com/rbbieee/rag-rbbieee.git
cd rag-rbbieee

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open `http://localhost:5173` in your browser.

## License

MIT License
