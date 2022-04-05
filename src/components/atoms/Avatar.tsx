import { CARD } from 'lib/data/const'
import { isPlayerCard } from 'lib/util'
import React from 'react'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { ICard, ICards, IPlayerStatus } from 'types/database'
import RemainingCard from './RemainingCard'

interface AvatarProps {
    cards: ICards
    isTern: boolean
    playerStatus: IPlayerStatus
}

const Avatar = React.memo((props: AvatarProps) => {
    const reactSwal = withReactContent(Swal)

    const showModal = () => {
        reactSwal.fire({
            title: `${props.playerStatus.name} の残りカード`,
            background: '#E0E0E0',
            html: (
                <>
                    {(Object.entries(CARD) as [keyof ICard, string][]).map(
                        ([cardKey, cardValue]) =>
                            (props.playerStatus.role === 'thief' ||
                                isPlayerCard(cardKey)) && (
                                <RemainingCard
                                    cardKey={cardKey}
                                    cardValue={cardValue}
                                    remainCards={
                                        props.cards[props.playerStatus.role][
                                            cardKey
                                        ]
                                    }
                                    key={cardKey}
                                />
                            ),
                    )}
                </>
            ),
            showCloseButton: true,
            showConfirmButton: false,
        })
    }

    return (
        <button className="mb-3 mt-2" onClick={showModal}>
            <div className="px-2">
                <div className="relative flex">
                    {props.isTern && (
                        <span
                            className={`bg-${props.playerStatus.role} absolute inline-flex h-full w-full animate-[ping_1.5s_linear_infinite] rounded-full opacity-50`}
                        />
                    )}
                    <img
                        className={`relative inline-flex rounded-full border-4 border-${props.playerStatus.role} bg-white`}
                        src={props.playerStatus.avatar}
                        alt={props.playerStatus.name}
                    />
                </div>
            </div>
            <div
                className={`inline-block rounded-full bg-${props.playerStatus.role} px-3`}
            >
                <div className="flex items-center py-0.5">
                    <span className="text-xs font-medium tracking-wider text-white drop-shadow-[1px_1px_0_rgba(0,0,0,0.2)]">
                        {props.playerStatus.name}
                    </span>
                </div>
            </div>
        </button>
    )
})

export default Avatar
