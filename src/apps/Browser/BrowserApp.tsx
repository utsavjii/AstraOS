import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { browserPages } from "../../data/mockContent";
import { GlassButton } from "../../components/ui/GlassButton";
import { SystemIcon } from "../../components/ui/SystemIcon";
import { TextInput } from "../../components/ui/TextInput";
import type { AppComponentProps } from "../../types/os";
import { useOS } from "../../state/OSProvider";

interface Tab {
  id: string;
  title: string;
  url: string;
}

export default function BrowserApp({ windowId }: AppComponentProps) {
  const { state, notify } = useOS();
  const windowState = state.windows.find((item) => item.id === windowId);
  const initialUrl = (windowState?.props?.url as string) ?? "astra://home";
  const initialQuery = (windowState?.props?.query as string) ?? "";
  const [tabs, setTabs] = useState<Tab[]>([{ id: "home", title: "Home", url: initialQuery ? `search:${initialQuery}` : initialUrl }]);
  const [activeId, setActiveId] = useState("home");
  const [address, setAddress] = useState(initialQuery || initialUrl);
  const [loading, setLoading] = useState(false);
  const activeTab = tabs.find((tab) => tab.id === activeId) ?? tabs[0];
  const page = useMemo(() => resolvePage(activeTab.url), [activeTab.url]);

  const navigate = () => {
    setLoading(true);
    const url = address.startsWith("astra://") ? address : `search:${address}`;
    window.setTimeout(() => {
      setTabs((current) => current.map((tab) => (tab.id === activeId ? { ...tab, url, title: resolvePage(url).title } : tab)));
      setLoading(false);
      if (!url.startsWith("astra://") && !url.startsWith("search:")) {
        notify("Browser", "This is a simulated offline browser surface.", "browser");
      }
    }, 420);
  };

  return (
    <div className="flex h-full flex-col bg-black/10">
      <div className="flex shrink-0 items-center gap-2 border-b border-white/10 bg-white/[0.04] p-2">
        <div className="flex min-w-0 flex-1 items-center gap-1 overflow-auto">
          {tabs.map((tab) => (
            <button
              type="button"
              key={tab.id}
              onClick={() => {
                setActiveId(tab.id);
                setAddress(tab.url.replace("search:", ""));
              }}
              className={`flex h-9 min-w-32 items-center gap-2 rounded-2xl px-3 text-xs transition ${tab.id === activeId ? "bg-white/14 text-white" : "text-white/54 hover:bg-white/8"}`}
            >
              <SystemIcon name="Globe2" size={14} />
              <span className="truncate">{tab.title}</span>
            </button>
          ))}
          <button
            type="button"
            className="grid h-9 w-9 place-items-center rounded-2xl text-white/58 hover:bg-white/10"
            onClick={() => {
              const tab = { id: `tab-${Date.now()}`, title: "New tab", url: "astra://home" };
              setTabs((current) => [...current, tab]);
              setActiveId(tab.id);
              setAddress(tab.url);
            }}
          >
            <SystemIcon name="Plus" size={16} />
          </button>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2 border-b border-white/10 p-3">
        <TextInput
          value={address}
          onChange={(event) => setAddress(event.target.value)}
          onKeyDown={(event) => event.key === "Enter" && navigate()}
          className="w-full"
          placeholder="Search or enter astra://home"
        />
        <GlassButton icon="Search" variant="primary" onClick={navigate}>Go</GlassButton>
      </div>
      <main className="relative min-h-0 flex-1 overflow-auto p-5">
        {loading ? <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,rgb(var(--accent)),#ff4fd8)]" /> : null}
        <motion.div
          key={activeTab.url}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-4xl"
        >
          <div className="rounded-[32px] border border-white/12 bg-white/[0.07] p-7">
            <p className="text-xs uppercase tracking-[0.24em] text-white/42">{activeTab.url}</p>
            <h1 className="mt-3 text-4xl font-semibold text-white">{page.title}</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-white/62">{page.body}</p>
            <div className="mt-7 grid gap-3 md:grid-cols-3">
              {page.cards.map((card) => (
                <article key={card} className="rounded-[24px] border border-white/10 bg-black/16 p-4">
                  <div className="mb-5 h-20 rounded-[20px] bg-[radial-gradient(circle_at_30%_20%,rgba(var(--accent),.42),transparent_60%),linear-gradient(135deg,rgba(255,255,255,.12),rgba(255,255,255,.02))]" />
                  <h3 className="font-medium text-white">{card}</h3>
                  <p className="mt-2 text-sm leading-5 text-white/48">Local result rendered from AstraOS mock content.</p>
                </article>
              ))}
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

function resolvePage(url: string) {
  if (url.startsWith("search:")) {
    const query = url.replace("search:", "");
    return {
      title: `Search: ${query || "Astra"}`,
      body: "Results are composed from local apps, files, notes, and simulated web fragments.",
      cards: [`${query} in Notes`, `${query} in Files`, `${query} on Astra Web`],
    };
  }
  return browserPages[url as keyof typeof browserPages] ?? {
    title: "Network boundary",
    body: "AstraOS is offline-first. External pages are represented with a styled local loading state.",
    cards: ["Try astra://home", "Open astra://news", "Visit astra://store"],
  };
}
