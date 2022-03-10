import { listenAuthState, Login, Logout } from 'lib/firebase'
import { useDispatch, useSelector } from 'react-redux'
import { Store } from '../stores'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
    const user = useSelector((state: Store) => state.user)
    const dispatch = useDispatch()
    useEffect(() => {
        return listenAuthState(dispatch)
    }, [dispatch])

    return (
        <div>
            <button onClick={() => Login(dispatch)}>ログイン</button>
            <button onClick={() => Logout()}>ログアウト</button>
            <Link to="/waiting-room">待合室</Link>
            <p>{JSON.stringify(user)}</p>
        </div>
    )
}

export default Home
