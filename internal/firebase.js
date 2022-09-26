const { initializeApp } = require("firebase/app");
const { getFirestore } = require("firebase/firestore");

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: "windy-fortress-363603.firebaseapp.com",
  projectId: "windy-fortress-363603",
  storageBucket: "windy-fortress-363603.appspot.com",
  messagingSenderId: "64610770224",
  appId: "1:64610770224:web:27c7d4697b0a38cfaebcf5",
  measurementId: "G-JLTYWVQSD7",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

module.exports = {
  db,
};
