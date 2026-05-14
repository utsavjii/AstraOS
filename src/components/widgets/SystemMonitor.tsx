import { useEffect, useState } from "react";
import { Panel } from "../ui/Panel";
import { SystemIcon } from "../ui/SystemIcon";

export function SystemMonitor() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const timer = window.setInterval(() => setTick((value) => value + 1), 1600);
    return () => window.clearInterval(timer);
  }, []);
  const cpu = 28 + Math.round(Math.sin(tick / 2) * 14 + (tick % 5) * 3);
  const ram = 54 + Math.round(Math.cos(tick / 3) * 8);

  return (
    <Panel className="w-64 p-4" subtle>
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-[0.22em] text-white/42">Live System</span>
        <SystemIcon name="Gauge" size={16} className="text-[rgb(var(--accent))]" />
      </div>
      <Metric label="CPU" value={cpu} icon="Cpu" />
      <Metric label="RAM" value={ram} icon="MemoryStick" />
      <Metric label="Battery" value={92} icon="BatteryCharging" />
    </Panel>
  );
}

function Metric({ label, value, icon }: { label: string; value: number; icon: string }) {
  return (
    <div className="mt-4">
      <div className="mb-2 flex items-center justify-between text-xs text-white/64">
        <span className="inline-flex items-center gap-2">
          <SystemIcon name={icon} size={14} /> {label}
        </span>
        <span>{value}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-[linear-gradient(90deg,rgb(var(--accent)),#ff4fd8)]" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
