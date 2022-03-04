import { AnyAction, applyMiddleware, createStore, Reducer } from 'redux'
import { load, save } from 'redux-localstorage-simple'

export interface Store {
    user: {
        uid: string
        emailVerified: boolean
        isAnonymous: boolean
        providerData: string[]
        stsTokenManager: {
            refreshToken: string
            accessToken: string
            expirationTime: number
        }
        createdAt: number
        lastLoginAt: number
        apiKey: string
        appName: string
    }
}

const initialState = {
    user: {},
}

const reducer = (state = initialState, action: AnyAction) => {
    switch (action.type) {
        case 'LOGIN':
            return {
                user: action.payload,
            }
        case 'LOGOUT':
            return {
                user: {},
            }
        default:
            return state
    }
}

/*
    Saving to LocalStorage is achieved using Redux
    middleware. The 'save' method is called by Redux
    each time an action is handled by your reducer.
*/
const createStoreWithMiddleware = applyMiddleware(
    save(), // Saving done here
)(createStore)

/*
    Loading from LocalStorage happens during
    creation of the Redux store.
*/
const store = createStoreWithMiddleware(
    reducer as Reducer<object, AnyAction>,
    load(), // Loading done here
)

export default store
