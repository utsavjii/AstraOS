import type { FileSystemNode } from "../types/os";

const now = new Date().toISOString();

export const initialFileSystem: FileSystemNode[] = [
  {
    id: "desktop",
    name: "Desktop",
    type: "folder",
    createdAt: now,
    updatedAt: now,
    children: [
      {
        id: "readme",
        name: "Welcome to AstraOS.txt",
        type: "file",
        mime: "text/plain",
        content:
          "AstraOS is a local web OS simulation. Try Ctrl+K, drag windows to screen edges, switch workspaces, and personalize the shell.",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "brief",
        name: "Launch Brief.md",
        type: "file",
        mime: "text/markdown",
        content:
          "# AstraOS Launch Brief\n\n- Glass UI shell\n- Local app simulations\n- Persistent personalization\n- PWA offline shell",
        createdAt: now,
        updatedAt: now,
      },
    ],
  },
  {
    id: "documents",
    name: "Documents",
    type: "folder",
    createdAt: now,
    updatedAt: now,
    children: [
      {
        id: "systems",
        name: "System Notes.txt",
        type: "file",
        mime: "text/plain",
        content: "Window layouts, widgets, wallpapers, and notes are saved in localStorage.",
        createdAt: now,
        updatedAt: now,
      },
    ],
  },
  {
    id: "media",
    name: "Media Lab",
    type: "folder",
    createdAt: now,
    updatedAt: now,
    children: [
      {
        id: "aurora-shot",
        name: "Aurora Mesh.preview",
        type: "file",
        mime: "image/svg+xml",
        preview: "/wallpapers/aurora.svg",
        content: "A generated wallpaper asset.",
        createdAt: now,
        updatedAt: now,
      },
    ],
  },
];
