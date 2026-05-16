import { memo, useEffect, useRef } from "react";

function CursorGlowComponent() {
  const glowRef = useRef<HTMLDivElement | null>(null);
  const pointRef = useRef({ x: -100, y: -100 });
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const render = () => {
      frameRef.current = null;
      const glow = glowRef.current;
      if (!glow) return;
      glow.style.left = `${pointRef.current.x}px`;
      glow.style.top = `${pointRef.current.y}px`;
    };

    const handleMove = (event: PointerEvent) => {
      pointRef.current = { x: event.clientX, y: event.clientY };
      if (frameRef.current === null) {
        frameRef.current = requestAnimationFrame(render);
      }
    };

    window.addEventListener("pointermove", handleMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", handleMove);
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return <div ref={glowRef} className="cursor-glow" />;
}

export const CursorGlow = memo(CursorGlowComponent);
