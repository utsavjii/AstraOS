import { useState } from "react";
import { GlassButton } from "../../components/ui/GlassButton";
import { Panel } from "../../components/ui/Panel";
import { SystemIcon } from "../../components/ui/SystemIcon";
import { accentColors, wallpapers } from "../../data/wallpapers";
import { performanceProfiles } from "../../lib/performance";
import { useOS } from "../../state/OSProvider";
import type { AppComponentProps, AnimatedTheme, OSSettings, PerformanceMode, Wallpaper } from "../../types/os";

export default function SettingsApp(_: AppComponentProps) {
  const { state, setSettings, notify } = useOS();
  const [generating, setGenerating] = useState(false);
  const allWallpapers = [...wallpapers, ...state.settings.customWallpapers];

  const uploadWallpaper = async (file: File) => {
    const src = await compressWallpaper(file);
    const wallpaper: Wallpaper = {
      id: `custom-${Date.now()}`,
      name: file.name.replace(/\.[^/.]+$/, ""),
      src,
      tone: "dark",
    };
    setSettings({
      customWallpapers: [wallpaper, ...state.settings.customWallpapers].slice(0, 6),
      wallpaperId: wallpaper.id,
    });
    notify("Wallpaper imported", `${wallpaper.name} is now active.`, "settings");
  };

  const generateWallpaper = () => {
    setGenerating(true);
    window.setTimeout(() => {
      const hue = Math.floor(Math.random() * 360);
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080"><defs><radialGradient id="a" cx="30%" cy="20%" r="80%"><stop offset="0" stop-color="hsl(${hue},100%,74%)"/><stop offset=".45" stop-color="hsl(${(hue + 90) % 360},86%,56%)" stop-opacity=".55"/><stop offset="1" stop-color="#07111f"/></radialGradient><filter id="b"><feGaussianBlur stdDeviation="38"/></filter></defs><rect width="1920" height="1080" fill="#07111f"/><path d="M0 700C420 420 650 620 980 340c250-212 580-230 940 70v670H0z" fill="url(#a)" filter="url(#b)" opacity=".84"/><circle cx="1450" cy="260" r="190" fill="hsl(${(hue + 160) % 360},90%,70%)" opacity=".28" filter="url(#b)"/></svg>`;
      const wallpaper: Wallpaper = {
        id: `ai-${Date.now()}`,
        name: "Generated Signal",
        src: `data:image/svg+xml;base64,${btoa(svg)}`,
        tone: "dark",
      };
      setSettings({
        customWallpapers: [wallpaper, ...state.settings.customWallpapers].slice(0, 6),
        wallpaperId: wallpaper.id,
      });
      setGenerating(false);
      notify("AI wallpaper", "A generated local wallpaper is active.", "settings");
    }, 900);
  };

  return (
    <div className="h-full overflow-auto p-5">
      <div className="grid gap-4 xl:grid-cols-[1.2fr_.8fr]">
        <Panel>
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-white/42">Personalization</p>
              <h2 className="mt-1 text-2xl font-semibold text-white">Wallpapers</h2>
            </div>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-white/12 bg-white/9 px-4 py-2 text-sm text-white/72 hover:bg-white/14">
              <SystemIcon name="Upload" size={16} />
              Upload
              <input type="file" accept="image/*" className="hidden" onChange={(event) => event.target.files?.[0] && uploadWallpaper(event.target.files[0])} />
            </label>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">
            {allWallpapers.map((wallpaper) => (
              <button
                type="button"
                key={wallpaper.id}
                onClick={() =>
                  setSettings({
                    wallpaperId: wallpaper.id,
                    animatedTheme: isAnimatedTheme(wallpaper.id) ? wallpaper.id : state.settings.animatedTheme,
                  })
                }
                className={`group overflow-hidden rounded-[24px] border p-2 text-left transition hover:-translate-y-1 ${state.settings.wallpaperId === wallpaper.id ? "border-[rgba(var(--accent),.58)] bg-[rgba(var(--accent),.16)]" : "border-white/10 bg-white/[0.055]"}`}
              >
                <div className="h-28 rounded-[18px] bg-cover bg-center" style={{ backgroundImage: `url(${wallpaper.src})` }} />
                <p className="mt-2 truncate px-1 text-sm font-medium text-white/78">{wallpaper.name}</p>
              </button>
            ))}
          </div>
        </Panel>
        <Panel>
          <p className="text-xs uppercase tracking-[0.24em] text-white/42">Appearance</p>
          <h2 className="mt-1 text-2xl font-semibold text-white">Adaptive Theme</h2>
          <div className="mt-5 grid grid-cols-3 gap-2">
            {(["dark", "light", "system"] as OSSettings["theme"][]).map((theme) => (
              <button
                type="button"
                key={theme}
                onClick={() => setSettings({ theme })}
                className={`rounded-2xl border px-3 py-3 text-sm capitalize transition ${state.settings.theme === theme ? "border-[rgba(var(--accent),.5)] bg-[rgba(var(--accent),.18)] text-white" : "border-white/10 bg-white/[0.055] text-white/58 hover:bg-white/10"}`}
              >
                {theme}
              </button>
            ))}
          </div>
          <div className="mt-6">
            <p className="mb-2 text-sm text-white/62">Accent color</p>
            <div className="flex flex-wrap gap-2">
              {accentColors.map((color) => (
                <button
                  type="button"
                  key={color}
                  aria-label={color}
                  title={color}
                  onClick={() => setSettings({ accent: color })}
                  className={`h-10 w-10 rounded-2xl border transition hover:scale-105 ${state.settings.accent === color ? "border-white shadow-glow" : "border-white/18"}`}
                  style={{ background: color }}
                />
              ))}
            </div>
          </div>
          <div className="mt-6">
            <p className="mb-2 text-sm text-white/62">Performance</p>
            <div className="grid gap-2">
              {(["high", "balanced", "battery"] as PerformanceMode[]).map((mode) => (
                <button
                  type="button"
                  key={mode}
                  onClick={() => setSettings({ performanceMode: mode })}
                  className={`rounded-[22px] border p-3 text-left transition ${
                    state.settings.performanceMode === mode
                      ? "border-[rgba(var(--accent),.48)] bg-[rgba(var(--accent),.16)] shadow-glow"
                      : "border-white/10 bg-white/[0.055] hover:bg-white/10"
                  }`}
                >
                  <span className="flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold text-white">{performanceProfiles[mode].label}</span>
                    {state.settings.performanceMode === mode ? <SystemIcon name="Check" size={16} /> : null}
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-white/46">{performanceProfiles[mode].description}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="mt-6 grid gap-3">
            <Toggle label="Startup sound" checked={state.settings.startupSound} onChange={(startupSound) => setSettings({ startupSound })} />
            <Toggle label="Cursor glow" checked={state.settings.cursorEffects} onChange={(cursorEffects) => setSettings({ cursorEffects })} />
            <Toggle label="Reduced motion" checked={state.settings.reducedMotion} onChange={(reducedMotion) => setSettings({ reducedMotion })} />
            <Toggle label="Multi-monitor simulation" checked={state.settings.multiMonitor} onChange={(multiMonitor) => setSettings({ multiMonitor })} />
          </div>
        </Panel>
        <Panel className="xl:col-span-2">
          <div className="grid gap-5 lg:grid-cols-[.8fr_1.2fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-white/42">Widgets</p>
              <h2 className="mt-1 text-2xl font-semibold text-white">Desktop Modules</h2>
              <div className="mt-4 grid gap-3">
                {Object.entries(state.settings.widgets).map(([key, checked]) => (
                  <Toggle
                    key={key}
                    label={`${key[0].toUpperCase()}${key.slice(1)} widget`}
                    checked={checked}
                    onChange={(value) => setSettings({ widgets: { ...state.settings.widgets, [key]: value } })}
                  />
                ))}
              </div>
            </div>
            <div className="rounded-[28px] border border-white/10 bg-black/16 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-white/42">AI Wallpaper Generator</p>
                  <h3 className="mt-1 text-xl font-semibold text-white">Generate local signal art</h3>
                </div>
                <GlassButton icon="Sparkles" variant="primary" onClick={generateWallpaper} disabled={generating}>
                  {generating ? "Generating" : "Generate"}
                </GlassButton>
              </div>
              <p className="mt-4 text-sm leading-6 text-white/56">
                This mock generator creates a new SVG wallpaper locally and saves it as a custom wallpaper. It keeps the app offline and deployable on Vercel.
              </p>
              <div className="mt-5 rounded-[24px] border border-white/10 bg-white/[0.05] p-4 text-sm text-white/52">
                PWA status: manifest configured, service worker registered after load, app shell cached for offline refreshes.
              </div>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <label className="flex items-center justify-between gap-4 rounded-[22px] border border-white/10 bg-white/[0.055] px-4 py-3 text-sm text-white/72">
      <span>{label}</span>
      <input type="checkbox" className="sr-only" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      <span className={`relative h-7 w-12 rounded-full transition ${checked ? "bg-[rgb(var(--accent))]" : "bg-white/16"}`}>
        <span className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${checked ? "left-6" : "left-1"}`} />
      </span>
    </label>
  );
}

function compressWallpaper(file: File): Promise<string> {
  return new Promise((resolve) => {
    if (file.type === "image/svg+xml") {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.readAsDataURL(file);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement("canvas");
        const width = 1280;
        const height = Math.round((image.height / image.width) * width) || 720;
        canvas.width = width;
        canvas.height = Math.min(960, height);
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.78));
      };
      image.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

function isAnimatedTheme(value: string): value is AnimatedTheme {
  return ["aurora", "eclipse", "daybreak", "orbital"].includes(value);
}
