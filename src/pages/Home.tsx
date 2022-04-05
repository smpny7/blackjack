import { useListenData, useReference } from 'lib/database'
import { listenAuthState, Login, Logout } from 'lib/firebase'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { IRoom, IRooms } from 'types/database'
import { UserStore } from '../types/store'

const Home = () => {
    const user = useSelector((state: UserStore) => state.user)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        Login(dispatch)
        return listenAuthState(dispatch)
    }, [dispatch])

    // ▼ Realtime Database Ref ▼
    const roomsRef = useReference('rooms')

    // ▼ Realtime Database Data ▼
    const rooms = useListenData<IRooms>(roomsRef)

    return (
        <div className="m-4">
            {/* <button onClick={() => Login(dispatch)}>ログイン</button> */}
            <button className="btn btn-secondary mb-2" onClick={() => Logout()}>
                ログアウト
            </button>
            <p>{JSON.stringify(user)}</p>
            <h1 className="mb-4 mt-10 text-2xl">部屋一覧</h1>
            <div>
                {(Object.entries(rooms) as [string, IRoom][]).map(
                    ([roomId, room]) => (
                        <button
                            key={roomId}
                            className="btn my-2 block"
                            disabled={room.isFinished}
                            onClick={() => navigate(`/waiting-room/${roomId}`)}
                        >
                            {room.name}({room.playerCount}/6){' '}
                            {room.isFinished && <> - 終了</>}
                        </button>
                    ),
                )}
            </div>
        </div>
    )
}

export default Home
