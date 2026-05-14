import { motion } from "framer-motion";
import type { SnapState } from "../../types/os";

export function SnapOverlay({ target }: { target: SnapState }) {
  if (target === "none") return null;
  const style =
    target === "left"
      ? "left-4 top-16 h-[calc(100vh-144px)] w-[calc(50vw-24px)]"
      : target === "right"
        ? "right-4 top-16 h-[calc(100vh-144px)] w-[calc(50vw-24px)]"
        : target === "bottom"
          ? "left-4 bottom-24 h-[calc(50vh-72px)] w-[calc(100vw-32px)]"
          : "left-4 top-16 h-[calc(100vh-144px)] w-[calc(100vw-32px)]";

  return (
    <motion.div
      className={`pointer-events-none fixed z-[5000] rounded-[32px] border border-[rgba(var(--accent),.62)] bg-[rgba(var(--accent),.12)] shadow-glow backdrop-blur-sm ${style}`}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
    />
  );
}
