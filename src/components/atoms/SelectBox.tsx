import { CARD } from 'lib/const'
import { route } from 'lib/route'
import { Role, Transportation } from 'types'
import { ICard, ICards } from 'types/database'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

interface SelectBoxProps {
    cardKey: keyof ICard
    cardValue: string
    cards: ICards
    myPosition: number
    myRole: Role
    submitNextPosition: Function
    isSelectingDoubleCard: boolean
    setIsSelectingDoubleCard: Function
}

const SelectBox = (props: SelectBoxProps) => {
    const positionsByBlackCard = (
        Object.entries(route[props.myPosition - 1]) as [
            Transportation,
            number[],
        ][]
    )
        .map(([, nextPositions]) => nextPositions.flat())
        .flat()

    const sortedPositionsByBlackCard = Array.from(
        new Set(positionsByBlackCard),
    ).sort((a, b) => {
        if (a < b) return -1
        if (a > b) return 1
        return 0
    })

    const MySwal = withReactContent(Swal)

    return (
        <div className="grid grid-cols-2 gap-4" key={props.cardKey}>
            <div className="text-left">
                <img
                    className="inline-block h-12"
                    src={`/img/${props.cardKey}.png`}
                    alt={props.cardValue}
                />
                <p className="relative top-1.5 inline-block border-b-2 border-white pl-3 pr-1 text-lg font-semibold tracking-widest text-white drop-shadow-[1px_1px_0_rgba(0,0,0,0.2)]">
                    残り{' '}
                    <span className="text-3xl">
                        {(
                            '00' + props.cards[props.myRole][props.cardKey]
                        ).slice(-2)}
                    </span>
                    枚
                </p>
            </div>

            {/* ダブル・ムーブ・カードではない時 */}
            {props.cardKey !== 'double' && (
                <select
                    className="select select-bordered ml-4 w-4/5 max-w-xs"
                    onChange={(e) =>
                        MySwal.fire({
                            title: '確認',
                            text: `${CARD[props.cardKey]}を使用して${
                                e.target.value
                            }に移動しますか？`,
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonColor: '#3085d6',
                            confirmButtonAriaLabel: 'はい',
                            confirmButtonText: 'はい',
                            cancelButtonColor: '#d33',
                            cancelButtonText: 'いいえ',
                            cancelButtonAriaLabel: 'いいえ',
                        }).then((result) => {
                            if (result.isConfirmed) {
                                props.submitNextPosition(
                                    props.cardKey,
                                    e.target.value,
                                )
                                MySwal.fire({
                                    position: 'top-end',
                                    icon: 'success',
                                    title: `${CARD[props.cardKey]}を使用して${
                                        e.target.value
                                    }に移動しました`,
                                    showConfirmButton: false,
                                    timer: 1500,
                                })
                            }
                            e.target.value = '0'
                        })
                    }
                    disabled={
                        !props.cards[props.myRole][props.cardKey] ||
                        (props.cardKey !== 'black' &&
                            !route[props.myPosition - 1][props.cardKey].length)
                    }
                >
                    <option selected disabled value={0}>
                        {props.cardKey !== 'black'
                            ? route[props.myPosition - 1][props.cardKey].length
                            : sortedPositionsByBlackCard.length}
                        ヶ所から選択
                    </option>

                    {/* ブラック・チケットではない時 */}
                    {props.cardKey !== 'black' &&
                        route[props.myPosition - 1][props.cardKey].map(
                            (nextPosition) => (
                                <option value={nextPosition}>
                                    {nextPosition}
                                </option>
                            ),
                        )}

                    {/* ブラック・チケットの時 */}
                    {props.cardKey === 'black' &&
                        sortedPositionsByBlackCard.map((nextPosition) => (
                            <option value={nextPosition}>{nextPosition}</option>
                        ))}
                </select>
            )}

            {/* ダブル・ムーブ・カードの時 */}
            {props.cardKey === 'double' && (
                <button
                    onClick={() =>
                        MySwal.fire({
                            title: '確認',
                            text: `${CARD[props.cardKey]}を使用しますか？`,
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonColor: '#3085d6',
                            confirmButtonAriaLabel: 'はい',
                            confirmButtonText: 'はい',
                            cancelButtonColor: '#d33',
                            cancelButtonText: 'いいえ',
                            cancelButtonAriaLabel: 'いいえ',
                        }).then((result) => {
                            if (result.isConfirmed) {
                                props.setIsSelectingDoubleCard(true)
                                MySwal.fire({
                                    position: 'top-end',
                                    icon: 'success',
                                    title: `${
                                        CARD[props.cardKey]
                                    }を使用しました`,
                                    showConfirmButton: false,
                                    timer: 1500,
                                })
                            }
                        })
                    }
                    disabled={props.isSelectingDoubleCard}
                    className="btn ml-4 w-4/5 border-accent/90 bg-accent/90 tracking-widest hover:scale-105 hover:border-accent/90 hover:bg-accent/90 disabled:border-accent/80 disabled:bg-accent/80"
                >
                    使用
                </button>
            )}
        </div>
    )
}

export default SelectBox
