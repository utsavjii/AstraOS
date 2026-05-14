import { weatherForecast } from "../../data/mockContent";
import { Panel } from "../../components/ui/Panel";
import { SystemIcon } from "../../components/ui/SystemIcon";
import type { AppComponentProps } from "../../types/os";

export default function WeatherApp(_: AppComponentProps) {
  return (
    <div className="h-full overflow-auto p-5">
      <Panel className="relative overflow-hidden p-6">
        <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-sky-300/20 blur-3xl" />
        <p className="text-xs uppercase tracking-[0.24em] text-white/42">Local weather simulation</p>
        <div className="mt-4 flex items-center justify-between">
          <div>
            <h1 className="text-6xl font-semibold text-white">{weatherForecast[0].temp}</h1>
            <p className="mt-3 text-white/58">{weatherForecast[0].detail}</p>
          </div>
          <SystemIcon name="CloudSun" size={76} className="text-sky-100" />
        </div>
      </Panel>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {weatherForecast.map((day) => (
          <Panel key={day.day} subtle>
            <p className="text-sm font-medium text-white">{day.day}</p>
            <h3 className="mt-3 text-3xl font-semibold text-white">{day.temp}</h3>
            <p className="mt-2 text-sm text-white/52">{day.condition}</p>
          </Panel>
        ))}
      </div>
    </div>
  );
}
