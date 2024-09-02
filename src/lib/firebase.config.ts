import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyCyJPMVbCMv7-NSaxdqs_CS8QXoA2UjYUo",
  authDomain: "novis-42e0c.firebaseapp.com",
  projectId: "novis-42e0c",
  storageBucket: "novis-42e0c.appspot.com",
  messagingSenderId: "997592612280",
  appId: "1:997592612280:web:c4ed2fb86a6e946229e34d",
};
// const firebaseConfig = {
//   apiKey: process.env.FIREBASE_API_KEY,
//   authDomain: process.env.FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.FIREBASE_PROJECT_ID,
//   storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.FIREBASE_SENDER_ID,
//   appId: process.env.FIREBASE_APP_ID,
// };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
