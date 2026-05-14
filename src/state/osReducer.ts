import { getApp } from "../data/apps";
import { createDefaultState, defaultSettings } from "../lib/storage";
import type { AppId, OSAction, OSSettings, OSState, WindowState } from "../types/os";

let windowSeed = 0;

function nextZIndex(state: OSState) {
  return Math.max(10, ...state.windows.map((windowState) => windowState.zIndex)) + 1;
}

function createWindow(state: OSState, appId: AppId, title?: string, props?: Record<string, unknown>): WindowState {
  const app = getApp(appId);
  if (!app) throw new Error(`Unknown app: ${appId}`);
  const viewportWidth = typeof window === "undefined" ? 1440 : window.innerWidth;
  const viewportHeight = typeof window === "undefined" ? 900 : window.innerHeight;
  const offset = (state.windows.length % 6) * 28;
  const width = Math.min(app.defaultSize.width, Math.max(app.minSize.width, viewportWidth - 96));
  const height = Math.min(app.defaultSize.height, Math.max(app.minSize.height, viewportHeight - 168));
  const x = Math.max(18, Math.round((viewportWidth - width) / 2 + offset - 70));
  const y = Math.max(78, Math.round((viewportHeight - height) / 2 + offset - 36));

  windowSeed += 1;
  return {
    id: `${appId}-${Date.now()}-${windowSeed}`,
    appId,
    title: title ?? app.name,
    workspaceId: state.currentWorkspace,
    position: { x, y },
    size: { width, height },
    zIndex: nextZIndex(state),
    minimized: false,
    maximized: false,
    snap: "none",
    props,
  };
}

function mergeSettings(settings: OSSettings, patch: Partial<OSSettings>): OSSettings {
  return {
    ...settings,
    ...patch,
    widgets: patch.widgets ? { ...settings.widgets, ...patch.widgets } : settings.widgets,
    customWallpapers: patch.customWallpapers ?? settings.customWallpapers,
  };
}

export function osReducer(state: OSState, action: OSAction): OSState {
  switch (action.type) {
    case "BOOT_COMPLETE":
      return { ...state, booted: true };
    case "LOCK":
      return { ...state, locked: true };
    case "UNLOCK":
      return { ...state, locked: false };
    case "OPEN_APP":
      return {
        ...state,
        windows: [...state.windows, createWindow(state, action.appId, action.title, action.props)],
      };
    case "CLOSE_WINDOW":
      return { ...state, windows: state.windows.filter((windowState) => windowState.id !== action.id) };
    case "FOCUS_WINDOW":
      return {
        ...state,
        windows: state.windows.map((windowState) =>
          windowState.id === action.id
            ? { ...windowState, zIndex: nextZIndex(state), minimized: false }
            : windowState,
        ),
      };
    case "MINIMIZE_WINDOW":
      return {
        ...state,
        windows: state.windows.map((windowState) =>
          windowState.id === action.id ? { ...windowState, minimized: true } : windowState,
        ),
      };
    case "RESTORE_WINDOW":
      return {
        ...state,
        windows: state.windows.map((windowState) =>
          windowState.id === action.id
            ? { ...windowState, minimized: false, zIndex: nextZIndex(state), workspaceId: state.currentWorkspace }
            : windowState,
        ),
      };
    case "UPDATE_WINDOW":
      return {
        ...state,
        windows: state.windows.map((windowState) =>
          windowState.id === action.id ? { ...windowState, ...action.patch } : windowState,
        ),
      };
    case "SET_WORKSPACE":
      return {
        ...state,
        currentWorkspace: Math.max(0, Math.min(state.workspaces.length - 1, action.workspaceId)),
      };
    case "SET_SETTINGS":
      return { ...state, settings: mergeSettings(state.settings, action.patch) };
    case "SET_FILE_SYSTEM":
      return { ...state, fileSystem: action.fileSystem };
    case "ADD_NOTE":
      return { ...state, notes: [action.note, ...state.notes] };
    case "UPDATE_NOTE":
      return {
        ...state,
        notes: state.notes.map((note) => (note.id === action.id ? { ...note, ...action.patch } : note)),
      };
    case "DELETE_NOTE":
      return { ...state, notes: state.notes.filter((note) => note.id !== action.id) };
    case "ADD_EVENT":
      return { ...state, events: [...state.events, action.event] };
    case "DELETE_EVENT":
      return { ...state, events: state.events.filter((event) => event.id !== action.id) };
    case "ADD_NOTIFICATION":
      return { ...state, notifications: [action.notification, ...state.notifications].slice(0, 24) };
    case "DISMISS_NOTIFICATION":
      return { ...state, notifications: state.notifications.filter((notification) => notification.id !== action.id) };
    case "MARK_NOTIFICATIONS_READ":
      return {
        ...state,
        notifications: state.notifications.map((notification) => ({ ...notification, read: true })),
      };
    case "HYDRATE": {
      const defaults = createDefaultState();
      return {
        ...defaults,
        ...action.state,
        booted: false,
        locked: true,
        settings: mergeSettings(defaultSettings, action.state.settings ?? {}),
        workspaces: action.state.workspaces ?? defaults.workspaces,
        fileSystem: action.state.fileSystem ?? defaults.fileSystem,
        notes: action.state.notes ?? defaults.notes,
        events: action.state.events ?? defaults.events,
        notifications: action.state.notifications ?? defaults.notifications,
        windows: action.state.windows ?? defaults.windows,
      };
    }
    default:
      return state;
  }
}
