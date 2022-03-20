import SelectBox from 'components/atoms/SelectBox'
import { CARD } from 'lib/const'
import { coordinate } from 'lib/coordinate'
import { useEffect, useRef, useState } from 'react'
import { Role } from 'types'
import { ICard, ICards, IPosition } from 'types/database'

interface CenterContentsProps {
    cards: ICards
    isMyTern: boolean
    myPosition: number
    myRole: Role
    isThief: boolean
    positions: IPosition
    submitNextPosition: Function
    isSelectingDoubleCard: boolean
    setIsSelectingDoubleCard: Function
}

const CenterContents = (props: CenterContentsProps) => {
    const mapImageRef = useRef<HTMLImageElement>(null)
    const [mapImageWidth, setMapImageWidth] = useState(0)

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
                    {props.myRole in props.cards &&
                        (Object.entries(CARD) as [keyof ICard, string][]).map(
                            ([cardKey, cardValue]) => (
                                <SelectBox
                                    cardKey={cardKey}
                                    cardValue={cardValue}
                                    cards={props.cards}
                                    myPosition={props.myPosition}
                                    myRole={props.myRole}
                                    submitNextPosition={
                                        props.submitNextPosition
                                    }
                                    isSelectingDoubleCard={
                                        props.isSelectingDoubleCard
                                    }
                                    setIsSelectingDoubleCard={
                                        props.setIsSelectingDoubleCard
                                    }
                                />
                            ),
                        )}
                </div>
            )}
        </>
    )
}

export default CenterContents
