import React, { useEffect, useRef, useCallback } from 'react';

export default function VectorCanvas3D({
  chunks,
  chunk3DCoords,
  query3DCoord,
  topKIndices,
  selectedChunkIndex,
  setSelectedChunkIndex,
}) {
  const canvasRef = useRef(null);
  const rotationRef = useRef({ rx: 0.35, ry: 0 });
  const isDraggingRef = useRef(false);
  const prevMouseRef = useRef({ x: 0, y: 0 });
  const animFrameRef = useRef(null);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const scaleFactor = Math.min(width, height) * 0.38;
    const focalLength = 320;

    // Slow auto-rotation only when not dragging
    if (!isDraggingRef.current) {
      rotationRef.current.ry += 0.003;
    }

    const { rx, ry } = rotationRef.current;
    const cosX = Math.cos(rx);
    const sinX = Math.sin(rx);
    const cosY = Math.cos(ry);
    const sinY = Math.sin(ry);

    ctx.clearRect(0, 0, width, height);

    // Project 3D to 2D with perspective
    const project = (coord) => {
      // Rotate around Y axis (yaw)
      let x1 = coord.x * cosY - coord.z * sinY;
      let z1 = coord.x * sinY + coord.z * cosY;
      let y1 = coord.y;

      // Rotate around X axis (pitch)
      let y2 = y1 * cosX - z1 * sinX;
      let z2 = y1 * sinX + z1 * cosX;

      const depth = z2 + 2.8;
      const perspective = focalLength / (focalLength + depth * 100);

      return {
        x: centerX + x1 * scaleFactor * perspective,
        y: centerY - y2 * scaleFactor * perspective,
        z: depth,
        scale: perspective,
      };
    };

    // 1. Draw 3D Grid Floor (Y = -0.7)
    ctx.lineWidth = 0.5;
    const gridCount = 6;
    const gridStep = 0.35;

    for (let i = -gridCount; i <= gridCount; i++) {
      const p1 = project({ x: i * gridStep, y: -0.7, z: -gridCount * gridStep });
      const p2 = project({ x: i * gridStep, y: -0.7, z: gridCount * gridStep });
      ctx.strokeStyle = '#1a1a1e';
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();

      const p3 = project({ x: -gridCount * gridStep, y: -0.7, z: i * gridStep });
      const p4 = project({ x: gridCount * gridStep, y: -0.7, z: i * gridStep });
      ctx.beginPath();
      ctx.moveTo(p3.x, p3.y);
      ctx.lineTo(p4.x, p4.y);
      ctx.stroke();
    }

    // 2. Draw 3D Axis Lines
    const origin = project({ x: 0, y: 0, z: 0 });
    const axisLen = 0.9;

    const axes = [
      { end: { x: axisLen, y: 0, z: 0 }, color: '#ff3b3088', label: 'X' },
      { end: { x: 0, y: axisLen, z: 0 }, color: '#34c75988', label: 'Y' },
      { end: { x: 0, y: 0, z: axisLen }, color: '#007aff88', label: 'Z' },
    ];

    axes.forEach(({ end, color, label }) => {
      const p = project(end);
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(origin.x, origin.y);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();

      ctx.fillStyle = color;
      ctx.font = '500 9px -apple-system, sans-serif';
      ctx.fillText(label, p.x + 4, p.y - 4);
    });

    // 3. Project all nodes
    const projectedChunks = chunk3DCoords.map((coord, idx) => ({
      ...project(coord),
      idx,
      type: 'chunk',
    }));

    const qScreen = query3DCoord
      ? { ...project(query3DCoord), type: 'query' }
      : null;

    // 4. Draw connection lines from Query to Top-K chunks
    if (qScreen) {
      topKIndices.forEach((tIdx) => {
        const cScreen = projectedChunks[tIdx];
        if (!cScreen) return;

        // Gradient line
        const gradient = ctx.createLinearGradient(qScreen.x, qScreen.y, cScreen.x, cScreen.y);
        gradient.addColorStop(0, 'rgba(255, 59, 48, 0.6)');
        gradient.addColorStop(1, 'rgba(255, 59, 48, 0.15)');

        ctx.save();
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.5;
        ctx.setLineDash([5, 4]);
        ctx.beginPath();
        ctx.moveTo(qScreen.x, qScreen.y);
        ctx.lineTo(cScreen.x, cScreen.y);
        ctx.stroke();
        ctx.restore();
      });
    }

    // 5. Sort nodes by depth (painter's algorithm: far objects first)
    const allNodes = [...projectedChunks, ...(qScreen ? [qScreen] : [])];
    allNodes.sort((a, b) => b.z - a.z);

    // 6. Render nodes
    allNodes.forEach((node) => {
      if (node.type === 'query') {
        const r = Math.max(4, 7 * node.scale);

        // Outer glow ring
        ctx.beginPath();
        ctx.arc(node.x, node.y, r * 2.2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 59, 48, 0.12)';
        ctx.fill();

        // Inner glow ring
        ctx.beginPath();
        ctx.arc(node.x, node.y, r * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 59, 48, 0.2)';
        ctx.fill();

        // Core sphere
        ctx.beginPath();
        ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
        ctx.fillStyle = '#ff3b30';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = '600 10px -apple-system, sans-serif';
        ctx.fillText('Query', node.x + r + 5, node.y + 3);
      } else {
        const idx = node.idx;
        const isTopK = topKIndices.includes(idx);
        const isSelected = selectedChunkIndex === idx;
        const baseR = isSelected ? 6.5 : isTopK ? 5 : 3.5;
        const r = Math.max(2.5, baseR * node.scale);

        // Depth-based opacity for distant nodes
        const depthOpacity = Math.max(0.3, Math.min(1, node.scale * 1.5));

        if (isTopK || isSelected) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, r * 2.2, 0, Math.PI * 2);
          ctx.fillStyle = isSelected
            ? `rgba(255, 59, 48, ${0.2 * depthOpacity})`
            : `rgba(255, 59, 48, ${0.1 * depthOpacity})`;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
        ctx.fillStyle = isSelected
          ? '#ff3b30'
          : isTopK
          ? `rgba(255, 69, 58, ${depthOpacity})`
          : `rgba(82, 82, 91, ${depthOpacity})`;
        ctx.strokeStyle = isTopK
          ? `rgba(255, 255, 255, ${depthOpacity * 0.8})`
          : `rgba(39, 39, 42, ${depthOpacity})`;
        ctx.lineWidth = 1;
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = isTopK
          ? `rgba(244, 244, 245, ${depthOpacity})`
          : `rgba(113, 113, 122, ${depthOpacity * 0.7})`;
        ctx.font = isTopK
          ? `600 ${Math.max(8, 10 * node.scale)}px -apple-system, sans-serif`
          : `400 ${Math.max(7, 9 * node.scale)}px -apple-system, sans-serif`;
        ctx.fillText(`C#${chunks[idx]?.index || idx + 1}`, node.x + r + 4, node.y + 3);
      }
    });

    animFrameRef.current = requestAnimationFrame(render);
  }, [chunks, chunk3DCoords, query3DCoord, topKIndices, selectedChunkIndex]);

  useEffect(() => {
    animFrameRef.current = requestAnimationFrame(render);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [render]);

  // Drag-to-orbit handlers
  const handleMouseDown = (e) => {
    isDraggingRef.current = true;
    prevMouseRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - prevMouseRef.current.x;
    const dy = e.clientY - prevMouseRef.current.y;

    rotationRef.current.ry += dx * 0.006;
    rotationRef.current.rx = Math.max(
      -Math.PI / 3,
      Math.min(Math.PI / 3, rotationRef.current.rx + dy * 0.006)
    );

    prevMouseRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  // Touch support for mobile
  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      isDraggingRef.current = true;
      prevMouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const handleTouchMove = (e) => {
    if (!isDraggingRef.current || e.touches.length !== 1) return;
    e.preventDefault();
    const dx = e.touches[0].clientX - prevMouseRef.current.x;
    const dy = e.touches[0].clientY - prevMouseRef.current.y;

    rotationRef.current.ry += dx * 0.006;
    rotationRef.current.rx = Math.max(
      -Math.PI / 3,
      Math.min(Math.PI / 3, rotationRef.current.rx + dy * 0.006)
    );

    prevMouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
  };

  return (
    <div className="relative w-full aspect-[4/3] rounded-xl bg-[#0a0a0c] border border-white/[0.06] overflow-hidden select-none">
      <div className="absolute top-3 left-3.5 z-10 flex items-center space-x-2 text-[11px] font-mono text-zinc-500 pointer-events-none">
        <span className="w-1.5 h-1.5 rounded-full bg-[#ff3b30] animate-pulse" />
        <span>3D Vector Space</span>
      </div>

      <canvas
        ref={canvasRef}
        width={520}
        height={380}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      />
    </div>
  );
}
