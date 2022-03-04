import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Store } from 'stores'

const WaitingRoom = () => {
    const user = useSelector((state: Store) => state.user)

    return (
        <div>
            <Link to="/">Home</Link>
            <p>Waiting Room</p>
            <p>{JSON.stringify(user)}</p>
            <p>ログインしてます{user.uid !== undefined ? 'true' : 'false'}</p>
        </div>
    )
}

export default WaitingRoom
