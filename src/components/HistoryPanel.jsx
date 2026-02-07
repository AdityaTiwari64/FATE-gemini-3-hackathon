import './HistoryPanel.css'

export default function HistoryPanel({ history = [] }) {
    return (
        <aside className="history-panel">
            <h3 className="history-title">MEMORY ECHOES</h3>
            <p className="history-subtitle">"Past choices shape your future silhouette."</p>

            <div className="history-timeline">
                {history.length === 0 ? (
                    <div className="history-empty">
                        <p>Your journey begins here...</p>
                    </div>
                ) : (
                    history.map((event, index) => (
                        <div key={index} className="history-event">
                            <div className="history-event-marker">
                                <span className={`marker-dot ${event.type || 'neutral'}`}></span>
                                {index < history.length - 1 && <span className="marker-line"></span>}
                            </div>
                            <div className="history-event-content">
                                <span className="history-event-title">{event.title}</span>
                                <span className="history-event-month">Month {event.month}</span>
                                {event.description && (
                                    <p className="history-event-desc">{event.description}</p>
                                )}
                            </div>
                        </div>
                    ))
                )}

                {/* Future placeholders */}
                <div className="history-event locked">
                    <div className="history-event-marker">
                        <span className="marker-dot"></span>
                        <span className="marker-line"></span>
                    </div>
                    <div className="history-event-content">
                        <span className="history-event-title">FUTURE EVENT</span>
                        <span className="history-event-locked">🔒 Locked</span>
                    </div>
                </div>

                <div className="history-event locked">
                    <div className="history-event-marker">
                        <span className="marker-dot"></span>
                    </div>
                    <div className="history-event-content">
                        <span className="history-event-title">FUTURE EVENT</span>
                        <span className="history-event-locked">🔒 Locked</span>
                    </div>
                </div>
            </div>
        </aside>
    )
}
