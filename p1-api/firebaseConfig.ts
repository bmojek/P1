import { initializeApp } from "firebase/app";
import { initializeAuth } from "firebase/auth";
import dotenv from "dotenv";

dotenv.config();

const firebaseConfig = JSON.parse(process.env.REACT_APP_FIREBASE as string);
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app);
module.exports = { app, auth };
