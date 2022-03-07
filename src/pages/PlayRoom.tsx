import { ref, update } from 'firebase/database'
import { useDatabase, useFetchData } from 'lib/database'
import { db } from 'lib/firebase'
import { route } from 'lib/route'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { Store } from 'stores'

interface PlayerStatus {
    isReady: boolean
    avatar: string
    name: string
    role: keyof Role
}

interface Role {
    thief: string
    player1: string
    player2: string
    player3: string
    player4: string
    player5: string
}

interface Cards {
    thief: RemainCards
    player1: RemainCards
    player2: RemainCards
    player3: RemainCards
    player4: RemainCards
    player5: RemainCards
}

interface Position {
    thief: number
    player1: number
    player2: number
    player3: number
    player4: number
    player5: number
}

export interface TransferablePosition {
    underGround: Array<number>
    bus: Array<number>
    taxi: Array<number>
    boat: Array<number>
}

interface Tern {
    action: string
    count: number
}

interface RemainCards {
    black: number
    bus: number
    double: number
    taxi: number
    underGround: number
}

const PlayRoom = () => {
    const location = useLocation()

    const user = useSelector((state: Store) => state.user)

    const [isBlackCard, setIsBlackCard] = useState(false)
    const [isSelectingDoubleCard, setIsSelectingDoubleCard] = useState(false)

    const cardsRef = useDatabase('cards' + '/' + '12345678')
    const positionRef = useDatabase('positions' + '/' + '12345678')
    const roomPlayersRef = useDatabase(
        'roomPlayers' + '/' + '12345678' + '/' + user.uid,
    )
    const ternRef = useDatabase('terns' + '/' + '12345678')

    const cards = useFetchData<Cards>(cardsRef)
    const myStatus = useFetchData<PlayerStatus>(roomPlayersRef)
    const position = useFetchData<Position>(positionRef)
    const tern = useFetchData<Tern>(ternRef)

    const myRole = myStatus.role
    const myPosition = position[myRole]
    const isThief = myRole === 'thief'
    const nextRole: keyof Role = {
        // TODO: player1: 'player2' as keyof Role,
        thief: 'player1' as keyof Role,
        player1: 'thief' as keyof Role,
        player2: 'player3' as keyof Role,
        player3: 'player4' as keyof Role,
        player4: 'player5' as keyof Role,
        player5: 'thief' as keyof Role,
    }[myRole]

    const isGameOver =
        (position.thief === position.player1 ||
            position.thief === position.player2 ||
            position.thief === position.player3 ||
            position.thief === position.player4 ||
            position.thief === position.player5) &&
        position.thief !== undefined

    const submitNextPosition = (
        transportation: string,
        remain: number,
        nextPosition: number,
    ) => {
        const transportationRef = ref(
            db,
            'cards' + '/' + '12345678' + '/' + myRole + '/',
        )
        update(transportationRef, { [transportation]: remain })

        const positionRef = ref(db, 'positions' + '/' + '12345678')
        update(positionRef, { [myRole]: nextPosition })

        if (isSelectingDoubleCard) {
            setIsSelectingDoubleCard(false)
            update(transportationRef, { [transportation]: remain })
        } else {
            const ternRef = ref(db, 'terns' + '/' + '12345678')
            update(ternRef, { action: nextRole })
        }
        if (nextRole === 'thief') update(ternRef, { count: tern.count + 1 })
    }

    return (
        <div>
            <Link to="/">Home</Link>
            <div style={{ height: '20px' }} />
            <img style={{ display: 'block' }} src="/map.png" alt="マップ" />

            <h2>現在のターン: {tern.count}</h2>

            {cards[myRole]?.underGround > 0 && (
                <p>地下鉄 ×{cards[myRole].underGround}</p>
            )}
            {cards[myRole]?.bus > 0 && <p>バス ×{cards[myRole].bus}</p>}
            {cards[myRole]?.taxi > 0 && <p>タクシー ×{cards[myRole].taxi}</p>}
            {cards[myRole]?.black > 0 && (
                <p>ブラック・チケット ×{cards[myRole].black}</p>
            )}
            {cards[myRole]?.double > 0 && (
                <p>ダブル・ムーブ・カード ×{cards[myRole].double}</p>
            )}

            {tern.action == myRole && (
                <>
                    <h2>あなたの番です</h2>
                    {cards[myRole]?.black > 0 && (
                        <>
                            <input
                                id="setBlackCard"
                                type="checkbox"
                                checked={isBlackCard}
                                onChange={() => setIsBlackCard(!isBlackCard)}
                            />
                            <label htmlFor="setBlackCard">
                                ブラックカードを使用（あと{cards[myRole].black}
                                回使用できます）
                            </label>
                        </>
                    )}
                    <div>
                        {route[myPosition - 1]?.underGround &&
                            cards[myRole]?.underGround > 0 &&
                            route[myPosition - 1].underGround.map(
                                (nextPosition) => {
                                    return (
                                        <button
                                            onClick={() =>
                                                submitNextPosition(
                                                    isSelectingDoubleCard
                                                        ? 'double'
                                                        : 'underGround',
                                                    isSelectingDoubleCard
                                                        ? cards[myRole]
                                                              ?.double - 1
                                                        : cards[myRole]
                                                              ?.underGround - 1,
                                                    nextPosition,
                                                )
                                            }
                                            key={nextPosition}
                                        >
                                            {nextPosition} (地下鉄
                                            {isBlackCard &&
                                                ': ブラックカードを使用'}
                                            )
                                        </button>
                                    )
                                },
                            )}
                    </div>
                    <div>
                        {route[myPosition - 1]?.bus &&
                            cards[myRole]?.bus > 0 &&
                            route[myPosition - 1].bus.map((nextPosition) => {
                                return (
                                    <button
                                        onClick={() =>
                                            submitNextPosition(
                                                isSelectingDoubleCard
                                                    ? 'double'
                                                    : 'bus',
                                                isSelectingDoubleCard
                                                    ? cards[myRole]?.double - 1
                                                    : cards[myRole]?.bus - 1,
                                                nextPosition,
                                            )
                                        }
                                        key={nextPosition}
                                    >
                                        {nextPosition} (バス
                                        {isBlackCard &&
                                            ': ブラックカードを使用'}
                                        )
                                    </button>
                                )
                            })}
                    </div>
                    <div>
                        {route[myPosition - 1]?.taxi &&
                            cards[myRole]?.taxi > 0 &&
                            route[myPosition - 1].taxi.map((nextPosition) => {
                                return (
                                    <button
                                        onClick={() =>
                                            submitNextPosition(
                                                isSelectingDoubleCard
                                                    ? 'double'
                                                    : 'taxi',
                                                isSelectingDoubleCard
                                                    ? cards[myRole]?.double - 1
                                                    : cards[myRole]?.taxi - 1,
                                                nextPosition,
                                            )
                                        }
                                        key={nextPosition}
                                    >
                                        {nextPosition} (タクシー
                                        {isBlackCard &&
                                            ': ブラックカードを使用'}
                                        )
                                    </button>
                                )
                            })}
                    </div>
                    <div>
                        {route[myPosition - 1]?.boat &&
                            cards[myRole]?.black > 0 &&
                            route[myPosition - 1].boat.map((nextPosition) => {
                                return (
                                    <button
                                        onClick={() =>
                                            submitNextPosition(
                                                isSelectingDoubleCard
                                                    ? 'double'
                                                    : 'black',
                                                isSelectingDoubleCard
                                                    ? cards[myRole]?.double - 1
                                                    : cards[myRole]?.black - 1,
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
                    {cards[myRole]?.double > 0 && (
                        <button
                            onClick={() => setIsSelectingDoubleCard(true)}
                            disabled={isSelectingDoubleCard}
                        >
                            {isSelectingDoubleCard
                                ? 'ダブルムーブカードを使用中'
                                : 'ダブルムーブカードを使用'}
                        </button>
                    )}
                </>
            )}

            <h2>現在のポジション</h2>
            {Object.entries(position).map((position) => {
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
