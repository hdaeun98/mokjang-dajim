import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDw4kTXfXmTRElegSxqsAW1cuH8vc-xIWo",
  authDomain: "mokjang-dajimpt.firebaseapp.com",
  projectId: "mokjang-dajimpt",
  storageBucket: "mokjang-dajimpt.appspot.com",
  messagingSenderId: "374556420281",
  appId: "1:374556420281:web:4250293cea9020829a1368",
  measurementId: "G-1ZFCWY6E52"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);