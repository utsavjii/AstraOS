import { weatherForecast } from "../../data/mockContent";
import { Panel } from "../ui/Panel";
import { SystemIcon } from "../ui/SystemIcon";

export function WeatherWidget() {
  const now = weatherForecast[0];
  return (
    <Panel className="w-64 p-4" subtle>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-white/42">Weather</p>
          <h3 className="mt-1 text-3xl font-semibold text-white">{now.temp}</h3>
        </div>
        <div className="grid h-14 w-14 place-items-center rounded-[20px] bg-sky-300/16 text-sky-100">
          <SystemIcon name="CloudSun" size={26} />
        </div>
      </div>
      <p className="mt-3 text-sm text-white/58">{now.detail}</p>
    </Panel>
  );
}
