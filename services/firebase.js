import { initializeApp, getApps } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBNNgnlmFjeiOE__Gd7FPvdDYtM--mz0aY",
  authDomain: "povs-xyz.firebaseapp.com",
  databaseURL: "https://povs-xyz-default-rtdb.firebaseio.com",
  projectId: "povs-xyz",
  storageBucket: "povs-xyz.firebasestorage.app",
  messagingSenderId: "837844751991",
  appId: "1:837844751991:web:71a2237085b254d9a81872",
};

let app;
let database;

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
  database = getDatabase(app);
}

export const db = database;
