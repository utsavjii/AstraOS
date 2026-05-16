import { useCallback, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { appDefinitions } from "../../data/apps";
import { useKeyboardShortcuts } from "../../hooks/useKeyboardShortcuts";
import { useAuth } from "../../state/AuthProvider";
import { useOS } from "../../state/OSProvider";
import type { Point } from "../../types/os";
import { SystemIcon } from "../ui/SystemIcon";
import { AmbientBackground } from "./AmbientBackground";
import { AppLauncher } from "./AppLauncher";
import { CommandPalette } from "./CommandPalette";
import { ContextMenu } from "./ContextMenu";
import { CursorGlow } from "./CursorGlow";
import { FloatingWidgets } from "../widgets/FloatingWidgets";
import { NotificationCenter } from "./NotificationCenter";
import { Taskbar } from "./Taskbar";
import { WindowManager } from "../windowing/WindowManager";

const workspaceProfiles = [
  {
    title: "Prime",
    status: "Daily command center",
    apps: ["browser", "files", "notes", "terminal", "settings", "gallery"],
  },
  {
    title: "Build",
    status: "Developer tools and project flow",
    apps: ["terminal", "files", "browser", "notes", "assistant", "store"],
  },
  {
    title: "Media",
    status: "Playback, gallery, weather, and games",
    apps: ["music", "gallery", "video", "weather", "games", "browser"],
  },
  {
    title: "Focus",
    status: "Calendar, notes, clock, and quiet tools",
    apps: ["notes", "calendar", "clock", "assistant", "calculator", "settings"],
  },
];

export function Desktop() {
  const { state, dispatch, openApp, setWorkspace, addNote } = useOS();
  const { user, logout } = useAuth();
  const [launcherOpen, setLauncherOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [contextPoint, setContextPoint] = useState<Point | null>(null);

  const closeOverlays = useCallback(() => {
    setLauncherOpen(false);
    setCommandOpen(false);
    setNotificationsOpen(false);
    setContextPoint(null);
  }, []);

  const shortcutOptions = useMemo(
    () => ({
      onCommand: () => setCommandOpen((open) => !open),
      onLauncher: () => setLauncherOpen((open) => !open),
      onEscape: closeOverlays,
      onWorkspace: (direction: 1 | -1) => setWorkspace((state.currentWorkspace + direction + state.workspaces.length) % state.workspaces.length),
      onOpenApp: openApp,
    }),
    [closeOverlays, openApp, setWorkspace, state.currentWorkspace, state.workspaces.length],
  );
  useKeyboardShortcuts(shortcutOptions);

  const workspaceProfile = workspaceProfiles[state.currentWorkspace] ?? workspaceProfiles[0];
  const desktopApps = workspaceProfile.apps
    .map((id) => appDefinitions.find((app) => app.id === id))
    .filter((app): app is (typeof appDefinitions)[number] => Boolean(app));
  const workspaceWindowCount = state.windows.filter((windowState) => windowState.workspaceId === state.currentWorkspace).length;

  return (
    <motion.main
      className="relative h-screen overflow-hidden text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onContextMenu={(event) => {
        event.preventDefault();
        setContextPoint({ x: Math.min(event.clientX, window.innerWidth - 240), y: Math.min(event.clientY, window.innerHeight - 230) });
      }}
      onPointerDown={() => setContextPoint(null)}
    >
      <AmbientBackground />
      {state.settings.cursorEffects ? <CursorGlow /> : null}
      <div className="relative z-10 flex h-screen flex-col">
        <header className="pointer-events-none fixed inset-x-0 top-0 z-30 flex items-center justify-between px-5 py-4">
          <div className="pointer-events-auto flex items-center gap-3 rounded-full border border-white/12 bg-black/18 px-4 py-2 text-sm text-white/72 backdrop-blur-2xl">
            <SystemIcon name="Sparkles" size={16} className="text-[rgb(var(--accent))]" />
            AstraOS
          </div>
          <div className="pointer-events-auto hidden items-center gap-2 rounded-full border border-white/12 bg-black/18 p-1 pl-4 text-sm text-white/66 backdrop-blur-2xl sm:flex">
            <span className="max-w-[260px] truncate">{user?.email ?? "Guest session"}</span>
            <button
              type="button"
              onClick={() => dispatch({ type: "LOCK" })}
              className="rounded-full px-3 py-1.5 transition hover:bg-white/12 hover:text-white"
            >
              Lock
            </button>
            {user ? (
              <button
                type="button"
                onClick={async () => {
                  await logout();
                  dispatch({ type: "LOCK" });
                }}
                className="rounded-full px-3 py-1.5 transition hover:bg-rose-500/70 hover:text-white"
              >
                Logout
              </button>
            ) : null}
          </div>
        </header>
        <section className="relative h-full px-5 pb-28 pt-20">
          <motion.div
            key={workspaceProfile.title}
            className="pointer-events-none fixed left-1/2 top-20 z-20 hidden -translate-x-1/2 rounded-full border border-white/12 bg-black/20 px-5 py-2 text-center shadow-glass backdrop-blur-2xl md:block"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.22 }}
          >
            <span className="text-sm font-semibold text-white">{workspaceProfile.title}</span>
            <span className="mx-2 text-white/24">/</span>
            <span className="text-xs text-white/52">{workspaceProfile.status}</span>
            <span className="mx-2 text-white/24">/</span>
            <span className="text-xs text-white/52">{workspaceWindowCount} windows</span>
          </motion.div>
          <div className="grid w-fit grid-cols-2 gap-4 sm:grid-cols-1">
            {desktopApps.map((app, index) => (
              <motion.button
                type="button"
                key={`${workspaceProfile.title}-${app.id}`}
                onDoubleClick={() => openApp(app.id)}
                onClick={() => openApp(app.id)}
                className="group flex w-24 flex-col items-center gap-2 rounded-[22px] p-2 text-center transition hover:bg-white/10"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.025 }}
              >
                <span className="grid h-14 w-14 place-items-center rounded-[22px] border border-white/12 bg-white/12 shadow-glass backdrop-blur-2xl transition group-hover:-translate-y-1 group-hover:shadow-glow">
                  <SystemIcon name={app.icon} size={24} />
                </span>
                <span className="text-xs font-medium text-white/78 drop-shadow">{app.name}</span>
              </motion.button>
            ))}
          </div>
          {state.settings.multiMonitor ? (
            <div className="pointer-events-none fixed left-[18%] top-[18%] h-[58vh] w-[64vw] rounded-[42px] border border-white/10 bg-white/[0.035] shadow-[inset_0_0_60px_rgba(255,255,255,.04)]" />
          ) : null}
          <FloatingWidgets />
          <WindowManager />
        </section>
      </div>
      <Taskbar
        onLauncher={() => setLauncherOpen((open) => !open)}
        onCommand={() => setCommandOpen(true)}
        onNotifications={() => setNotificationsOpen((open) => !open)}
      />
      <AnimatePresence>
        {launcherOpen ? <AppLauncher key="launcher" onClose={() => setLauncherOpen(false)} /> : null}
        {commandOpen ? <CommandPalette key="command" onClose={() => setCommandOpen(false)} /> : null}
        {notificationsOpen ? <NotificationCenter key="notifications" onClose={() => setNotificationsOpen(false)} /> : null}
        {contextPoint ? (
          <ContextMenu
            key="context"
            point={contextPoint}
            onClose={() => setContextPoint(null)}
            onSettings={() => {
              openApp("settings");
              setContextPoint(null);
            }}
            onWallpaper={() => {
              openApp("settings", "Settings", { section: "wallpapers" });
              setContextPoint(null);
            }}
            onNote={() => {
              addNote({
                id: `note-${Date.now()}`,
                title: "Untitled note",
                body: "",
                pinned: false,
                updatedAt: new Date().toISOString(),
              });
              openApp("notes");
              setContextPoint(null);
            }}
          />
        ) : null}
      </AnimatePresence>
    </motion.main>
  );
}
