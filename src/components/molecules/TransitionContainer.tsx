import SelectBox from 'components/atoms/SelectBox'
import UseButton from 'components/atoms/UseButton'
import React from 'react'
import { Role } from 'types'
import { ICard, ICards, ITern } from 'types/database'
import RemainingCard from '../atoms/RemainingCard'

interface TransitionContainerProps {
    cardKey: keyof ICard
    cardValue: string
    cards: ICards
    isSelectingDoubleCard: boolean
    isThief: boolean
    myPosition: number
    myRole: Role
    roomId: number
    setIsSelectingDoubleCard: Function
    tern: ITern
}

const TransitionContainer = React.memo((props: TransitionContainerProps) => {
    return (
        <div className="grid grid-cols-2 gap-4" key={props.cardKey}>
            <RemainingCard
                cardKey={props.cardKey}
                cardValue={props.cardValue}
                remainCards={props.cards[props.myRole][props.cardKey]}
            />

            {props.cardKey !== 'double' ? (
                <SelectBox
                    cardKey={props.cardKey}
                    cards={props.cards}
                    isSelectingDoubleCard={props.isSelectingDoubleCard}
                    isThief={props.isThief}
                    myPosition={props.myPosition}
                    myRole={props.myRole}
                    roomId={props.roomId}
                    setIsSelectingDoubleCard={props.setIsSelectingDoubleCard}
                    tern={props.tern}
                    key={props.cardKey}
                />
            ) : (
                <UseButton
                    cardKey={props.cardKey}
                    cards={props.cards}
                    isSelectingDoubleCard={props.isSelectingDoubleCard}
                    isThief={props.isThief}
                    myRole={props.myRole}
                    setIsSelectingDoubleCard={props.setIsSelectingDoubleCard}
                    tern={props.tern}
                />
            )}
        </div>
    )
})

export default TransitionContainer
