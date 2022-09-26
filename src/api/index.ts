import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDYQIsMZ8IlZspCHTA6lxQ10jiU-PSwQrU",
  authDomain: "windy-fortress-363603.firebaseapp.com",
  projectId: "windy-fortress-363603",
  storageBucket: "windy-fortress-363603.appspot.com",
  messagingSenderId: "64610770224",
  appId: "1:64610770224:web:27c7d4697b0a38cfaebcf5",
  measurementId: "G-JLTYWVQSD7",
};

const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
