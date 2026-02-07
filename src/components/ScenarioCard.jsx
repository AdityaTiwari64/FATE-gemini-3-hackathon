import ChoiceButton from './ChoiceButton'
import './ScenarioCard.css'

export default function ScenarioCard({ scenario, onChoiceSelect }) {
    if (!scenario) {
        return (
            <div className="scenario-card empty">
                <p className="scenario-empty-text">No scenario available</p>
            </div>
        )
    }

    const { situation, choices } = scenario

    return (
        <div className="scenario-card">
            <div className="scenario-badge">DECISION REQUIRED</div>

            <div className="scenario-image">
                <div className="scenario-image-overlay"></div>
            </div>

            <div className="scenario-content">
                <h2 className="scenario-title">The Crossroads</h2>
                <p className="scenario-situation">{situation}</p>

                <blockquote className="scenario-quote">
                    "Every choice shapes your financial future. Choose wisely."
                </blockquote>

                <div className="scenario-choices">
                    {choices.map((choice, index) => (
                        <ChoiceButton
                            key={choice.id}
                            choice={choice}
                            onSelect={onChoiceSelect}
                            recommended={index === 1}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}
