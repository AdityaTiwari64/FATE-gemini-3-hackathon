import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Shield, User, Settings, Image, ChevronRight, Home, DollarSign, AlertTriangle, Trophy, Star, Dumbbell, BookOpen, RefreshCw, PiggyBank, Wallet, Lightbulb, Calculator } from 'lucide-react'
import { GameProvider, useGameState, useGameDispatch } from '../context/GameContext'
import { getUserSession, getUserName } from '../utils/session'
import { fetchScenario, processGameChoice } from '../services/gameService'

// Impact Log Item Component
function ImpactLogItem({ log }) {
    const isSystem = log.type === 'system' || log.description?.toLowerCase().includes('tax') ||
        log.description?.toLowerCase().includes('deduction') ||
        log.description?.toLowerCase().includes('penalty')

    const isPositive = (log.amount || log.balanceChange || 0) > 0

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`flex items-center justify-between py-3 border-b border-fate-gray/30 ${isSystem ? 'bg-red-500/5' : ''
                }`}
        >
            <div className="flex items-center gap-3">
                <span className={`text-xs font-mono ${isSystem ? 'text-red-400' : 'text-fate-text'}`}>
                    {isSystem ? 'System:' : 'Choice:'}
                </span>
                <span className="text-sm text-white truncate max-w-[180px]">
                    {log.description || log.narrative?.substring(0, 30) || 'Decision made'}
                </span>
            </div>
            <div className="flex items-center gap-2">
                <span className={`font-mono text-sm font-bold ${isPositive ? 'text-green-400' : 'text-fate-orange'
                    }`}>
                    {isPositive ? '+' : ''}{log.amount || log.balanceChange ? `₹${Math.abs(log.amount || log.balanceChange).toLocaleString()}` : ''}
                </span>
                <span className="text-lg">{log.icon || (isSystem ? '⚠️' : '📋')}</span>
            </div>
        </motion.div>
    )
}

// Game End Screen Component
const GAME_END_MONTH = 12 // Game ends after 12 months

