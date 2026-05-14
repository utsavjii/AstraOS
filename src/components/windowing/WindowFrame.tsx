import { lazy, Suspense, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { getApp } from "../../data/apps";
import { usePointerDrag } from "../../hooks/usePointerDrag";
import { cn } from "../../lib/cn";
import { useOS } from "../../state/OSProvider";
import type { SnapState, WindowState } from "../../types/os";
import { SystemIcon } from "../ui/SystemIcon";
import { SnapOverlay } from "./SnapOverlay";

export function WindowFrame({ windowState }: { windowState: WindowState }) {
  const { closeWindow, focusWindow, minimizeWindow, updateWindow } = useOS();
  const app = getApp(windowState.appId)!;
  const AppComponent = useMemo(() => lazy(app.loader), [app]);
  const [snapPreview, setSnapPreview] = useState<SnapState>("none");
  const livePosition = useRef(windowState.position);
  const liveSize = useRef(windowState.size);

  const normalBounds = () => ({
    position: windowState.restoreBounds?.position ?? windowState.position,
    size: windowState.restoreBounds?.size ?? windowState.size,
  });

  const restoreWindowBounds = () => {
    updateWindow(windowState.id, {
      position: windowState.restoreBounds?.position ?? { x: 92, y: 86 },
      size: windowState.restoreBounds?.size ?? app.defaultSize,
      restoreBounds: undefined,
      snap: "none",
      maximized: false,
    });
  };

  const applySnap = (target: SnapState) => {
    if (target === "none") {
      restoreWindowBounds();
      return;
    }
    const width = window.innerWidth;
    const height = window.innerHeight;
    const top = 62;
    const bottom = 96;
    const usableHeight = height - top - bottom;
    const patch =
      target === "left"
        ? { position: { x: 14, y: top }, size: { width: width / 2 - 22, height: usableHeight }, restoreBounds: normalBounds(), snap: target, maximized: false }
        : target === "right"
          ? { position: { x: width / 2 + 8, y: top }, size: { width: width / 2 - 22, height: usableHeight }, restoreBounds: normalBounds(), snap: target, maximized: false }
          : target === "bottom"
            ? { position: { x: 14, y: Math.round(height / 2) }, size: { width: width - 28, height: height / 2 - bottom }, restoreBounds: normalBounds(), snap: target, maximized: false }
            : { position: { x: 14, y: top }, size: { width: width - 28, height: usableHeight }, restoreBounds: normalBounds(), snap: "maximized" as SnapState, maximized: true };
    updateWindow(windowState.id, patch);
  };

  const detectSnap = (event: PointerEvent): SnapState => {
    if (event.clientY < 44) return "maximized";
    if (event.clientX < 32) return "left";
    if (event.clientX > window.innerWidth - 32) return "right";
    if (event.clientY > window.innerHeight - 54) return "bottom";
    return "none";
  };

  const drag = usePointerDrag({
    onStart: () => {
      focusWindow(windowState.id);
      livePosition.current = windowState.position;
    },
    onMove: (delta, event) => {
      if (windowState.maximized) return;
      setSnapPreview(detectSnap(event));
      livePosition.current = {
        x: Math.max(-windowState.size.width + 140, Math.min(window.innerWidth - 90, livePosition.current.x + delta.x)),
        y: Math.max(8, Math.min(window.innerHeight - 92, livePosition.current.y + delta.y)),
      };
      updateWindow(windowState.id, {
        position: livePosition.current,
        snap: "none",
      });
    },
    onEnd: (event) => {
      const target = detectSnap(event);
      setSnapPreview("none");
      if (target !== "none") applySnap(target);
    },
  });

  const resize = usePointerDrag({
    onStart: () => {
      focusWindow(windowState.id);
      liveSize.current = windowState.size;
    },
    onMove: (delta) => {
      liveSize.current = {
        width: Math.max(app.minSize.width, liveSize.current.width + delta.x),
        height: Math.max(app.minSize.height, liveSize.current.height + delta.y),
      };
      updateWindow(windowState.id, {
        size: liveSize.current,
        snap: "none",
        maximized: false,
      });
    },
  });

  return (
    <>
      <SnapOverlay target={snapPreview} />
      <motion.section
        className={cn("window-panel pointer-events-auto absolute flex min-w-0 flex-col overflow-hidden rounded-[28px] border border-white/18 bg-[#07111f]/64 shadow-glass backdrop-blur-3xl", windowState.maximized && "rounded-[24px]")}
        style={{
          left: windowState.position.x,
          top: windowState.position.y,
          width: windowState.size.width,
          height: windowState.size.height,
          zIndex: windowState.zIndex,
        }}
        initial={{ opacity: 0, scale: 0.94, y: 18 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ type: "spring", stiffness: 420, damping: 34 }}
        onPointerDown={() => focusWindow(windowState.id)}
      >
        <header
          onPointerDown={drag}
          onDoubleClick={() => applySnap(windowState.maximized ? "none" : "maximized")}
          className="flex h-12 shrink-0 cursor-grab items-center gap-3 border-b border-white/10 bg-white/[0.055] pl-4 pr-1 active:cursor-grabbing"
        >
          <div className="flex min-w-0 items-center gap-2 text-sm font-medium text-white/78">
            <SystemIcon name={app.icon} size={16} />
            <span className="truncate">{windowState.title}</span>
          </div>
          <div className="ml-auto hidden items-center gap-1 rounded-xl border border-white/10 bg-black/14 p-1 sm:flex">
            {(["left", "right", "bottom", "maximized"] as SnapState[]).map((target) => (
              <button
                type="button"
                key={target}
                aria-label={`Snap ${target}`}
                title={`Snap ${target}`}
                onPointerDown={(event) => event.stopPropagation()}
                onClick={() => applySnap(target)}
                className="grid h-7 w-7 place-items-center rounded-lg text-white/48 transition hover:bg-white/12 hover:text-white"
              >
                <SystemIcon name={target === "maximized" ? "Maximize2" : target === "bottom" ? "PanelRight" : "Square"} size={13} />
              </button>
            ))}
          </div>
          <div className="ml-1 flex h-full shrink-0 items-center">
            <button
              type="button"
              aria-label="Minimize"
              title="Minimize"
              onPointerDown={(event) => event.stopPropagation()}
              onDoubleClick={(event) => event.stopPropagation()}
              onClick={() => minimizeWindow(windowState.id)}
              className="grid h-11 w-11 place-items-center rounded-xl text-white/58 transition hover:bg-white/10 hover:text-white"
            >
              <SystemIcon name="Minus" size={16} />
            </button>
            <button
              type="button"
              aria-label={windowState.maximized ? "Restore" : "Maximize"}
              title={windowState.maximized ? "Restore" : "Maximize"}
              onPointerDown={(event) => event.stopPropagation()}
              onDoubleClick={(event) => event.stopPropagation()}
              onClick={() => applySnap(windowState.maximized ? "none" : "maximized")}
              className="grid h-11 w-11 place-items-center rounded-xl text-white/58 transition hover:bg-white/10 hover:text-white"
            >
              <SystemIcon name={windowState.maximized ? "Copy" : "Square"} size={16} />
            </button>
            <button
              type="button"
              aria-label="Close"
              title="Close"
              onPointerDown={(event) => event.stopPropagation()}
              onDoubleClick={(event) => event.stopPropagation()}
              onClick={() => closeWindow(windowState.id)}
              className="grid h-11 w-11 place-items-center rounded-xl text-white/58 transition hover:bg-rose-500/82 hover:text-white"
            >
              <SystemIcon name="X" size={17} />
            </button>
          </div>
        </header>
        <div className="min-h-0 flex-1 overflow-hidden">
          <Suspense fallback={<div className="grid h-full place-items-center text-sm text-white/54">Loading {app.name}...</div>}>
            <AppComponent windowId={windowState.id} />
          </Suspense>
        </div>
        {!windowState.maximized ? (
          <button
            type="button"
            aria-label="Resize window"
            title="Resize"
            onPointerDown={resize}
            className="absolute bottom-1 right-1 h-6 w-6 cursor-nwse-resize rounded-br-[24px] text-white/30"
          >
            <SystemIcon name="Expand" size={16} />
          </button>
        ) : null}
      </motion.section>
    </>
  );
}
