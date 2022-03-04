import { ref, update } from 'firebase/database'
import { useDatabase, useFetchData } from 'lib/database'
import { db } from 'lib/firebase'
import { useState } from 'react'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Store } from 'stores'

export interface RoomPlayer {
    is_ready: boolean
    name: string
    role: string
}

const WaitingRoom = () => {
    const user = useSelector((state: Store) => state.user)

    // ref渡してデータを取得する
    const memberRef = useDatabase('room_players' + '/' + '12345678')
    const members = useFetchData(memberRef)

    const [name, setName] = useState('新規Player')
    const [isReady, setIsReady] = useState(false)
    const [thiefName, setThiefName] = useState('')
    const [player1Name, setPlayer1Name] = useState('')
    const [player2Name, setPlayer2Name] = useState('')
    const [player3Name, setPlayer3Name] = useState('')
    const [player4Name, setPlayer4Name] = useState('')
    const [player5Name, setPlayer5Name] = useState('')

    const inRoom = () => {
        console.log('inRoom')
        const roomRef = ref(db, 'room_players' + '/' + '12345678')
        // const newRoomRef = push(roomRef)
        // set(newRoomRef, user.uid)
        update(roomRef, {
            [user.uid]: {
                is_ready: false,
                name: name,
                role: null,
            },
        })
    }

    const setPlayerName = () => {
        console.log('setPlayerName')
        const roomRef = ref(
            db,
            'room_players' + '/' + '12345678' + '/' + user.uid,
        )
        update(roomRef, { name: name })
    }

    const setPlayerRole = (selectRole: string) => {
        console.log('setPlayerRole')
        console.log('Roleを' + selectRole + 'に変更します')
        const roomRef = ref(
            db,
            'room_players' + '/' + '12345678' + '/' + user.uid,
        )
        update(roomRef, { role: selectRole })
    }

    const setPlayerIsReady = (submitIsReady: boolean) => {
        const roomRef = ref(
            db,
            'room_players' + '/' + '12345678' + '/' + user.uid,
        )
        update(roomRef, { is_ready: submitIsReady })
    }

    useEffect(() => {
        console.log('useEffect')
        setThiefName('')
        setPlayer1Name('')
        setPlayer2Name('')
        setPlayer3Name('')
        setPlayer4Name('')
        setPlayer5Name('')

        Object.entries(members).map((member) => {
            if (member[0] === user.uid) {
                console.log('Its me')
                setName((member[1] as RoomPlayer).name)
                setIsReady((member[1] as RoomPlayer).is_ready)
            }
            switch ((member[1] as RoomPlayer).role) {
                case 'thief':
                    setThiefName((member[1] as RoomPlayer).name)
                    break
                case 'player1':
                    setPlayer1Name((member[1] as RoomPlayer).name)
                    break
                case 'player2':
                    setPlayer2Name((member[1] as RoomPlayer).name)
                    break
                case 'player3':
                    setPlayer3Name((member[1] as RoomPlayer).name)
                    break
                case 'player4':
                    setPlayer4Name((member[1] as RoomPlayer).name)
                    break
                case 'player5':
                    setPlayer5Name((member[1] as RoomPlayer).name)
                    break
            }
        })
    }, [members])

    return (
        <div>
            <Link to="/">Home</Link>
            <button onClick={inRoom}>入室</button>

            <p>Waiting Room</p>
            <p>{JSON.stringify(user)}</p>
            <p>ログインしてます{user.uid !== undefined ? 'true' : 'false'}</p>

            {/* <p>{JSON.stringify(members)}</p>
            <p>{JSON.stringify(Object.entries(members))}</p> */}

            <h1>あなたの名前</h1>
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <button disabled={!name.trim()} onClick={setPlayerName}>
                更新
            </button>

            <h1>この部屋のメンバー一覧</h1>
            {Object.entries(members).map((member) => {
                return (
                    <div key={member[0]}>
                        <p>{(member[1] as RoomPlayer).name}</p>
                        {JSON.stringify(member)}
                    </div>
                )
            })}

            <h1>みんなのRole</h1>
            <p>
                怪盗: {thiefName}
                {!thiefName && (
                    <button onClick={() => setPlayerRole('thief')}>
                        立候補
                    </button>
                )}
            </p>
            <p>
                警察1: {player1Name}
                {!player1Name && (
                    <button onClick={() => setPlayerRole('player1')}>
                        立候補
                    </button>
                )}
            </p>
            <p>
                警察2: {player2Name}
                {!player2Name && (
                    <button onClick={() => setPlayerRole('player2')}>
                        立候補
                    </button>
                )}
            </p>
            <p>
                警察3: {player3Name}
                {!player3Name && (
                    <button onClick={() => setPlayerRole('player3')}>
                        立候補
                    </button>
                )}
            </p>
            <p>
                警察4: {player4Name}
                {!player4Name && (
                    <button onClick={() => setPlayerRole('player4')}>
                        立候補
                    </button>
                )}
            </p>
            <p>
                警察5: {player5Name}
                {!player5Name && (
                    <button onClick={() => setPlayerRole('player5')}>
                        立候補
                    </button>
                )}
            </p>
            {isReady && <span>プレイヤーを待っています...</span>}
            <button onClick={() => setPlayerIsReady(!isReady)}>
                {isReady ? 'キャンセル' : '準備OK'}
            </button>
            <div style={{ height: '100px' }} />
        </div>
    )
}

export default WaitingRoom
