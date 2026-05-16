import { initializeApp, getApps, type FirebaseOptions } from "firebase/app";
import {
  browserLocalPersistence,
  getAuth,
  GoogleAuthProvider,
  setPersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID || "astra-os-5e622";
const envApiKey = import.meta.env.VITE_FIREBASE_API_KEY;
const envMessagingSenderId = import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID;
const envAppId = import.meta.env.VITE_FIREBASE_APP_ID;

export const firebaseConfig: FirebaseOptions = {
  apiKey: envApiKey || "missing-firebase-api-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || `${projectId}.firebaseapp.com`,
  projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || `${projectId}.appspot.com`,
  messagingSenderId: envMessagingSenderId || "000000000000",
  appId: envAppId || "missing-firebase-app-id",
};

export const isFirebaseConfigured = Boolean(envApiKey && envAppId && envMessagingSenderId);

export const firebaseApp = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
export const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: "select_account",
});

export const authPersistenceReady = setPersistence(auth, browserLocalPersistence);
