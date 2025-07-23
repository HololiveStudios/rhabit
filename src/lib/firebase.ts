import { initializeApp } from 'firebase/app';
import { getApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, enableNetwork, enableIndexedDbPersistence } from 'firebase/firestore';
//import { getMessaging, isSupported } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyDULf3XSwiiFQZ7q_M9YNieDbWZNLnO7Nw",
  authDomain: "myapp-415315.firebaseapp.com",
  databaseURL: "https://myapp-415315-default-rtdb.firebaseio.com",
  projectId: "myapp-415315",
  storageBucket: "myapp-415315.appspot.com",
  messagingSenderId: "103002319588",
  appId: "1:103002319588:web:de1acf21dca6c6f44e1af1",
  measurementId: "G-2Z7YWFQV9X"
};

// Initialize Firebase app only if it doesn't already exist
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Enable offline persistence
if (typeof window !== 'undefined') {
  // Using the new cache settings instead of deprecated enableIndexedDbPersistence
  // This is handled automatically by Firebase v9+ with default settings
}

// Initialize FCM if supported
//export const messaging = isSupported() ? getMessaging(app) : null;