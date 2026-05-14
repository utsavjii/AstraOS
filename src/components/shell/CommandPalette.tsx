import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { createCommandActions } from "../../lib/commands";
import { useOS } from "../../state/OSProvider";
import { TextInput } from "../ui/TextInput";
import { SystemIcon } from "../ui/SystemIcon";

interface CommandPaletteProps {
  onClose: () => void;
}

export function CommandPalette({ onClose }: CommandPaletteProps) {
  const os = useOS();
  const [query, setQuery] = useState("");
  const actions = useMemo(() => createCommandActions(os), [os]);
  const noteActions = os.state.notes.map((note) => ({
    id: `note-${note.id}`,
    label: note.title,
    hint: "Note",
    icon: "NotebookPen",
    run: () => os.openApp("notes", "Notes", { noteId: note.id }),
  }));
  const fileActions = os.state.fileSystem.map((file) => ({
    id: `file-${file.id}`,
    label: file.name,
    hint: "File system",
    icon: file.type === "folder" ? "Folder" : "File",
    run: () => os.openApp("files"),
  }));
  const results = [...actions, ...noteActions, ...fileActions]
    .filter((action) => `${action.label} ${action.hint}`.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 10);

  return (
    <motion.div
      className="fixed left-1/2 top-20 z-[9000] w-[min(720px,calc(100vw-24px))] -translate-x-1/2 overflow-hidden rounded-[34px] border border-white/16 bg-[#07111f]/76 p-3 shadow-glass backdrop-blur-3xl"
      initial={{ opacity: 0, y: -18, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12, scale: 0.98 }}
    >
      <div className="flex items-center gap-3 rounded-[24px] border border-white/10 bg-black/20 p-2">
        <SystemIcon name="Sparkles" className="ml-2 text-[rgb(var(--accent))]" />
        <TextInput
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Open apps, search files, run system actions"
          className="h-11 flex-1 border-0 bg-transparent px-1 focus:ring-0"
          autoFocus
        />
      </div>
      <div className="mt-2 max-h-[52vh] overflow-auto p-1">
        {results.map((action) => (
          <button
            type="button"
            key={action.id}
            onClick={() => {
              action.run();
              onClose();
            }}
            className="flex w-full items-center gap-3 rounded-[22px] px-3 py-3 text-left transition hover:bg-white/12"
          >
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-white/10 text-white">
              <SystemIcon name={action.icon} size={18} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium text-white">{action.label}</span>
              <span className="text-xs text-white/46">{action.hint}</span>
            </span>
            <kbd className="rounded-lg bg-white/10 px-2 py-1 text-[10px] text-white/48">Enter</kbd>
          </button>
        ))}
      </div>
    </motion.div>
  );
}
