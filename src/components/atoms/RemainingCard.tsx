import React from 'react'
import { ICard } from 'types/database'

interface RemainingCardProps {
    cardKey: keyof ICard
    cardValue: string
    remainCards: number
}

const RemainingCard = React.memo((props: RemainingCardProps) => (
    <div className="text-left">
        <img
            className="inline-block h-12"
            src={`/img/${props.cardKey}.png`}
            alt={props.cardValue}
        />
        <p className="relative top-1.5 inline-block border-b-2 border-white pl-3 pr-1 text-lg font-semibold tracking-widest text-white drop-shadow-[1px_1px_0_rgba(0,0,0,0.2)]">
            残り{' '}
            <span className="text-3xl">
                {('00' + props.remainCards).slice(-2)}
            </span>
            枚
        </p>
    </div>
))

export default RemainingCard
