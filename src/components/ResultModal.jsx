import { motion, AnimatePresence } from 'framer-motion'
import { TrendingUp, TrendingDown, DollarSign, ArrowRight, Shield, PiggyBank } from 'lucide-react'

export default function ResultModal({ isOpen, result, onContinue }) {
    if (!result) return null

    const { updatedState, reflection, narrative, learningInsight } = result
    const balanceChange = result.balanceChange || (updatedState?.balance - result.previousState?.balance) || 0
    const savingsChange = result.savingsChange || (updatedState?.savings - result.previousState?.savings) || 0
    const riskChange = (updatedState?.riskExposure || 0) - (result.previousState?.riskExposure || 0)

    const isPositive = balanceChange >= 0

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
                        onClick={onContinue}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative bg-fate-card border border-fate-gray/50 rounded-xl max-w-lg w-full p-6 shadow-2xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center gap-2 mb-6 border-b border-fate-gray/30 pb-4">
                            <div className="w-8 h-8 bg-fate-orange/20 rounded-full flex items-center justify-center">
                                <span className="font-mono text-lg">📝</span>
                            </div>
                            <h2 className="font-mono text-lg font-bold text-white tracking-wider">RESULT</h2>
                        </div>

                        {/* Content */}
                        <div className="space-y-6">
                            {/* Narrative */}
                            <div>
                                <p className="text-white text-lg leading-relaxed mb-2">
                                    {narrative}
                                </p>
                                {reflection && (
                                    <p className="text-fate-text italic text-sm border-l-2 border-fate-orange pl-3">
                                        "{reflection}"
                                    </p>
                                )}
                            </div>

                            {/* Impact Stats */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className={`bg-black/50 rounded-lg p-3 border ${isPositive ? 'border-green-500/30' : 'border-red-500/30'}`}>
                                    <div className="font-mono text-xs text-fate-text mb-1">CASH FLOW</div>
                                    <div className={`font-mono text-xl font-bold flex items-center gap-1 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                                        {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                                        {isPositive ? '+' : ''}₹{Math.abs(balanceChange).toLocaleString()}
                                    </div>
                                </div>

                                {savingsChange !== 0 && (
                                    <div className="bg-black/50 rounded-lg p-3 border border-fate-gray/30">
                                        <div className="font-mono text-xs text-fate-text mb-1">SAVINGS</div>
                                        <div className="font-mono text-xl font-bold flex items-center gap-1 text-fate-orange">
                                            <PiggyBank size={16} />
                                            {savingsChange > 0 ? '+' : ''}₹{Math.abs(savingsChange).toLocaleString()}
                                        </div>
                                    </div>
                                )}

                                {riskChange !== 0 && (
                                    <div className="bg-black/50 rounded-lg p-3 border border-fate-gray/30">
                                        <div className="font-mono text-xs text-fate-text mb-1">RISK EXPOSURE</div>
                                        <div className={`font-mono text-xl font-bold flex items-center gap-1 ${riskChange < 0 ? 'text-green-400' : 'text-fate-orange'}`}>
                                            <Shield size={16} />
                                            {riskChange > 0 ? '+' : ''}{riskChange}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Learning Insight */}
                            {learningInsight && (
                                <div className="bg-fate-orange/10 border border-fate-orange/30 rounded-lg p-4">
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1">💡</div>
                                        <div>
                                            <div className="font-mono text-xs text-fate-orange font-bold mb-1">INSIGHT</div>
                                            <p className="text-sm text-fate-text leading-relaxed">
                                                {learningInsight.message || learningInsight}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Continue Button */}
                            <button
                                onClick={onContinue}
                                className="w-full bg-fate-orange text-black font-bold py-4 rounded-lg font-mono tracking-wider hover:bg-fate-orange-light transition-colors flex items-center justify-center gap-2 group"
                            >
                                CONTINUE <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
