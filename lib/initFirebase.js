import { initializeApp } from "firebase/app";
import { getAuth} from "firebase/auth" 
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore"
const firebaseConfig = {
  apiKey: "AIzaSyASrCyyfuHzCy_m5xG0Gb6L4p-0CSVXNmg",
  authDomain: "version2-3284e.firebaseapp.com",
  projectId: "version2-3284e",
  storageBucket: "version2-3284e.appspot.com",
  messagingSenderId: "540747009631",
  appId: "1:540747009631:web:21a1cad78ae8ca108e55ea",
  measurementId: "G-L8M13XZV01"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();
