import { useCallback, useRef, type PointerEvent as ReactPointerEvent } from "react";

interface DragOptions {
  onStart?: () => void;
  onMove: (delta: { x: number; y: number }, event: PointerEvent) => void;
  onEnd?: (event: PointerEvent) => void;
}

export function usePointerDrag({ onStart, onMove, onEnd }: DragOptions) {
  const lastPoint = useRef({ x: 0, y: 0 });
  const frame = useRef<number | null>(null);
  const queuedDelta = useRef({ x: 0, y: 0 });
  const queuedEvent = useRef<PointerEvent | null>(null);

  const flushMove = useCallback(() => {
    frame.current = null;
    const event = queuedEvent.current;
    if (!event) return;
    const delta = queuedDelta.current;
    queuedDelta.current = { x: 0, y: 0 };
    queuedEvent.current = null;
    onMove(delta, event);
  }, [onMove]);

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
        queuedDelta.current = {
          x: queuedDelta.current.x + delta.x,
          y: queuedDelta.current.y + delta.y,
        };
        queuedEvent.current = moveEvent;
        if (frame.current === null) {
          frame.current = requestAnimationFrame(flushMove);
        }
      };

      const handleUp = (upEvent: PointerEvent) => {
        window.removeEventListener("pointermove", handleMove);
        window.removeEventListener("pointerup", handleUp);
        if (frame.current !== null) {
          cancelAnimationFrame(frame.current);
          flushMove();
        }
        onEnd?.(upEvent);
      };

      window.addEventListener("pointermove", handleMove);
      window.addEventListener("pointerup", handleUp);
    },
    [flushMove, onEnd, onStart],
  );
}
