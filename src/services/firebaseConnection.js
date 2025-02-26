import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage';


const firebaseConfig = {
  apiKey: "AIzaSyAvN8aAETsvqtT-EayKhuaWZpCJdoXYhDU",
  authDomain: "chamadosinc.firebaseapp.com",
  databaseURL: "https://chamadosinc-default-rtdb.firebaseio.com",
  projectId: "chamadosinc",
  storageBucket: "chamadosinc.firebasestorage.app",
  messagingSenderId: "189217706194",
  appId: "1:189217706194:web:428d058a20ab240cf11d0b",
  measurementId: "G-FH1YHPYFGK"
};

const firebaseApp = initializeApp(firebaseConfig);

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

export { auth, db, storage };