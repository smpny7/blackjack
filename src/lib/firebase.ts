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
    getDatabase,
    connectDatabaseEmulator,
    Database,
} from 'firebase/database'

export const config = {
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

export const auth: Auth = getAuth()
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
            console.log(`User:`)
            console.log(JSON.stringify(user))
        })
        .catch((error) => {
            const errorCode = error.code
            const errorMessage = error.message
            console.log(`errorCode: ${errorCode}`)
            console.log(`errorMessage: ${errorMessage}`)
        })
}

export const Logout = () => {
    signOut(auth)
        .then(() => {
            console.log('ログアウトしました')
        })
        .catch((error) => {
            const errorCode = error.code
            const errorMessage = error.message
            console.log(`errorCode: ${errorCode}`)
            console.log(`errorMessage: ${errorMessage}`)
        })
}

export const listenAuthState = (dispatch: any) => {
    return onAuthStateChanged(auth, (user) => {
        if (user) {
            dispatch({ type: 'LOGIN', payload: user })
        } else {
            dispatch({ type: 'LOGOUT', payload: {} })
        }
    })
}
