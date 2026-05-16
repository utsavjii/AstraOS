import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AmbientBackground } from "./AmbientBackground";
import { GlassButton } from "../ui/GlassButton";
import { SystemIcon } from "../ui/SystemIcon";
import { TextInput } from "../ui/TextInput";
import { useOS } from "../../state/OSProvider";
import { getAuthErrorMessage, useAuth } from "../../state/AuthProvider";

type AuthMode = "login" | "register";

export function LockScreen() {
  const { dispatch } = useOS();
  const { user, loading, configured, login, register, loginWithGoogle, logout } = useAuth();
  const [time, setTime] = useState(new Date());
  const [mode, setMode] = useState<AuthMode>("login");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const timer = window.setInterval(() => setTime(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const unlockDesktop = () => {
    setSubmitting(true);
    window.setTimeout(() => {
      dispatch({ type: "UNLOCK" });
    }, 420);
  };

  const resetFormError = () => setError("");

  const submitEmailAuth = async () => {
    if (!configured) return;
    setSubmitting(true);
    setError("");

    if (mode === "register") {
      if (!displayName.trim()) {
        setError("Enter your name to create an account.");
        setSubmitting(false);
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        setSubmitting(false);
        return;
      }
    }

    try {
      if (mode === "register") {
        await register(displayName.trim(), email.trim(), password);
      } else {
        await login(email.trim(), password);
      }
      unlockDesktop();
    } catch (authError) {
      setError(getAuthErrorMessage(authError));
      setSubmitting(false);
    }
  };

  const submitGoogleAuth = async () => {
    if (!configured) return;
    setSubmitting(true);
    setError("");
    try {
      await loginWithGoogle();
      unlockDesktop();
    } catch (authError) {
      setError(getAuthErrorMessage(authError));
      setSubmitting(false);
    }
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
            <SystemIcon name="Wifi" size={16} /> Firebase Auth
          </span>
        </div>
        <div className="grid w-full max-w-5xl items-center gap-6 lg:grid-cols-[1fr_460px]">
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
              Sign in with Firebase to restore your AstraOS desktop, apps, widgets, and local preferences.
            </p>
          </motion.div>
          <motion.div
            className="lock-card w-full rounded-[38px] border border-white/16 bg-white/10 p-6 shadow-glass backdrop-blur-3xl sm:p-8"
            initial={{ y: 24, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: submitting ? 0.985 : 1 }}
            transition={{ delay: 0.12 }}
          >
            <div className="text-center">
              <div className="mx-auto grid h-24 w-24 place-items-center rounded-[30px] border border-white/14 bg-[rgba(var(--accent),.18)] shadow-glow">
                <SystemIcon name={user ? "UserRound" : "KeyRound"} size={38} />
              </div>
              <p className="mt-5 text-xs uppercase tracking-[0.28em] text-white/42">
                {user ? "Firebase session" : "AstraOS Authentication"}
              </p>
              <h2 className="mt-2 text-3xl font-semibold text-white">
                {user?.displayName || user?.email || (mode === "register" ? "Create account" : "Sign in")}
              </h2>
              <p className="mt-2 text-sm text-white/50">
                {user ? user.email : "Email/password or Google sign-in"}
              </p>
            </div>

            {!configured ? (
              <div className="mt-7 rounded-[26px] border border-amber-300/20 bg-amber-400/12 p-5 text-sm leading-6 text-amber-50">
                Firebase is not configured. Add the `VITE_FIREBASE_*` values from `.env.example` to your local `.env` file or Vercel environment variables, then reload AstraOS.
              </div>
            ) : loading ? (
              <div className="mt-7 rounded-[26px] border border-white/10 bg-black/18 p-5 text-center text-sm text-white/56">
                Restoring Firebase session...
              </div>
            ) : user ? (
              <div className="mt-7 grid gap-3">
                <div className="rounded-[26px] border border-white/10 bg-black/18 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/38">Signed in as</p>
                  <p className="mt-2 break-all text-sm font-medium text-white">{user.email}</p>
                </div>
                <GlassButton className="w-full" variant="primary" icon="LogIn" onClick={unlockDesktop} disabled={submitting}>
                  Enter AstraOS
                </GlassButton>
                <GlassButton
                  className="w-full"
                  icon="Power"
                  onClick={async () => {
                    await logout();
                    setPassword("");
                    setConfirmPassword("");
                  }}
                  disabled={submitting}
                >
                  Logout
                </GlassButton>
              </div>
            ) : (
              <>
                <div className="mt-7 grid grid-cols-2 rounded-[22px] border border-white/10 bg-black/18 p-1">
                  {(["login", "register"] as AuthMode[]).map((nextMode) => (
                    <button
                      type="button"
                      key={nextMode}
                      onClick={() => {
                        setMode(nextMode);
                        setPassword("");
                        setConfirmPassword("");
                        setError("");
                      }}
                      className={`h-10 rounded-[18px] text-sm font-medium capitalize transition ${
                        mode === nextMode
                          ? "bg-[rgba(var(--accent),.22)] text-white shadow-glow"
                          : "text-white/52 hover:bg-white/8 hover:text-white"
                      }`}
                    >
                      {nextMode}
                    </button>
                  ))}
                </div>

                <div className="mt-4 grid gap-3 rounded-[26px] border border-white/10 bg-black/18 p-3">
                  {mode === "register" ? (
                    <label className="grid gap-2 text-left">
                      <span className="flex items-center gap-2 px-2 text-xs uppercase tracking-[0.2em] text-white/38">
                        <SystemIcon name="UserRound" size={14} />
                        Name
                      </span>
                      <TextInput
                        value={displayName}
                        onChange={(event) => {
                          setDisplayName(event.target.value);
                          resetFormError();
                        }}
                        type="text"
                        autoComplete="name"
                        placeholder="Your display name"
                        className="h-12 w-full"
                        autoFocus
                      />
                    </label>
                  ) : null}
                  <label className="grid gap-2 text-left">
                    <span className="flex items-center gap-2 px-2 text-xs uppercase tracking-[0.2em] text-white/38">
                      <SystemIcon name="Mail" size={14} />
                      Email
                    </span>
                    <TextInput
                      value={email}
                      onChange={(event) => {
                        setEmail(event.target.value);
                        resetFormError();
                      }}
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      className="h-12 w-full"
                      autoFocus={mode === "login"}
                    />
                  </label>
                  <label className="grid gap-2 text-left">
                    <span className="flex items-center gap-2 px-2 text-xs uppercase tracking-[0.2em] text-white/38">
                      <SystemIcon name="KeyRound" size={14} />
                      Password
                    </span>
                    <TextInput
                      value={password}
                      onChange={(event) => {
                        setPassword(event.target.value);
                        resetFormError();
                      }}
                      onKeyDown={(event) => event.key === "Enter" && mode === "login" && submitEmailAuth()}
                      type="password"
                      autoComplete={mode === "register" ? "new-password" : "current-password"}
                      placeholder={mode === "register" ? "At least 6 characters" : "Your password"}
                      className="h-12 w-full"
                    />
                  </label>
                  {mode === "register" ? (
                    <label className="grid gap-2 text-left">
                      <span className="flex items-center gap-2 px-2 text-xs uppercase tracking-[0.2em] text-white/38">
                        <SystemIcon name="Check" size={14} />
                        Confirm password
                      </span>
                      <TextInput
                        value={confirmPassword}
                        onChange={(event) => {
                          setConfirmPassword(event.target.value);
                          resetFormError();
                        }}
                        onKeyDown={(event) => event.key === "Enter" && submitEmailAuth()}
                        type="password"
                        autoComplete="new-password"
                        placeholder="Repeat password"
                        className="h-12 w-full"
                      />
                    </label>
                  ) : null}
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
                  <p className="mt-3 text-center text-sm text-white/42">
                    {mode === "register" ? "Your profile will be saved to Firestore." : "Firebase persistence keeps you signed in."}
                  </p>
                )}

                <div className="mt-6 grid gap-2">
                  <GlassButton
                    className="w-full"
                    variant="primary"
                    icon={mode === "register" ? "UserRound" : "LogIn"}
                    onClick={submitEmailAuth}
                    disabled={submitting || loading}
                  >
                    {submitting ? "Working" : mode === "register" ? "Register" : "Login"}
                  </GlassButton>
                  <GlassButton
                    className="w-full"
                    icon="Globe2"
                    onClick={submitGoogleAuth}
                    disabled={submitting || loading}
                  >
                    Google Sign-in
                  </GlassButton>
                </div>
              </>
            )}
          </motion.div>
        </div>
        <div className="grid w-full max-w-6xl grid-cols-1 gap-3 text-xs text-white/58 sm:grid-cols-3">
          <span>Battery 92%</span>
          <span className="text-center">Firebase persistence enabled</span>
          <span className="text-right">Ctrl+K after unlock</span>
        </div>
      </section>
    </motion.main>
  );
}
