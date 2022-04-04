import { update } from 'firebase/database'
import { CARD } from 'lib/const'
import { useDatabase } from 'lib/database'
import { route } from 'lib/route'
import React, { useState } from 'react'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { Role, Transportation } from 'types'
import { ICard, ICards, ITern } from 'types/database'

interface SelectBoxProps {
    cardKey: keyof ICard
    cards: ICards
    isSelectingDoubleCard: boolean
    isThief: boolean
    myPosition: number
    myRole: Role
    roomId: number
    setIsSelectingDoubleCard: Function
    tern: ITern
}

const SelectBox = React.memo((props: SelectBoxProps) => {
    const reactSwal = withReactContent(Swal)

    // State
    const [isSelectingBlackCard, setIsSelectingBlackCard] = useState(false)

    // Realtime Database Ref
    const hasMovedRef = useDatabase(`terns/${props.roomId}/hasMoved`)
    const historyRef = useDatabase(`history/${props.roomId}`)
    const positionRef = useDatabase(`positions/${props.roomId}`)
    const ternRef = useDatabase(`terns/${props.roomId}`)
    const transportationRef = useDatabase(
        `cards/${props.roomId}/${props.myRole}`,
    )

    const disabled =
        !props.cards[props.myRole][props.cardKey] ||
        (props.cardKey !== 'black' &&
            props.cardKey !== 'double' &&
            !route[props.myPosition - 1][props.cardKey].length) // カードがない or ルートがない時

    const positionsForBlackCard = (
        Object.entries(route[props.myPosition - 1]) as [
            Transportation,
            number[],
        ][]
    )
        .map(([, nextPositions]) => nextPositions.flat())
        .flat()

    const sortedPositionsForBlackCard = Array.from(
        new Set(positionsForBlackCard),
    ).sort((a, b) => {
        if (a < b) return -1
        if (a > b) return 1
        return 0
    })

    const movablePosition =
        props.cardKey !== 'black' && props.cardKey !== 'double'
            ? route[props.myPosition - 1][props.cardKey]
            : sortedPositionsForBlackCard

    const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const nextPosition = Number(e.target.value)
        const result = await reactSwal.fire({
            title: '確認',
            text: `${
                CARD[props.cardKey]
            }を使用して${nextPosition}に移動しますか？`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#59AFE0',
            confirmButtonAriaLabel: 'はい',
            confirmButtonText: 'はい',
            cancelButtonColor: '#A3A3A3',
            cancelButtonText: 'いいえ',
            cancelButtonAriaLabel: 'いいえ',
        })
        if (result.isConfirmed) {
            submitNextPosition(props.cardKey, nextPosition)
            reactSwal.fire({
                position: 'top-end',
                icon: 'success',
                title: `${
                    CARD[props.cardKey]
                }を使用して${nextPosition}に移動しました`,
                showConfirmButton: false,
                timer: 1500,
            })
        }
        e.target.value = '0'
    }

    const submitNextPosition = (
        transportation: keyof ICard,
        nextPosition: number,
    ) => {
        if (isSelectingBlackCard) transportation = 'black'

        // カードの残数を更新
        update(transportationRef, {
            [transportation]: props.cards[props.myRole][transportation] - 1,
        })

        // 座標を更新
        update(positionRef, { [props.myRole]: nextPosition })

        // 使用履歴を更新
        if (props.isThief)
            update(historyRef, {
                [props.tern.count]: {
                    position: nextPosition,
                    card: transportation,
                },
            })

        if (props.isSelectingDoubleCard) {
            // ダブルカードを消費
            update(transportationRef, {
                double: props.cards[props.myRole].double - 1,
            })
        } else {
            if (props.isThief) {
                update(ternRef, {
                    action: 'player',
                    hasMoved: {
                        thief: true,
                        player1: false,
                        player2: true, // TODO: false
                        player3: true, // TODO: false
                        player4: true, // TODO: false
                        player5: true, // TODO: false
                    },
                })
            } else {
                update(hasMovedRef, { [props.myRole]: true })
                if (
                    (
                        Object.entries(props.tern.hasMoved) as [Role, boolean][]
                    ).filter(([, hasMoved]) => !hasMoved).length === 1
                ) {
                    update(ternRef, {
                        action: 'thief',
                    })

                    // ターン数を更新
                    update(ternRef, { count: props.tern.count + 1 })
                }
            }
        }

        setIsSelectingBlackCard(false)
        props.setIsSelectingDoubleCard(false)
    }

    return (
        <select
            className="select select-bordered ml-4 w-4/5 max-w-xs"
            onChange={handleChange}
            disabled={disabled}
        >
            <option selected disabled value={0}>
                {movablePosition.length}ヶ所から選択
            </option>

            {movablePosition.map((nextPosition) => (
                <option value={nextPosition} key={nextPosition}>
                    {nextPosition}
                </option>
            ))}
        </select>
    )
})

export default SelectBox
