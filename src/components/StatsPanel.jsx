import './StatsPanel.css'

export default function StatsPanel({ gameState }) {
    const { month, balance, savings, insuranceOpted, riskScore } = gameState

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(amount)
    }

    const getRiskLevel = (score) => {
        if (score <= 30) return { label: 'Low', color: 'green' }
        if (score <= 60) return { label: 'Medium', color: 'orange' }
        return { label: 'High', color: 'red' }
    }

    const risk = getRiskLevel(riskScore)

    return (
        <aside className="stats-panel">
            <div className="stats-section">
                <span className="stats-label">TEMPORAL PHASE</span>
                <h2 className="stats-month">MONTH {String(month).padStart(2, '0')}</h2>
            </div>

            <div className="stats-card">
                <div className="stat-row">
                    <span className="stat-label">LIQUID FUNDS</span>
                    <span className="stat-icon">💰</span>
                </div>
                <span className="stat-value-large">{formatCurrency(balance)}</span>
                <span className="stat-note text-accent">↗ Current Balance</span>
            </div>

            <div className="stats-card">
                <div className="stat-row">
                    <span className="stat-label">SAVINGS</span>
                    <span className="stat-value">{formatCurrency(savings)}</span>
                </div>
                <div className="progress-bar">
                    <div
                        className="progress-fill cyan"
                        style={{ width: `${Math.min((savings / 10000) * 100, 100)}%` }}
                    ></div>
                </div>
                <span className="stat-note text-secondary">Goal: $10,000</span>
            </div>

            <div className="stats-card">
                <div className="stat-row">
                    <span className="stat-label">RISK SCORE</span>
                    <span className={`stat-value text-${risk.color}`}>{riskScore}%</span>
                </div>
                <div className="progress-bar">
                    <div
                        className={`progress-fill ${risk.color}`}
                        style={{ width: `${riskScore}%` }}
                    ></div>
                </div>
                <span className={`stat-note text-${risk.color}`}>{risk.label} Risk</span>
            </div>

            <div className="stats-card">
                <div className="stat-row">
                    <span className="stat-label">INSURANCE</span>
                    <span className={`badge ${insuranceOpted ? 'badge-green' : 'badge-red'}`}>
                        {insuranceOpted ? 'ACTIVE' : 'NONE'}
                    </span>
                </div>
                {!insuranceOpted && (
                    <span className="stat-note text-muted">
                        Consider getting coverage for unexpected events
                    </span>
                )}
            </div>
        </aside>
    )
}
