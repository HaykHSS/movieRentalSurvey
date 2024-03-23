import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD3Z53hO5bSxyEWUUe5r7Hl77KL7cpQ1MA",
  authDomain: "movierentalsurvey.firebaseapp.com",
  projectId: "movierentalsurvey",
  storageBucket: "movierentalsurvey.appspot.com",
  messagingSenderId: "775413154604",
  appId: "1:775413154604:web:bdba676ee5a45c48dca289",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);