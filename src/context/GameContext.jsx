import { createContext, useContext, useReducer } from 'react'

const GameContext = createContext(null)
const GameDispatchContext = createContext(null)

const initialState = {
    month: 1,
    balance: 2400,
    savings: 0,
    insuranceOpted: false,
    riskScore: 25,
    history: [
        {
            month: 1,
            title: 'The Genesis',
            description: 'You started your journey with a dream, a moderate debt, and the heavy weight of expectations.',
            type: 'neutral'
        }
    ]
}

function gameReducer(state, action) {
    switch (action.type) {
        case 'SELECT_CHOICE': {
            const { choice } = action.payload
            const newBalance = state.balance + (choice.balanceChange || 0)
            const newSavings = state.savings + (choice.savingsChange || 0)
            const newRiskScore = Math.max(0, Math.min(100, state.riskScore + (choice.riskChange || 0)))

            return {
                ...state,
                balance: newBalance,
                savings: Math.max(0, newSavings),
                riskScore: newRiskScore,
                history: [
                    ...state.history,
                    {
                        month: state.month,
                        title: choice.label,
                        description: `Balance: ${choice.balanceChange >= 0 ? '+' : ''}$${choice.balanceChange}`,
                        type: choice.balanceChange >= 0 ? 'positive' : 'negative'
                    }
                ]
            }
        }

        case 'NEXT_MONTH': {
            return {
                ...state,
                month: state.month + 1
            }
        }

        case 'SET_INSURANCE': {
            return {
                ...state,
                insuranceOpted: action.payload,
                balance: action.payload ? state.balance - 100 : state.balance
            }
        }

        case 'RESET': {
            return initialState
        }

        case 'SET_STATE': {
            return {
                ...state,
                ...action.payload
            }
        }

        default:
            return state
    }
}

export function GameProvider({ children }) {
    const [state, dispatch] = useReducer(gameReducer, initialState)

    return (
        <GameContext.Provider value={state}>
            <GameDispatchContext.Provider value={dispatch}>
                {children}
            </GameDispatchContext.Provider>
        </GameContext.Provider>
    )
}

export function useGameState() {
    const context = useContext(GameContext)
    if (context === null) {
        throw new Error('useGameState must be used within a GameProvider')
    }
    return context
}

export function useGameDispatch() {
    const context = useContext(GameDispatchContext)
    if (context === null) {
        throw new Error('useGameDispatch must be used within a GameProvider')
    }
    return context
}
