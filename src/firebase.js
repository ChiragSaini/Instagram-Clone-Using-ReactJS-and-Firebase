import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
    apiKey: `${process.env.REACT_APP_API_KEY}`,
    authDomain: "instagram-clone-16740.firebaseapp.com",
    databaseURL: "https://instagram-clone-16740.firebaseio.com",
    projectId: "instagram-clone-16740",
    storageBucket: "instagram-clone-16740.appspot.com",
    messagingSenderId: "746495274891",
    appId: "1:746495274891:web:72a0399053979b6c2b498e",
    measurementId: "G-7DTFYLGYXT"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };