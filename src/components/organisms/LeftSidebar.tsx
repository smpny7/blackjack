import HistoryButton from 'components/atoms/HistoryButton'
import TernCard from 'components/atoms/TernCard'
import TernPlayer from 'components/atoms/TernPlayer'
import { ROLES } from 'lib/const'
import { Role } from 'types'
import { IPlayerStatus, IPlayerStatuses } from 'types/database'

interface LeftSidebarProps {
    action: Role
    playerStatuses: IPlayerStatuses
    tern: number
}

const LeftSidebar = (props: LeftSidebarProps) => {
    const sortedPlayerStatuses = (
        Object.entries(props.playerStatuses) as [string, IPlayerStatus][]
    ).sort(
        ([, playerStatus1], [, playerStatus2]) =>
            Object.keys(ROLES).indexOf(playerStatus1.role) -
            Object.keys(ROLES).indexOf(playerStatus2.role),
    )

    return (
        <div className="h-screen w-64 flex-none">
            <div className="mt-10">
                <TernCard tern={props.tern} />
            </div>
            <div className="h-92 mt-14 text-right">
                {sortedPlayerStatuses.map(([index, playerStatus]) => (
                    <div className="mt-2" key={index}>
                        <TernPlayer
                            name={props.playerStatuses[index].name}
                            borderColor={`bg-${playerStatus.role}`}
                            textColor={`text-${playerStatus.role}`}
                            isActive={
                                props.action ===
                                props.playerStatuses[index].role
                            }
                        />
                    </div>
                ))}
            </div>
            <div className="mt-28 pr-6 text-right">
                <HistoryButton />
            </div>
        </div>
    )
}

export default LeftSidebar
