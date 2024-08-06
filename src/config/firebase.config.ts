// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDaXHqicJib_EKLOG_-YXH0PVjJ2pDSKkg",
  authDomain: "novis-57856.firebaseapp.com",
  projectId: "novis-57856",
  storageBucket: "novis-57856.appspot.com",
  messagingSenderId: "394380328573",
  appId: "1:394380328573:web:b75684a3526254191b7b14",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const database = getDatabase(app);
