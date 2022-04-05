import {
    DatabaseReference,
    DataSnapshot,
    off,
    onValue,
    ref,
} from 'firebase/database'
import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { UserStore } from 'types/store'
import { isDebug } from './debug'
import { db } from './firebase'
import { fetchLog } from './log'

/**
 * Returns a `Reference` to any path in the Realtime Database.
 */
export const useReference = (path: string) =>
    useMemo(() => ref(db, path), [path])

/**
 * Returns the `Data` in the `Realtime Database Reference`,
 * retrieves the `Data` when an update is detected and returns it again
 */
export const useListenData = <T>(ref: DatabaseReference): T => {
    const user = useSelector((state: UserStore) => state.user)
    const [data, setData] = useState<T>({} as T)
    useEffect(() => {
        onValue(ref, (snapshot: DataSnapshot) => {
            setData(snapshot?.val() ? snapshot.val() : ({} as T))
            if (isDebug) fetchLog(snapshot?.val())
        })
        return () => {
            off(ref)
        }
    }, [user.uid, ref])
    return data
}
