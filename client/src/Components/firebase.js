


import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// Replace these with your actual Firebase config details

const firebaseConfig = {
  apiKey: "AIzaSyCqbMtwmzysfn89KGZtSJgQ9A-YZ7jyv5s",
  authDomain: "lumora-32951.firebaseapp.com",
  projectId: "lumora-32951",
  storageBucket: "lumora-32951.firebasestorage.app",
  messagingSenderId: "441704832855",
  appId: "1:441704832855:web:9768350d67a3c595e8a812",
  measurementId: "G-E5HJPMMH6N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

export { auth };