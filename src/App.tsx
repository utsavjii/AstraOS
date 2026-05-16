import { useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { OSProvider, useOS } from "./state/OSProvider";
import { AuthProvider } from "./state/AuthProvider";
import { BootScreen } from "./components/shell/BootScreen";
import { Desktop } from "./components/shell/Desktop";
import { LockScreen } from "./components/shell/LockScreen";
import { playStartupTone } from "./lib/sound";

function AstraRoot() {
  const { state, dispatch } = useOS();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      dispatch({ type: "BOOT_COMPLETE" });
      playStartupTone(state.settings.startupSound);
    }, 2100);
    return () => window.clearTimeout(timer);
  }, [dispatch, state.settings.startupSound]);

  useEffect(() => {
    document.documentElement.dataset.theme =
      state.settings.theme === "system"
        ? window.matchMedia("(prefers-color-scheme: light)").matches
          ? "light"
          : "dark"
        : state.settings.theme;
    document.documentElement.style.setProperty("--accent", hexToRgb(state.settings.accent));
    document.documentElement.style.setProperty("--accent-hex", state.settings.accent);
  }, [state.settings.accent, state.settings.theme]);

  return (
    <AnimatePresence mode="wait">
      {!state.booted ? (
        <BootScreen key="boot" />
      ) : state.locked ? (
        <LockScreen key="lock" />
      ) : (
        <Desktop key="desktop" />
      )}
    </AnimatePresence>
  );
}

function hexToRgb(hex: string) {
  const value = hex.replace("#", "");
  const r = parseInt(value.slice(0, 2), 16) || 125;
  const g = parseInt(value.slice(2, 4), 16) || 243;
  const b = parseInt(value.slice(4, 6), 16) || 255;
  return `${r} ${g} ${b}`;
}

export default function App() {
  return (
    <AuthProvider>
      <OSProvider>
        <AstraRoot />
      </OSProvider>
    </AuthProvider>
  );
}
