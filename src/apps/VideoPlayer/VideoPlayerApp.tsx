import { useEffect, useState } from "react";
import { videoItems } from "../../data/mockContent";
import { GlassButton } from "../../components/ui/GlassButton";
import { Slider } from "../../components/ui/Slider";
import { SystemIcon } from "../../components/ui/SystemIcon";
import type { AppComponentProps } from "../../types/os";

export default function VideoPlayerApp(_: AppComponentProps) {
  const [active, setActive] = useState(videoItems[0]);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(14);
  const [localName, setLocalName] = useState<string | null>(null);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => setProgress((value) => (value >= 100 ? 0 : value + 0.8)), 250);
    return () => window.clearInterval(timer);
  }, [playing]);

  return (
    <div className="grid h-full grid-rows-[1fr_auto] bg-black/18">
      <div className="relative grid place-items-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_28%,rgba(var(--accent),.28),transparent_46%),linear-gradient(135deg,rgba(255,79,216,.12),rgba(0,0,0,.58))]" />
        <div className="relative grid h-32 w-32 place-items-center rounded-full border border-white/18 bg-black/32 shadow-glow">
          <SystemIcon name={playing ? "Pause" : "Play"} size={48} />
        </div>
        <div className="absolute bottom-5 left-5">
          <p className="text-xs uppercase tracking-[0.24em] text-white/42">{localName ? "Local file" : active.duration}</p>
          <h2 className="mt-1 text-3xl font-semibold text-white">{localName ?? active.title}</h2>
        </div>
      </div>
      <div className="border-t border-white/10 p-4">
        <Slider min={0} max={100} value={progress} onChange={(event) => setProgress(Number(event.target.value))} className="w-full" />
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <GlassButton icon={playing ? "Pause" : "Play"} variant="primary" onClick={() => setPlaying((value) => !value)}>
            {playing ? "Pause" : "Play"}
          </GlassButton>
          {videoItems.map((item) => (
            <GlassButton key={item.id} onClick={() => { setActive(item); setLocalName(null); }}>
              {item.title}
            </GlassButton>
          ))}
          <label className="ml-auto inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-white/12 bg-white/9 px-4 py-2 text-sm text-white/72 hover:bg-white/14">
            <SystemIcon name="Upload" size={16} /> Open file
            <input type="file" accept="video/*" className="hidden" onChange={(event) => setLocalName(event.target.files?.[0]?.name ?? null)} />
          </label>
        </div>
      </div>
    </div>
  );
}
