// Firebase Imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


// YOUR FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyABZKs8MP6NwOjgnKB7qNdh11FOftnDxCk",
  authDomain: "great-outdoors-user-accounts.firebaseapp.com",
  projectId: "great-outdoors-user-accounts",
  storageBucket: "great-outdoors-user-accounts.firebasestorage.app",
  messagingSenderId: "703767712918",
  appId: "1:703767712918:web:e759ca183f0db213bc5eb7",
  measurementId: "G-496BHP4EK8"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


// SIGN UP
window.signUp = function () {

  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;

  createUserWithEmailAndPassword(auth, email, password)
    .then(() => {
      alert("Account Created!");
      window.location.href = "dashboard.html";
    })
    .catch((error) => {
      alert(error.message);
    });
};


// LOGIN
window.login = function () {

  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      alert("Logged In!");
      window.location.href = "dashboard.html";
    })
    .catch((error) => {
      alert(error.message);
    });
};


// LOGOUT
window.logout = function () {

  signOut(auth)
    .then(() => {
      alert("Logged Out");
      window.location.href = "login.html";
    });
};


// Protect Dashboard
onAuthStateChanged(auth, (user) => {

  if (
    window.location.pathname.includes("dashboard.html")
    && !user
  ) {
    window.location.href = "login.html";
  }
});