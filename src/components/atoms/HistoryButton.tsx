import { OPEN_TERN } from 'lib/data/const'
import { useReference, useListenData } from 'lib/database'
import React from 'react'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { IHistories, IHistory } from 'types/database'

interface HistoryButtonProps {
    roomId: number
}

const HistoryButton = React.memo((props: HistoryButtonProps) => {
    const reactSwal = withReactContent(Swal)

    // ▼ Realtime Database Ref ▼
    const historyRef = useReference(`history/${props.roomId}`)

    // ▼ Realtime Database Data ▼
    const histories = useListenData<IHistories>(historyRef)

    const showModal = () => {
        reactSwal.fire({
            title: '怪盗Xの行動履歴',
            html: (
                <table style={{ border: 'black solid 1px' }}>
                    <tr>
                        <th>ターン</th>
                        <th>使用カード</th>
                        <th>位置</th>
                    </tr>
                    {(Object.entries(histories) as [string, IHistory][]).map(
                        ([index, history]) =>
                            index !== '0' && (
                                <tr key={index}>
                                    <td>{index}</td>
                                    <td>{history?.card ?? '初期ポジション'}</td>
                                    <td>
                                        {OPEN_TERN.includes(Number(index))
                                            ? history.position
                                            : '？'}
                                    </td>
                                </tr>
                            ),
                    )}
                </table>
            ),
            showCloseButton: true,
            showConfirmButton: false,
        })
    }

    return (
        <button
            onClick={showModal}
            className="rounded-full border-4 border-history bg-white/70 py-2 pl-5 pr-7 drop-shadow-xl transition duration-150 ease-in-out hover:scale-105"
        >
            <img
                className="inline-block h-9 align-text-top"
                src={`${process.env.PUBLIC_URL}/img/escape.png`}
                alt="経路"
            />
            <span className="white-text-stroke ml-2 align-text-top text-2xl font-bold tracking-widest text-history">
                経路
            </span>
        </button>
    )
})

export default HistoryButton
