import SelectBox from 'components/atoms/SelectBox'
import { CARD } from 'lib/const'
import { position } from 'lib/position'
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

    const tempRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (mapImageRef?.current)
            setMapImageWidth(mapImageRef.current.offsetWidth)
        if (tempRef.current)
            tempRef.current.addEventListener('click', (event: any) => {
                var clickX = event.pageX
                var clickY = event.pageY

                // 要素の位置を取得
                var clientRect = tempRef.current!.getBoundingClientRect()
                var positionX = clientRect.left + window.pageXOffset
                var positionY = clientRect.top + window.pageYOffset

                // 要素内におけるクリック位置を計算
                console.log('(X, Y)')
                console.log(
                    `${((clickY - positionY - 24) * 100) / 738}, ${
                        ((clickX - positionX - 24) * 100) / 984
                    }`,
                )
            })
    }, [mapImageRef?.current?.offsetWidth])

    return (
        <>
            <div ref={tempRef} className="relative h-3/4">
                <img
                    style={{ display: 'block' }}
                    className="h-full"
                    src="/map.png"
                    alt="マップ"
                    ref={mapImageRef}
                />
                <div className="absolute top-0 bottom-0 right-0 left-0">
                    {position.map(({ x, y }) => (
                        <div
                            key={x.toString() + y.toString()}
                            style={{
                                top: `${x}%`,
                                left: `${y}%`,
                            }}
                            className="absolute inline-block h-12 w-12 rounded-full border-4 border-red-500 bg-red-500/30"
                        />
                    ))}
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
