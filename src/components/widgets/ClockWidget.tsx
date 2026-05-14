import { useEffect, useState } from "react";
import { Panel } from "../ui/Panel";

export function ClockWidget() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);
  return (
    <Panel className="w-64 p-4" subtle>
      <p className="text-xs uppercase tracking-[0.22em] text-white/42">Local Time</p>
      <h3 className="mt-2 text-4xl font-semibold text-white">
        {now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </h3>
      <p className="mt-2 text-sm text-white/56">
        {now.toLocaleDateString([], { weekday: "long", month: "short", day: "numeric" })}
      </p>
    </Panel>
  );
}
