import { initializeApp } from "firebase/app";
import { initializeFirestore, persistentLocalCache } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCDUHf2BUyAVLKFopGbS1xeoz1tLwabDSw",
  authDomain: "padel-ded61.firebaseapp.com",
  projectId: "padel-ded61",
  storageBucket: "padel-ded61.firebasestorage.app",
  messagingSenderId: "632325799423",
  appId: "1:632325799423:web:7d8e5fe4adbd7a08727bca",
  measurementId: "G-EDZKTQ53F9"
};

const app = initializeApp(firebaseConfig);
export const db = initializeFirestore(app, {
  experimentalAutoDetectLongPolling: true,
});
export const auth = getAuth(app);
export const storage = getStorage(app);
export const analytics = typeof window !== 'undefined' && import.meta.env.PROD ? getAnalytics(app) : null;
