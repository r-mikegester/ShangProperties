// firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAI_8OGCM7Pg-2JQvu02QKKJAsMD-WfEjc",
  authDomain: "shang-properties-3631a.firebaseapp.com",
  projectId: "shang-properties-3631a",
  storageBucket: "shang-properties-3631a.firebasestorage.app",
  messagingSenderId: "907496955632",
  appId: "1:907496955632:web:cdfdcef73798f0797aac35",
  measurementId: "G-GZ9RZ3BNT7"
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
