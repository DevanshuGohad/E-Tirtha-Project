// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCuDK3fvTd3a-44b_1AjAmErxCWISoZFEI",
    authDomain: "login-form-e2d41.firebaseapp.com",
    projectId: "login-form-e2d41",
    storageBucket: "login-form-e2d41.firebasestorage.app",
    messagingSenderId: "1057085241798",
    appId: "1:1057085241798:web:4d4a7008fec495661f1ac7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); 