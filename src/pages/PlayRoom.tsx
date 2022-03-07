import { ref, update } from 'firebase/database'
import { useDatabase, useFetchData } from 'lib/database'
import { db } from 'lib/firebase'
import { route } from 'lib/route'
import { useSelector } from 'react-redux'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { Store } from 'stores'
import { PlayerStatus } from './WaitingRoom'

interface Position {
    thief: number
    player1: number
    player2: number
    player3: number
    player4: number
    player5: number
}

interface TransferablePosition {
    underGround: Array<number>
    bus: Array<number>
    taxi: Array<number>
    boat: Array<number>
}

interface Tern {
    action: string
    count: number
}

interface Cards {
    black: number
    bus: number
    double: number
    taxi: number
    underGround: number
}

const PlayRoom = () => {
    const location = useLocation()

    const user = useSelector((state: Store) => state.user)
    const memberRef = useDatabase(
        'roomPlayers' + '/' + '12345678' + '/' + user.uid,
    )
    const myStatus = useFetchData(memberRef)

    const positionsRef = useDatabase('positions' + '/' + '12345678')
    const positions = useFetchData(positionsRef)

    // const positionRef = useDatabase(
    //     'positions' + '/' + '12345678' + '/' + (myStatus as PlayerStatus).role,
    // )
    // const position = useFetchData(positionRef)

    const ternRef = useDatabase('terns' + '/' + '12345678')

    const tern = useFetchData(ternRef)
    console.log(tern)
    // console.log('position')
    console.log('myPosition')
    const myRole = (myStatus as PlayerStatus).role
    const myPosition = (positions as any)[myRole]
    console.log(myPosition)
    console.log(route[myPosition - 1]?.underGround)

    const cardsRef = useDatabase('cards' + '/' + '12345678')
    const cards = useFetchData(cardsRef)
    console.log('cards')
    console.log(((cards as any)[myRole] as Cards)?.black)

    const isThief = myRole === 'thief'

    const nextRole: string =
        {
            thief: 'player1',
            player1: 'thief',
            // player1: 'player2',
            // player2: 'player3',
            // player3: 'player4',
            // player4: 'player5',
            // player5: 'thief',
        }[myRole] ?? ''

    const isGameOver =
        ((positions as Position).thief === (positions as Position).player1 ||
            (positions as Position).thief === (positions as Position).player2 ||
            (positions as Position).thief === (positions as Position).player3 ||
            (positions as Position).thief === (positions as Position).player4 ||
            (positions as Position).thief ===
                (positions as Position).player5) &&
        (positions as Position).thief !== undefined

    const submitNextPosition = (
        transportation: string,
        remain: number,
        nextPosition: number,
    ) => {
        console.log('position')
        console.log(nextPosition)
        console.log('nextRole')
        console.log(nextRole)

        const transportationRef = ref(
            db,
            'cards' + '/' + '12345678' + '/' + myRole + '/',
        )
        update(transportationRef, { [transportation]: remain })

        const positionRef = ref(db, 'positions' + '/' + '12345678')
        update(positionRef, { [myRole]: nextPosition })

        const ternRef = ref(db, 'terns' + '/' + '12345678')
        update(ternRef, { action: nextRole })
        if (nextRole === 'thief')
            update(ternRef, { count: (tern as Tern).count + 1 })
    }

    return (
        <div>
            <Link to="/">Home</Link>
            <div style={{ height: '20px' }} />
            <img style={{ display: 'block' }} src="/map.png" alt="マップ" />

            <h2>現在のターン: {(tern as Tern).count}</h2>

            {((cards as any)[myRole] as Cards)?.underGround > 0 && (
                <p>地下鉄 ×{((cards as any)[myRole] as Cards).underGround}</p>
            )}
            {((cards as any)[myRole] as Cards)?.bus > 0 && (
                <p>バス ×{((cards as any)[myRole] as Cards).bus}</p>
            )}
            {((cards as any)[myRole] as Cards)?.taxi > 0 && (
                <p>タクシー ×{((cards as any)[myRole] as Cards).taxi}</p>
            )}
            {((cards as any)[myRole] as Cards)?.black > 0 && (
                <p>
                    ブラック・チケット ×
                    {((cards as any)[myRole] as Cards).black}
                </p>
            )}
            {((cards as any)[myRole] as Cards)?.double > 0 && (
                <p>
                    ダブル・ムーブ・カード ×
                    {((cards as any)[myRole] as Cards).double}
                </p>
            )}

            {(tern as Tern).action == myRole && (
                <>
                    <h2>あなたの番です</h2>
                    <div>
                        {route[myPosition - 1]?.underGround &&
                            ((cards as any)[myRole] as Cards)?.underGround >
                                0 &&
                            (
                                route[myPosition - 1] as TransferablePosition
                            ).underGround.map((nextPosition) => {
                                return (
                                    <button
                                        onClick={() =>
                                            submitNextPosition(
                                                'underGround',
                                                (
                                                    (cards as any)[
                                                        myRole
                                                    ] as Cards
                                                )?.underGround - 1,
                                                nextPosition,
                                            )
                                        }
                                        key={nextPosition}
                                    >
                                        {nextPosition} (地下鉄)
                                    </button>
                                )
                            })}
                    </div>
                    <div>
                        {route[myPosition - 1]?.bus &&
                            ((cards as any)[myRole] as Cards)?.bus > 0 &&
                            (
                                route[myPosition - 1] as TransferablePosition
                            ).bus.map((nextPosition) => {
                                return (
                                    <button
                                        onClick={() =>
                                            submitNextPosition(
                                                'bus',
                                                (
                                                    (cards as any)[
                                                        myRole
                                                    ] as Cards
                                                )?.bus - 1,
                                                nextPosition,
                                            )
                                        }
                                        key={nextPosition}
                                    >
                                        {nextPosition} (バス)
                                    </button>
                                )
                            })}
                    </div>
                    <div>
                        {route[myPosition - 1]?.taxi &&
                            ((cards as any)[myRole] as Cards)?.taxi > 0 &&
                            (
                                route[myPosition - 1] as TransferablePosition
                            ).taxi.map((nextPosition) => {
                                return (
                                    <button
                                        onClick={() =>
                                            submitNextPosition(
                                                'taxi',
                                                (
                                                    (cards as any)[
                                                        myRole
                                                    ] as Cards
                                                )?.taxi - 1,
                                                nextPosition,
                                            )
                                        }
                                        key={nextPosition}
                                    >
                                        {nextPosition} (タクシー)
                                    </button>
                                )
                            })}
                    </div>
                    <div>
                        {route[myPosition - 1]?.boat &&
                            ((cards as any)[myRole] as Cards)?.black > 0 &&
                            (
                                route[myPosition - 1] as TransferablePosition
                            ).boat.map((nextPosition) => {
                                return (
                                    <button
                                        onClick={() =>
                                            submitNextPosition(
                                                'black',
                                                (
                                                    (cards as any)[
                                                        myRole
                                                    ] as Cards
                                                )?.black - 1,
                                                nextPosition,
                                            )
                                        }
                                        key={nextPosition}
                                    >
                                        {nextPosition} (ボート)
                                    </button>
                                )
                            })}
                    </div>
                </>
            )}

            <h2>現在のポジション</h2>
            {Object.entries(positions).map((position) => {
                return (
                    <div key={position[0]}>
                        {(position[0] !== 'thief' || isThief) && (
                            <p>
                                {position[0]}: {position[1]}
                            </p>
                        )}
                    </div>
                )
            })}
            {isGameOver && (
                <Navigate to="/result" state={{ from: location }} replace />
            )}
            <div style={{ height: '100px' }} />
        </div>
    )
}

export default PlayRoom
