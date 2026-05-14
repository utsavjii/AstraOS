import { useEffect, useState } from "react";
import { GlassButton } from "../../components/ui/GlassButton";
import { Panel } from "../../components/ui/Panel";
import type { AppComponentProps } from "../../types/os";

const cells = Array.from({ length: 16 }, (_, index) => index);

export default function GamesApp(_: AppComponentProps) {
  const [activeCell, setActiveCell] = useState(5);
  const [score, setScore] = useState(0);
  const [running, setRunning] = useState(false);
  const [sequence, setSequence] = useState<number[]>([1, 4, 7]);

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => setActiveCell(Math.floor(Math.random() * cells.length)), 900);
    return () => window.clearInterval(timer);
  }, [running]);

  return (
    <div className="grid h-full gap-4 p-4 lg:grid-cols-[1fr_280px]">
      <Panel className="grid place-items-center">
        <div className="w-full max-w-md">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-white/42">Mini Game</p>
              <h2 className="text-2xl font-semibold text-white">Photon Tap</h2>
            </div>
            <span className="rounded-2xl border border-white/10 bg-white/[0.07] px-4 py-2 text-white">Score {score}</span>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {cells.map((cell) => (
              <button
                type="button"
                key={cell}
                onClick={() => {
                  if (cell === activeCell) {
                    setScore((value) => value + 1);
                    setActiveCell(Math.floor(Math.random() * cells.length));
                  } else {
                    setScore((value) => Math.max(0, value - 1));
                  }
                }}
                className={`aspect-square rounded-[22px] border transition ${cell === activeCell ? "border-[rgba(var(--accent),.7)] bg-[rgba(var(--accent),.32)] shadow-glow" : "border-white/10 bg-white/[0.06] hover:bg-white/12"}`}
              />
            ))}
          </div>
          <div className="mt-4 flex justify-center gap-2">
            <GlassButton icon={running ? "Pause" : "Play"} variant="primary" onClick={() => setRunning((value) => !value)}>
              {running ? "Pause" : "Start"}
            </GlassButton>
            <GlassButton icon="RefreshCcw" onClick={() => { setScore(0); setActiveCell(5); }}>Reset</GlassButton>
          </div>
        </div>
      </Panel>
      <Panel subtle>
        <p className="text-xs uppercase tracking-[0.24em] text-white/42">Pattern Memory</p>
        <h3 className="mt-1 text-xl font-semibold text-white">Signal Chain</h3>
        <div className="mt-5 grid grid-cols-3 gap-2">
          {Array.from({ length: 9 }, (_, index) => (
            <button
              type="button"
              key={index}
              onClick={() => setSequence((current) => [...current.slice(-5), index])}
              className={`aspect-square rounded-2xl border ${sequence.includes(index) ? "border-[rgba(var(--accent),.55)] bg-[rgba(var(--accent),.2)]" : "border-white/10 bg-white/[0.055]"}`}
            />
          ))}
        </div>
        <p className="mt-4 text-sm leading-6 text-white/52">Tap tiles to build a visible pattern. This keeps the games app lightweight while still interactive.</p>
      </Panel>
    </div>
  );
}
