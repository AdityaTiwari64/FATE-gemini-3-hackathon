import { useState } from 'react'
import { GameProvider, useGameState, useGameDispatch } from './context/GameContext'
import { getScenarioByMonth } from './data/mockData'
import Header from './components/Header'
import StatsPanel from './components/StatsPanel'
import ScenarioCard from './components/ScenarioCard'
import HistoryPanel from './components/HistoryPanel'
import './App.css'

function GameContent() {
  const gameState = useGameState()
  const dispatch = useGameDispatch()
  const [currentScenario, setCurrentScenario] = useState(() => getScenarioByMonth(gameState.month))

  const handleChoiceSelect = (choice) => {
    dispatch({ type: 'SELECT_CHOICE', payload: { choice } })
    dispatch({ type: 'NEXT_MONTH' })

    // Load next scenario after a brief delay
    setTimeout(() => {
      setCurrentScenario(getScenarioByMonth(gameState.month + 1))
    }, 300)
  }

  return (
    <div className="app">
      <Header
        balance={gameState.balance}
        month={gameState.month}
        isActive={true}
      />

      <main className="app-layout">
        <StatsPanel gameState={gameState} />

        <ScenarioCard
          scenario={currentScenario}
          onChoiceSelect={handleChoiceSelect}
        />

        <HistoryPanel history={gameState.history} />
      </main>

      <footer className="app-footer">
        <span className="footer-text">WAITING FOR YOUR INPUT, TRAVELER.</span>
      </footer>
    </div>
  )
}

function App() {
  return (
    <GameProvider>
      <GameContent />
    </GameProvider>
  )
}

export default App
