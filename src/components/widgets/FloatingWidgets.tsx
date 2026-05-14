import { useOS } from "../../state/OSProvider";
import { AssistantOrb } from "./AssistantOrb";
import { ClockWidget } from "./ClockWidget";
import { SystemMonitor } from "./SystemMonitor";
import { WeatherWidget } from "./WeatherWidget";

export function FloatingWidgets() {
  const { state } = useOS();
  return (
    <aside className="pointer-events-none fixed right-5 top-24 z-20 hidden flex-col items-end gap-3 xl:flex">
      {state.settings.widgets.weather ? <div className="pointer-events-auto"><WeatherWidget /></div> : null}
      {state.settings.widgets.system ? <div className="pointer-events-auto"><SystemMonitor /></div> : null}
      {state.settings.widgets.clock ? <div className="pointer-events-auto"><ClockWidget /></div> : null}
      {state.settings.widgets.assistant ? <div className="pointer-events-auto mt-1"><AssistantOrb /></div> : null}
    </aside>
  );
}
