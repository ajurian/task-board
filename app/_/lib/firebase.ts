import { getApp, getApps, initializeApp } from "firebase/app";
import {
    browserPopupRedirectResolver,
    getAuth,
    initializeAuth,
    inMemoryPersistence,
} from "firebase/auth";

const appCount = getApps().length;

const app = appCount
    ? getApp("task-board")
    : initializeApp(
          {
              apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
              authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
              projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
              storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
              messagingSenderId:
                  process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
              appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
              measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID!,
          },
          "task-board"
      );

export const auth = appCount
    ? getAuth(app)
    : initializeAuth(app, {
          persistence: inMemoryPersistence,
          popupRedirectResolver:
              typeof window === "undefined"
                  ? undefined
                  : browserPopupRedirectResolver,
      });
