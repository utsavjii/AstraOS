import { AnimatePresence } from "framer-motion";
import { useOS } from "../../state/OSProvider";
import { WindowFrame } from "./WindowFrame";

export function WindowManager() {
  const { state } = useOS();
  const visible = state.windows.filter(
    (windowState) => windowState.workspaceId === state.currentWorkspace && !windowState.minimized,
  );
  return (
    <div className="pointer-events-none absolute inset-0 z-40">
      <AnimatePresence>
        {visible.map((windowState) => (
          <WindowFrame key={windowState.id} windowState={windowState} />
        ))}
      </AnimatePresence>
    </div>
  );
}
