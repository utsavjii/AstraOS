import { memo, useEffect, useMemo, useState } from "react";
import { usePageVisibility } from "../../hooks/usePageVisibility";
import { useOS } from "../../state/OSProvider";
import { Panel } from "../ui/Panel";

function ClockWidgetComponent() {
  const { state } = useOS();
  const visible = usePageVisibility();
  const [now, setNow] = useState(new Date());
  const interval = useMemo(() => {
    if (!visible) return 60000;
    if (state.settings.performanceMode === "battery") return 15000;
    if (state.settings.performanceMode === "balanced") return 5000;
    return 1000;
  }, [state.settings.performanceMode, visible]);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), interval);
    return () => window.clearInterval(timer);
  }, [interval]);
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

export const ClockWidget = memo(ClockWidgetComponent);
