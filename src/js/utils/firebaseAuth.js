import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAt0tg_QWJKw5Ekhgs77xPLtTe2f42JPFc",
    authDomain: "ccsync-elphp-2025.firebaseapp.com",
    projectId: "ccsync-elphp-2025",
    storageBucket: "ccsync-elphp-2025.firebasestorage.app",
    messagingSenderId: "621497927422",
    appId: "1:621497927422:web:68b9acc2e43108942307af"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);