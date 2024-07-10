// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.FB_API_KEY,
  authDomain: "cleat-conect.firebaseapp.com",
  projectId: "cleat-conect",
  storageBucket: "cleat-conect.appspot.com",
  messagingSenderId: "936665708992",
  appId: "1:936665708992:web:2a33d3859f13e9667c7025"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);