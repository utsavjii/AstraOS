import { motion } from "framer-motion";
import type { Point } from "../../types/os";
import { SystemIcon } from "../ui/SystemIcon";

interface ContextMenuProps {
  point: Point;
  onClose: () => void;
  onSettings: () => void;
  onNote: () => void;
  onWallpaper: () => void;
}

export function ContextMenu({ point, onClose, onSettings, onNote, onWallpaper }: ContextMenuProps) {
  const items = [
    { label: "Refresh desktop", icon: "RefreshCcw", action: onClose },
    { label: "New note", icon: "NotebookPen", action: onNote },
    { label: "Change wallpaper", icon: "Images", action: onWallpaper },
    { label: "Settings", icon: "Settings", action: onSettings },
  ];

  return (
    <motion.div
      className="fixed z-[9000] w-56 overflow-hidden rounded-3xl border border-white/14 bg-[#08111f]/82 p-2 shadow-glass backdrop-blur-3xl"
      style={{ left: point.x, top: point.y }}
      onPointerDown={(event) => event.stopPropagation()}
      initial={{ opacity: 0, scale: 0.94, y: -6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
    >
      {items.map((item) => (
        <button
          type="button"
          key={item.label}
          onClick={item.action}
          className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm text-white/78 transition hover:bg-white/12 hover:text-white"
        >
          <SystemIcon name={item.icon} size={16} />
          {item.label}
        </button>
      ))}
    </motion.div>
  );
}
