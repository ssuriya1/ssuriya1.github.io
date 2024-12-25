import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js';

const firebaseConfig = {
  apiKey: "AIzaSyBN99oCiUx3QxtqTyPo9idujEdUsQKPTJo",
  authDomain: "portfolio-52bbf.firebaseapp.com",
  projectId: "portfolio-52bbf",
  storageBucket: "portfolio-52bbf.firebasestorage.app",
  messagingSenderId: "1035007490056",
  appId: "1:1035007490056:web:fac8e6974a5178722ab9bd",
  measurementId: "G-LB5J9C1CVK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
