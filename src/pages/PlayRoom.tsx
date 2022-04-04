import CenterContents from 'components/organisms/CenterContents'
import LeftSidebar from 'components/organisms/LeftSidebar'
import RightSidebar from 'components/organisms/RightSidebar'
import { ROLES } from 'lib/const'
import { useDatabase, useFetchData } from 'lib/database'
import { isTern, judgeIsGameOver } from 'lib/util'
import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'
import { Store } from 'stores'
import { Role } from 'types'
import {
    ICards,
    IPlayerStatus,
    IPlayerStatuses,
    IPosition,
    ITern,
} from 'types/database'

const PlayRoom = () => {
    const roomId = 12345678 //TODO: get roomId from Realtime Database

    const location = useLocation()

    const user = useSelector((state: Store) => state.user)

    // ▼ Realtime Database Ref ▼
    const cardsRef = useDatabase(`cards/${roomId}`)
    const myStatusRef = useDatabase(`playerStatus/${roomId}/${user.uid}`)
    const playerStatusRef = useDatabase(`playerStatus/${roomId}`)
    const positionRef = useDatabase(`positions/${roomId}`)
    const ternRef = useDatabase(`terns/${roomId}`)

    // ▼ Realtime Database Data ▼
    const cards = useFetchData<ICards>(cardsRef)
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
                        roomId={roomId}
                        sortedPlayerStatuses={sortedPlayerStatuses}
                        tern={tern}
                    />
                    <div className="h-screen">
                        <CenterContents
                            cards={cards}
                            isThief={isThief}
                            isMyTern={isTern(myRole, tern)}
                            myRole={myRole}
                            myPosition={myPosition}
                            positions={positions}
                            roomId={roomId}
                            tern={tern}
                        />

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
