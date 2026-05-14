import type { CalendarEvent, NoteItem, NotificationItem } from "../types/os";

const today = new Date();
const isoToday = today.toISOString().slice(0, 10);

export const browserPages = {
  "astra://home": {
    title: "Astra Search",
    body: "A private local search surface for files, notes, apps, and simulated web results.",
    cards: ["AstraOS release notes", "Orbital UI patterns", "Local-first productivity"],
  },
  "astra://news": {
    title: "Signal Dispatch",
    body: "A calm feed of simulated technology updates, weather signals, and workspace activity.",
    cards: ["Interface lab opens", "Ambient theme pack ships", "Offline mode healthy"],
  },
  "astra://store": {
    title: "Astra Store",
    body: "Installable modules are mocked locally so the app feels real without remote services.",
    cards: ["Synth Studio", "Orbit Maps", "Focus Deck"],
  },
};

export const initialNotes: NoteItem[] = [
  {
    id: "n-1",
    title: "First launch checklist",
    body: "Open Settings, switch wallpapers, try the command palette, then drag windows to the screen edges for snap layouts.",
    pinned: true,
    updatedAt: new Date().toISOString(),
  },
  {
    id: "n-2",
    title: "Design tone",
    body: "Premium, spatial, translucent, fast. Avoid decorative clutter. Every panel should feel usable.",
    pinned: false,
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

export const initialEvents: CalendarEvent[] = [
  { id: "e-1", title: "Workspace review", date: isoToday, time: "10:30", accent: "#7df3ff" },
  { id: "e-2", title: "Theme polish", date: isoToday, time: "14:00", accent: "#ff4fd8" },
  {
    id: "e-3",
    title: "Offline QA",
    date: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
    time: "09:15",
    accent: "#8b5cf6",
  },
];

export const initialNotifications: NotificationItem[] = [
  {
    id: "notif-1",
    title: "AstraOS initialized",
    body: "Your glass workspace is ready. Preferences will stay local to this browser.",
    appId: "settings",
    createdAt: new Date().toISOString(),
    read: false,
  },
];

export const weatherForecast = [
  { day: "Now", temp: "24°C", condition: "Clear", detail: "Low wind, high visibility" },
  { day: "Fri", temp: "26°C", condition: "Haze", detail: "Soft light all day" },
  { day: "Sat", temp: "23°C", condition: "Rain", detail: "Short evening shower" },
  { day: "Sun", temp: "28°C", condition: "Sun", detail: "Warm and bright" },
];

export const musicTracks = [
  { id: "m-1", title: "Glass Horizon", artist: "Astra Labs", length: "3:42", color: "#7df3ff" },
  { id: "m-2", title: "Neon Rain", artist: "Signal Choir", length: "4:12", color: "#ff4fd8" },
  { id: "m-3", title: "Orbital Sleep", artist: "Low Earth", length: "5:08", color: "#8b5cf6" },
];

export const videoItems = [
  { id: "v-1", title: "Aurora Desktop Tour", duration: "02:18", color: "#7df3ff" },
  { id: "v-2", title: "Window Snap Study", duration: "01:46", color: "#8b5cf6" },
  { id: "v-3", title: "Spatial Light Mode", duration: "03:04", color: "#f59e0b" },
];

export const storeItems = [
  { id: "s-1", name: "Synth Studio", tag: "Audio", rating: "4.9", installed: false },
  { id: "s-2", name: "Orbit Maps", tag: "Navigation", rating: "4.7", installed: false },
  { id: "s-3", name: "Focus Deck", tag: "Productivity", rating: "4.8", installed: true },
  { id: "s-4", name: "Photon Paint", tag: "Creative", rating: "4.6", installed: false },
];
