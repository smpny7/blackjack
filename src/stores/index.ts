import { createStore } from 'redux'

interface Action<Type extends string> {
    type: Type
    payload: {
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
}

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

const reducer = (state = initialState, action: Action<string>) => {
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

const store = createStore(reducer)
console.log(store.getState())

export default store
