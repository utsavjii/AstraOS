import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { appDefinitions } from "../../data/apps";
import { useOS } from "../../state/OSProvider";
import { TextInput } from "../ui/TextInput";
import { SystemIcon } from "../ui/SystemIcon";

interface AppLauncherProps {
  onClose: () => void;
}

export function AppLauncher({ onClose }: AppLauncherProps) {
  const { openApp } = useOS();
  const [query, setQuery] = useState("");
  const apps = useMemo(
    () => appDefinitions.filter((app) => app.launcher && app.name.toLowerCase().includes(query.toLowerCase())),
    [query],
  );

  return (
    <motion.div
      className="fixed bottom-24 left-1/2 z-[8500] w-[min(760px,calc(100vw-24px))] -translate-x-1/2 rounded-[34px] border border-white/16 bg-[#07111f]/72 p-5 shadow-glass backdrop-blur-3xl"
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 16, scale: 0.98 }}
    >
      <div className="flex items-center gap-3">
        <TextInput value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find an app" className="w-full" autoFocus />
      </div>
      <div className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-5">
        {apps.map((app) => (
          <button
            type="button"
            key={app.id}
            onClick={() => {
              openApp(app.id);
              onClose();
            }}
            className="group flex min-h-24 flex-col items-center justify-center gap-3 rounded-[24px] border border-white/10 bg-white/[0.075] p-3 text-center transition hover:-translate-y-1 hover:border-[rgba(var(--accent),.45)] hover:bg-white/14"
          >
            <span className="grid h-12 w-12 place-items-center rounded-2xl shadow-glow" style={{ background: `${app.color}26` }}>
              <SystemIcon name={app.icon} size={22} />
            </span>
            <span className="text-xs font-medium text-white/76 group-hover:text-white">{app.name}</span>
          </button>
        ))}
      </div>
    </motion.div>
  );
}
