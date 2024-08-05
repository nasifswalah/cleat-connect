// Import the functions from the SDKs 
import { initializeApp } from "firebase/app";


// Web app's Firebase configuration
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