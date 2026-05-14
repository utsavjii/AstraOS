import { useMemo, useState } from "react";
import { GlassButton } from "../../components/ui/GlassButton";
import { TextInput } from "../../components/ui/TextInput";
import { useOS } from "../../state/OSProvider";
import type { AppComponentProps } from "../../types/os";

export default function NotesApp({ windowId }: AppComponentProps) {
  const { state, addNote, updateNote, deleteNote } = useOS();
  const windowState = state.windows.find((item) => item.id === windowId);
  const initialNoteId = windowState?.props?.noteId as string | undefined;
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState(initialNoteId ?? state.notes[0]?.id);
  const notes = useMemo(
    () =>
      [...state.notes]
        .sort((a, b) => Number(b.pinned) - Number(a.pinned) || b.updatedAt.localeCompare(a.updatedAt))
        .filter((note) => `${note.title} ${note.body}`.toLowerCase().includes(query.toLowerCase())),
    [query, state.notes],
  );
  const active = state.notes.find((note) => note.id === activeId) ?? notes[0];

  const create = () => {
    const note = {
      id: `note-${Date.now()}`,
      title: "New note",
      body: "",
      pinned: false,
      updatedAt: new Date().toISOString(),
    };
    addNote(note);
    setActiveId(note.id);
  };

  return (
    <div className="grid h-full grid-cols-[260px_1fr] gap-3 p-3 max-md:grid-cols-1">
      <aside className="min-h-0 rounded-[26px] border border-white/10 bg-white/[0.06] p-3">
        <div className="flex gap-2">
          <TextInput value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search notes" className="min-w-0 flex-1" />
          <GlassButton icon="Plus" onClick={create} />
        </div>
        <div className="mt-3 max-h-[calc(100%-56px)] space-y-2 overflow-auto">
          {notes.map((note) => (
            <button
              type="button"
              key={note.id}
              onClick={() => setActiveId(note.id)}
              className={`w-full rounded-[20px] border p-3 text-left transition ${note.id === active?.id ? "border-[rgba(var(--accent),.4)] bg-[rgba(var(--accent),.14)]" : "border-white/8 bg-black/10 hover:bg-white/9"}`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-sm font-semibold text-white">{note.title}</span>
                {note.pinned ? <span className="text-xs text-[rgb(var(--accent))]">Pinned</span> : null}
              </div>
              <p className="mt-2 line-clamp-2 text-xs leading-5 text-white/46">{note.body || "Empty note"}</p>
            </button>
          ))}
        </div>
      </aside>
      <main className="min-h-0 rounded-[26px] border border-white/10 bg-black/14 p-4">
        {active ? (
          <div className="flex h-full flex-col">
            <div className="mb-3 flex gap-2">
              <TextInput value={active.title} onChange={(event) => updateNote(active.id, { title: event.target.value })} className="flex-1 text-base font-semibold" />
              <GlassButton icon="Sparkles" onClick={() => updateNote(active.id, { pinned: !active.pinned })}>
                {active.pinned ? "Unpin" : "Pin"}
              </GlassButton>
              <GlassButton icon="Trash2" variant="danger" onClick={() => deleteNote(active.id)} />
            </div>
            <textarea
              value={active.body}
              onChange={(event) => updateNote(active.id, { body: event.target.value })}
              className="min-h-0 flex-1 resize-none rounded-[24px] border border-white/10 bg-white/[0.055] p-4 text-sm leading-7 text-white outline-none placeholder:text-white/35 focus:border-[rgba(var(--accent),.45)]"
              placeholder="Write something..."
            />
          </div>
        ) : (
          <div className="grid h-full place-items-center text-sm text-white/46">No notes yet.</div>
        )}
      </main>
    </div>
  );
}
