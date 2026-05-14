import { useCallback, useRef, type PointerEvent as ReactPointerEvent } from "react";

interface DragOptions {
  onStart?: () => void;
  onMove: (delta: { x: number; y: number }, event: PointerEvent) => void;
  onEnd?: (event: PointerEvent) => void;
}

export function usePointerDrag({ onStart, onMove, onEnd }: DragOptions) {
  const lastPoint = useRef({ x: 0, y: 0 });

  return useCallback(
    (event: ReactPointerEvent) => {
      if (event.button !== 0) return;
      event.preventDefault();
      event.currentTarget.setPointerCapture(event.pointerId);
      lastPoint.current = { x: event.clientX, y: event.clientY };
      onStart?.();

      const handleMove = (moveEvent: PointerEvent) => {
        const delta = {
          x: moveEvent.clientX - lastPoint.current.x,
          y: moveEvent.clientY - lastPoint.current.y,
        };
        lastPoint.current = { x: moveEvent.clientX, y: moveEvent.clientY };
        onMove(delta, moveEvent);
      };

      const handleUp = (upEvent: PointerEvent) => {
        window.removeEventListener("pointermove", handleMove);
        window.removeEventListener("pointerup", handleUp);
        onEnd?.(upEvent);
      };

      window.addEventListener("pointermove", handleMove);
      window.addEventListener("pointerup", handleUp);
    },
    [onEnd, onMove, onStart],
  );
}
