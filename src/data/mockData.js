export const mockScenarios = [
    {
        id: 'scenario_1',
        situation: 'A recruiter from a booming tech hub in the city has reached out. The salary is a 30% bump from your current role, but the sirens of progress come with a heavy tax. Moving means leaving behind your support network—the quiet comfort of the suburbs—for a studio apartment that costs as much as a mortgage.',
        choices: [
            {
                id: 'choice_1a',
                label: 'Take the risk (Move to the city)',
                balanceChange: 500,
                savingsChange: -200,
                riskChange: 15
            },
            {
                id: 'choice_1b',
                label: 'Stay comfortable (Keep current job)',
                balanceChange: 0,
                savingsChange: 100,
                riskChange: -5
            },
            {
                id: 'choice_1c',
                label: 'Negotiate terms (Ask for signing bonus)',
                balanceChange: 300,
                savingsChange: 0,
                riskChange: 5
            }
        ]
    },
    {
        id: 'scenario_2',
        situation: 'Your car breaks down on the way to work. The mechanic says it will cost $800 to fix, but you could also buy a used car for $2,500. Public transit exists but adds 45 minutes to your commute each way.',
        choices: [
            {
                id: 'choice_2a',
                label: 'Fix the current car',
                balanceChange: -800,
                savingsChange: 0,
                riskChange: 10
            },
            {
                id: 'choice_2b',
                label: 'Buy a used car',
                balanceChange: -2500,
                savingsChange: 0,
                riskChange: -5
            },
            {
                id: 'choice_2c',
                label: 'Use public transit',
                balanceChange: -80,
                savingsChange: 100,
                riskChange: 0
            }
        ]
    },
    {
        id: 'scenario_3',
        situation: 'A friend approaches you with an investment opportunity in their startup. They need $1,000 and promise 20% returns within 6 months. You\'ve known them for years, but their track record with money isn\'t great.',
        choices: [
            {
                id: 'choice_3a',
                label: 'Invest the full amount',
                balanceChange: -1000,
                savingsChange: 0,
                riskChange: 25
            },
            {
                id: 'choice_3b',
                label: 'Invest half the amount',
                balanceChange: -500,
                savingsChange: 0,
                riskChange: 15
            },
            {
                id: 'choice_3c',
                label: 'Politely decline',
                balanceChange: 0,
                savingsChange: 50,
                riskChange: -5
            }
        ]
    }
]

export const getScenarioByMonth = (month) => {
    const index = (month - 1) % mockScenarios.length
    return mockScenarios[index]
}
