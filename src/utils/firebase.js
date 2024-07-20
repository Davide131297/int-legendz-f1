// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDsVmnRbZmDaJ4lv6vJEqVd4Q9IvxTF_v8",
  authDomain: "virtual-racing-league.firebaseapp.com",
  databaseURL: "https://virtual-racing-league-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "virtual-racing-league",
  storageBucket: "virtual-racing-league.appspot.com",
  messagingSenderId: "779165086251",
  appId: "1:779165086251:web:671967280e392e4efd306e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const realtimeDatabase = getDatabase(app);  // Initialisieren Sie die Realtime Database

// Firestore initailisieren
const db = getFirestore();
export { db, realtimeDatabase };