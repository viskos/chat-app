import React, {createContext} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import firebase from "firebase";
import 'firebase/firestore'
import 'firebase/auth'

firebase.initializeApp({
    apiKey: "AIzaSyCuuAXbn99vaBBx-73wGOOB-Zg6phCZQrU",
    authDomain: "chat-fbsrct.firebaseapp.com",
    projectId: "chat-fbsrct",
    storageBucket: "chat-fbsrct.appspot.com",
    messagingSenderId: "545532414519",
    appId: "1:545532414519:web:332853a505f970323e4db2",
    measurementId: "G-RJPS65PC9R"
})

export const Context = createContext(null)

const auth = firebase.auth()
const firestore = firebase.firestore()

ReactDOM.render(
  <React.StrictMode>
      <Context.Provider value={{
          firebase,
          auth,
          firestore
      }}>
          <App />
      </Context.Provider>
  </React.StrictMode>,
  document.getElementById('root')
);