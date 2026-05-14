import {
  createContext,
  type Dispatch,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import { loadState, saveState, createDefaultState } from "../lib/storage";
import { osReducer } from "./osReducer";
import type { AppId, CalendarEvent, FileSystemNode, NoteItem, NotificationItem, OSAction, OSSettings, OSState } from "../types/os";

interface OSContextValue {
  state: OSState;
  dispatch: Dispatch<OSAction>;
  openApp: (appId: AppId, title?: string, props?: Record<string, unknown>) => void;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  updateWindow: (id: string, patch: Partial<OSState["windows"][number]>) => void;
  setWorkspace: (workspaceId: number) => void;
  setSettings: (patch: Partial<OSSettings>) => void;
  setFileSystem: (fileSystem: FileSystemNode[]) => void;
  addNote: (note: NoteItem) => void;
  updateNote: (id: string, patch: Partial<NoteItem>) => void;
  deleteNote: (id: string) => void;
  addEvent: (event: CalendarEvent) => void;
  deleteEvent: (id: string) => void;
  notify: (title: string, body: string, appId?: AppId) => void;
}

const OSContext = createContext<OSContextValue | null>(null);

export function OSProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(osReducer, undefined, createDefaultState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = loadState();
    if (saved) dispatch({ type: "HYDRATE", state: saved });
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveState(state);
  }, [hydrated, state]);

  const openApp = useCallback((appId: AppId, title?: string, props?: Record<string, unknown>) => {
    dispatch({ type: "OPEN_APP", appId, title, props });
  }, []);

  const closeWindow = useCallback((id: string) => dispatch({ type: "CLOSE_WINDOW", id }), []);
  const focusWindow = useCallback((id: string) => dispatch({ type: "FOCUS_WINDOW", id }), []);
  const minimizeWindow = useCallback((id: string) => dispatch({ type: "MINIMIZE_WINDOW", id }), []);
  const restoreWindow = useCallback((id: string) => dispatch({ type: "RESTORE_WINDOW", id }), []);
  const updateWindow = useCallback((id: string, patch: Partial<OSState["windows"][number]>) => {
    dispatch({ type: "UPDATE_WINDOW", id, patch });
  }, []);
  const setWorkspace = useCallback((workspaceId: number) => dispatch({ type: "SET_WORKSPACE", workspaceId }), []);
  const setSettings = useCallback((patch: Partial<OSSettings>) => dispatch({ type: "SET_SETTINGS", patch }), []);
  const setFileSystem = useCallback((fileSystem: FileSystemNode[]) => {
    dispatch({ type: "SET_FILE_SYSTEM", fileSystem });
  }, []);
  const addNote = useCallback((note: NoteItem) => dispatch({ type: "ADD_NOTE", note }), []);
  const updateNote = useCallback((id: string, patch: Partial<NoteItem>) => {
    dispatch({ type: "UPDATE_NOTE", id, patch: { ...patch, updatedAt: new Date().toISOString() } });
  }, []);
  const deleteNote = useCallback((id: string) => dispatch({ type: "DELETE_NOTE", id }), []);
  const addEvent = useCallback((event: CalendarEvent) => dispatch({ type: "ADD_EVENT", event }), []);
  const deleteEvent = useCallback((id: string) => dispatch({ type: "DELETE_EVENT", id }), []);
  const notify = useCallback((title: string, body: string, appId?: AppId) => {
    const notification: NotificationItem = {
      id: `notif-${Date.now()}`,
      title,
      body,
      appId,
      createdAt: new Date().toISOString(),
      read: false,
    };
    dispatch({ type: "ADD_NOTIFICATION", notification });
  }, []);

  const value = useMemo(
    () => ({
      state,
      dispatch,
      openApp,
      closeWindow,
      focusWindow,
      minimizeWindow,
      restoreWindow,
      updateWindow,
      setWorkspace,
      setSettings,
      setFileSystem,
      addNote,
      updateNote,
      deleteNote,
      addEvent,
      deleteEvent,
      notify,
    }),
    [
      addEvent,
      addNote,
      closeWindow,
      deleteEvent,
      deleteNote,
      focusWindow,
      minimizeWindow,
      notify,
      openApp,
      restoreWindow,
      setFileSystem,
      setSettings,
      setWorkspace,
      state,
      updateNote,
      updateWindow,
    ],
  );

  return <OSContext.Provider value={value}>{children}</OSContext.Provider>;
}

export function useOS() {
  const context = useContext(OSContext);
  if (!context) throw new Error("useOS must be used within OSProvider");
  return context;
}
