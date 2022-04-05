import AuthenticatedGuard from 'components/template/AuthenticatedGuard'
import PlayRoom from 'pages/PlayRoom'
import WaitingRoom from 'pages/WaitingRoom'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import Home from './pages/Home'

const App = () => {
    return (
        <Router>
            <Routes>
                <Route
                    path="/waiting-room/:roomId"
                    element={
                        <AuthenticatedGuard>
                            <WaitingRoom />
                        </AuthenticatedGuard>
                    }
                />
                <Route
                    path="/play-room"
                    element={
                        <AuthenticatedGuard>
                            <PlayRoom />
                        </AuthenticatedGuard>
                    }
                />
                <Route path="/" element={<Home />} />
                <Route
                    path="*"
                    element={
                        <main style={{ padding: '1rem' }}>
                            <p>There's nothing here!</p>
                        </main>
                    }
                />
            </Routes>
        </Router>
    )
}

export default App
