import { FC } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Store } from 'stores'

const AuthenticatedGuard: FC = ({ children }) => {
    const user = useSelector((state: Store) => state.user)

    const isAuthenticated = user.uid !== undefined
    console.log(isAuthenticated)
    console.log(user.uid)

    const location = useLocation()

    return isAuthenticated ? (
        <>{children}</>
    ) : (
        <Navigate to="/" state={{ from: location }} replace />
    )
}

export default AuthenticatedGuard
