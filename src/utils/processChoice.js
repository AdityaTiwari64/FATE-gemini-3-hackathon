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
                { id: 'move_out', label: 'MOVE OUT', balanceChange: -8000, savingsChange: -5000, riskChange: 15 },
                { id: 'file_appeal', label: 'FILE APPEAL', balanceChange: -2000, savingsChange: 0, riskChange: 5 },
                { id: 'accept_increase', label: 'ACCEPT INCREASE', balanceChange: -3600, savingsChange: 0, riskChange: -5 }
            ]
        },
        {
            text: 'A friend offers you an investment opportunity with potential <span class="text-fate-orange">40%</span> returns. The market is unpredictable.',
            choices: [
                { id: 'invest_aggressive', label: 'INVEST HEAVILY', balanceChange: -5000, savingsChange: -10000, riskChange: 25 },
                { id: 'invest_conservative', label: 'INVEST SMALL', balanceChange: -1000, savingsChange: 0, riskChange: 5 },
                { id: 'skip', label: 'PASS', balanceChange: 0, savingsChange: 0, riskChange: 0 }
            ]
        },
        {
            text: 'Your health insurance is due for renewal. Premium increased by <span class="text-fate-orange">₹1,500</span> this year.',
            choices: [
                { id: 'buy_insurance', label: 'RENEW POLICY', balanceChange: -1500, savingsChange: 0, riskChange: -15 },
                { id: 'skip_insurance', label: 'SKIP THIS YEAR', balanceChange: 0, savingsChange: 0, riskChange: 20 },
                { id: 'downgrade', label: 'DOWNGRADE PLAN', balanceChange: -800, savingsChange: 0, riskChange: 5 }
            ]
        },
        {
            text: 'Unexpected medical emergency. Hospital bills total <span class="text-fate-orange">₹12,000</span>. How do you handle it?',
            choices: [
                { id: 'pay_full', label: 'PAY IN FULL', balanceChange: -12000, savingsChange: 0, riskChange: -10 },
                { id: 'use_savings', label: 'USE SAVINGS', balanceChange: 0, savingsChange: -12000, riskChange: 5 },
                { id: 'emi', label: 'EMI PLAN', balanceChange: -2000, savingsChange: 0, riskChange: 10 }
            ]
        },
        {
            text: 'Job offer from a startup. <span class="text-fate-orange">30%</span> salary hike but stock options instead of bonus.',
            choices: [
                { id: 'accept_offer', label: 'ACCEPT OFFER', balanceChange: 8000, savingsChange: 0, riskChange: 20 },
                { id: 'negotiate', label: 'NEGOTIATE', balanceChange: 5000, savingsChange: 0, riskChange: 10 },
                { id: 'decline', label: 'STAY PUT', balanceChange: 0, savingsChange: 2000, riskChange: -5 }
            ]
        },
        {
            text: 'Your laptop crashed. You need it for work. New one costs <span class="text-fate-orange">₹65,000</span>.',
            choices: [
                { id: 'buy_new', label: 'BUY NEW', balanceChange: -30000, savingsChange: -35000, riskChange: -5 },
                { id: 'repair', label: 'REPAIR OLD', balanceChange: -8000, savingsChange: 0, riskChange: 10 },
                { id: 'buy_used', label: 'BUY REFURBISHED', balanceChange: -25000, savingsChange: 0, riskChange: 5 }
            ]
        },
        {
            text: 'Your parents need <span class="text-fate-orange">₹20,000</span> for home repairs. Family expectations are high.',
            choices: [
                { id: 'send_full', label: 'SEND FULL AMOUNT', balanceChange: -10000, savingsChange: -10000, riskChange: -10 },
                { id: 'send_partial', label: 'SEND ₹10,000', balanceChange: -10000, savingsChange: 0, riskChange: 0 },
                { id: 'decline_help', label: 'EXPLAIN SITUATION', balanceChange: 0, savingsChange: 0, riskChange: 5 }
            ]
        },
        {
            text: 'Crypto is surging. Your friend made <span class="text-fate-orange">₹50,000</span> this week. FOMO is real.',
            choices: [
                { id: 'invest_crypto', label: 'INVEST ₹20,000', balanceChange: -10000, savingsChange: -10000, riskChange: 30 },
                { id: 'small_bet', label: 'TEST WITH ₹5,000', balanceChange: -5000, savingsChange: 0, riskChange: 15 },
                { id: 'ignore_fomo', label: 'IGNORE THE HYPE', balanceChange: 0, savingsChange: 3000, riskChange: -5 }
            ]
        },
        {
            text: 'Annual bonus arrived: <span class="text-fate-orange">₹45,000</span>. What do you do with it?',
            choices: [
                { id: 'save_all', label: 'SAVE EVERYTHING', balanceChange: 5000, savingsChange: 40000, riskChange: -10 },
                { id: 'invest_bonus', label: 'INVEST IN MUTUAL FUNDS', balanceChange: 15000, savingsChange: 15000, riskChange: 5 },
                { id: 'treat_yourself', label: 'TREAT YOURSELF', balanceChange: 45000, savingsChange: 0, riskChange: 0 }
            ]
        },
        {
            text: 'Your bike needs major servicing. Quote is <span class="text-fate-orange">₹8,000</span> but you could sell it.',
            choices: [
                { id: 'service_bike', label: 'GET IT SERVICED', balanceChange: -8000, savingsChange: 0, riskChange: -5 },
                { id: 'sell_bike', label: 'SELL & USE PUBLIC TRANSPORT', balanceChange: 15000, savingsChange: 10000, riskChange: 10 },
                { id: 'delay_service', label: 'DELAY FOR NOW', balanceChange: 0, savingsChange: 0, riskChange: 15 }
            ]
        },
        {
            text: 'Your company offers a <span class="text-fate-orange">₹5,000/month</span> matched savings plan. Do you enroll?',
            choices: [
                { id: 'max_savings', label: 'MAX CONTRIBUTION', balanceChange: -5000, savingsChange: 10000, riskChange: -10 },
                { id: 'partial_savings', label: 'CONTRIBUTE ₹2,500', balanceChange: -2500, savingsChange: 5000, riskChange: -5 },
                { id: 'skip_plan', label: 'SKIP FOR NOW', balanceChange: 0, savingsChange: 0, riskChange: 5 }
            ]
        },
        {
            text: 'Emergency fund goal: <span class="text-fate-orange">₹50,000</span>. How much do you set aside this month?',
            choices: [
                { id: 'big_deposit', label: 'DEPOSIT ₹15,000', balanceChange: -15000, savingsChange: 15000, riskChange: -15 },
                { id: 'small_deposit', label: 'DEPOSIT ₹5,000', balanceChange: -5000, savingsChange: 5000, riskChange: -5 },
                { id: 'skip_deposit', label: 'SKIP THIS MONTH', balanceChange: 0, savingsChange: 0, riskChange: 10 }
            ]
        }
    ]

    return scenarios[(month - 1) % scenarios.length]
}
