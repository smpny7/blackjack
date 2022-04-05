import { CARD } from 'lib/data/const'
import React from 'react'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { Role } from 'types'
import { ICard, ICards, ITern } from 'types/database'

interface UseButtonProps {
    cardKey: keyof ICard
    cards: ICards
    isSelectingDoubleCard: boolean
    isThief: boolean
    myRole: Role
    setIsSelectingDoubleCard: Function
    tern: ITern
}

const UseButton = React.memo((props: UseButtonProps) => {
    const reactSwal = withReactContent(Swal)

    return (
        <button
            onClick={() =>
                reactSwal
                    .fire({
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
                    })
                    .then((result) => {
                        if (result.isConfirmed) {
                            props.setIsSelectingDoubleCard(true)
                            reactSwal.fire({
                                position: 'top-end',
                                icon: 'success',
                                title: `${CARD[props.cardKey]}を使用しました`,
                                showConfirmButton: false,
                                timer: 1500,
                            })
                        }
                    })
            }
            disabled={
                !props.isThief ||
                props.isSelectingDoubleCard ||
                !props.cards[props.myRole][props.cardKey]
            }
            className="btn ml-4 w-4/5 border-accent/90 bg-accent/90 tracking-widest hover:scale-105 hover:border-accent/90 hover:bg-accent/90 disabled:border-accent/80 disabled:bg-accent/80"
        >
            使用
        </button>
    )
})

export default UseButton
