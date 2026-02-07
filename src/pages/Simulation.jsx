import { useState, useEffect } from 'react'
import { GameProvider, useGameState, useGameDispatch } from '../context/GameContext'
import { processChoice, getScenario } from '../utils/processChoice'

function SimulationContent() {
    const state = useGameState()
    const dispatch = useGameDispatch()
    const [scenario, setScenario] = useState(null)
    const [isProcessing, setIsProcessing] = useState(false)

    useEffect(() => {
        if (state.isLoaded) {
            setScenario(getScenario(state.month))
        }
    }, [state.isLoaded, state.month])

    const handleChoice = async (choice) => {
        setIsProcessing(true)

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500))

        const result = processChoice(choice.id, state)

        dispatch({
            type: 'PROCESS_CHOICE_RESULT',
            payload: result
        })

        dispatch({ type: 'NEXT_MONTH' })

        setIsProcessing(false)

        // Go to dashboard to show results
        window.location.hash = '#/dashboard'
    }

    if (!state.isLoaded || !scenario) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-fate-orange font-mono text-sm tracking-wider animate-pulse">
                    LOADING SCENARIO...
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-black text-white flex flex-col">
            {/* Header */}
            <header className="p-6 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-fate-orange rounded flex items-center justify-center font-bold text-black">
                        F
                    </div>
                    <span className="font-mono text-sm text-fate-text tracking-wider">FATE</span>
                    <span className="font-mono text-sm text-fate-muted">MONTH {String(state.month).padStart(2, '0')}</span>
                </div>
                <div className="font-mono text-right">
                    <div className="text-3xl font-bold">₹{state.balance.toLocaleString('en-IN')}</div>
                    <div className="text-xs text-fate-text tracking-widest">CURRENT LIQUIDITY</div>
                </div>
            </header>

            {/* Main Content - Centered Scenario */}
            <main className="flex-1 flex items-center justify-center px-8">
                <div className="max-w-3xl text-center">
                    <h1
                        className="font-heading text-3xl md:text-5xl font-bold leading-tight mb-12"
                        dangerouslySetInnerHTML={{ __html: scenario.text }}
                    />

                    <div className="flex flex-wrap justify-center gap-4">
                        {scenario.choices.map((choice) => (
                            <button
                                key={choice.id}
                                onClick={() => handleChoice(choice)}
                                disabled={isProcessing}
                                className={`px-8 py-4 rounded-full border-2 border-white/30 font-mono text-sm tracking-wider transition-all
                  ${isProcessing
                                        ? 'opacity-50 cursor-not-allowed'
                                        : 'hover:bg-white hover:text-black hover:border-white'
                                    }`}
                            >
                                {choice.label}
                            </button>
                        ))}
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="p-6 flex justify-between items-center border-t border-fate-gray/30">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => window.location.hash = '#/dashboard'}
                        className="w-10 h-10 border border-fate-gray rounded-full flex items-center justify-center hover:bg-fate-gray transition-colors"
                    >
                        ←
                    </button>
                    <div className="flex items-center gap-2">
                        {[1, 2, 3].map((num) => (
                            <span
                                key={num}
                                className={`font-mono text-sm ${num === ((state.month - 1) % 3) + 1
                                        ? 'text-white font-bold'
                                        : 'text-fate-muted'
                                    }`}
                            >
                                {String(num).padStart(2, '0')}
                            </span>
                        ))}
                    </div>
                    <button className="w-10 h-10 border border-fate-gray rounded-full flex items-center justify-center hover:bg-fate-gray transition-colors">
                        →
                    </button>
                </div>

                <div className="flex items-center gap-8 text-xs font-mono text-fate-muted">
                    <span>PRIVACY POLICY</span>
                    <span>VARIANT {((state.month - 1) % 3) + 1} OF 3</span>
                    <span>TERMS OF FATE</span>
                </div>
            </footer>
        </div>
    )
}

export default function Simulation() {
    return (
        <GameProvider>
            <SimulationContent />
        </GameProvider>
    )
}
