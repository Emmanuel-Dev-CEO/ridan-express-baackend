const { initializeApp } = require('firebase/app');
const { getAuth, GoogleAuthProvider } = require('firebase/auth');

const firebaseConfig = {
  apiKey: "AIzaSyCg6gbQzVDpK_EvNmWbX4hHuusSlniXAxM",
  authDomain: "570674577792",
  projectId: "ridan-auth",
  storageBucket: "ridan-auth.appspot.com",
  messagingSenderId: "570674577792",
  appId: "1:570674577792:web:dc3e8a18b464c5c6370165",
  measurementId: "G-FQYHE8S9R4"
  // ... other config options
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

module.exports = { auth, provider };
