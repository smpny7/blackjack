import { CARD } from 'lib/const'
import { route } from 'lib/route'
import { useEffect, useRef, useState } from 'react'
import { Role } from 'types'
import { ICard, ICards } from 'types/database'

interface CenterContentsProps {
    cards: ICards
    myPosition: number
    myRole: Role
    submitNextPosition: Function
}

const CenterContents = (props: CenterContentsProps) => {
    const mapImageRef = useRef<HTMLImageElement>(null)
    const [mapImageWidth, setMapImageWidth] = useState(0)

    useEffect(() => {
        if (mapImageRef?.current)
            setMapImageWidth(mapImageRef.current.offsetWidth)
    })

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
            {mapImageWidth && props.myPosition > 0 && (
                <div
                    className="mt-6 grid grid-cols-2 gap-x-20 gap-y-2"
                    style={{ width: `${mapImageWidth}px` }}
                >
                    {props.myRole in props.cards &&
                        (Object.entries(CARD) as [keyof ICard, string][]).map(
                            ([cardKey, cardValue]) => (
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="text-left">
                                        <img
                                            className="inline-block h-12"
                                            src={`/img/${cardKey}.png`}
                                            alt={cardValue}
                                        />
                                        <p className="relative top-1.5 inline-block border-b-2 border-white pl-3 pr-1 text-lg font-semibold tracking-widest text-white drop-shadow-[1px_1px_0_rgba(0,0,0,0.2)]">
                                            残り{' '}
                                            <span className="text-3xl">
                                                {(
                                                    '00' +
                                                    props.cards[props.myRole][
                                                        cardKey
                                                    ]
                                                ).slice(-2)}
                                            </span>
                                            枚
                                        </p>
                                    </div>
                                    {cardKey !== 'double' && (
                                        <select
                                            className="select select-bordered ml-4 w-4/5 max-w-xs"
                                            disabled={
                                                !props.cards[props.myRole][
                                                    cardKey
                                                ] ||
                                                (cardKey !== 'black' &&
                                                    !route[
                                                        props.myPosition - 1
                                                    ][cardKey].length)
                                            }
                                        >
                                            <option selected>
                                                {cardKey !== 'black'
                                                    ? route[
                                                          props.myPosition - 1
                                                      ][cardKey].length
                                                    : 100}
                                                ヶ所から選択
                                            </option>

                                            {cardKey !== 'black' &&
                                                route[props.myPosition - 1][
                                                    cardKey
                                                ].map((nextPosition) => (
                                                    <option>
                                                        {nextPosition}
                                                    </option>
                                                ))}
                                        </select>
                                    )}
                                    {cardKey === 'double' && (
                                        <button className="btn ml-4 w-4/5 border-accent/90 bg-accent/90 tracking-widest hover:scale-105 hover:border-accent/90 hover:bg-accent/90 disabled:border-accent/80 disabled:bg-accent/80">
                                            使用
                                        </button>
                                    )}
                                    {/* </div> */}
                                </div>
                            ),
                        )}
                </div>
            )}
        </>
    )
}

export default CenterContents
