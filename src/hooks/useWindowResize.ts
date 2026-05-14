import { useCallback } from "react";
import type { Size } from "../types/os";

export function useWindowResize(
  current: Size,
  min: Size,
  onResize: (size: Size) => void,
) {
  return useCallback(
    (delta: { x: number; y: number }) => {
      onResize({
        width: Math.max(min.width, current.width + delta.x),
        height: Math.max(min.height, current.height + delta.y),
      });
    },
    [current.height, current.width, min.height, min.width, onResize],
  );
}
