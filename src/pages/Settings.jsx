import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Settings as SettingsIcon, Volume2, VolumeX, Sun, Moon, RefreshCw, Trash2, Info, ChevronRight } from 'lucide-react'
import { GameProvider, useGameDispatch } from '../context/GameContext'
import { clearUserData, getUserSession } from '../utils/session'

function SettingsContent() {
    const dispatch = useGameDispatch()
    const [soundEnabled, setSoundEnabled] = useState(true)
    const [darkMode, setDarkMode] = useState(true)
    const [showResetConfirm, setShowResetConfirm] = useState(false)

    const handleResetGame = () => {
        dispatch({ type: 'RESET_GAME' })
        setShowResetConfirm(false)
        window.location.hash = '#/dashboard'
    }

    const handleClearData = () => {
        const { userId } = getUserSession()
        clearUserData(userId)
        localStorage.removeItem(`fate_game_state_${userId}`)
        window.location.hash = '#/'
        window.location.reload()
    }

    return (
        <div className="min-h-screen bg-black text-white relative overflow-hidden">
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
                    <button
                        onClick={() => window.location.hash = '#/dashboard'}
                        className="w-10 h-10 border border-fate-gray rounded flex items-center justify-center hover:bg-fate-orange/20 hover:border-fate-orange transition-colors"
                    >
                        <ArrowLeft size={18} className="text-fate-text" />
                    </button>
                    <div className="w-8 h-8 bg-fate-orange rounded flex items-center justify-center font-bold text-black">
                        F
                    </div>
                    <span className="font-mono text-sm tracking-wider text-fate-text">
                        FATE // SETTINGS
                    </span>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-10 p-6 max-w-2xl mx-auto">
                {/* Page Title */}
                <div className="mb-8">
                    <h1 className="font-mono text-2xl font-bold text-fate-orange mb-2">SETTINGS</h1>
                    <p className="font-mono text-sm text-fate-text">Configure your FATE experience</p>
                </div>

                {/* Sound Settings */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-fate-card border border-fate-gray/50 rounded-xl p-6 mb-4"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {soundEnabled ? <Volume2 size={20} className="text-fate-orange" /> : <VolumeX size={20} className="text-fate-text" />}
                            <div>
                                <div className="font-mono text-sm text-white">Sound Effects</div>
                                <div className="font-mono text-xs text-fate-text">Enable audio feedback</div>
                            </div>
                        </div>
                        <button
                            onClick={() => setSoundEnabled(!soundEnabled)}
                            className={`w-14 h-8 rounded-full transition-colors ${soundEnabled ? 'bg-fate-orange' : 'bg-fate-gray'
                                }`}
                        >
                            <motion.div
                                className="w-6 h-6 bg-white rounded-full shadow-lg"
                                animate={{ x: soundEnabled ? 28 : 4 }}
                                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            />
                        </button>
                    </div>
                </motion.div>

                {/* Theme Settings */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                    className="bg-fate-card border border-fate-gray/50 rounded-xl p-6 mb-4"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {darkMode ? <Moon size={20} className="text-fate-orange" /> : <Sun size={20} className="text-yellow-400" />}
                            <div>
                                <div className="font-mono text-sm text-white">Dark Mode</div>
                                <div className="font-mono text-xs text-fate-text">Toggle dark theme</div>
                            </div>
                        </div>
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className={`w-14 h-8 rounded-full transition-colors ${darkMode ? 'bg-fate-orange' : 'bg-fate-gray'
                                }`}
                        >
                            <motion.div
                                className="w-6 h-6 bg-white rounded-full shadow-lg"
                                animate={{ x: darkMode ? 28 : 4 }}
                                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            />
                        </button>
                    </div>
                </motion.div>

                {/* Game Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-fate-card border border-fate-gray/50 rounded-xl p-6 mb-4"
                >
                    <div className="flex items-center gap-2 mb-4">
                        <SettingsIcon size={18} className="text-fate-orange" />
                        <span className="font-mono text-xs text-fate-text tracking-widest">GAME ACTIONS</span>
                    </div>

                    {/* Reset Game */}
                    <button
                        onClick={() => setShowResetConfirm(true)}
                        className="w-full flex items-center justify-between p-4 bg-black/50 border border-fate-gray/30 rounded-lg mb-3 hover:border-fate-orange/50 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <RefreshCw size={18} className="text-fate-orange" />
                            <div className="text-left">
                                <div className="font-mono text-sm text-white">Reset Game</div>
                                <div className="font-mono text-xs text-fate-text">Start a new simulation</div>
                            </div>
                        </div>
                        <ChevronRight size={18} className="text-fate-text" />
                    </button>

                    {/* Clear All Data */}
                    <button
                        onClick={handleClearData}
                        className="w-full flex items-center justify-between p-4 bg-black/50 border border-red-500/30 rounded-lg hover:border-red-500/50 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <Trash2 size={18} className="text-red-400" />
                            <div className="text-left">
                                <div className="font-mono text-sm text-white">Clear All Data</div>
                                <div className="font-mono text-xs text-fate-text">Delete preferences and progress</div>
                            </div>
                        </div>
                        <ChevronRight size={18} className="text-fate-text" />
                    </button>
                </motion.div>

                {/* About Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="bg-fate-card border border-fate-gray/50 rounded-xl p-6 mb-6"
                >
                    <div className="flex items-center gap-2 mb-4">
                        <Info size={18} className="text-fate-orange" />
                        <span className="font-mono text-xs text-fate-text tracking-widest">ABOUT</span>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="font-mono text-xs text-fate-text">Version</span>
                            <span className="font-mono text-xs text-white">1.0.0</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-mono text-xs text-fate-text">Build</span>
                            <span className="font-mono text-xs text-white">Gemini 3 Hackathon</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-mono text-xs text-fate-text">Created</span>
                            <span className="font-mono text-xs text-white">2026</span>
                        </div>
                    </div>
                </motion.div>

                {/* Back Button */}
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => window.location.hash = '#/dashboard'}
                    className="w-full bg-fate-orange text-black font-bold py-4 rounded-lg font-mono tracking-wider hover:bg-fate-orange-light transition-colors flex items-center justify-center gap-2"
                >
                    <ArrowLeft size={18} /> BACK TO DASHBOARD
                </motion.button>
            </main>

            {/* Reset Confirmation Modal */}
            {showResetConfirm && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
                    onClick={() => setShowResetConfirm(false)}
                >
                    <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        className="bg-fate-card border border-fate-gray/50 rounded-xl p-6 max-w-sm w-full"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="text-center mb-6">
                            <RefreshCw size={48} className="text-fate-orange mx-auto mb-4" />
                            <h3 className="font-mono text-lg font-bold text-white mb-2">RESET GAME?</h3>
                            <p className="font-mono text-sm text-fate-text">
                                This will reset all your progress and start a new simulation.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowResetConfirm(false)}
                                className="flex-1 bg-fate-gray text-white font-bold py-3 rounded-lg font-mono tracking-wider hover:bg-fate-gray/80 transition-colors"
                            >
                                CANCEL
                            </button>
                            <button
                                onClick={handleResetGame}
                                className="flex-1 bg-fate-orange text-black font-bold py-3 rounded-lg font-mono tracking-wider hover:bg-fate-orange-light transition-colors"
                            >
                                RESET
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </div>
    )
}

export default function Settings() {
    return (
        <SettingsContent />
    )
}
