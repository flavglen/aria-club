import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, Firestore, addDoc,doc, setDoc, getDoc, updateDoc} from 'firebase/firestore/lite';

const firebaseConfig = {
  apiKey: "AIzaSyAFCafbtG8D3tJEI-2QitNGAkyAWxKksQo",
  authDomain: "ariaclubindia.firebaseapp.com",
  projectId: "ariaclubindia",
  storageBucket: "ariaclubindia.appspot.com",
  messagingSenderId: "481878676349",
  appId: "1:481878676349:web:880c862370c5b457def214",
  measurementId: "G-02FFMXYC6H"
};


const app = initializeApp(firebaseConfig);
const db: Firestore = getFirestore(app)


export  {app, db, collection, getDocs, addDoc,doc, setDoc, getDoc, updateDoc};


