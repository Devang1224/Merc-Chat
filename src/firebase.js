import { initializeApp } from "firebase/app";
import { getAuth} from "firebase/auth"
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyDswwFrzzcs5E2FXnz87sRPgk445xP9tcQ",
  authDomain: "merc-chat.firebaseapp.com",
  projectId: "merc-chat",
  storageBucket: "merc-chat.appspot.com",
  messagingSenderId: "317464155078",
  appId: "1:317464155078:web:351b78171ad63a435318c7"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();