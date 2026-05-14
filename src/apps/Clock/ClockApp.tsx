import { useEffect, useState } from "react";
import { GlassButton } from "../../components/ui/GlassButton";
import type { AppComponentProps } from "../../types/os";

export default function ClockApp(_: AppComponentProps) {
  const [now, setNow] = useState(new Date());
  const [timer, setTimer] = useState(300);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    const tick = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(tick);
  }, []);

  useEffect(() => {
    if (!running || timer <= 0) return;
    const tick = window.setInterval(() => setTimer((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(tick);
  }, [running, timer]);

  return (
    <div className="grid h-full gap-4 p-5 sm:grid-cols-2">
      <section className="grid place-items-center rounded-[34px] border border-white/10 bg-white/[0.06] p-5 text-center">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-white/42">Clock</p>
          <h1 className="mt-4 text-6xl font-semibold text-white">
            {now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </h1>
          <p className="mt-4 text-white/54">{now.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" })}</p>
        </div>
      </section>
      <section className="grid place-items-center rounded-[34px] border border-white/10 bg-black/14 p-5 text-center">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-white/42">Focus Timer</p>
          <h2 className="mt-4 text-5xl font-semibold text-white">
            {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, "0")}
          </h2>
          <div className="mt-5 flex justify-center gap-2">
            <GlassButton icon={running ? "Pause" : "Play"} variant="primary" onClick={() => setRunning((value) => !value)}>
              {running ? "Pause" : "Start"}
            </GlassButton>
            <GlassButton icon="RefreshCcw" onClick={() => setTimer(300)}>Reset</GlassButton>
          </div>
        </div>
      </section>
    </div>
  );
}
