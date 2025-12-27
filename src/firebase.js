// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// 🔹 Your Firebase config using Environment Variables
const firebaseConfig = {
  apiKey: "AIzaSyDlfkXCU7Ndt6pB_s36_BisFogfdKCr-R8",
  authDomain: "vajra-retail.firebaseapp.com",
  projectId: "vajra-retail",
  storageBucket: "vajra-retail.firebasestorage.app",
  messagingSenderId: "841688994224",
  appId: "1:841688994224:web:e3f8c29d4b924476a94675"
};


// 🔹 Initialize Firebase
const app = initializeApp(firebaseConfig);

// 🔹 Export Auth and Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);