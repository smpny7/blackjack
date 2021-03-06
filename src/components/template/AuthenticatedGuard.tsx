import { FC } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { UserStore } from 'types/store'

const AuthenticatedGuard: FC = ({ children }) => {
    const user = useSelector((state: UserStore) => state.user)
    const isAuthenticated = user && user.uid !== undefined

    const location = useLocation()

    return isAuthenticated ? (
        <>{children}</>
    ) : (
        <Navigate to="/" state={{ from: location }} replace />
    )
}

export default AuthenticatedGuard
