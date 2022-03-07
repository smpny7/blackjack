import { ref, update } from 'firebase/database'
import { useDatabase, useFetchData } from 'lib/database'
import { db } from 'lib/firebase'
import { useState } from 'react'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { Store } from 'stores'

export interface PlayerStatus {
    isReady: boolean
    avatar: string
    name: string
    role: string
}

const WaitingRoom = () => {
    const location = useLocation()
    const user = useSelector((state: Store) => state.user)

    // ref渡してデータを取得する
    const memberRef = useDatabase('roomPlayers' + '/' + '12345678')
    const members = useFetchData(memberRef)

    const initialStatus = {
        isReady: false,
        avatar: '',
        name: '',
        role: '',
    }

    const randomId = Math.floor(Math.random() * 500)
    const [myStatus, setMyStatus] = useState({
        isReady: false,
        avatar: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${randomId}.png`,
        name: '新規Player',
        role: '',
    })

    // const [role, setRole] = useState('')
    // const [isReady, setIsReady] = useState(false)
    const [thiefStatus, setThiefStatus] = useState(initialStatus)
    const [player1Status, setPlayer1Status] = useState(initialStatus)
    const [player2Status, setPlayer2Status] = useState(initialStatus)
    const [player3Status, setPlayer3Status] = useState(initialStatus)
    const [player4Status, setPlayer4Status] = useState(initialStatus)
    const [player5Status, setPlayer5Status] = useState(initialStatus)

    const inRoom = () => {
        const roomRef = ref(db, 'roomPlayers' + '/' + '12345678')
        // const newRoomRef = push(roomRef)
        // set(newRoomRef, user.uid)
        update(roomRef, {
            [user.uid]: {
                isReady: false,
                avatar: myStatus.avatar,
                name: myStatus.name,
                role: null,
            },
        })
    }

    const positionRef = useDatabase('positions' + '/' + '12345678')
    const ternRef = useDatabase('terns' + '/' + '12345678')
    const cardsRef = useDatabase('cards' + '/' + '12345678')

    // const initialPositions = [
    //     13, 16, 26, 29, 34, 50, 53, 94, 103, 112, 117, 132, 138, 141, 155, 174,
    //     197, 198,
    // ]
    const initialPositions = [13, 16, 26, 29, 34, 50, 53, 94]
    const shuffle = ([...array]) => {
        for (let i = array.length - 1; i >= 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
            ;[array[i], array[j]] = [array[j], array[i]]
        }
        return array
    }
    const initialSortedPositions = shuffle(initialPositions)

    const setInitialPositions = () => {
        update(positionRef, {
            thief: initialSortedPositions[0],
            player1: initialSortedPositions[1],
            // TODO: player2, player3, player4, player5
            // player2: initialSortedPositions[2],
            // player3: initialSortedPositions[3],
            // player4: initialSortedPositions[4],
            // player5: initialSortedPositions[5],
        })
        update(ternRef, {
            action: 'thief',
            count: 1,
        })
        update(cardsRef, {
            thief: {
                underGround: 99,
                bus: 99,
                taxi: 99,
                black: 5,
                double: 2,
            },
            player1: {
                underGround: 4,
                bus: 8,
                taxi: 10,
                black: 0,
                double: 0,
            },
            player2: {
                underGround: 4,
                bus: 8,
                taxi: 10,
                black: 0,
                double: 0,
            },
            player3: {
                underGround: 4,
                bus: 8,
                taxi: 10,
                black: 0,
                double: 0,
            },
            player4: {
                underGround: 4,
                bus: 8,
                taxi: 10,
                black: 0,
                double: 0,
            },
            player5: {
                underGround: 4,
                bus: 8,
                taxi: 10,
                black: 0,
                double: 0,
            },
        })
    }

    const setPlayerStatus = () => {
        const roomRef = ref(
            db,
            'roomPlayers' + '/' + '12345678' + '/' + user.uid,
        )
        update(roomRef, { name: myStatus.name })
    }

    const setPlayerRole = (selectRole: string) => {
        const roomRef = ref(
            db,
            'roomPlayers' + '/' + '12345678' + '/' + user.uid,
        )
        update(roomRef, { role: selectRole })
    }

    const setPlayerIsReady = (submitIsReady: boolean) => {
        const roomRef = ref(
            db,
            'roomPlayers' + '/' + '12345678' + '/' + user.uid,
        )
        update(roomRef, { isReady: submitIsReady })
        if (myStatus.role === 'thief') setInitialPositions()
    }

    useEffect(() => {
        setThiefStatus(initialStatus)
        setPlayer1Status(initialStatus)
        setPlayer2Status(initialStatus)
        setPlayer3Status(initialStatus)
        setPlayer4Status(initialStatus)
        setPlayer5Status(initialStatus)

        Object.entries(members).map((member) => {
            if (member[0] === user.uid) {
                setMyStatus(member[1] as PlayerStatus)
            }
            switch ((member[1] as PlayerStatus).role) {
                case 'thief':
                    setThiefStatus(member[1] as PlayerStatus)
                    break
                case 'player1':
                    setPlayer1Status(member[1] as PlayerStatus)
                    break
                case 'player2':
                    setPlayer2Status(member[1] as PlayerStatus)
                    break
                case 'player3':
                    setPlayer3Status(member[1] as PlayerStatus)
                    break
                case 'player4':
                    setPlayer4Status(member[1] as PlayerStatus)
                    break
                case 'player5':
                    setPlayer5Status(member[1] as PlayerStatus)
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
                value={myStatus.name}
                readOnly={myStatus.isReady}
                onChange={(e) =>
                    setMyStatus((prev) => ({
                        ...prev,
                        name: e.target.value,
                    }))
                }
            />
            <button
                disabled={!myStatus.name.trim() || myStatus.isReady}
                onClick={setPlayerStatus}
            >
                更新
            </button>

            <h1>この部屋のメンバー一覧</h1>
            {Object.entries(members).map((member) => {
                return (
                    <div key={member[0]}>
                        <img
                            src={(member[1] as PlayerStatus).avatar}
                            alt={(member[1] as PlayerStatus).name}
                        />
                        <p>{(member[1] as PlayerStatus).name}</p>
                        {JSON.stringify(member)}
                    </div>
                )
            })}

            <h1>みんなのRole</h1>
            <p>
                怪盗: {thiefStatus.name}
                {thiefStatus.isReady && <span>　✅</span>}
                {!thiefStatus.name && (
                    <button
                        disabled={myStatus.isReady}
                        onClick={() => setPlayerRole('thief')}
                    >
                        立候補
                    </button>
                )}
            </p>
            <p>
                警察1: {player1Status.name}
                {player1Status.isReady && <span>　✅</span>}
                {!player1Status.name && (
                    <button
                        disabled={myStatus.isReady}
                        onClick={() => setPlayerRole('player1')}
                    >
                        立候補
                    </button>
                )}
            </p>
            <p>
                警察2: {player2Status.name}
                {player2Status.isReady && <span>　✅</span>}
                {!player2Status.name && (
                    <button
                        disabled={myStatus.isReady}
                        onClick={() => setPlayerRole('player2')}
                    >
                        立候補
                    </button>
                )}
            </p>
            <p>
                警察3: {player3Status.name}
                {player3Status.isReady && <span>　✅</span>}
                {!player3Status.name && (
                    <button
                        disabled={myStatus.isReady}
                        onClick={() => setPlayerRole('player3')}
                    >
                        立候補
                    </button>
                )}
            </p>
            <p>
                警察4: {player4Status.name}
                {player4Status.isReady && <span>　✅</span>}
                {!player4Status.name && (
                    <button
                        disabled={myStatus.isReady}
                        onClick={() => setPlayerRole('player4')}
                    >
                        立候補
                    </button>
                )}
            </p>
            <p>
                警察5: {player5Status.name}
                {player5Status.isReady && <span>　✅</span>}
                {!player5Status.name && (
                    <button
                        disabled={myStatus.isReady}
                        onClick={() => setPlayerRole('player5')}
                    >
                        立候補
                    </button>
                )}
            </p>

            <h1>私のRole</h1>
            <p>{myStatus.role}</p>

            {myStatus.isReady && <span>プレイヤーを待っています...</span>}
            <button
                disabled={!myStatus.role}
                onClick={() => setPlayerIsReady(!myStatus.isReady)}
            >
                {myStatus.isReady ? 'キャンセル' : '準備OK'}
            </button>
            {myStatus.isReady &&
                thiefStatus.isReady &&
                player1Status.isReady &&
                player2Status.isReady &&
                player3Status.isReady && (
                    // player4Status.isReady && player5Status.isReady
                    <Navigate
                        to="/play-room"
                        state={{ from: location }}
                        replace
                    />
                )}
            <div style={{ height: '100px' }} />
        </div>
    )
}

export default WaitingRoom
