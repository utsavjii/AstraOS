import { useMemo, useState, type DragEvent } from "react";
import { GlassButton } from "../../components/ui/GlassButton";
import { Panel } from "../../components/ui/Panel";
import { SystemIcon } from "../../components/ui/SystemIcon";
import { TextInput } from "../../components/ui/TextInput";
import { useOS } from "../../state/OSProvider";
import type { AppComponentProps, FileSystemNode } from "../../types/os";

export default function FileManagerApp(_: AppComponentProps) {
  const { state, setFileSystem, notify } = useOS();
  const [activeFolderId, setActiveFolderId] = useState(state.fileSystem[0]?.id ?? "");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const folder = state.fileSystem.find((node) => node.id === activeFolderId) ?? state.fileSystem[0];
  const items = useMemo(
    () => (folder.children ?? []).filter((item) => item.name.toLowerCase().includes(query.toLowerCase())),
    [folder.children, query],
  );
  const selected = items.find((item) => item.id === selectedId) ?? items[0];

  const addFile = () => {
    const file: FileSystemNode = {
      id: `file-${Date.now()}`,
      name: "Untitled.txt",
      type: "file",
      mime: "text/plain",
      content: "New local file.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setFileSystem(
      state.fileSystem.map((node) =>
        node.id === activeFolderId ? { ...node, children: [...(node.children ?? []), file] } : node,
      ),
    );
  };

  const renameSelected = () => {
    if (!selected) return;
    const name = window.prompt("Rename item", selected.name);
    if (!name?.trim()) return;
    setFileSystem(
      state.fileSystem.map((node) =>
        node.id === activeFolderId
          ? {
              ...node,
              children: (node.children ?? []).map((child) =>
                child.id === selected.id ? { ...child, name: name.trim(), updatedAt: new Date().toISOString() } : child,
              ),
            }
          : node,
      ),
    );
  };

  const deleteSelected = () => {
    if (!selected) return;
    setFileSystem(
      state.fileSystem.map((node) =>
        node.id === activeFolderId
          ? { ...node, children: (node.children ?? []).filter((child) => child.id !== selected.id) }
          : node,
      ),
    );
    setSelectedId(null);
  };

  const handleDrop = (event: DragEvent) => {
    event.preventDefault();
    const uploaded = Array.from(event.dataTransfer.files).slice(0, 4);
    if (!uploaded.length) return;
    const newFiles = uploaded.map<FileSystemNode>((file) => ({
      id: `drop-${file.name}-${Date.now()}`,
      name: file.name,
      type: "file",
      mime: file.type || "application/octet-stream",
      content: `${file.name} imported through drag-and-drop.`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
    setFileSystem(
      state.fileSystem.map((node) =>
        node.id === activeFolderId ? { ...node, children: [...(node.children ?? []), ...newFiles] } : node,
      ),
    );
    notify("Files", `${uploaded.length} item${uploaded.length > 1 ? "s" : ""} imported.`, "files");
  };

  return (
    <div className="grid h-full grid-cols-[190px_1fr_260px] gap-3 p-3 max-lg:grid-cols-[160px_1fr] max-md:grid-cols-1">
      <Panel subtle className="overflow-auto p-2">
        {state.fileSystem.map((node) => (
          <button
            type="button"
            key={node.id}
            onClick={() => {
              setActiveFolderId(node.id);
              setSelectedId(null);
            }}
            className={`flex w-full items-center gap-2 rounded-2xl px-3 py-2 text-sm transition ${node.id === activeFolderId ? "bg-white/14 text-white" : "text-white/58 hover:bg-white/8"}`}
          >
            <SystemIcon name="Folder" size={16} /> {node.name}
          </button>
        ))}
      </Panel>
      <Panel className="min-h-0 p-3" onDrop={handleDrop} onDragOver={(event) => event.preventDefault()}>
        <div className="flex items-center gap-2">
          <TextInput value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search this folder" className="flex-1" />
          <GlassButton icon="Plus" onClick={addFile}>File</GlassButton>
        </div>
        <div className="mt-4 grid grid-cols-[repeat(auto-fill,minmax(130px,1fr))] gap-3 overflow-auto">
          {items.map((item) => (
            <button
              type="button"
              key={item.id}
              onClick={() => setSelectedId(item.id)}
              className={`rounded-[24px] border p-4 text-left transition hover:-translate-y-1 ${selected?.id === item.id ? "border-[rgba(var(--accent),.45)] bg-[rgba(var(--accent),.14)]" : "border-white/10 bg-white/[0.06]"}`}
            >
              <div className="mb-4 grid h-16 place-items-center rounded-[20px] bg-black/18">
                <SystemIcon name={item.type === "folder" ? "Folder" : "File"} size={26} />
              </div>
              <p className="truncate text-sm font-medium text-white">{item.name}</p>
              <p className="mt-1 text-xs text-white/42">{item.mime ?? item.type}</p>
            </button>
          ))}
        </div>
      </Panel>
      <Panel subtle className="min-h-0 overflow-auto max-md:hidden">
        {selected ? (
          <>
            <div className="mb-4 h-32 rounded-[24px] bg-cover bg-center" style={{ backgroundImage: selected.preview ? `url(${selected.preview})` : "linear-gradient(135deg, rgba(var(--accent),.26), rgba(255,255,255,.05))" }} />
            <h3 className="font-semibold text-white">{selected.name}</h3>
            <p className="mt-2 text-xs text-white/42">{selected.mime ?? selected.type}</p>
            <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-white/58">{selected.content ?? "No text preview available."}</p>
            <div className="mt-5 flex gap-2">
              <GlassButton icon="File" onClick={renameSelected}>Rename</GlassButton>
              <GlassButton icon="Trash2" variant="danger" onClick={deleteSelected}>Delete</GlassButton>
            </div>
          </>
        ) : (
          <p className="text-sm text-white/48">Select a file to preview it.</p>
        )}
      </Panel>
    </div>
  );
}
