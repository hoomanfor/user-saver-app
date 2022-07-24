import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyClWYAZl7uXmSUelYruajfmi7U0BZ4gg3Y",
  authDomain: "user-saver-app.firebaseapp.com",
  projectId: "user-saver-app",
  storageBucket: "user-saver-app.appspot.com",
  messagingSenderId: "149838616692",
  appId: "1:149838616692:web:991ab34e214b15aa9ed921",
  measurementId: "G-4W40L082P6",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