function GameEndScreen({ state, onRestart }) {
    const netWorth = state.balance + (state.savings || 0)
    const riskScore = state.riskExposure || 0

    // Analyze choices for learning insights
    const riskyChoices = state.history.filter(h => h.learningInsight?.whatWentWrong)
    const goodChoices = state.history.filter(h => h.learningInsight && !h.learningInsight.whatWentWrong)
    const totalChoices = state.history.length

    // Generate summary insights
    const generateLearningTips = () => {
        const tips = []

        if (riskScore >= 70) {
            tips.push({
                icon: AlertTriangle,
                title: 'HIGH RISK BEHAVIOR',
                message: 'You consistently chose high-risk options. Consider balancing rewards with security.',
                color: 'text-fate-orange'
            })
        }

        if (state.savings < 5000) {
            tips.push({
                icon: PiggyBank,
                title: 'LOW SAVINGS',
                message: 'Your savings are critically low. Prioritize building an emergency fund of 3-6 months expenses.',
                color: 'text-fate-orange'
            })
        }

        if (riskyChoices.length > totalChoices / 2) {
            tips.push({
                icon: BookOpen,
                title: 'DECISION PATTERN',
                message: `${riskyChoices.length} of ${totalChoices} choices were risky. Try safer alternatives when possible.`,
                color: 'text-fate-text'
            })
        }

        if (goodChoices.length >= totalChoices / 2) {
            tips.push({
                icon: Trophy,
                title: 'SMART DECISIONS',
                message: `${goodChoices.length} of ${totalChoices} choices were financially sound. Keep building on this!`,
                color: 'text-green-400'
            })
        }

        if (netWorth >= 50000) {
            tips.push({
                icon: Star,
                title: 'WEALTH BUILDING',
                message: 'You\'ve built solid wealth. Consider diversifying into investments for long-term growth.',
                color: 'text-green-400'
            })
        }

        return tips.slice(0, 3) // Show max 3 tips
    }

    const learningTips = generateLearningTips()

    // Determine outcome
    let outcome, message, IconComponent, iconColor, bgGradient

    if (netWorth >= 100000 && riskScore < 40) {
        outcome = 'FINANCIAL MASTER'
        message = 'You\'ve built wealth while keeping risks low. Your financial future is secure!'
        IconComponent = Trophy
        iconColor = 'text-yellow-400'
        bgGradient = 'from-yellow-500/20 to-green-500/20'
    } else if (netWorth >= 50000) {
        outcome = 'WELL BALANCED'
        message = 'You made smart choices and ended with a healthy balance. Keep growing!'
        IconComponent = Star
        iconColor = 'text-green-400'
        bgGradient = 'from-green-500/20 to-blue-500/20'
    } else if (netWorth >= 10000) {
        outcome = 'SURVIVOR'
        message = 'You made it through the year. Not bad, but there\'s room to grow.'
        IconComponent = Dumbbell
        iconColor = 'text-blue-400'
        bgGradient = 'from-blue-500/20 to-purple-500/20'
    } else if (riskScore >= 80) {
        outcome = 'HIGH RISK PLAYER'
        message = 'You lived on the edge. One bad month could ruin everything.'
        IconComponent = AlertTriangle
        iconColor = 'text-red-400'
        bgGradient = 'from-red-500/20 to-orange-500/20'
    } else {
        outcome = 'STRUGGLING'
        message = 'Tough year. Learn from your choices and try again!'
        IconComponent = BookOpen
        iconColor = 'text-gray-400'
        bgGradient = 'from-gray-500/20 to-red-500/20'
    }

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-8">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="max-w-2xl w-full"
            >
                {/* Main Score Card */}
                <div className={`bg-gradient-to-br ${bgGradient} border border-fate-gray/50 rounded-2xl p-8 text-center mb-6`}>
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="mb-6 flex justify-center"
                    >
                        <IconComponent size={72} className={iconColor} />
                    </motion.div>

                    <h1 className="font-mono text-xs text-fate-text tracking-widest mb-2">YEAR COMPLETE</h1>
                    <h2 className="font-mono text-3xl font-bold text-fate-orange mb-4">{outcome}</h2>
                    <p className="text-fate-text mb-8">{message}</p>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-black/50 rounded-lg p-4">
                            <div className="font-mono text-xs text-fate-text flex items-center justify-center gap-1">
                                <Wallet size={14} /> BALANCE
                            </div>
                            <div className="font-mono text-xl font-bold text-white">₹{state.balance.toLocaleString()}</div>
                        </div>
                        <div className="bg-black/50 rounded-lg p-4">
                            <div className="font-mono text-xs text-fate-text flex items-center justify-center gap-1">
                                <PiggyBank size={14} /> SAVINGS
                            </div>
                            <div className="font-mono text-xl font-bold text-green-400">₹{(state.savings || 0).toLocaleString()}</div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-black/50 rounded-lg p-4">
                            <div className="font-mono text-xs text-fate-text">NET WORTH</div>
                            <div className="font-mono text-xl font-bold text-fate-orange">₹{netWorth.toLocaleString()}</div>
                        </div>
                        <div className="bg-black/50 rounded-lg p-4">
                            <div className="font-mono text-xs text-fate-text flex items-center justify-center gap-1">
                                <Shield size={14} /> RISK
                            </div>
                            <div className={`font-mono text-xl font-bold ${riskScore < 40 ? 'text-green-400' : riskScore < 70 ? 'text-fate-orange' : 'text-red-500'}`}>
                                {riskScore}/100
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => window.location.hash = '#/'}
                            className="flex-1 bg-fate-gray text-white font-bold py-4 rounded-lg font-mono tracking-wider hover:bg-fate-gray/80 transition-colors flex items-center justify-center gap-2"
                        >
                            <Home size={18} /> HOME
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onRestart}
                            className="flex-1 bg-fate-orange text-black font-bold py-4 rounded-lg font-mono tracking-wider hover:bg-fate-orange-light transition-colors flex items-center justify-center gap-2"
                        >
                            <RefreshCw size={18} /> PLAY AGAIN
                        </motion.button>
                    </div>
                </div>

                {/* Learning Insights Section */}
                {learningTips.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-fate-card border border-fate-gray/50 rounded-2xl p-6"
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <Lightbulb size={18} className="text-fate-orange" />
                            <span className="font-mono text-xs text-fate-text tracking-widest">WHAT YOU CAN LEARN</span>
                        </div>

                        <div className="space-y-3">
                            {learningTips.map((tip, idx) => (
                                <div key={idx} className="bg-black/50 rounded-lg p-4 border border-fate-gray/30">
                                    <div className="flex items-center gap-2 mb-2">
                                        <tip.icon size={16} className={tip.color} />
                                        <span className={`font-mono text-xs ${tip.color} tracking-wider`}>{tip.title}</span>
                                    </div>
                                    <p className="text-sm text-fate-text">{tip.message}</p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-4 p-3 bg-fate-orange/10 border border-fate-orange/30 rounded-lg">
                            <p className="text-sm text-fate-orange font-mono">
                                💡 TIP: Financial success comes from consistent good decisions, not just avoiding bad ones.
                            </p>
                        </div>
                    </motion.div>
                )}
            </motion.div>
        </div>
    )
}

