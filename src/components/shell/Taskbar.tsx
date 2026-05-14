import { appDefinitions } from "../../data/apps";
import { useOS } from "../../state/OSProvider";
import { IconButton } from "../ui/IconButton";
import { SystemIcon } from "../ui/SystemIcon";
import { WorkspaceSwitcher } from "./WorkspaceSwitcher";

interface TaskbarProps {
  onLauncher: () => void;
  onCommand: () => void;
  onNotifications: () => void;
}

export function Taskbar({ onLauncher, onCommand, onNotifications }: TaskbarProps) {
  const { state, openApp, restoreWindow } = useOS();
  const dockApps = appDefinitions.filter((app) => app.dock);
  const activeIds = new Set(state.windows.filter((windowState) => !windowState.minimized).map((windowState) => windowState.appId));
  const unread = state.notifications.filter((notification) => !notification.read).length;

  return (
    <footer className="pointer-events-none fixed inset-x-0 bottom-4 z-[8000] flex justify-center px-3">
      <div className="pointer-events-auto flex max-w-[calc(100vw-24px)] items-center gap-2 rounded-[30px] border border-white/16 bg-[#07111f]/54 p-2 shadow-glass backdrop-blur-3xl">
        <IconButton icon="Command" label="Launcher" active={false} onClick={onLauncher} />
        <button
          type="button"
          onClick={onCommand}
          className="hidden h-10 min-w-48 items-center gap-2 rounded-2xl border border-white/12 bg-white/9 px-3 text-left text-sm text-white/58 transition hover:bg-white/14 hover:text-white md:flex"
        >
          <SystemIcon name="Search" size={16} />
          Search everything
          <kbd className="ml-auto rounded-lg bg-white/12 px-1.5 py-0.5 text-[10px] text-white/52">Ctrl K</kbd>
        </button>
        <div className="hidden h-8 w-px bg-white/12 sm:block" />
        <div className="flex items-center gap-1">
          {dockApps.map((app) => {
            const minimized = state.windows.find((windowState) => windowState.appId === app.id && windowState.minimized);
            return (
              <IconButton
                key={app.id}
                icon={app.icon}
                label={app.name}
                active={activeIds.has(app.id)}
                onClick={() => (minimized ? restoreWindow(minimized.id) : openApp(app.id))}
              />
            );
          })}
        </div>
        <div className="hidden h-8 w-px bg-white/12 lg:block" />
        <div className="hidden lg:block">
          <WorkspaceSwitcher />
        </div>
        <button
          type="button"
          onClick={onNotifications}
          className="relative flex h-10 items-center gap-2 rounded-2xl border border-white/12 bg-white/9 px-3 text-xs text-white/72"
        >
          <SystemIcon name="BatteryCharging" size={16} />
          <span className="hidden sm:inline">92%</span>
          <SystemIcon name="Wifi" size={16} />
          {unread ? (
            <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[rgb(var(--accent))] px-1 text-[10px] font-bold text-[#06111f]">
              {unread}
            </span>
          ) : null}
        </button>
      </div>
    </footer>
  );
}
