import { useEffect, useRef } from 'react';

// starfield canvas behind the UI
export default function Starfield({ maxStars = 220, animate = true }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });

    let raf = 0;
    const stars = [];

    // Size canvas
    const setup = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      stars.length = 0;
      const area = canvas.width * canvas.height;
      const count = Math.min(maxStars, Math.max(80, Math.floor(area / 8000)));

      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: 0.5 + Math.random() * 1.2, // radius
          base: 0.75 + Math.random() * 0.25, // opacity
        });
      }
    };

    const draw = (t = 0) => {
      // Background
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Sstars
      for (const s of stars) {
        const alpha = animate
          ? s.base * (0.85 + 0.15 * Math.sin(t * 0.001))
          : s.base;

        ctx.beginPath();
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }

      if (animate) raf = requestAnimationFrame(draw);
    };

    setup();
    draw(0);

    window.addEventListener('resize', setup);
    return () => {
      window.removeEventListener('resize', setup);
      cancelAnimationFrame(raf);
    };
  }, [maxStars, animate]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}
