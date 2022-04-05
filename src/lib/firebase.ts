import * as firebase from 'firebase/app'
import {
    Auth,
    connectAuthEmulator,
    getAuth,
    onAuthStateChanged,
    signInAnonymously,
    signOut,
    UserCredential,
} from 'firebase/auth'
import {
    connectDatabaseEmulator,
    Database,
    getDatabase,
} from 'firebase/database'
import store from 'store'
import { isDebug } from './debug'
import { errorLog, loginLog, logoutLog } from './log'

const config = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGE_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
}

firebase.initializeApp(config)

const auth: Auth = getAuth()
export const db: Database = getDatabase()

if (window.location.hostname === 'localhost') {
    connectAuthEmulator(auth, 'http://localhost:9099')
    connectDatabaseEmulator(db, 'localhost', 9000)
}

export const Login = (dispatch: any) => {
    signInAnonymously(auth)
        .then((userCredential: UserCredential) => {
            const user = userCredential.user
            dispatch({ type: 'LOGIN', payload: user })
            if (isDebug) loginLog(user)
        })
        .catch((e) => {
            if (isDebug) errorLog(e.code, e.message)
        })
}

export const Logout = () => {
    signOut(auth)
        .then(() => {
            if (isDebug) logoutLog()
        })
        .catch((e) => {
            if (isDebug) errorLog(e.code, e.message)
        })
}

export const listenAuthState = (dispatch: typeof store.dispatch) =>
    onAuthStateChanged(auth, (user) => {
        if (user) dispatch({ type: 'LOGIN', payload: user })
        else dispatch({ type: 'LOGOUT', payload: {} })
    })
