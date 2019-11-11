import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

// THIS IS USED TO INITIALIZE THE firebase OBJECT
// PUT YOUR FIREBASE PROJECT CONFIG STUFF HERE
var firebaseConfig = {
    apiKey: "AIzaSyBHgfFavaxmi6qBQsyE4pAb2nmcTLnF0p0",
    authDomain: "cse316-hw3.firebaseapp.com",
    databaseURL: "https://cse316-hw3.firebaseio.com",
    projectId: "cse316-hw3",
    storageBucket: "cse316-hw3.appspot.com",
    messagingSenderId: "262454433419",
    appId: "1:262454433419:web:8d12a4750e25ded3a2a68e",
    measurementId: "G-VRRR5NLM3N"
    // apiKey: "AIzaSyCJxkqx-6PMJrZ7ACkrgbO55b5wmJdop1Y",
    // authDomain: "todo-rrf-316.firebaseapp.com",
    // databaseURL: "https://todo-rrf-316.firebaseio.com",
    // projectId: "todo-rrf-316",
    // storageBucket: "todo-rrf-316.appspot.com",
    // messagingSenderId: "892398996038",
    // appId: "1:892398996038:web:1fb9157fc6c5d266e01847",
    // measurementId: "G-TEGQB3MZ23"
};
firebase.initializeApp(firebaseConfig);


// NOW THE firebase OBJECT CAN BE CONNECTED TO THE STORE
export default firebase;