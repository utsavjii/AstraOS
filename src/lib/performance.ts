import type { PerformanceMode } from "../types/os";

export const performanceProfiles: Record<
  PerformanceMode,
  {
    label: string;
    description: string;
    particles: number;
    parallax: number;
    widgetInterval: number;
    hiddenWidgetInterval: number;
  }
> = {
  high: {
    label: "High",
    description: "Full particles, glow, blur, and animation density.",
    particles: 52,
    parallax: 22,
    widgetInterval: 1600,
    hiddenWidgetInterval: 12000,
  },
  balanced: {
    label: "Balanced",
    description: "Nearly identical visuals with lighter background work.",
    particles: 34,
    parallax: 14,
    widgetInterval: 2600,
    hiddenWidgetInterval: 18000,
  },
  battery: {
    label: "Battery Saver",
    description: "Keeps the look, but uses fewer repaints and simpler motion.",
    particles: 18,
    parallax: 6,
    widgetInterval: 5200,
    hiddenWidgetInterval: 30000,
  },
};

export function shouldReduceMotion(mode: PerformanceMode, reducedMotion: boolean) {
  if (reducedMotion) return true;
  if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return true;
  }
  return mode === "battery";
}
