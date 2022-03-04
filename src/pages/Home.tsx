import { listenAuthState, Login, Logout } from 'lib/firebase'
import { useDispatch, useSelector } from 'react-redux'
import { Store } from './../stores'
import { useEffect } from 'react'
import { useDatabase, useFetchData } from 'lib/database'
import { Link } from 'react-router-dom'

const Home = () => {
    const user = useSelector((state: Store) => state.user)
    console.log(user)
    const dispatch = useDispatch()
    useEffect(() => {
        return listenAuthState(dispatch)
    }, [dispatch])

    // ref渡してデータを取得する
    const ref = useDatabase()
    const rooms = useFetchData(ref)

    return (
        <div>
            <button onClick={() => Login(dispatch)}>ログイン</button>
            <button onClick={() => Logout()}>ログアウト</button>
            <Link to="/waiting-room">待合室</Link>
            <p>
                {user.uid
                    ? user.uid + 'でログインしています'
                    : 'ログインしていません'}
            </p>
            {rooms.map((room: number) => {
                return <div key={room}>{room}</div>
            })}
        </div>
    )
}

export default Home
