import TransitionContainer from 'components/molecules/TransitionContainer'
import { CARD } from 'lib/const'
import React from 'react'
import { Role } from 'types'
import { ICard, ICards, ITern } from 'types/database'

interface TransitionContainersProps {
    cards: ICards
    isSelectingDoubleCard: boolean
    isThief: boolean
    myPosition: number
    myRole: Role
    roomId: number
    setIsSelectingDoubleCard: Function
    tern: ITern
}

const TransitionContainers = React.memo((props: TransitionContainersProps) => {
    return (
        <>
            {props.myRole in props.cards &&
                (Object.entries(CARD) as [keyof ICard, string][]).map(
                    ([cardKey, cardValue]) => (
                        <TransitionContainer
                            cardKey={cardKey}
                            cardValue={cardValue}
                            cards={props.cards}
                            isThief={props.isThief}
                            isSelectingDoubleCard={props.isSelectingDoubleCard}
                            myPosition={props.myPosition}
                            myRole={props.myRole}
                            roomId={props.roomId}
                            setIsSelectingDoubleCard={
                                props.setIsSelectingDoubleCard
                            }
                            tern={props.tern}
                            key={cardKey}
                        />
                    ),
                )}
        </>
    )
})

export default TransitionContainers
