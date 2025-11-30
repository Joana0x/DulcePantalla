// lib/firebase-client.ts
import { getApps, initializeApp } from "firebase/app";
import {
  browserLocalPersistence,
  browserSessionPersistence,
  getAuth,
  setPersistence,
  GoogleAuthProvider,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore"; 

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Inicializa la app
export const app = getApps().length
  ? getApps()[0]!
  : initializeApp(firebaseConfig);

// Auth
export const auth = getAuth(app);

// Firestore (db)
export const db = getFirestore(app);

// Configurar persistencia según "remember"
export async function configureAuthPersistence(remember: boolean) {
  await setPersistence(
    auth,
    remember ? browserLocalPersistence : browserSessionPersistence
  );
}

// Provider de Google
export const provider = new GoogleAuthProvider();
