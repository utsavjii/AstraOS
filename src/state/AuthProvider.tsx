import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  type User,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, authPersistenceReady, db, googleProvider, isFirebaseConfigured } from "../lib/firebase";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  configured: boolean;
  register: (displayName: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setLoading(false);
      return undefined;
    }

    let unsubscribe: (() => void) | undefined;
    authPersistenceReady
      .then(() => {
        unsubscribe = onAuthStateChanged(auth, (nextUser) => {
          setUser(nextUser);
          setLoading(false);
        });
      })
      .catch(() => {
        setLoading(false);
      });

    return () => unsubscribe?.();
  }, []);

  const ensureConfigured = useCallback(() => {
    if (!isFirebaseConfigured) {
      throw new Error("Firebase is not configured. Add your Vite Firebase env vars first.");
    }
  }, []);

  const register = useCallback(
    async (displayName: string, email: string, password: string) => {
      ensureConfigured();
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(credential.user, { displayName });
      await setDoc(doc(db, "users", credential.user.uid), {
        uid: credential.user.uid,
        displayName,
        email: credential.user.email,
        createdAt: serverTimestamp(),
      });
    },
    [ensureConfigured],
  );

  const login = useCallback(
    async (email: string, password: string) => {
      ensureConfigured();
      await signInWithEmailAndPassword(auth, email, password);
    },
    [ensureConfigured],
  );

  const loginWithGoogle = useCallback(async () => {
    ensureConfigured();
    const credential = await signInWithPopup(auth, googleProvider);
    const userRef = doc(db, "users", credential.user.uid);
    const existingProfile = await getDoc(userRef);
    await setDoc(
      userRef,
      {
        uid: credential.user.uid,
        displayName: credential.user.displayName ?? "",
        email: credential.user.email,
        ...(existingProfile.exists() ? { lastLoginAt: serverTimestamp() } : { createdAt: serverTimestamp() }),
        provider: "google",
      },
      { merge: true },
    );
  }, [ensureConfigured]);

  const logout = useCallback(async () => {
    if (!isFirebaseConfigured) return;
    await signOut(auth);
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      configured: isFirebaseConfigured,
      register,
      login,
      loginWithGoogle,
      logout,
    }),
    [loading, login, loginWithGoogle, logout, register, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}

export function getAuthErrorMessage(error: unknown) {
  const code = typeof error === "object" && error && "code" in error ? String(error.code) : "";
  switch (code) {
    case "auth/invalid-email":
      return "Enter a valid email address.";
    case "auth/weak-password":
      return "Use a stronger password with at least 6 characters.";
    case "auth/email-already-in-use":
      return "An account already exists for this email.";
    case "auth/user-not-found":
      return "No account was found for this email.";
    case "auth/wrong-password":
      return "The password is incorrect.";
    case "auth/invalid-credential":
      return "Email or password is incorrect.";
    case "auth/popup-closed-by-user":
      return "Google sign-in was closed before it finished.";
    default:
      return error instanceof Error ? error.message : "Authentication failed. Please try again.";
  }
}
