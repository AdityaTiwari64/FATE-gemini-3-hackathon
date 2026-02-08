import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, TrendingUp, TrendingDown, DollarSign, AlertTriangle, CheckCircle } from 'lucide-react'
import { GameProvider, useGameState } from '../context/GameContext'

function ArchiveContent() {
    const state = useGameState()

    const getMonthName = (monthNum) => {
        const months = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December']
        return months[(monthNum - 1) % 12]
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
                        FATE // ARCHIVE
                    </span>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-10 p-6 max-w-4xl mx-auto">
                {/* Page Title */}
                <div className="mb-8">
                    <h1 className="font-mono text-2xl font-bold text-fate-orange mb-2">DECISION ARCHIVE</h1>
                    <p className="font-mono text-sm text-fate-text">Your complete history of financial decisions</p>
                </div>

                {/* Stats Summary */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-fate-card border border-fate-gray/50 rounded-lg p-4">
                        <div className="font-mono text-xs text-fate-text mb-1">TOTAL DECISIONS</div>
                        <div className="font-mono text-2xl font-bold text-white">{state.history.length}</div>
                    </div>
                    <div className="bg-fate-card border border-fate-gray/50 rounded-lg p-4">
                        <div className="font-mono text-xs text-fate-text mb-1">MONTHS PLAYED</div>
                        <div className="font-mono text-2xl font-bold text-fate-orange">{state.month - 1}</div>
                    </div>
                    <div className="bg-fate-card border border-fate-gray/50 rounded-lg p-4">
                        <div className="font-mono text-xs text-fate-text mb-1">NET CHANGE</div>
                        <div className={`font-mono text-2xl font-bold ${state.history.reduce((sum, h) => sum + (h.balanceChange || 0), 0) >= 0
                            ? 'text-green-400' : 'text-red-400'
                            }`}>
                            ₹{Math.abs(state.history.reduce((sum, h) => sum + (h.balanceChange || 0), 0)).toLocaleString()}
                        </div>
                    </div>
                    <div className="bg-fate-card border border-fate-gray/50 rounded-lg p-4">
                        <div className="font-mono text-xs text-fate-text mb-1">RISK LEVEL</div>
                        <div className={`font-mono text-2xl font-bold ${(state.riskExposure || 0) < 40 ? 'text-green-400' :
                            (state.riskExposure || 0) < 70 ? 'text-fate-orange' : 'text-red-400'
                            }`}>
                            {state.riskExposure || 0}/100
                        </div>
                    </div>
                </div>

                {/* Archive List */}
                <div className="bg-fate-card border border-fate-gray/50 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Calendar size={18} className="text-fate-orange" />
                        <span className="font-mono text-xs text-fate-text tracking-widest">DECISION TIMELINE</span>
                    </div>

                    {state.history.length === 0 ? (
                        <div className="text-center py-12 text-fate-muted">
                            <AlertTriangle size={32} className="mx-auto mb-3 opacity-50" />
                            <p className="font-mono text-sm">No decisions recorded yet</p>
                            <p className="font-mono text-xs mt-1">Play the game to build your archive</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {state.history.slice().reverse().map((log, idx) => {
                                const isPositive = (log.balanceChange || 0) >= 0
                                const monthNum = state.history.length - idx

                                return (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="bg-black/50 border border-fate-gray/30 rounded-lg p-4"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="font-mono text-xs text-fate-orange">
                                                        MONTH {monthNum}
                                                    </span>
                                                    <span className="font-mono text-xs text-fate-text">
                                                        {getMonthName(monthNum)}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-white mb-2">
                                                    {log.narrative || log.description || 'Decision made'}
                                                </p>
                                                {log.reflection && (
                                                    <p className="text-xs text-fate-text italic">
                                                        "{log.reflection}"
                                                    </p>
                                                )}
                                            </div>
                                            <div className="text-right ml-4">
                                                <div className={`flex items-center gap-1 font-mono text-lg font-bold ${isPositive ? 'text-green-400' : 'text-red-400'
                                                    }`}>
                                                    {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                                                    {isPositive ? '+' : ''}₹{Math.abs(log.balanceChange || 0).toLocaleString()}
                                                </div>
                                                {log.savingsChange !== 0 && (
                                                    <div className="font-mono text-xs text-fate-text mt-1">
                                                        Savings: {log.savingsChange > 0 ? '+' : ''}₹{log.savingsChange?.toLocaleString() || 0}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </div>
                    )}
                </div>

                {/* Back Button */}
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => window.location.hash = '#/dashboard'}
                    className="mt-6 w-full bg-fate-orange text-black font-bold py-4 rounded-lg font-mono tracking-wider hover:bg-fate-orange-light transition-colors flex items-center justify-center gap-2"
                >
                    <ArrowLeft size={18} /> BACK TO DASHBOARD
                </motion.button>
            </main>
        </div>
    )
}

export default function Archive() {
    return (
        <ArchiveContent />
    )
}
