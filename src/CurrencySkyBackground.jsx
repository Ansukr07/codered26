import { useEffect, useRef } from "react";

const TIERS = [
  { min: 160, color: "#dadada" },
  { min: 100, color: "#dadada" },
  { min: 50, color: "#dadada" },
  { min: 15, color: "#dadada" },
];

const PARAGRAPH = "CODERED '26  /  THE  NEXT  WAVE  OF  BUILDERS  /  IDEAS  DON'T  BUILD  THEMSELVES  /  LESS  WHAT  IF,  MORE  WHAT'S  NEXT  /  A  COLLISION  OF  CODE,  CREATIVITY,  AND  CAFFEINE  /  THINK  BOLD  /  BREAK  THE  ORDINARY  /  ";
const GLITCH_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";

function waves(x, y, time) {
  return Math.sin(0.8 * x + 0.3 * time) * Math.cos(0.6 * y + 0.2 * time) * 0.5
    + 0.25 * Math.sin(1.6 * x + 1.2 * y + 0.15 * time)
    + Math.sin(0.3 * x - 0.4 * time) * Math.cos(0.4 * y + 0.25 * time) * 0.6
    + 0.3 * Math.sin(0.5 * (x + y) + 0.35 * time)
    + Math.sin(2.5 * x + 0.1 * time) * Math.cos(2.8 * y - 0.12 * time) * 0.15;
}

function brightness(x, y, time, spacing) {
  const field = waves(x, y, time) + 0.4 * waves(x * 2.2, y * 2.2, time * 0.7)
    + 0.15 * waves(x * 4.5, y * 4.5, time * 0.4);
  const value = Math.max(0, Math.min(1, (field + 1.8) / 3.6));
  const band = value % spacing / spacing;
  const contour = band < 0.12 || band > 0.88;
  let light = Math.round(contour ? 200 * value + 55 : 140 * value);
  if (contour) {
    const dx = waves(x + 0.01, y, time) - waves(x - 0.01, y, time);
    const dy = waves(x, y + 0.01, time) - waves(x, y - 0.01, time);
    const slope = 12 * Math.hypot(dx, dy);
    if (slope > 0.5) light = Math.min(255, light + Math.round(40 * slope));
  }
  return light;
}

export default function CurrencySkyBackground({
  children, className = "", style, speed = 0.15, opacity = 1,
  cellWidth = 12, cellHeight = 14, fontSize = 11.5,
  fontFamily = "ui-monospace, monospace", terrainScale = 0.13,
  contourSpacing = 0.08, paused = false,
}) {
  const hostRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;
    const positive = (value, fallback, min) => Number.isFinite(value) ? Math.max(min, value) : fallback;
    const cw = positive(cellWidth, 12, 4);
    const ch = positive(cellHeight, 14, 4);
    const size = positive(fontSize, 12, 1);
    const scale = positive(terrainScale, 0.13, 0.001);
    const spacing = positive(contourSpacing, 0.08, 0.001);
    const rate = positive(speed, 0.9, 0);
    const alpha = Number.isFinite(opacity) ? Math.max(0, Math.min(1, opacity)) : 1;
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
    let width = 0;
    let height = 0;
    let frame = 0;
    let frameNumber = 0;
    let previous = 0;
    let elapsed = 0;
    let visible = false;
    
    // Create buckets for each color tier. 
    // Each bucket is a flat array: [char, x, y, char, x, y, ...]
    const buckets = TIERS.map(() => []);
    
    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.font = `400 ${size}px ${fontFamily}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.globalAlpha = alpha;
      
      buckets.forEach((bucket) => { bucket.length = 0; });
      
      const columns = Math.ceil(width / cw) + 1;
      const rows = Math.ceil(height / ch) + 1;
      
      for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++) {
          const value = brightness((column + 0.5) * scale, (row + 0.5) * scale, elapsed, spacing);
          
          for (let i = 0; i < TIERS.length; i++) {
            if (value >= TIERS[i].min) {
              const charIndex = (row * columns + column) % PARAGRAPH.length;
              let char = PARAGRAPH[charIndex];
              
              if (char !== ' ') {
                 const glitchTime = Math.floor(Date.now() / 250); // Updates every 250ms
                 const pseudoRandom = (row * 13.37 + column * 42.1 + glitchTime * 0.13) % 1;
                 if (pseudoRandom > 0.85) {
                    const charHash = (row * 7.1 + column * 3.3 + glitchTime * 0.27) % 1;
                    char = GLITCH_CHARS[Math.floor(charHash * GLITCH_CHARS.length)];
                 }
              }
              
              buckets[i].push(char, column * cw + cw / 2, row * ch + ch / 2);
              break;
            }
          }
        }
      }
      
      buckets.forEach((bucket, index) => {
        if (bucket.length === 0) return;
        ctx.fillStyle = TIERS[index].color;
        for (let i = 0; i < bucket.length; i += 3) {
           ctx.fillText(bucket[i], bucket[i + 1], bucket[i + 2]);
        }
      });
      
      ctx.globalAlpha = 1;
    };
    
    const tick = (now) => {
      elapsed += Math.min((now - previous) / 1000, 0.1) * rate;
      previous = now;
      if (++frameNumber % 2 === 0) draw();
      frame = requestAnimationFrame(tick);
    };
    
    const update = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      if (reducedMotion.matches) elapsed = 0;
      draw();
      if (!paused && rate > 0 && visible && !document.hidden && !reducedMotion.matches) {
        previous = performance.now();
        frame = requestAnimationFrame(tick);
      }
    };
    
    const resize = () => {
      width = host.clientWidth;
      height = host.clientHeight;
      const dpr = Math.min(devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    };
    
    const observer = new ResizeObserver(resize);
    observer.observe(host);
    resize();
    
    const intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update(); });
    intersection.observe(host);
    
    reducedMotion.addEventListener("change", update);
    document.addEventListener("visibilitychange", update);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      intersection.disconnect();
      reducedMotion.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", update);
    };
  }, [speed, opacity, cellWidth, cellHeight, fontSize, fontFamily, terrainScale, contourSpacing, paused]);

  return (
    <div ref={hostRef} className={className} style={{ position: 'relative', height: '100%', width: '100%', overflow: 'hidden', backgroundColor: "#c8c8c8", ...style }}>
      <canvas ref={canvasRef} aria-hidden="true" style={{ pointerEvents: 'none', position: 'absolute', top: 0, left: 0, height: '100%', width: '100%' }} />
      {children && <div style={{ position: 'relative', zIndex: 10, height: '100%', width: '100%' }}>{children}</div>}
    </div>
  );
}
