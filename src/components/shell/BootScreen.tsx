import { motion } from "framer-motion";

export function BootScreen() {
  return (
    <motion.main
      className="grid min-h-screen place-items-center overflow-hidden bg-[#050914] text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.45 }}
    >
      <div className="boot-grid" />
      <motion.div
        className="relative z-10 flex flex-col items-center gap-7"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <motion.div
          className="grid h-28 w-28 place-items-center rounded-[34px] border border-cyan-200/30 bg-white/10 shadow-glow backdrop-blur-2xl"
          animate={{ boxShadow: ["0 0 30px rgba(125,243,255,.25)", "0 0 80px rgba(255,79,216,.32)", "0 0 30px rgba(125,243,255,.25)"] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        >
          <div className="h-14 w-14 rounded-full border-[6px] border-cyan-100/90 border-t-fuchsia-300" />
        </motion.div>
        <div className="text-center">
          <h1 className="font-display text-4xl font-semibold tracking-normal">AstraOS</h1>
          <p className="mt-2 text-sm uppercase tracking-[0.32em] text-cyan-100/60">initializing spatial shell</p>
        </div>
        <div className="h-1.5 w-72 overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full rounded-full bg-[linear-gradient(90deg,#7df3ff,#ff4fd8,#8b5cf6)]"
            initial={{ width: "8%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.9, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </motion.main>
  );
}
