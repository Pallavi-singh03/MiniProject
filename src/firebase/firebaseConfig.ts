// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"; 
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCKE9S80pXorAxSXro0lY19Ip73s3To_mA",
  authDomain: "tenmineats.firebaseapp.com",
  projectId: "tenmineats",
  storageBucket: "tenmineats.firebasestorage.app",
  messagingSenderId: "395517764107",
  appId: "1:395517764107:web:63ba9a34ce60fedf161d0e"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

//Export Firebase Auth instance
export const auth = getAuth(app);
export default app;
