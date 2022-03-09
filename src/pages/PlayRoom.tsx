import { ref, update } from 'firebase/database'
import { CARD, OPEN_TERN, TRANSPORTATION } from 'lib/const'
import { useDatabase, useFetchData } from 'lib/database'
import { db } from 'lib/firebase'
import { route } from 'lib/route'
import {
    getCardKeyFromTransportation,
    getNextRole,
    judgeIsGameOver,
} from 'lib/util'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { Store } from 'stores'
import { Role, Transportation } from 'types'
import {
    ICard,
    ICards,
    IHistories,
    IHistory,
    IPlayerStatus,
    IPosition,
    ITern,
} from 'types/database'

const PlayRoom = () => {
    const location = useLocation()

    const user = useSelector((state: Store) => state.user)

    // ▼ State ▼
    const [isSelectingBlackCard, setIsSelectingBlackCard] = useState(false)
    const [isSelectingDoubleCard, setIsSelectingDoubleCard] = useState(false)

    // ▼ Realtime Database Ref ▼
    const cardsRef = useDatabase('cards' + '/' + '12345678')
    const historyRef = useDatabase('history' + '/' + '12345678')
    const positionRef = useDatabase('positions' + '/' + '12345678')
    const playerStatus = useDatabase(
        'playerStatus' + '/' + '12345678' + '/' + user.uid,
    )
    const ternRef = useDatabase('terns' + '/' + '12345678')

    // ▼ Realtime Database Data ▼
    const cards = useFetchData<ICards>(cardsRef)
    const histories = useFetchData<IHistories>(historyRef)
    const myStatus = useFetchData<IPlayerStatus>(playerStatus)
    const positions = useFetchData<IPosition>(positionRef)
    const tern = useFetchData<ITern>(ternRef)

    // ▼ Data ▼
    const myRole = myStatus.role // 自分の役職
    const myPosition = positions[myRole] // 自分の位置
    const isThief = myRole === ('thief' as Role) // 自分が怪盗かどうか

    // =========================================================================

    const submitNextPosition = (
        transportation: keyof ICard,
        nextPosition: number,
    ) => {
        if (isSelectingBlackCard) transportation = 'black' as keyof ICard

        // ▼ カードの残数を更新 ▼
        const transportationRef = ref(
            db,
            'cards' + '/' + '12345678' + '/' + myRole + '/',
        )
        update(transportationRef, {
            [transportation]: cards[myRole][transportation] - 1,
        })

        // ▼ 座標を更新 ▼
        update(positionRef, { [myRole]: nextPosition })

        // ▼ 使用履歴を更新 ▼
        if (myRole === ('thief' as Role)) {
            update(historyRef, {
                [tern.count]: {
                    position: nextPosition,
                    card: transportation,
                },
            })
        }

        if (isSelectingDoubleCard) {
            // ▼ ダブルカードを消費 ▼
            update(transportationRef, {
                double: cards[myRole].double - 1,
            })
        } else {
            // ▼ 操作する人を更新 ▼
            update(ternRef, { action: getNextRole(myRole) })
        }

        // ▼ ターン数を更新 ▼
        if (getNextRole(myRole) === ('thief' as Role))
            update(ternRef, { count: tern.count + 1 })

        setIsSelectingBlackCard(false)
        setIsSelectingDoubleCard(false)
    }

    return (
        <div>
            <Link to="/">Home</Link>
            <div style={{ height: '20px' }} />
            <img style={{ display: 'block' }} src="/map.png" alt="マップ" />

            <h2>現在のターン: {tern.count}</h2>

            <h2>残りカード</h2>
            {myRole in cards &&
                (Object.entries(CARD) as [keyof ICard, string][]).map(
                    ([transportationKey, transportationValue]) => (
                        <p key={transportationKey}>
                            {transportationValue} ×
                            {cards[myRole][transportationKey]}
                        </p>
                    ),
                )}

            {tern.action === myRole && (
                <>
                    <h2>あなたの番です</h2>
                    {cards[myRole]?.black > 0 && (
                        <>
                            <input
                                id="setBlackCard"
                                type="checkbox"
                                checked={isSelectingBlackCard}
                                onChange={() =>
                                    setIsSelectingBlackCard(
                                        !isSelectingBlackCard,
                                    )
                                }
                            />
                            <label htmlFor="setBlackCard">
                                ブラックカードを使用（あと {cards[myRole].black}
                                回使用できます）
                            </label>
                        </>
                    )}

                    {myRole in cards &&
                        (
                            Object.entries(TRANSPORTATION) as [
                                Transportation,
                                string,
                            ][]
                        ).map(([transportationKey, transportationValue]) => (
                            <div key={transportationKey}>
                                {cards[myRole][
                                    getCardKeyFromTransportation(
                                        transportationKey,
                                    )
                                ] > 0 &&
                                    route[myPosition - 1][
                                        transportationKey
                                    ].map((nextPosition: number) => (
                                        <button
                                            onClick={() =>
                                                submitNextPosition(
                                                    getCardKeyFromTransportation(
                                                        transportationKey,
                                                    ),
                                                    nextPosition,
                                                )
                                            }
                                            key={nextPosition}
                                        >
                                            {nextPosition} (
                                            {transportationValue}
                                            {isSelectingBlackCard &&
                                                transportationKey !==
                                                    ('boat' as Transportation) &&
                                                ': ブラックカードを使用'}
                                            )
                                        </button>
                                    ))}
                            </div>
                        ))}

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
            {(Object.entries(positions) as [Role, number][]).map(
                ([positionKey, positionValue]) => (
                    <div key={positionKey}>
                        {(isThief || positionKey !== ('thief' as Role)) && (
                            <p>
                                {positionKey}: {positionValue}
                            </p>
                        )}
                    </div>
                ),
            )}

            <h2>怪盗のカード使用履歴</h2>
            <table style={{ border: 'black solid 1px' }}>
                <tr>
                    <th>ターン</th>
                    <th>使用カード</th>
                    <th>位置</th>
                </tr>
                {(Object.entries(histories) as [string, IHistory][]).map(
                    ([index, history]) => (
                        <tr key={index}>
                            <td>{index}</td>
                            <td>{history?.card ?? '初期ポジション'}</td>
                            <td>
                                {OPEN_TERN.includes(history.position)
                                    ? history.position
                                    : '？'}
                            </td>
                        </tr>
                    ),
                )}
            </table>

            {judgeIsGameOver(positions) && (
                <Navigate to="/result" state={{ from: location }} replace />
            )}
            <div style={{ height: '100px' }} />
        </div>
    )
}

export default PlayRoom