// Main Dashboard Content
function DashboardContent() {
    const state = useGameState()
    const dispatch = useGameDispatch()
    const [scenario, setScenario] = useState(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const { userId } = getUserSession()
    const userName = getUserName()

    const [isLoadingScenario, setIsLoadingScenario] = useState(false)

    // Load scenario instantly from fallback (fast), optionally enhance with Gemini
    const loadScenario = async () => {
        // Instant load from fallback scenarios
        const { getScenario } = await import('../utils/processChoice')
        setScenario(getScenario(state.month))

        // Optional: Try Gemini in background (non-blocking)
        // Uncomment below to enable Gemini scenarios:
        // fetchScenario(state).then(({ scenario: geminiScenario }) => {
        //     if (geminiScenario) {
        //         setScenario({
        //             text: geminiScenario.situation,
        //             choices: geminiScenario.choices.map(c => ({
        //                 id: c.id,
        //                 label: c.label,
        //                 balanceChange: c.balanceChange,
        //                 riskChange: c.riskChange
        //             }))
        //         })
        //     }
        // }).catch(console.error)
    }

    useEffect(() => {
        if (state.isLoaded && !scenario) {
            loadScenario()
        }
    }, [state.isLoaded])

    const handleChoice = async (choice) => {
        setIsProcessing(true)

        // Process the choice
        const result = processGameChoice(choice.id, { choices: scenario.choices }, state)

        dispatch({ type: 'PROCESS_CHOICE_RESULT', payload: result })
        dispatch({ type: 'NEXT_MONTH' })

        // Load next scenario
        setScenario(null)
        await loadScenario()

        setIsProcessing(false)
    }

    const getRiskColor = (score) => {
        if (score < 30) return 'text-green-400'
        if (score <= 70) return 'text-fate-orange'
        return 'text-red-500'
    }

    const getRiskBgColor = (score) => {
        if (score < 30) return 'bg-green-400'
        if (score <= 70) return 'bg-fate-orange'
        return 'bg-red-500'
    }

    const handleRestart = () => {
        // Clear saved state and reset
        localStorage.removeItem('fate_gameState')
        dispatch({ type: 'RESET' })
        setScenario(null)
        window.location.reload()
    }

    // Check for game end (12 months completed)
    if (state.isLoaded && state.month > GAME_END_MONTH) {
        return <GameEndScreen state={state} onRestart={handleRestart} />
    }

    if (!state.isLoaded) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-fate-orange font-mono text-sm tracking-wider animate-pulse">
                    LOADING FATE...
                </div>
            </div>
        )
    }

    return (
        <div className="h-screen bg-black text-white relative overflow-hidden flex flex-col">
            {/* Grid Overlay */}
            <div
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                    backgroundImage: `
            linear-gradient(rgba(38, 38, 38, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(38, 38, 38, 0.5) 1px, transparent 1px)
          `,
                    backgroundSize: '40px 40px'
                }}
            />

            {/* Header */}
            <header className="relative z-10 flex items-center justify-between p-4 border-b border-fate-gray/30">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-fate-orange rounded flex items-center justify-center font-bold text-black">
                        F
                    </div>
                    <span className="font-mono text-sm tracking-wider text-fate-text">
                        FATE // SIM_V2
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => window.location.hash = '#/'}
                        className="w-10 h-10 border border-fate-gray rounded flex items-center justify-center hover:bg-fate-orange/20 hover:border-fate-orange transition-colors"
                        title="Go Home"
                    >
                        <Home size={18} className="text-fate-text" />
                    </button>
                    <button
                        onClick={() => window.location.hash = '#/archive'}
                        className="w-10 h-10 border border-fate-gray rounded flex items-center justify-center hover:bg-fate-orange/20 hover:border-fate-orange transition-colors"
                        title="Decision Archive"
                    >
                        <Image size={18} className="text-fate-text" />
                    </button>
                    <button
                        onClick={() => window.location.hash = '#/profile'}
                        className="w-10 h-10 border border-fate-gray rounded flex items-center justify-center hover:bg-fate-orange/20 hover:border-fate-orange transition-colors"
                        title="Profile"
                    >
                        <User size={18} className="text-fate-text" />
                    </button>
                    <button
                        onClick={() => window.location.hash = '#/settings'}
                        className="w-10 h-10 border border-fate-gray rounded flex items-center justify-center hover:bg-fate-orange/20 hover:border-fate-orange transition-colors"
                        title="Settings"
                    >
                        <Settings size={18} className="text-fate-text" />
                    </button>
                    <button
                        onClick={() => window.location.hash = '#/math'}
                        className="w-10 h-10 border border-fate-gray rounded flex items-center justify-center hover:bg-fate-orange/20 hover:border-fate-orange transition-colors"
                        title="Financial Analytics"
                    >
                        <Calculator size={18} className="text-fate-text" />
                    </button>
                </div>

                {/* Month Progress Indicator */}
                <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-fate-text">
                        MONTH {state.month}/{GAME_END_MONTH}
                    </span>
                    <div className="w-32 h-2 bg-fate-gray/50 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-fate-orange"
                            initial={{ width: 0 }}
                            animate={{ width: `${(state.month / GAME_END_MONTH) * 100}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>
                </div>
            </header>

            {/* Main 3-Column Layout */}
            <main className="relative z-10 grid grid-cols-1 lg:grid-cols-[320px_1fr_340px] gap-0 flex-1 overflow-hidden">

                {/* LEFT COLUMN - Profile/Stats */}
                <div className="border-r border-fate-gray/30 p-6 flex flex-col overflow-y-auto">
                    {/* User Info */}
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-fate-gray/30">
                        <div className="w-12 h-12 bg-fate-gray rounded-lg flex items-center justify-center">
                            <User size={24} className="text-fate-text" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-mono text-xs text-fate-text">USER //</span>
                                <span className="font-mono text-sm text-white">{userName.toUpperCase()}</span>
                                <Settings size={14} className="text-fate-text" />
                            </div>
                            <span className="font-mono text-xs text-fate-orange">STUDENT</span>
                        </div>
                    </div>

                    {/* Profile Section */}
                    <div className="mb-6">
                        <span className="font-mono text-xs text-fate-text tracking-widest block mb-3">PROFILE</span>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="font-mono text-xs text-fate-text">STATUS // STUDENT</span>
                                <span className="font-mono text-2xl font-bold">{String(state.month).padStart(2, '0')}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-mono text-xs text-fate-text">RISK TYPE // BALANCED</span>
                            </div>
                        </div>
                    </div>

                    {/* Savings */}
                    <div className="mb-6 p-4 bg-fate-card border border-fate-gray/30 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <Home size={16} className="text-fate-text" />
                            <span className="font-mono text-xs text-fate-text">SAVINGS</span>
                        </div>
                        <div className="flex justify-between items-end mb-3">
                            <span className="font-mono text-2xl font-bold text-fate-orange">
                                ₹{(state.savings || 80000).toLocaleString()}
                            </span>
                            <span className="font-mono text-sm text-fate-text">
                                ₹{((state.savings || 80000) * 0.1).toLocaleString()}
                            </span>
                        </div>
                        <div className="h-2 bg-fate-gray rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-fate-orange"
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(100, ((state.savings || 80000) / 100000) * 100)}%` }}
                                transition={{ duration: 0.5 }}
                            />
                        </div>
                    </div>

                    {/* Current Month / Balance */}
                    <div className="mb-6">
                        <span className="font-mono text-xs text-fate-text tracking-widest block mb-2">CURRENT MONTH</span>
                        <div className="flex items-center gap-3">
                            <span className="font-mono text-4xl font-bold text-fate-orange">
                                ₹{state.balance.toLocaleString()}
                            </span>
                            <span className="font-mono text-lg text-fate-text">.00</span>
                            {state.insuranceOpted && (
                                <Shield size={24} className="text-fate-orange ml-2" />
                            )}
                        </div>
                        <span className="font-mono text-xs text-fate-text tracking-widest block mt-1">AVAILABLE CAPITAL</span>
                    </div>

                    {/* Risk Score */}
                    <div className="mb-6">
                        <span className="font-mono text-xs text-fate-text tracking-widest block mb-2">RISK SCORE</span>
                        <div className="flex items-center gap-4">
                            <span className={`font-mono text-3xl font-bold ${getRiskColor(state.riskExposure)}`}>
                                {state.riskExposure}/100
                            </span>
                            <div className="flex-1">
                                <div className="h-2 bg-fate-gray rounded-full overflow-hidden">
                                    <motion.div
                                        className={`h-full ${getRiskBgColor(state.riskExposure)}`}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${state.riskExposure}%` }}
                                        transition={{ duration: 0.5 }}
                                    />
                                </div>
                            </div>
                            <span className="font-mono text-xs text-fate-text">{state.riskExposure}/100</span>
                        </div>
                    </div>

                    {/* Insurance */}
                    <div className="mb-6">
                        <span className="font-mono text-xs text-fate-text tracking-widest block mb-2">INSURANCE</span>
                        <div className="flex items-center justify-between">
                            <span className={`font-mono text-xl font-bold ${state.insuranceOpted ? 'text-green-400' : 'text-fate-muted'}`}>
                                {state.insuranceOpted ? 'ACTIVE' : 'INACTIVE'}
                            </span>
                            <span className={`font-mono text-xs px-2 py-1 rounded ${state.insuranceOpted ? 'bg-green-400/20 text-green-400' : 'bg-fate-gray text-fate-muted'
                                }`}>
                                {state.insuranceOpted ? 'ACTIVE' : 'NONE'}
                            </span>
                        </div>
                    </div>

                    {/* Spacer */}
                    <div className="flex-1" />

                    {/* Continue Button */}
                    <motion.button
                        whileTap={{ scale: 0.98 }}
                        onClick={loadScenario}
                        disabled={isLoadingScenario || isProcessing}
                        className={`w-full bg-fate-orange text-black font-bold py-4 rounded font-mono tracking-wider transition-colors ${isLoadingScenario || isProcessing
                            ? 'opacity-50 cursor-not-allowed'
                            : 'hover:bg-fate-orange-light'
                            }`}
                    >
                        {isLoadingScenario ? 'LOADING...' : 'CONTINUE SIMULATION'}
                    </motion.button>
                </div>

                {/* CENTER COLUMN - Active Scenario */}
                <div className="p-8 flex flex-col border-r border-fate-gray/30">
                    <div className="mb-4">
                        <span className="font-mono text-xs text-fate-text tracking-widest">
                            TEMPORAL NODE // <span className="text-white">MONTH {String(state.month).padStart(2, '0')} EVENT</span>
                        </span>
                    </div>

                    {scenario && (
                        <div className="flex-1 flex flex-col justify-center">
                            <p
                                className="text-xl leading-relaxed mb-12 max-w-lg"
                                dangerouslySetInnerHTML={{ __html: scenario.text }}
                            />

                            <div className="flex flex-wrap gap-4">
                                {scenario.choices.map((choice, idx) => (
                                    <motion.button
                                        key={choice.id}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleChoice(choice)}
                                        disabled={isProcessing}
                                        className={`px-6 py-3 rounded border-2 font-mono text-sm tracking-wider transition-all ${idx === 0
                                            ? 'bg-fate-orange text-black border-fate-orange hover:bg-fate-orange-light'
                                            : 'border-fate-orange text-fate-orange hover:bg-fate-orange hover:text-black'
                                            } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        {choice.label}
                                        {choice.cost && (
                                            <span className="ml-3 px-2 py-0.5 bg-black/20 rounded text-xs">
                                                ₹{choice.cost.toLocaleString()}
                                            </span>
                                        )}
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* RIGHT COLUMN - Impact Logs */}
                <div className="p-6 flex flex-col overflow-hidden">
                    <div className="flex items-center justify-between mb-4">
                        <span className="font-mono text-xs text-fate-text tracking-widest">
                            RECENT IMPACT LOGS
                        </span>
                    </div>

                    <div className="flex-1 overflow-y-auto min-h-0">
                        {state.history.length === 0 ? (
                            <div className="text-center py-12 text-fate-muted">
                                <AlertTriangle size={32} className="mx-auto mb-3 opacity-50" />
                                <p className="font-mono text-sm">No impact logs yet</p>
                                <p className="font-mono text-xs mt-1">Make choices to see your history</p>
                            </div>
                        ) : (
                            <div className="space-y-1">
                                {state.history.slice().reverse().map((log, idx) => (
                                    <ImpactLogItem key={idx} log={log} />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* View Archive Button */}
                    <motion.button
                        whileTap={{ scale: 0.98 }}
                        className="mt-4 w-full bg-fate-orange text-black font-bold py-3 rounded font-mono text-sm tracking-wider flex items-center justify-center gap-2 hover:bg-fate-orange-light transition-colors"
                    >
                        VIEW FULL ARCHIVE
                        <ChevronRight size={16} />
                    </motion.button>
                </div>
            </main>

            {/* Side Label */}
            <div className="fixed left-2 top-1/2 -translate-y-1/2 -rotate-90 origin-left font-mono text-xs text-fate-muted tracking-widest hidden lg:block">
                SIMULATION ACTIVE // 0.0.1
            </div>
        </div>
    )
}

export default function Dashboard() {
    return (
        <DashboardContent />
    )
}
