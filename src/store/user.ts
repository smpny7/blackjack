import { AnyAction } from 'redux'

const initialState = {}

export const userReducer = (state = initialState, action: AnyAction) => {
    switch (action.type) {
        case 'LOGIN':
            return action.payload
        case 'LOGOUT':
            return initialState
        default:
            return state
    }
}
