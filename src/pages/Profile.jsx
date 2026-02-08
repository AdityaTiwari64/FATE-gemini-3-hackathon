import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, User, Wallet, PiggyBank, Shield, Trophy, TrendingUp, Calendar, Award } from 'lucide-react'
import { GameProvider, useGameState } from '../context/GameContext'
import { getUserName } from '../utils/session'

function ProfileContent() {
    const state = useGameState()
    const userName = getUserName()

    // Calculate stats
    const netWorth = state.balance + (state.savings || 0)
    const totalDecisions = state.history.length
    const goodDecisions = state.history.filter(h => (h.balanceChange || 0) > 0).length
    const riskScore = state.riskExposure || 0

    // Determine player level
    const getPlayerLevel = () => {
        if (netWorth >= 100000 && riskScore < 40) return { level: 'MASTER', color: 'text-yellow-400', icon: Trophy }
        if (netWorth >= 50000) return { level: 'EXPERT', color: 'text-green-400', icon: Award }
        if (netWorth >= 25000) return { level: 'INTERMEDIATE', color: 'text-blue-400', icon: TrendingUp }
        return { level: 'BEGINNER', color: 'text-fate-text', icon: User }
    }

    const playerLevel = getPlayerLevel()

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
                        FATE // PROFILE
                    </span>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-10 p-6 max-w-2xl mx-auto">
                {/* Profile Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-fate-card border border-fate-gray/50 rounded-xl p-8 mb-6"
                >
                    {/* Avatar & Name */}
                    <div className="flex items-center gap-6 mb-8">
                        <div className="w-24 h-24 bg-fate-gray rounded-xl flex items-center justify-center">
                            <User size={48} className="text-fate-text" />
                        </div>
                        <div>
                            <h1 className="font-mono text-2xl font-bold text-white mb-1">
                                {userName || 'PLAYER_001'}
                            </h1>
                            <div className="flex items-center gap-2">
                                <playerLevel.icon size={16} className={playerLevel.color} />
                                <span className={`font-mono text-sm ${playerLevel.color}`}>
                                    {playerLevel.level}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Financial Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-black/50 border border-fate-gray/30 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Wallet size={16} className="text-fate-orange" />
                                <span className="font-mono text-xs text-fate-text">BALANCE</span>
                            </div>
                            <div className="font-mono text-xl font-bold text-white">
                                ₹{state.balance.toLocaleString()}
                            </div>
                        </div>
                        <div className="bg-black/50 border border-fate-gray/30 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <PiggyBank size={16} className="text-green-400" />
                                <span className="font-mono text-xs text-fate-text">SAVINGS</span>
                            </div>
                            <div className="font-mono text-xl font-bold text-green-400">
                                ₹{(state.savings || 0).toLocaleString()}
                            </div>
                        </div>
                        <div className="bg-black/50 border border-fate-gray/30 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Trophy size={16} className="text-fate-orange" />
                                <span className="font-mono text-xs text-fate-text">NET WORTH</span>
                            </div>
                            <div className="font-mono text-xl font-bold text-fate-orange">
                                ₹{netWorth.toLocaleString()}
                            </div>
                        </div>
                        <div className="bg-black/50 border border-fate-gray/30 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Shield size={16} className={riskScore < 40 ? 'text-green-400' : riskScore < 70 ? 'text-fate-orange' : 'text-red-400'} />
                                <span className="font-mono text-xs text-fate-text">RISK LEVEL</span>
                            </div>
                            <div className={`font-mono text-xl font-bold ${riskScore < 40 ? 'text-green-400' : riskScore < 70 ? 'text-fate-orange' : 'text-red-400'
                                }`}>
                                {riskScore}/100
                            </div>
                        </div>
                    </div>

                    {/* Progress Stats */}
                    <div className="border-t border-fate-gray/30 pt-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Calendar size={16} className="text-fate-orange" />
                            <span className="font-mono text-xs text-fate-text tracking-widest">GAME PROGRESS</span>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="text-center">
                                <div className="font-mono text-3xl font-bold text-white">{state.month - 1}</div>
                                <div className="font-mono text-xs text-fate-text">MONTHS PLAYED</div>
                            </div>
                            <div className="text-center">
                                <div className="font-mono text-3xl font-bold text-fate-orange">{totalDecisions}</div>
                                <div className="font-mono text-xs text-fate-text">TOTAL DECISIONS</div>
                            </div>
                            <div className="text-center">
                                <div className="font-mono text-3xl font-bold text-green-400">{goodDecisions}</div>
                                <div className="font-mono text-xs text-fate-text">PROFITABLE</div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Achievements Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-fate-card border border-fate-gray/50 rounded-xl p-6 mb-6"
                >
                    <div className="flex items-center gap-2 mb-4">
                        <Award size={18} className="text-fate-orange" />
                        <span className="font-mono text-xs text-fate-text tracking-widest">ACHIEVEMENTS</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className={`bg-black/50 border rounded-lg p-3 ${totalDecisions >= 1 ? 'border-fate-orange/50' : 'border-fate-gray/30 opacity-50'
                            }`}>
                            <div className="font-mono text-sm text-white">First Decision</div>
                            <div className="font-mono text-xs text-fate-text">Make your first choice</div>
                        </div>
                        <div className={`bg-black/50 border rounded-lg p-3 ${state.savings >= 10000 ? 'border-green-500/50' : 'border-fate-gray/30 opacity-50'
                            }`}>
                            <div className="font-mono text-sm text-white">Saver</div>
                            <div className="font-mono text-xs text-fate-text">Save ₹10,000+</div>
                        </div>
                        <div className={`bg-black/50 border rounded-lg p-3 ${netWorth >= 50000 ? 'border-yellow-500/50' : 'border-fate-gray/30 opacity-50'
                            }`}>
                            <div className="font-mono text-sm text-white">Wealth Builder</div>
                            <div className="font-mono text-xs text-fate-text">Net worth ₹50,000+</div>
                        </div>
                        <div className={`bg-black/50 border rounded-lg p-3 ${riskScore < 30 ? 'border-blue-500/50' : 'border-fate-gray/30 opacity-50'
                            }`}>
                            <div className="font-mono text-sm text-white">Risk Manager</div>
                            <div className="font-mono text-xs text-fate-text">Keep risk below 30</div>
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
        </div>
    )
}

export default function Profile() {
    return (
        <ProfileContent />
    )
}
