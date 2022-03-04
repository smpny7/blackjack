import AuthenticatedGuard from 'AuthenticatedGuard'
import WaitingRoom from 'pages/WaitingRoom'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import Home from './pages/Home'

const App = () => {
    return (
        <Router>
            <Routes>
                <Route
                    path="/waiting-room"
                    element={
                        <AuthenticatedGuard>
                            <WaitingRoom />
                        </AuthenticatedGuard>
                    }
                />
                <Route path="/" element={<Home />} />
            </Routes>
        </Router>
    )
}

export default App
