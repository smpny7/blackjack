import HistoryButton from 'components/atoms/HistoryButton'
import TernCard from 'components/atoms/TernCard'
import TernPlayer from 'components/atoms/TernPlayer'
import { isTern } from 'lib/util'
import { Link } from 'react-router-dom'
import { Position, Role } from 'types'
import { IHasMoved, IPlayerStatus, ITern } from 'types/database'

interface LeftSidebarProps {
    action: Position
    hasMoved: IHasMoved
    myRole: Role
    sortedPlayerStatuses: [string, IPlayerStatus][]
    tern: ITern
}

const LeftSidebar = (props: LeftSidebarProps) => {
    console.log('props.hasMoved')
    console.log(props.hasMoved)
    return (
        <div className="h-screen w-64 flex-none">
            <div className="mt-10">
                <TernCard count={props.tern.count} />
            </div>
            <div className="h-92 mt-14 text-right">
                {props.hasMoved &&
                    props.sortedPlayerStatuses.map(([index, playerStatus]) => (
                        <div className="mt-2" key={index}>
                            <TernPlayer
                                name={playerStatus.name}
                                borderColor={`bg-${playerStatus.role}`}
                                textColor={`text-${playerStatus.role}`}
                                isActive={isTern(playerStatus.role, props.tern)}
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
}

export default LeftSidebar
