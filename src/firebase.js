import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCza4cd-rcxm1PBoOuQ4_PoRpUwiV2IOh0",
  authDomain: "novamart-86960.firebaseapp.com",
  projectId: "novamart-86960",
  storageBucket: "novamart-86960.firebasestorage.app",
  messagingSenderId: "726281196154",
  appId: "1:726281196154:web:417d8d55041543615161c3",
  measurementId: "G-D23PQSQXGV"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();