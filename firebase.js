// ==========================================================================
// SAPATOS DE PASSI — firebase.js
// Firebase config + init using the compat SDK (global `firebase` object),
// so no bundler / ES modules are required.
// ==========================================================================

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAy2BDRBOCN4kDDlt9ysUoGDLaR05EnAA4",
  authDomain: "sapatos-de-passi.firebaseapp.com",
  databaseURL: "https://sapatos-de-passi-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "sapatos-de-passi",
  storageBucket: "sapatos-de-passi.firebasestorage.app",
  messagingSenderId: "145088717674",
  appId: "1:145088717674:web:6b8c57a3baf0d8f04b3b13",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Realtime Database instance, used by app.js to read/write products
const db = firebase.database();

