import './ChoiceButton.css'

export default function ChoiceButton({ choice, onSelect, recommended = false }) {
    const { id, label, balanceChange, savingsChange, riskChange } = choice

    const formatChange = (value, prefix = '') => {
        if (value === 0 || value === undefined) return null
        const sign = value > 0 ? '+' : ''
        return `${prefix}${sign}${value}`
    }

    const getImpactClass = (value) => {
        if (value > 0) return 'positive'
        if (value < 0) return 'negative'
        return 'neutral'
    }

    return (
        <button
            className={`choice-button ${recommended ? 'recommended' : ''}`}
            onClick={() => onSelect(choice)}
        >
            {recommended && <span className="choice-recommended-badge">RECOMMENDED</span>}

            <div className="choice-content">
                <span className="choice-label">{label}</span>

                <div className="choice-impacts">
                    {balanceChange !== 0 && (
                        <span className={`choice-impact ${getImpactClass(balanceChange)}`}>
                            {formatChange(balanceChange, '$')}
                        </span>
                    )}
                    {savingsChange !== undefined && savingsChange !== 0 && (
                        <span className={`choice-impact ${getImpactClass(savingsChange)}`}>
                            Savings: {formatChange(savingsChange, '$')}
                        </span>
                    )}
                    {riskChange !== 0 && (
                        <span className={`choice-impact risk ${getImpactClass(-riskChange)}`}>
                            Risk: {formatChange(riskChange)}
                        </span>
                    )}
                </div>
            </div>

            <span className="choice-arrow">→</span>
        </button>
    )
}
