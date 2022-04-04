import { coordinate } from 'lib/coordinate'
import React from 'react'
import { useEffect, useRef, useState } from 'react'
import { Role } from 'types'
import { ICards, IPosition, ITern } from 'types/database'
import TransitionContainers from './TransitionContainers'

interface CenterContentsProps {
    cards: ICards
    isMyTern: boolean
    isThief: boolean
    myPosition: number
    myRole: Role
    positions: IPosition
    roomId: number
    tern: ITern
}

const CenterContents = React.memo((props: CenterContentsProps) => {
    const mapImageRef = useRef<HTMLImageElement>(null)
    const [mapImageWidth, setMapImageWidth] = useState(0)

    const [isSelectingDoubleCard, setIsSelectingDoubleCard] = useState(false)

    useEffect(() => {
        if (mapImageRef?.current)
            setMapImageWidth(mapImageRef.current.offsetWidth)
    }, [mapImageRef?.current?.offsetWidth])

    return (
        <>
            <div className="relative h-3/4">
                <img
                    style={{ display: 'block' }}
                    className="h-full"
                    src="/map.png"
                    alt="マップ"
                    ref={mapImageRef}
                />
                <div className="absolute top-0 bottom-0 right-0 left-0">
                    {(Object.entries(props.positions) as [Role, number][]).map(
                        ([role, position]) =>
                            (props.isThief || role !== ('thief' as Role)) && (
                                <div
                                    className="absolute flex"
                                    key={role}
                                    style={{
                                        top: `${coordinate[position - 1].x}%`,
                                        left: `${coordinate[position - 1].y}%`,
                                    }}
                                >
                                    <span
                                        className={`bg-${role} absolute inline-flex h-full w-full animate-[ping_3s_linear_infinite] rounded-full opacity-25`}
                                    />
                                    <div
                                        className={`inline-block h-12 w-12 rounded-full border-4 border-${role} bg-white/40`}
                                    />
                                </div>
                            ),
                    )}
                </div>
            </div>
            {mapImageWidth && props.myPosition > 0 && props.isMyTern && (
                <div
                    className="mt-6 grid grid-cols-2 gap-x-20 gap-y-2"
                    style={{ width: `${mapImageWidth}px` }}
                >
                    <TransitionContainers
                        cards={props.cards}
                        isThief={props.isThief}
                        isSelectingDoubleCard={isSelectingDoubleCard}
                        myPosition={props.myPosition}
                        myRole={props.myRole}
                        roomId={props.roomId}
                        setIsSelectingDoubleCard={setIsSelectingDoubleCard}
                        tern={props.tern}
                    />
                </div>
            )}
        </>
    )
})

export default CenterContents
