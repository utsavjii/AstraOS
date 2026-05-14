import { useEffect, useState } from "react";
import { musicTracks } from "../../data/mockContent";
import { GlassButton } from "../../components/ui/GlassButton";
import { Slider } from "../../components/ui/Slider";
import { SystemIcon } from "../../components/ui/SystemIcon";
import type { AppComponentProps } from "../../types/os";

export default function MusicApp(_: AppComponentProps) {
  const [active, setActive] = useState(musicTracks[0]);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(24);
  const [localName, setLocalName] = useState<string | null>(null);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => setProgress((value) => (value >= 100 ? 0 : value + 1)), 600);
    return () => window.clearInterval(timer);
  }, [playing]);

  return (
    <div className="grid h-full grid-cols-[1fr_280px] gap-4 p-4 max-md:grid-cols-1">
      <main className="flex min-h-0 flex-col rounded-[34px] border border-white/10 bg-white/[0.06] p-5">
        <div className="relative grid flex-1 place-items-center overflow-hidden rounded-[30px] bg-[radial-gradient(circle_at_30%_22%,rgba(var(--accent),.46),transparent_56%),linear-gradient(135deg,rgba(255,79,216,.24),rgba(7,17,31,.7))]">
          <div className="absolute inset-0 music-bars opacity-60" />
          <div className="relative grid h-44 w-44 place-items-center rounded-full border border-white/18 bg-black/22 shadow-glow backdrop-blur-2xl">
            <SystemIcon name="Music2" size={54} />
          </div>
        </div>
        <div className="mt-5">
          <p className="text-xs uppercase tracking-[0.24em] text-white/42">{localName ? "Local file" : active.artist}</p>
          <h2 className="mt-1 text-3xl font-semibold text-white">{localName ?? active.title}</h2>
          <Slider min={0} max={100} value={progress} onChange={(event) => setProgress(Number(event.target.value))} className="mt-5 w-full" />
          <div className="mt-4 flex items-center justify-center gap-3">
            <GlassButton icon="ChevronLeft" />
            <GlassButton icon={playing ? "Pause" : "Play"} variant="primary" onClick={() => setPlaying((value) => !value)}>
              {playing ? "Pause" : "Play"}
            </GlassButton>
            <GlassButton icon="ChevronRight" />
          </div>
        </div>
      </main>
      <aside className="min-h-0 overflow-auto rounded-[30px] border border-white/10 bg-black/14 p-3">
        <label className="mb-3 flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-white/18 bg-white/[0.05] p-3 text-sm text-white/58 hover:bg-white/10">
          <SystemIcon name="Upload" size={16} />
          Import audio
          <input
            type="file"
            accept="audio/*"
            className="hidden"
            onChange={(event) => setLocalName(event.target.files?.[0]?.name ?? null)}
          />
        </label>
        {musicTracks.map((track) => (
          <button
            type="button"
            key={track.id}
            onClick={() => {
              setActive(track);
              setLocalName(null);
            }}
            className={`mb-2 flex w-full items-center gap-3 rounded-[22px] border p-3 text-left transition ${track.id === active.id && !localName ? "border-[rgba(var(--accent),.42)] bg-[rgba(var(--accent),.14)]" : "border-white/8 bg-white/[0.045] hover:bg-white/10"}`}
          >
            <span className="h-10 w-10 rounded-2xl" style={{ background: track.color }} />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium text-white">{track.title}</span>
              <span className="text-xs text-white/42">{track.artist}</span>
            </span>
            <span className="text-xs text-white/42">{track.length}</span>
          </button>
        ))}
      </aside>
    </div>
  );
}
