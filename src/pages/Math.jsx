import { motion } from 'framer-motion'
import { ArrowLeft, Calculator, TrendingUp, TrendingDown, PieChart, BarChart3, Percent, DollarSign } from 'lucide-react'
import { GameProvider, useGameState } from '../context/GameContext'

function MathContent() {
    const state = useGameState()

    // Calculate financial metrics
    const netWorth = state.balance + (state.savings || 0)
    const startingBalance = 30000 // Initial balance
    const totalGrowth = netWorth - startingBalance
    const growthPercent = ((netWorth / startingBalance) - 1) * 100

    // Calculate income vs expenses from history
    const income = state.history.filter(h => (h.balanceChange || 0) > 0)
        .reduce((sum, h) => sum + (h.balanceChange || 0), 0)
    const expenses = Math.abs(state.history.filter(h => (h.balanceChange || 0) < 0)
        .reduce((sum, h) => sum + (h.balanceChange || 0), 0))

    // Calculate savings rate
    const totalMovement = income + expenses
    const savingsRate = totalMovement > 0 ? ((state.savings || 0) / totalMovement) * 100 : 0

    // Calculate average per month
    const monthsPlayed = Math.max(state.month - 1, 1)
    const avgMonthlyGain = totalGrowth / monthsPlayed
    const avgMonthlyIncome = income / monthsPlayed
    const avgMonthlyExpense = expenses / monthsPlayed

    // Risk metrics
    const riskScore = state.riskExposure || 0
    const riskCategory = riskScore < 30 ? 'LOW' : riskScore < 60 ? 'MODERATE' : riskScore < 80 ? 'HIGH' : 'CRITICAL'
    const riskColor = riskScore < 30 ? 'text-green-400' : riskScore < 60 ? 'text-yellow-400' : riskScore < 80 ? 'text-fate-orange' : 'text-red-400'

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
                        FATE // ANALYTICS
                    </span>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-10 p-6 max-w-4xl mx-auto">
                {/* Page Title */}
                <div className="mb-8">
                    <h1 className="font-mono text-2xl font-bold text-fate-orange mb-2">FINANCIAL ANALYTICS</h1>
                    <p className="font-mono text-sm text-fate-text">Detailed breakdown of your financial performance</p>
                </div>

                {/* Growth Overview */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-fate-card border border-fate-gray/50 rounded-xl p-6 mb-6"
                >
                    <div className="flex items-center gap-2 mb-4">
                        <Calculator size={18} className="text-fate-orange" />
                        <span className="font-mono text-xs text-fate-text tracking-widest">WEALTH SUMMARY</span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-black/50 border border-fate-gray/30 rounded-lg p-4 text-center">
                            <div className="font-mono text-xs text-fate-text mb-1">STARTING</div>
                            <div className="font-mono text-xl font-bold text-fate-text">₹{startingBalance.toLocaleString()}</div>
                        </div>
                        <div className="bg-black/50 border border-fate-gray/30 rounded-lg p-4 text-center">
                            <div className="font-mono text-xs text-fate-text mb-1">CURRENT</div>
                            <div className="font-mono text-xl font-bold text-fate-orange">₹{netWorth.toLocaleString()}</div>
                        </div>
                        <div className="bg-black/50 border border-fate-gray/30 rounded-lg p-4 text-center">
                            <div className="font-mono text-xs text-fate-text mb-1">GROWTH</div>
                            <div className={`font-mono text-xl font-bold flex items-center justify-center gap-1 ${totalGrowth >= 0 ? 'text-green-400' : 'text-red-400'
                                }`}>
                                {totalGrowth >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                                ₹{Math.abs(totalGrowth).toLocaleString()}
                            </div>
                        </div>
                        <div className="bg-black/50 border border-fate-gray/30 rounded-lg p-4 text-center">
                            <div className="font-mono text-xs text-fate-text mb-1">% CHANGE</div>
                            <div className={`font-mono text-xl font-bold ${growthPercent >= 0 ? 'text-green-400' : 'text-red-400'
                                }`}>
                                {growthPercent >= 0 ? '+' : ''}{growthPercent.toFixed(1)}%
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Income vs Expenses */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-fate-card border border-fate-gray/50 rounded-xl p-6 mb-6"
                >
                    <div className="flex items-center gap-2 mb-4">
                        <BarChart3 size={18} className="text-fate-orange" />
                        <span className="font-mono text-xs text-fate-text tracking-widest">CASH FLOW ANALYSIS</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Income */}
                        <div className="bg-black/50 border border-green-500/30 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <TrendingUp size={16} className="text-green-400" />
                                <span className="font-mono text-xs text-green-400">TOTAL INCOME</span>
                            </div>
                            <div className="font-mono text-2xl font-bold text-green-400 mb-2">
                                +₹{income.toLocaleString()}
                            </div>
                            <div className="font-mono text-xs text-fate-text">
                                Avg: ₹{avgMonthlyIncome.toLocaleString()}/month
                            </div>
                            {/* Visual bar */}
                            <div className="mt-3 h-2 bg-fate-gray/30 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-green-400 rounded-full"
                                    style={{ width: `${totalMovement > 0 ? (income / totalMovement) * 100 : 50}%` }}
                                />
                            </div>
                        </div>

                        {/* Expenses */}
                        <div className="bg-black/50 border border-red-500/30 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <TrendingDown size={16} className="text-red-400" />
                                <span className="font-mono text-xs text-red-400">TOTAL EXPENSES</span>
                            </div>
                            <div className="font-mono text-2xl font-bold text-red-400 mb-2">
                                -₹{expenses.toLocaleString()}
                            </div>
                            <div className="font-mono text-xs text-fate-text">
                                Avg: ₹{avgMonthlyExpense.toLocaleString()}/month
                            </div>
                            {/* Visual bar */}
                            <div className="mt-3 h-2 bg-fate-gray/30 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-red-400 rounded-full"
                                    style={{ width: `${totalMovement > 0 ? (expenses / totalMovement) * 100 : 50}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Key Metrics */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-fate-card border border-fate-gray/50 rounded-xl p-6 mb-6"
                >
                    <div className="flex items-center gap-2 mb-4">
                        <PieChart size={18} className="text-fate-orange" />
                        <span className="font-mono text-xs text-fate-text tracking-widest">KEY METRICS</span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="bg-black/50 border border-fate-gray/30 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Percent size={14} className="text-fate-orange" />
                                <span className="font-mono text-xs text-fate-text">SAVINGS RATE</span>
                            </div>
                            <div className="font-mono text-xl font-bold text-fate-orange">
                                {savingsRate.toFixed(1)}%
                            </div>
                        </div>
                        <div className="bg-black/50 border border-fate-gray/30 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <DollarSign size={14} className="text-green-400" />
                                <span className="font-mono text-xs text-fate-text">AVG MONTHLY</span>
                            </div>
                            <div className={`font-mono text-xl font-bold ${avgMonthlyGain >= 0 ? 'text-green-400' : 'text-red-400'
                                }`}>
                                {avgMonthlyGain >= 0 ? '+' : ''}₹{avgMonthlyGain.toLocaleString()}
                            </div>
                        </div>
                        <div className="bg-black/50 border border-fate-gray/30 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <BarChart3 size={14} className={riskColor} />
                                <span className="font-mono text-xs text-fate-text">RISK LEVEL</span>
                            </div>
                            <div className={`font-mono text-xl font-bold ${riskColor}`}>
                                {riskCategory}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Financial Ratios */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-fate-card border border-fate-gray/50 rounded-xl p-6 mb-6"
                >
                    <div className="flex items-center gap-2 mb-4">
                        <Calculator size={18} className="text-fate-orange" />
                        <span className="font-mono text-xs text-fate-text tracking-widest">FINANCIAL FORMULAS</span>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-black/50 border border-fate-gray/30 rounded-lg p-4">
                            <div className="font-mono text-sm text-fate-orange mb-2">Net Worth Calculation</div>
                            <div className="font-mono text-xs text-fate-text">
                                Balance (₹{state.balance.toLocaleString()}) + Savings (₹{(state.savings || 0).toLocaleString()}) = <span className="text-white font-bold">₹{netWorth.toLocaleString()}</span>
                            </div>
                        </div>
                        <div className="bg-black/50 border border-fate-gray/30 rounded-lg p-4">
                            <div className="font-mono text-sm text-fate-orange mb-2">Growth Rate Formula</div>
                            <div className="font-mono text-xs text-fate-text">
                                ((Current ₹{netWorth.toLocaleString()} / Starting ₹{startingBalance.toLocaleString()}) - 1) × 100 = <span className={`font-bold ${growthPercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>{growthPercent.toFixed(1)}%</span>
                            </div>
                        </div>
                        <div className="bg-black/50 border border-fate-gray/30 rounded-lg p-4">
                            <div className="font-mono text-sm text-fate-orange mb-2">Risk Exposure Index</div>
                            <div className="font-mono text-xs text-fate-text">
                                Current Risk Score: <span className={`font-bold ${riskColor}`}>{riskScore}/100</span> ({riskCategory})
                            </div>
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

export default function Math() {
    return (
        <MathContent />
    )
}
