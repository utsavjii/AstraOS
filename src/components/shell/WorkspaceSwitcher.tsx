import { cn } from "../../lib/cn";
import { useOS } from "../../state/OSProvider";

export function WorkspaceSwitcher() {
  const { state, setWorkspace } = useOS();
  return (
    <div className="pointer-events-auto relative z-10 flex items-center gap-2 rounded-full border border-white/12 bg-black/20 p-1 backdrop-blur-2xl">
      {state.workspaces.map((workspace, index) => (
        <button
          type="button"
          key={workspace}
          onPointerDown={(event) => event.stopPropagation()}
          onClick={() => setWorkspace(index)}
          className={cn(
            "h-8 rounded-full px-3 text-xs font-medium text-white/58 transition hover:bg-white/10 hover:text-white",
            index === state.currentWorkspace && "bg-white/16 text-white shadow-glow",
          )}
        >
          {workspace}
        </button>
      ))}
    </div>
  );
}
