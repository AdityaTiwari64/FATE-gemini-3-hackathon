import AuthGate from './components/AuthGate'
import LandingPage from './components/LandingPage'
import PreferencesSetup from './pages/PreferencesSetup'
import Dashboard from './pages/Dashboard'
import Simulation from './pages/Simulation'

import { GameProvider } from './context/GameContext'

function App() {
  return (
    <GameProvider>
      <AuthGate
        LandingComponent={LandingPage}
        SetupComponent={PreferencesSetup}
        DashboardComponent={Dashboard}
        SimulationComponent={Simulation}
      />
    </GameProvider>
  )
}

export default App
