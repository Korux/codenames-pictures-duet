import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// Replace with your own Firebase config


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA7hqLG0CytiOvsI0SkJ92kUbi_iDOSi9U",
  authDomain: "codenames-pictures-duet.firebaseapp.com",
  databaseURL: "https://codenames-pictures-duet-default-rtdb.firebaseio.com",
  projectId: "codenames-pictures-duet",
  storageBucket: "codenames-pictures-duet.firebasestorage.app",
  messagingSenderId: "56974541090",
  appId: "1:56974541090:web:21369824c650f4572c257b",
  measurementId: "G-P9GDXHCB1Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// Get a reference to the database service
export const database = getDatabase(app);



