import { motion } from "framer-motion";
import { useOS } from "../../state/OSProvider";
import { SystemIcon } from "../ui/SystemIcon";

export function AssistantOrb() {
  const { openApp } = useOS();
  return (
    <motion.button
      type="button"
      onClick={() => openApp("assistant")}
      className="group relative grid h-20 w-20 place-items-center rounded-full border border-white/18 bg-[rgba(var(--accent),.16)] shadow-glow backdrop-blur-2xl"
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.96 }}
      animate={{ y: [0, -5, 0] }}
      transition={{ duration: 3.2, repeat: Infinity }}
      aria-label="Open Assistant"
      title="Assistant"
    >
      <span className="absolute inset-2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,.34),transparent_64%)]" />
      <SystemIcon name="Sparkles" size={28} className="relative text-white" />
      <span className="absolute -bottom-7 text-xs text-white/48 opacity-0 transition group-hover:opacity-100">Assistant</span>
    </motion.button>
  );
}
