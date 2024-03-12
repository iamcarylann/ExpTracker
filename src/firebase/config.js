import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyAnqjc7s_YRR0mdBILURKXaevDGhLMWrLw",
  authDomain: "expensestracker-7fccd.firebaseapp.com",
  projectId: "expensestracker-7fccd",
  storageBucket: "expensestracker-7fccd.appspot.com",
  messagingSenderId: "124197026836",
  appId: "1:124197026836:web:16d39cc37e916222f2bb01",
  measurementId: "G-N4CMQX1Y70"
};


initializeApp(firebaseConfig);

const db = getFirestore();

export default db