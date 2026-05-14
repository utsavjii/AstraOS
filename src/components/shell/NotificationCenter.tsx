import { motion } from "framer-motion";
import { useEffect } from "react";
import { useOS } from "../../state/OSProvider";
import { GlassButton } from "../ui/GlassButton";
import { SystemIcon } from "../ui/SystemIcon";

interface NotificationCenterProps {
  onClose: () => void;
}

export function NotificationCenter({ onClose }: NotificationCenterProps) {
  const { state, dispatch, openApp } = useOS();

  useEffect(() => {
    dispatch({ type: "MARK_NOTIFICATIONS_READ" });
  }, [dispatch]);

  return (
    <motion.aside
      className="fixed right-4 top-4 z-[9000] flex h-[calc(100vh-120px)] w-[min(420px,calc(100vw-24px))] flex-col rounded-[34px] border border-white/16 bg-[#07111f]/74 p-4 shadow-glass backdrop-blur-3xl"
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 24 }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-white/42">Signal Center</p>
          <h2 className="text-xl font-semibold text-white">Notifications</h2>
        </div>
        <GlassButton icon="X" onClick={onClose}>Close</GlassButton>
      </div>
      <div className="mt-5 grid gap-3 overflow-auto">
        {state.notifications.length ? (
          state.notifications.map((notification) => (
            <button
              type="button"
              key={notification.id}
              onClick={() => notification.appId && openApp(notification.appId)}
              className="rounded-[24px] border border-white/10 bg-white/[0.07] p-4 text-left transition hover:bg-white/12"
            >
              <div className="flex items-start gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[rgba(var(--accent),.16)]">
                  <SystemIcon name="Bell" size={17} />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-white">{notification.title}</span>
                  <span className="mt-1 block text-sm leading-5 text-white/58">{notification.body}</span>
                  <span className="mt-2 block text-xs text-white/36">
                    {new Date(notification.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </span>
              </div>
            </button>
          ))
        ) : (
          <div className="rounded-[24px] border border-white/10 bg-white/[0.06] p-6 text-center text-sm text-white/54">
            Nothing waiting. Suspiciously calm.
          </div>
        )}
      </div>
    </motion.aside>
  );
}
