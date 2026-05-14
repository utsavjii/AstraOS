import { initialFileSystem } from "../data/files";
import { initialEvents, initialNotes, initialNotifications } from "../data/mockContent";
import { wallpapers } from "../data/wallpapers";
import type { OSSettings, OSState } from "../types/os";

export const STORAGE_KEY = "astraos.v1";

export const defaultSettings: OSSettings = {
  theme: "dark",
  accent: "#7df3ff",
  wallpaperId: "aurora",
  customWallpapers: [],
  animatedTheme: "aurora",
  startupSound: true,
  cursorEffects: true,
  reducedMotion: false,
  multiMonitor: false,
  widgets: {
    weather: true,
    system: true,
    clock: true,
    assistant: true,
  },
};

export function createDefaultState(): OSState {
  return {
    booted: false,
    locked: true,
    currentWorkspace: 0,
    workspaces: ["Prime", "Build", "Media", "Focus"],
    windows: [],
    settings: defaultSettings,
    fileSystem: initialFileSystem,
    notes: initialNotes,
    events: initialEvents,
    notifications: initialNotifications,
  };
}

export function loadState(): Partial<OSState> | null {
  if (typeof localStorage === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<OSState>;
    return {
      ...parsed,
      booted: false,
      locked: true,
      settings: {
        ...defaultSettings,
        ...(parsed.settings ?? {}),
        customWallpapers: parsed.settings?.customWallpapers ?? [],
        widgets: { ...defaultSettings.widgets, ...(parsed.settings?.widgets ?? {}) },
      },
    };
  } catch {
    return null;
  }
}

export function saveState(state: OSState) {
  if (typeof localStorage === "undefined") return;
  const serializable: OSState = {
    ...state,
    booted: false,
    locked: true,
    windows: state.windows.map((windowState) => ({ ...windowState, minimized: true })),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(serializable));
}

export function getActiveWallpaper(settings: OSSettings) {
  return [...wallpapers, ...settings.customWallpapers].find((wallpaper) => wallpaper.id === settings.wallpaperId) ?? wallpapers[0];
}
