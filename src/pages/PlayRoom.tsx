import CenterContents from 'components/organisms/CenterContents'
import LeftSidebar from 'components/organisms/LeftSidebar'
import RightSidebar from 'components/organisms/RightSidebar'
import { ref, update } from 'firebase/database'
import { OPEN_TERN, ROLES } from 'lib/const'
import { useDatabase, useFetchData } from 'lib/database'
import { db } from 'lib/firebase'
import { isTern, judgeIsGameOver } from 'lib/util'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'
import { Store } from 'stores'
import { Position, Role } from 'types'
import {
    ICard,
    ICards,
    IHistories,
    IHistory,
    IPlayerStatus,
    IPlayerStatuses,
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
    const hasMovedRef = useDatabase(
        'terns' + '/' + '12345678' + '/' + 'hasMoved',
    )
    const historyRef = useDatabase('history' + '/' + '12345678')
    const myStatusRef = useDatabase(
        'playerStatus' + '/' + '12345678' + '/' + user.uid,
    )
    const playerStatusRef = useDatabase('playerStatus' + '/' + '12345678')
    const positionRef = useDatabase('positions' + '/' + '12345678')
    const ternRef = useDatabase('terns' + '/' + '12345678')

    // ▼ Realtime Database Data ▼
    const cards = useFetchData<ICards>(cardsRef)
    const histories = useFetchData<IHistories>(historyRef)
    const myStatus = useFetchData<IPlayerStatus>(myStatusRef)
    const playerStatuses = useFetchData<IPlayerStatuses>(playerStatusRef)
    const positions = useFetchData<IPosition>(positionRef)
    const tern = useFetchData<ITern>(ternRef)

    // ▼ Data ▼
    const myRole = myStatus.role // 自分の役職
    const myPosition = positions[myRole] // 自分の位置
    const isThief = myRole === ('thief' as Role) // 自分が怪盗かどうか
    const sortedPlayerStatuses = (
        Object.entries(playerStatuses) as [string, IPlayerStatus][]
    ).sort(
        ([, playerStatus1], [, playerStatus2]) =>
            Object.keys(ROLES).indexOf(playerStatus1.role) -
            Object.keys(ROLES).indexOf(playerStatus2.role),
    )

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
        if (isThief)
            update(historyRef, {
                [tern.count]: {
                    position: nextPosition,
                    card: transportation,
                },
            })

        if (isSelectingDoubleCard) {
            // ▼ ダブルカードを消費 ▼
            update(transportationRef, {
                double: cards[myRole].double - 1,
            })
        } else {
            if (isThief) {
                update(ternRef, {
                    action: 'player' as Role,
                })
                update(ternRef, {
                    hasMoved: {
                        thief: true,
                        player1: false,
                        player2: true, // false
                        player3: true, // false
                        player4: true, // false
                        player5: true, // false
                    },
                })
            } else {
                update(hasMovedRef, { [myRole]: true })
                if (
                    (Object.entries(tern.hasMoved) as [Role, boolean][]).filter(
                        ([_, hasMoved]) => !hasMoved,
                    ).length === 1
                ) {
                    update(ternRef, {
                        action: 'thief' as Position,
                    })

                    // ▼ ターン数を更新 ▼
                    update(ternRef, { count: tern.count + 1 })
                }
            }
        }

        setIsSelectingBlackCard(false)
        setIsSelectingDoubleCard(false)
    }

    return (
        <div className="relative">
            <div className="absolute h-screen w-screen">
                <img
                    className="h-full w-full bg-cover"
                    src={`${process.env.PUBLIC_URL}/img/background.jpg`}
                    alt="background"
                />
            </div>

            <div className="relative text-center">
                <div className="inline-flex">
                    <LeftSidebar
                        action={tern.action}
                        hasMoved={tern.hasMoved}
                        myRole={myRole}
                        sortedPlayerStatuses={sortedPlayerStatuses}
                        tern={tern}
                    />
                    <div className="h-screen">
                        <CenterContents
                            cards={cards}
                            isMyTern={isTern(myRole, tern)}
                            myRole={myRole}
                            myPosition={myPosition}
                            isThief={isThief}
                            positions={positions}
                            submitNextPosition={submitNextPosition}
                            isSelectingDoubleCard={isSelectingDoubleCard}
                            setIsSelectingDoubleCard={setIsSelectingDoubleCard}
                        />

                        <h2>怪盗のカード使用履歴</h2>
                        <table style={{ border: 'black solid 1px' }}>
                            <tr>
                                <th>ターン</th>
                                <th>使用カード</th>
                                <th>位置</th>
                            </tr>
                            {(
                                Object.entries(histories) as [
                                    string,
                                    IHistory,
                                ][]
                            ).map(([index, history]) => (
                                <tr key={index}>
                                    <td>{index}</td>
                                    <td>{history?.card ?? '初期ポジション'}</td>
                                    <td>
                                        {OPEN_TERN.includes(history.position)
                                            ? history.position
                                            : '？'}
                                    </td>
                                </tr>
                            ))}
                        </table>

                        {judgeIsGameOver(positions) && (
                            <Navigate
                                to="/result"
                                state={{ from: location }}
                                replace
                            />
                        )}
                        <div style={{ height: '100px' }} />
                    </div>
                    <RightSidebar
                        action={tern.action}
                        sortedPlayerStatuses={sortedPlayerStatuses}
                        tern={tern}
                    />
                </div>
            </div>
        </div>
    )
}

export default PlayRoom
