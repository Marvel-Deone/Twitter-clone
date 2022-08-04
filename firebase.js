// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDgK9wSsIlIXDXrV_GRgffAjYVQUDhsjO8",
    authDomain: "social-media-da0ab.firebaseapp.com",
    projectId: "social-media-da0ab",
    storageBucket: "social-media-da0ab.appspot.com",
    messagingSenderId: "423307902444",
    appId: "1:423307902444:web:a929ed955b82d9f74214c9"
  };

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore();
const storage = getStorage();

export default app;
export { db, storage };
