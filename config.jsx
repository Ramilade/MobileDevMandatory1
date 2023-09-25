// Import necessary Firebase SDKs
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Firebase configuration details
const firebaseConfig = {
  apiKey: "AIzaSyAaHKnzdIfF6lWJgkbXJ74N0QFGvEBgKHo",
  authDomain: "mandatory1-1e004.firebaseapp.com",
  projectId: "mandatory1-1e004",
  storageBucket: "mandatory1-1e004.appspot.com",
  messagingSenderId: "207000403634",
  appId: "1:207000403634:web:369d64b4626075d643d3ab"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firestore and export it
export const db = getFirestore(app);
