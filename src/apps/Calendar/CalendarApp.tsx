import { useMemo, useState } from "react";
import { GlassButton } from "../../components/ui/GlassButton";
import { TextInput } from "../../components/ui/TextInput";
import { accentColors } from "../../data/wallpapers";
import { useOS } from "../../state/OSProvider";
import type { AppComponentProps } from "../../types/os";

export default function CalendarApp(_: AppComponentProps) {
  const { state, addEvent, deleteEvent } = useOS();
  const today = new Date();
  const [title, setTitle] = useState("");
  const days = useMemo(() => Array.from({ length: 35 }, (_, index) => new Date(today.getFullYear(), today.getMonth(), index - today.getDay() + 1)), [today]);

  const create = () => {
    if (!title.trim()) return;
    addEvent({
      id: `event-${Date.now()}`,
      title,
      date: today.toISOString().slice(0, 10),
      time: "12:00",
      accent: accentColors[state.events.length % accentColors.length],
    });
    setTitle("");
  };

  return (
    <div className="grid h-full grid-cols-[1fr_260px] gap-4 p-4 max-md:grid-cols-1">
      <main className="rounded-[30px] border border-white/10 bg-white/[0.055] p-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-white">{today.toLocaleDateString([], { month: "long", year: "numeric" })}</h2>
          <span className="text-sm text-white/48">{state.events.length} events</span>
        </div>
        <div className="grid grid-cols-7 gap-2 text-center text-xs text-white/42">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => <span key={day}>{day}</span>)}
        </div>
        <div className="mt-2 grid grid-cols-7 gap-2">
          {days.map((day) => {
            const iso = day.toISOString().slice(0, 10);
            const events = state.events.filter((event) => event.date === iso);
            const isToday = iso === today.toISOString().slice(0, 10);
            return (
              <div key={iso} className={`min-h-20 rounded-2xl border p-2 ${isToday ? "border-[rgba(var(--accent),.45)] bg-[rgba(var(--accent),.14)]" : "border-white/8 bg-black/12"}`}>
                <span className="text-sm text-white/72">{day.getDate()}</span>
                {events.map((event) => <div key={event.id} className="mt-1 truncate rounded-lg px-1.5 py-1 text-[10px] text-white" style={{ background: `${event.accent}66` }}>{event.title}</div>)}
              </div>
            );
          })}
        </div>
      </main>
      <aside className="rounded-[30px] border border-white/10 bg-black/14 p-4">
        <h3 className="font-semibold text-white">Today</h3>
        <div className="mt-3 flex gap-2">
          <TextInput value={title} onChange={(event) => setTitle(event.target.value)} placeholder="New event" className="min-w-0 flex-1" />
          <GlassButton icon="Plus" onClick={create} />
        </div>
        <div className="mt-4 space-y-2">
          {state.events.map((event) => (
            <button type="button" key={event.id} onClick={() => deleteEvent(event.id)} className="w-full rounded-2xl border border-white/8 bg-white/[0.055] p-3 text-left transition hover:bg-white/10">
              <span className="block text-sm font-medium text-white">{event.title}</span>
              <span className="text-xs text-white/44">{event.date} · {event.time}</span>
            </button>
          ))}
        </div>
      </aside>
    </div>
  );
}
