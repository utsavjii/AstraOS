import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AmbientBackground } from "./AmbientBackground";
import { GlassButton } from "../ui/GlassButton";
import { SystemIcon } from "../ui/SystemIcon";
import { TextInput } from "../ui/TextInput";
import { useOS } from "../../state/OSProvider";

export function LockScreen() {
  const { dispatch } = useOS();
  const [time, setTime] = useState(new Date());
  const [credential, setCredential] = useState("");
  const [error, setError] = useState("");
  const [signingIn, setSigningIn] = useState(false);

  useEffect(() => {
    const timer = window.setInterval(() => setTime(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const completeLogin = () => {
    setSigningIn(true);
    window.setTimeout(() => {
      dispatch({ type: "UNLOCK" });
    }, 520);
  };

  const submitLogin = () => {
    const value = credential.trim().toLowerCase();
    if (value === "2026" || value === "astra" || value === "demo") {
      setError("");
      completeLogin();
      return;
    }
    setError("Use PIN 2026, password astra, or continue as guest.");
  };

  return (
    <motion.main
      className="relative min-h-screen overflow-hidden text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <AmbientBackground />
      <section className="relative z-10 flex min-h-screen flex-col items-center justify-between px-6 py-10">
        <div className="flex w-full max-w-6xl items-center justify-between text-sm text-white/72">
          <span>AstraOS secure session</span>
          <span className="inline-flex items-center gap-2">
            <SystemIcon name="Wifi" size={16} /> Local Mesh
          </span>
        </div>
        <div className="grid w-full max-w-5xl items-center gap-6 lg:grid-cols-[1fr_440px]">
          <motion.div
            className="hidden text-left lg:block"
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.08 }}
          >
            <p className="text-sm uppercase tracking-[0.32em] text-white/48">
              {time.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
            </p>
            <h1 className="mt-4 font-display text-8xl font-semibold tracking-normal text-white">
              {time.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}
            </h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-white/62">
              Sign in to restore your desktop, apps, widgets, and local preferences.
            </p>
          </motion.div>
          <motion.div
            className="lock-card w-full rounded-[38px] border border-white/16 bg-white/10 p-6 text-center shadow-glass backdrop-blur-3xl sm:p-8"
            initial={{ y: 24, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: signingIn ? 0.985 : 1 }}
            transition={{ delay: 0.12 }}
          >
            <div className="mx-auto grid h-24 w-24 place-items-center rounded-[30px] border border-white/14 bg-[rgba(var(--accent),.18)] shadow-glow">
              <SystemIcon name="UserRound" size={38} />
            </div>
            <p className="mt-5 text-xs uppercase tracking-[0.28em] text-white/42">Local account</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">Nova Patel</h2>
            <p className="mt-2 text-sm text-white/50">Administrator · AstraOS Prime</p>

            <div className="mt-7 rounded-[26px] border border-white/10 bg-black/18 p-3">
              <label className="mb-2 flex items-center gap-2 px-2 text-left text-xs uppercase tracking-[0.2em] text-white/38">
                <SystemIcon name="KeyRound" size={14} />
                PIN or password
              </label>
              <TextInput
                value={credential}
                onChange={(event) => {
                  setCredential(event.target.value);
                  setError("");
                }}
                onKeyDown={(event) => event.key === "Enter" && submitLogin()}
                type="password"
                inputMode="text"
                autoComplete="current-password"
                placeholder="PIN 2026 or password astra"
                className="h-12 w-full text-center text-base tracking-[0.28em]"
                autoFocus
              />
              <div className="mt-3 flex justify-center gap-2">
                {Array.from({ length: 4 }, (_, index) => (
                  <span
                    key={index}
                    className={`h-2.5 w-2.5 rounded-full transition ${
                      credential.length > index ? "bg-[rgb(var(--accent))] shadow-glow" : "bg-white/18"
                    }`}
                  />
                ))}
              </div>
            </div>

            {error ? (
              <motion.p
                className="mt-3 rounded-2xl border border-rose-300/20 bg-rose-500/14 px-3 py-2 text-sm text-rose-100"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {error}
              </motion.p>
            ) : (
              <p className="mt-3 text-sm text-white/42">Demo credentials are local only.</p>
            )}

            <div className="mt-6 grid grid-cols-[1fr_auto] gap-2">
              <GlassButton
                className="w-full"
                variant="primary"
                icon="LogIn"
                onClick={submitLogin}
                disabled={signingIn}
              >
                {signingIn ? "Signing in" : "Sign in"}
              </GlassButton>
              <GlassButton
                icon="Fingerprint"
                aria-label="Use biometric demo"
                title="Use biometric demo"
                onClick={completeLogin}
                disabled={signingIn}
              />
            </div>
            <button
              type="button"
              onClick={completeLogin}
              className="mt-4 text-sm font-medium text-white/52 transition hover:text-white"
              disabled={signingIn}
            >
              Continue as guest
            </button>
          </motion.div>
        </div>
        <div className="grid w-full max-w-6xl grid-cols-1 gap-3 text-xs text-white/58 sm:grid-cols-3">
          <span>Battery 92%</span>
          <span className="text-center">Offline shell cached</span>
          <span className="text-right">Ctrl+K after unlock</span>
        </div>
      </section>
    </motion.main>
  );
}
