import React, { useEffect, useRef } from 'react';

export default function VectorCanvas2D({
  chunks,
  chunkCoords,
  queryCoord,
  topKIndices,
  selectedChunkIndex,
  setSelectedChunkIndex,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;
      const scale = Math.min(width, height) * 0.38;

      ctx.clearRect(0, 0, width, height);

      // Distance Reference Rings
      [0.35, 0.7, 1.05].forEach((rFactor) => {
        ctx.beginPath();
        ctx.arc(centerX, centerY, scale * rFactor, 0, Math.PI * 2);
        ctx.strokeStyle = '#18181b';
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // Axis Crosshairs
      ctx.strokeStyle = '#27272a';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(centerX, 15);
      ctx.lineTo(centerX, height - 15);
      ctx.moveTo(15, centerY);
      ctx.lineTo(width - 15, centerY);
      ctx.stroke();

      const toScreen = (coord) => ({
        x: centerX + coord.x * scale,
        y: centerY - coord.y * scale,
      });

      const qScreen = queryCoord ? toScreen(queryCoord) : null;

      // Lines to Top-K Chunks
      if (qScreen && chunkCoords.length > 0) {
        topKIndices.forEach((idx) => {
          if (chunkCoords[idx]) {
            const cScreen = toScreen(chunkCoords[idx]);
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(qScreen.x, qScreen.y);
            ctx.lineTo(cScreen.x, cScreen.y);
            ctx.strokeStyle = '#ff3b30';
            ctx.lineWidth = 1.5;
            ctx.setLineDash([3, 3]);
            ctx.stroke();
            ctx.restore();
          }
        });
      }

      // Chunk Nodes
      chunkCoords.forEach((coord, idx) => {
        const screen = toScreen(coord);
        const isTopK = topKIndices.includes(idx);
        const isSelected = selectedChunkIndex === idx;

        if (isTopK || isSelected) {
          ctx.beginPath();
          ctx.arc(screen.x, screen.y, 12, 0, Math.PI * 2);
          ctx.fillStyle = isSelected ? 'rgba(255, 59, 48, 0.2)' : 'rgba(255, 59, 48, 0.1)';
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(screen.x, screen.y, isSelected ? 7 : isTopK ? 5.5 : 4, 0, Math.PI * 2);
        ctx.fillStyle = isSelected ? '#ff3b30' : isTopK ? '#ff453a' : '#3f3f46';
        ctx.strokeStyle = isTopK ? '#ffffff' : '#27272a';
        ctx.lineWidth = 1;
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = isTopK ? '#f4f4f5' : '#71717a';
        ctx.font = isTopK ? '600 11px -apple-system, sans-serif' : '400 10px -apple-system, sans-serif';
        ctx.fillText(`C#${chunks[idx]?.index || idx + 1}`, screen.x + 8, screen.y + 4);
      });

      // Query Node
      if (qScreen) {
        ctx.beginPath();
        ctx.arc(qScreen.x, qScreen.y, 6.5, 0, Math.PI * 2);
        ctx.fillStyle = '#ff3b30';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = '600 11px -apple-system, sans-serif';
        ctx.fillText('Query', qScreen.x + 10, qScreen.y + 4);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [chunks, chunkCoords, queryCoord, topKIndices, selectedChunkIndex]);

  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const scale = Math.min(width, height) * 0.38;

    let clickedIdx = null;

    chunkCoords.forEach((coord, idx) => {
      const nodeX = centerX + coord.x * scale;
      const nodeY = centerY - coord.y * scale;
      const dist = Math.hypot(clickX - nodeX, clickY - nodeY);
      if (dist < 16) {
        clickedIdx = idx;
      }
    });

    if (clickedIdx !== null) {
      setSelectedChunkIndex(clickedIdx);
    }
  };

  return (
    <div className="relative w-full aspect-[4/3] rounded-lg bg-[#0d0d0f] border border-[#1f1f23] overflow-hidden flex flex-col">
      <div className="absolute top-2.5 left-3 text-[11px] font-mono text-zinc-500">
        Vector Space 2D
      </div>

      <canvas
        ref={canvasRef}
        width={480}
        height={340}
        onClick={handleCanvasClick}
        className="w-full h-full cursor-pointer"
      />
    </div>
  );
}
