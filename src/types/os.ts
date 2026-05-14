import type { ComponentType } from "react";

export type AppId =
  | "browser"
  | "assistant"
  | "files"
  | "terminal"
  | "calculator"
  | "notes"
  | "music"
  | "weather"
  | "clock"
  | "calendar"
  | "settings"
  | "store"
  | "gallery"
  | "video"
  | "games";

export type ThemeMode = "dark" | "light" | "system";
export type AnimatedTheme = "aurora" | "eclipse" | "daybreak" | "orbital";
export type SnapState = "none" | "left" | "right" | "top" | "bottom" | "maximized";
export type FileNodeType = "folder" | "file";

export interface Size {
  width: number;
  height: number;
}

export interface Point {
  x: number;
  y: number;
}

export interface AppComponentProps {
  windowId: string;
}

export interface AppDefinition {
  id: AppId;
  name: string;
  icon: string;
  category: "system" | "productivity" | "media" | "utility" | "play";
  color: string;
  defaultSize: Size;
  minSize: Size;
  launcher: boolean;
  dock: boolean;
  loader: () => Promise<{ default: ComponentType<AppComponentProps> }>;
}

export interface WindowState {
  id: string;
  appId: AppId;
  title: string;
  workspaceId: number;
  position: Point;
  size: Size;
  restoreBounds?: {
    position: Point;
    size: Size;
  };
  zIndex: number;
  minimized: boolean;
  maximized: boolean;
  snap: SnapState;
  props?: Record<string, unknown>;
}

export interface OSSettings {
  theme: ThemeMode;
  accent: string;
  wallpaperId: string;
  customWallpapers: Wallpaper[];
  animatedTheme: AnimatedTheme;
  startupSound: boolean;
  cursorEffects: boolean;
  reducedMotion: boolean;
  multiMonitor: boolean;
  widgets: {
    weather: boolean;
    system: boolean;
    clock: boolean;
    assistant: boolean;
  };
}

export interface Wallpaper {
  id: string;
  name: string;
  src: string;
  tone: "dark" | "light";
}

export interface FileSystemNode {
  id: string;
  name: string;
  type: FileNodeType;
  mime?: string;
  content?: string;
  preview?: string;
  children?: FileSystemNode[];
  createdAt: string;
  updatedAt: string;
}

export interface NoteItem {
  id: string;
  title: string;
  body: string;
  pinned: boolean;
  updatedAt: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  accent: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  appId?: AppId;
  createdAt: string;
  read: boolean;
}

export interface CommandAction {
  id: string;
  label: string;
  hint: string;
  icon: string;
  run: () => void;
}

export interface TerminalLine {
  id: string;
  prompt?: string;
  text: string;
  kind: "input" | "output" | "error" | "system";
}

export interface OSState {
  booted: boolean;
  locked: boolean;
  currentWorkspace: number;
  workspaces: string[];
  windows: WindowState[];
  settings: OSSettings;
  fileSystem: FileSystemNode[];
  notes: NoteItem[];
  events: CalendarEvent[];
  notifications: NotificationItem[];
}

export type OSAction =
  | { type: "BOOT_COMPLETE" }
  | { type: "LOCK" }
  | { type: "UNLOCK" }
  | { type: "OPEN_APP"; appId: AppId; title?: string; props?: Record<string, unknown> }
  | { type: "CLOSE_WINDOW"; id: string }
  | { type: "FOCUS_WINDOW"; id: string }
  | { type: "MINIMIZE_WINDOW"; id: string }
  | { type: "RESTORE_WINDOW"; id: string }
  | { type: "UPDATE_WINDOW"; id: string; patch: Partial<WindowState> }
  | { type: "SET_WORKSPACE"; workspaceId: number }
  | { type: "SET_SETTINGS"; patch: Partial<OSSettings> }
  | { type: "SET_FILE_SYSTEM"; fileSystem: FileSystemNode[] }
  | { type: "ADD_NOTE"; note: NoteItem }
  | { type: "UPDATE_NOTE"; id: string; patch: Partial<NoteItem> }
  | { type: "DELETE_NOTE"; id: string }
  | { type: "ADD_EVENT"; event: CalendarEvent }
  | { type: "DELETE_EVENT"; id: string }
  | { type: "ADD_NOTIFICATION"; notification: NotificationItem }
  | { type: "DISMISS_NOTIFICATION"; id: string }
  | { type: "MARK_NOTIFICATIONS_READ" }
  | { type: "HYDRATE"; state: Partial<OSState> };
