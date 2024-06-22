import "server-only";

import {
    getApps,
    getApp,
    initializeApp,
    applicationDefault,
} from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const appCount = getApps().length;

const app = appCount
    ? getApp()
    : initializeApp({
          credential: applicationDefault(),
      });

export const adminAuth = getAuth(app);
