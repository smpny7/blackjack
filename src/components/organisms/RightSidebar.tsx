import Players from 'components/molecules/Players'
import { Position } from 'types'
import { IPlayerStatus, ITern } from 'types/database'

interface RightSidebarProps {
    action: Position
    sortedPlayerStatuses: [string, IPlayerStatus][]
    tern: ITern
}

const RightSidebar = (props: RightSidebarProps) => {
    const thiefStatuses = props.sortedPlayerStatuses.filter(
        ([, playerStatus]) => playerStatus.role === 'thief',
    )
    const playerStatuses = props.sortedPlayerStatuses.filter(
        ([, playerStatus]) => playerStatus.role !== 'thief',
    )
    return (
        <div className="h-screen w-64 flex-none px-4">
            <div className="mt-10">
                <Players
                    action={props.action}
                    tern={props.tern}
                    titleSrc={`${process.env.PUBLIC_URL}/img/label_thief.png`}
                    titleAlt="怪盗X"
                    playerStatuses={thiefStatuses}
                />
            </div>
            <div className="mt-4">
                <Players
                    action={props.action}
                    tern={props.tern}
                    titleSrc={`${process.env.PUBLIC_URL}/img/label_player.png`}
                    titleAlt="刑事"
                    playerStatuses={playerStatuses}
                />
            </div>
        </div>
    )
}

export default RightSidebar
