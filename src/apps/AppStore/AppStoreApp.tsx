import { storeItems } from "../../data/mockContent";
import { GlassButton } from "../../components/ui/GlassButton";
import { Panel } from "../../components/ui/Panel";
import { SystemIcon } from "../../components/ui/SystemIcon";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { useOS } from "../../state/OSProvider";
import type { AppComponentProps } from "../../types/os";

export default function AppStoreApp(_: AppComponentProps) {
  const { notify } = useOS();
  const [installedIds, setInstalledIds] = useLocalStorage(
    "astraos.store.installed",
    storeItems.filter((item) => item.installed).map((item) => item.id),
  );
  const installed = new Set(installedIds);
  return (
    <div className="h-full overflow-auto p-5">
      <Panel className="mb-4 p-6">
        <p className="text-xs uppercase tracking-[0.24em] text-white/42">Astra Store</p>
        <h1 className="mt-2 text-4xl font-semibold text-white">Local modules</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-white/56">A polished mock store with realistic states, ratings, installs, and no remote backend.</p>
      </Panel>
      <div className="grid gap-3 md:grid-cols-2">
        {storeItems.map((item) => {
          const isInstalled = installed.has(item.id);
          return (
            <Panel key={item.id} subtle className="flex items-center gap-4">
              <div className="grid h-16 w-16 place-items-center rounded-[24px] bg-[rgba(var(--accent),.16)]">
                <SystemIcon name="ShoppingBag" size={24} />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-white">{item.name}</h3>
                <p className="mt-1 text-sm text-white/48">{item.tag} · ★ {item.rating}</p>
              </div>
              <GlassButton
                icon={isInstalled ? "Check" : "Download"}
                variant={isInstalled ? "ghost" : "primary"}
                onClick={() => {
                  setInstalledIds([...new Set([...installedIds, item.id])]);
                  notify("Store", `${item.name} installed in mock mode.`, "store");
                }}
              >
                {isInstalled ? "Installed" : "Install"}
              </GlassButton>
            </Panel>
          );
        })}
      </div>
    </div>
  );
}
