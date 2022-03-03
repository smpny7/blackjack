import { listenAuthState, Login, Logout } from 'lib/firebase'
import { useDispatch, useSelector } from 'react-redux'
import { Store } from './stores'
import { useEffect } from 'react'

function App() {
    const user = useSelector((state: Store) => state.user)
    const dispatch = useDispatch()
    useEffect(() => {
        return listenAuthState(dispatch)
    }, [dispatch])

    return (
        <div>
            <button onClick={() => Login(dispatch)}>ログイン</button>
            <button onClick={() => Logout()}>ログアウト</button>
            <p>
                {user.uid
                    ? user.uid + 'でログインしています'
                    : 'ログインしていません'}
            </p>
        </div>
    )
}

export default App
