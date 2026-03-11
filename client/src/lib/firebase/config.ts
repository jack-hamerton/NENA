import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// NOTE: Using dummy credentials as requested. 
// These will be replaced with real ones later.
const firebaseConfig = {
  apiKey: "dummy-api-key",
  authDomain: "nena-dummy.firebaseapp.com",
  projectId: "nena-dummy",
  storageBucket: "nena-dummy.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
