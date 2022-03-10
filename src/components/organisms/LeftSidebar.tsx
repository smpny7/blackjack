import HistoryButton from 'components/atoms/HistoryButton'
import TernCard from 'components/atoms/TernCard'
import TernPlayer from 'components/atoms/TernPlayer'
import { Link } from 'react-router-dom'
import { Role } from 'types'
import { IPlayerStatus } from 'types/database'

interface LeftSidebarProps {
    action: Role
    sortedPlayerStatuses: [string, IPlayerStatus][]
    tern: number
}

const LeftSidebar = (props: LeftSidebarProps) => (
    <div className="h-screen w-64 flex-none">
        <div className="mt-10">
            <TernCard tern={props.tern} />
        </div>
        <div className="h-92 mt-14 text-right">
            {props.sortedPlayerStatuses.map(([index, playerStatus]) => (
                <div className="mt-2" key={index}>
                    <TernPlayer
                        name={playerStatus.name}
                        borderColor={`bg-${playerStatus.role}`}
                        textColor={`text-${playerStatus.role}`}
                        isActive={props.action === playerStatus.role}
                    />
                </div>
            ))}
        </div>
        <div className="mt-12 pr-5 text-right">
            <HistoryButton />
        </div>
        Debug:{' '}
        <Link className="mt-20" to="/">
            Home
        </Link>
    </div>
)

export default LeftSidebar
