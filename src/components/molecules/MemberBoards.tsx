import MemberBoard from 'components/atoms/MemberBoard'
import { isTern } from 'lib/util'
import React from 'react'
import { IHasMoved, IPlayerStatus, ITern } from 'types/database'

interface MemberBoardsProps {
    hasMoved: IHasMoved
    sortedPlayerStatuses: [string, IPlayerStatus][]
    tern: ITern
}

const MemberBoards = React.memo((props: MemberBoardsProps) => (
    <>
        {props.hasMoved &&
            props.sortedPlayerStatuses.map(([index, playerStatus]) => (
                <div className="mt-2" key={index}>
                    <MemberBoard
                        name={playerStatus.name}
                        borderColor={`bg-${playerStatus.role}`}
                        textColor={`text-${playerStatus.role}`}
                        isActive={isTern(playerStatus.role, props.tern)}
                    />
                </div>
            ))}
    </>
))

export default MemberBoards
