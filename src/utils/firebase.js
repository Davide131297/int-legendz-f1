// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB6yEC7PhCjtMFjecgrQngETcBEuqfMeO0",
  authDomain: "f1-liga-int-legendz.firebaseapp.com",
  projectId: "f1-liga-int-legendz",
  storageBucket: "f1-liga-int-legendz.appspot.com",
  messagingSenderId: "517140205326",
  appId: "1:517140205326:web:400230f480f5db349cd15f",
  measurementId: "G-09JFYGPLLY",
  storageBucket: "gs://f1-liga-int-legendz.appspot.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Firestore initailisieren
const db = getFirestore();
export { db };