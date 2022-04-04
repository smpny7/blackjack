import Avatar from 'components/atoms/Avatar'
import { isTern } from 'lib/util'
import React from 'react'
import { ICards, IPlayerStatus, ITern } from 'types/database'

interface AvatarContainerProps {
    cards: ICards
    playerStatuses: [string, IPlayerStatus][]
    tern: ITern
    titleSrc: string
    titleAlt: string
}

const AvatarContainer = React.memo((props: AvatarContainerProps) => (
    <div className="relative">
        <img
            className="relative z-10 inline-block h-8 drop-shadow-lg"
            src={props.titleSrc}
            alt={props.titleAlt}
        />
        <div className="relative -top-4 z-0 grid grid-cols-2 rounded-2xl bg-white/80 px-3 py-8 drop-shadow-xl">
            {props.playerStatuses.map(([index, playerStatus]) => (
                <Avatar
                    cards={props.cards}
                    isTern={isTern(playerStatus.role, props.tern)}
                    playerStatus={playerStatus}
                    key={index}
                />
            ))}
        </div>
    </div>
))

export default AvatarContainer
