/**
 * Process a choice and return the updated state
 * This is a mock function that simulates backend logic
 * 
 * @param {string} choiceId - The ID of the selected choice
 * @param {object} currentState - The current game state
 * @returns {{ updatedState: object, narrative: string, reflection: string }}
 */
export function processChoice(choiceId, currentState) {
    // Mock scenarios based on choice ID patterns
    const mockResponses = {
        'move_out': {
            updatedState: {
                balance: currentState.balance - 8000,
                riskExposure: currentState.riskExposure + 15,
                stressLevel: Math.min(100, currentState.stressLevel + 20)
            },
            narrative: 'You decided to move out. The relocation costs hit your savings hard.',
            reflection: 'Sometimes the cost of freedom is measured in more than rupees.'
        },
        'file_appeal': {
            updatedState: {
                balance: currentState.balance - 2000,
                riskExposure: currentState.riskExposure + 5,
                stressLevel: Math.min(100, currentState.stressLevel + 10)
            },
            narrative: 'You filed an appeal against the rent increase. Legal fees were moderate.',
            reflection: 'Fighting the system has its costs, but sometimes principles matter.'
        },
        'accept_increase': {
            updatedState: {
                balance: currentState.balance - 3600,
                riskExposure: currentState.riskExposure - 5,
                stressLevel: Math.max(0, currentState.stressLevel - 5)
            },
            narrative: 'You accepted the 15% increase. Your monthly expenses are now higher.',
            reflection: 'Stability often comes at a premium.'
        },
        'invest_aggressive': {
            updatedState: {
                balance: Math.random() > 0.5
                    ? currentState.balance + 5000
                    : currentState.balance - 3000,
                riskExposure: currentState.riskExposure + 25,
                fortuneIndex: Math.min(100, currentState.fortuneIndex + 10)
            },
            narrative: 'You made an aggressive investment. The market was volatile.',
            reflection: 'High risk, high reward. Or high loss.'
        },
        'invest_conservative': {
            updatedState: {
                balance: currentState.balance + 800,
                riskExposure: Math.max(0, currentState.riskExposure - 5),
                fortuneIndex: currentState.fortuneIndex + 2
            },
            narrative: 'You chose a conservative investment. Steady gains.',
            reflection: 'Slow and steady wins the race.'
        },
        'skip_insurance': {
            updatedState: {
                balance: currentState.balance,
                riskExposure: currentState.riskExposure + 20
            },
            narrative: 'You decided to skip insurance this month.',
            reflection: 'Saving now might cost you later.'
        },
        'buy_insurance': {
            updatedState: {
                balance: currentState.balance - 1500,
                riskExposure: Math.max(0, currentState.riskExposure - 15)
            },
            narrative: 'You purchased comprehensive insurance coverage.',
            reflection: 'Protection has its price, but peace of mind is priceless.'
        }
    }

    // Default response for unknown choices
    const defaultResponse = {
        updatedState: {
            balance: currentState.balance - 1000,
            riskExposure: currentState.riskExposure + 5
        },
        narrative: 'You made a decision. Life goes on.',
        reflection: 'Every choice shapes your financial destiny.'
    }

    // Find matching response or use default
    const matchingKey = Object.keys(mockResponses).find(key =>
        choiceId.toLowerCase().includes(key.toLowerCase())
    )

    return matchingKey ? mockResponses[matchingKey] : defaultResponse
}

/**
 * Get a random scenario for the current month
 * @param {number} month 
 * @returns {{ text: string, choices: Array }}
 */
export function getScenario(month) {
    const scenarios = [
        {
            text: 'Your rent just increased by <span class="text-fate-orange">15%</span> due to new city regulations. You can move, fight it, or pay up.',
            choices: [
                { id: 'move_out', label: 'MOVE OUT' },
                { id: 'file_appeal', label: 'FILE APPEAL' },
                { id: 'accept_increase', label: 'ACCEPT INCREASE' }
            ]
        },
        {
            text: 'A friend offers you an investment opportunity with potential <span class="text-fate-orange">40%</span> returns. The market is unpredictable.',
            choices: [
                { id: 'invest_aggressive', label: 'INVEST HEAVILY' },
                { id: 'invest_conservative', label: 'INVEST SMALL' },
                { id: 'skip', label: 'PASS' }
            ]
        },
        {
            text: 'Your health insurance is due for renewal. Premium increased by <span class="text-fate-orange">₹1,500</span> this year.',
            choices: [
                { id: 'buy_insurance', label: 'RENEW POLICY' },
                { id: 'skip_insurance', label: 'SKIP THIS YEAR' },
                { id: 'downgrade', label: 'DOWNGRADE PLAN' }
            ]
        },
        {
            text: 'Unexpected medical emergency. Hospital bills total <span class="text-fate-orange">₹12,000</span>. How do you handle it?',
            choices: [
                { id: 'pay_full', label: 'PAY IN FULL' },
                { id: 'emi', label: 'EMI PLAN' },
                { id: 'borrow', label: 'BORROW FROM FAMILY' }
            ]
        },
        {
            text: 'Job offer from a startup. <span class="text-fate-orange">30%</span> salary hike but stock options instead of bonus.',
            choices: [
                { id: 'accept_offer', label: 'ACCEPT OFFER' },
                { id: 'negotiate', label: 'NEGOTIATE' },
                { id: 'decline', label: 'STAY PUT' }
            ]
        }
    ]

    return scenarios[(month - 1) % scenarios.length]
}
