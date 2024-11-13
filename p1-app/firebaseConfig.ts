import { initializeApp } from "firebase/app";
import { REACT_APP_FIREBASE } from "@env";

const firebaseConfig = JSON.parse(REACT_APP_FIREBASE);
export const app = initializeApp(firebaseConfig);
