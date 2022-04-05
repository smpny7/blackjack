import {
    AnyAction,
    applyMiddleware,
    combineReducers,
    createStore,
    Reducer,
} from 'redux'
import { load, save } from 'redux-localstorage-simple'
import { userReducer } from './user'

const reducer = combineReducers({
    user: userReducer,
})

/**
 * Saving to LocalStorage is achieved using Redux
 * middleware. The 'save' method is called by Redux
 * each time an action is handled by your reducer.
 */
const createStoreWithMiddleware = applyMiddleware(save())(createStore)

/**
 * Loading from LocalStorage happens during
 * creation of the Redux store.
 */
const store = createStoreWithMiddleware(
    reducer as Reducer<object, AnyAction>,
    load(),
)

export default store
