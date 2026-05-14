import { useEffect } from "react";
import type { AppId } from "../types/os";

interface ShortcutOptions {
  onCommand: () => void;
  onLauncher: () => void;
  onEscape: () => void;
  onWorkspace: (direction: 1 | -1) => void;
  onOpenApp: (id: AppId) => void;
}

const numericApps: AppId[] = ["browser", "files", "terminal", "notes", "settings"];

export function useKeyboardShortcuts(options: ShortcutOptions) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if ((event.ctrlKey || event.metaKey) && key === "k") {
        event.preventDefault();
        options.onCommand();
      }
      if ((event.ctrlKey || event.metaKey) && key === " ") {
        event.preventDefault();
        options.onLauncher();
      }
      if (event.key === "Escape") options.onEscape();
      if (event.ctrlKey && event.altKey && event.key === "ArrowRight") {
        event.preventDefault();
        options.onWorkspace(1);
      }
      if (event.ctrlKey && event.altKey && event.key === "ArrowLeft") {
        event.preventDefault();
        options.onWorkspace(-1);
      }
      if (event.altKey && /^[1-5]$/.test(event.key)) {
        event.preventDefault();
        options.onOpenApp(numericApps[Number(event.key) - 1]);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [options]);
}
