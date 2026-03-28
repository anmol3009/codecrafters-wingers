import { initializeApp, getApp, getApps } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

// Initialize Firebase with safety check
const app = (function () {
  try {
    if (getApps().length > 0) return getApp();
    if (!firebaseConfig.apiKey || firebaseConfig.apiKey === 'your-api-key') {
      console.warn('Firebase API key is missing or dummy. Auth will be disabled.');
      return null;
    }
    return initializeApp(firebaseConfig);
  } catch (err) {
    console.error('Firebase initialization failed:', err);
    return null;
  }
})();

// Initialize Auth
export const auth = app ? getAuth(app) : null;
export const googleProvider = new GoogleAuthProvider();
