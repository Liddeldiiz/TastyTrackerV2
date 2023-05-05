import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBgTw0a2GhYWwnXyRbeXEFJ73DB0MoQrrU",
  authDomain: "tasty-tracker-v2.firebaseapp.com",
  projectId: "tasty-tracker-v2",
  storageBucket: "tasty-tracker-v2.appspot.com",
  messagingSenderId: "745675201514",
  appId: "1:745675201514:web:627ad5881183df64fd7093",
  measurementId: "G-JW4LCGXSQQ"

};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const storage = getStorage(app);

export const db = getFirestore(app);