import {
    DatabaseReference,
    DataSnapshot,
    off,
    onValue,
    ref,
} from 'firebase/database'
import { useEffect, useMemo, useState } from 'react'
import { db } from './firebase'

export const useDatabase = () => {
    // 同じパスでは毎回同じ結果が得られるのでmemo化しておく
    return useMemo(() => ref(db, 'rooms'), [])
}

export const useFetchData = (ref: DatabaseReference) => {
    console.log('useFetchData')
    const [rooms, setRooms] = useState([])
    useEffect(() => {
        // イベントリスナーを追加するにはonを使う
        onValue(ref, (snapshot: DataSnapshot) => {
            // パスに対する全データを含むsnapshotが渡される
            // ない場合はnullが変えるので存在をチェックしておく
            if (snapshot?.val()) {
                console.log(snapshot.val())
                setRooms(snapshot.val())
            } else {
                setRooms([])
            }
        })
        return () => {
            off(ref)
        }
        // refの変更に応じて再取得する
    }, [ref])
    // データを返却する
    return rooms
}
