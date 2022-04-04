import Counter from 'components/atoms/Counter'
import HistoryButton from 'components/atoms/HistoryButton'
import MemberBoards from 'components/molecules/MemberBoards'
import { Link } from 'react-router-dom'
import { Position, Role } from 'types'
import { IHasMoved, IPlayerStatus, ITern } from 'types/database'

interface LeftSidebarProps {
    action: Position
    hasMoved: IHasMoved
    myRole: Role
    roomId: number
    sortedPlayerStatuses: [string, IPlayerStatus][]
    tern: ITern
}

const LeftSidebar = (props: LeftSidebarProps) => (
    <div className="h-screen w-64 flex-none">
        <div className="mt-10">
            <Counter count={props.tern.count} />
        </div>
        <div className="h-92 mt-14 text-right">
            <MemberBoards
                hasMoved={props.hasMoved}
                sortedPlayerStatuses={props.sortedPlayerStatuses}
                tern={props.tern}
            />
        </div>
        <div className="mt-12 pr-5 text-right">
            <HistoryButton roomId={props.roomId} />
        </div>
        Debug:{' '}
        <Link className="mt-20" to="/">
            Home
        </Link>
    </div>
)

export default LeftSidebar
