import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  getDocs, 
  Firestore, 
  addDoc,
  doc, 
  setDoc,
  getDoc, 
  updateDoc,
  query,
  orderBy,
  limit,
  serverTimestamp
} from "firebase/firestore/lite";
import { getStorage, ref, uploadBytes  } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "ariaclubindia.firebaseapp.com",
  projectId: "ariaclubindia",
  storageBucket: "ariaclubindia.appspot.com",
  messagingSenderId: "481878676349",
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: "G-02FFMXYC6H"
};


const app = initializeApp(firebaseConfig);
const db: Firestore = getFirestore(app)
const imageDB = getStorage(app);


export  {app, db, collection, getDocs, addDoc,doc, setDoc, getDoc, updateDoc, imageDB, uploadBytes, ref, query, limit, orderBy, serverTimestamp};