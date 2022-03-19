import SelectBox from 'components/atoms/SelectBox'
import { CARD } from 'lib/const'
import { useEffect, useRef, useState } from 'react'
import { Role } from 'types'
import { ICard, ICards } from 'types/database'

interface CenterContentsProps {
    cards: ICards
    isMyTern: boolean
    myPosition: number
    myRole: Role
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
            <div className="h-3/4">
                <img
                    style={{ display: 'block' }}
                    className="h-full"
                    src="/map.png"
                    alt="マップ"
                    ref={mapImageRef}
                />
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
