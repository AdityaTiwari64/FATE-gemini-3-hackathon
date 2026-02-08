/**
 * Game Service - Connects Gemini engine to frontend
 * Handles scenario generation and choice processing
 */

import { generateScenario as geminiGenerateScenario } from '../engine/scenarioGenerator'
import { getNetWorth } from '../engine/gameEngine'
import { getGeminiApiKey } from '../utils/session'

/**
 * Generate a new scenario using Gemini AI
 * @param {Object} gameState - Current game state
 * @returns {Promise<Object>} - { scenario, uiHint }
 */
export async function fetchScenario(gameState) {
    const apiKey = getGeminiApiKey()

    try {
        const scenario = await geminiGenerateScenario(gameState, apiKey)
        return {
            scenario: {
                id: `scenario_${Date.now()}`,
                ...scenario
            },
            uiHint: 'scenario'
        }
    } catch (error) {
        console.error('Scenario generation failed:', error)
        return {
            scenario: null,
            uiHint: 'error'
        }
    }
}

/**
 * Process a player's choice and return updated state
 * @param {string} selectedChoiceId - The choice ID
 * @param {Object} scenario - Current scenario with choices
 * @param {Object} gameState - Current game state
 * @returns {{ updatedGameState: Object, reflection: string, uiHint: string }}
 */
export function processGameChoice(selectedChoiceId, scenario, gameState) {
    // Find the selected choice from scenario
    const selectedChoice = scenario.choices.find(c => c.id === selectedChoiceId)

    if (!selectedChoice) {
        return {
            updatedState: gameState,
            narrative: 'Invalid choice',
            reflection: 'Invalid choice',
            learningInsight: null,
            uiHint: 'error'
        }
    }

    // Calculate new values
    const balanceChange = selectedChoice.balanceChange || 0
    const riskChange = selectedChoice.riskChange || 0
    const savingsChange = selectedChoice.savingsChange || 0

    // Create updated state matching GameContext structure
    const updatedState = {
        balance: Math.max(0, gameState.balance + balanceChange),
        savings: Math.max(0, (gameState.savings || 0) + savingsChange),
        riskExposure: Math.max(0, Math.min(100, (gameState.riskExposure || 0) + riskChange)),
        stressLevel: gameState.stressLevel,
        fortuneIndex: gameState.fortuneIndex
    }

    // Generate detailed learning feedback
    const learningInsight = generateLearningInsight(selectedChoice, scenario.choices, gameState)

    return {
        updatedState,
        narrative: `You chose: ${selectedChoice.label}`,
        reflection: generateReflection(selectedChoice),
        learningInsight,
        uiHint: 'reflection'
    }
}

/**
 * Generate a simple reflection based on choice
 * @param {Object} choice - The choice made
 * @returns {string}
 */
function generateReflection(choice) {
    const { balanceChange = 0, riskChange = 0, savingsChange = 0 } = choice

    if (balanceChange > 0 && riskChange < 0) {
        return 'Smart move! You gained money while reducing risk.'
    }
    if (balanceChange < 0 && riskChange < 0) {
        return 'Sometimes spending wisely reduces future risk.'
    }
    if (balanceChange > 0 && riskChange > 0) {
        return 'High reward often comes with higher risk.'
    }
    if (balanceChange < 0 && riskChange > 0) {
        return 'This choice cost you and increased your exposure.'
    }
    if (savingsChange > 0) {
        return 'Building savings is always a wise choice.'
    }
    if (savingsChange < 0) {
        return 'Dipping into savings should be a last resort.'
    }
    return 'Every choice shapes your financial future.'
}

/**
 * Generate detailed learning insights with improvement tips
 * @param {Object} selectedChoice - The choice the user made
 * @param {Array} allChoices - All available choices for comparison
 * @param {Object} gameState - Current game state for context
 * @returns {Object} - Learning insight with tips
 */
function generateLearningInsight(selectedChoice, allChoices, gameState) {
    const { balanceChange = 0, riskChange = 0, savingsChange = 0, label } = selectedChoice

    // Analyze the choice quality
    const isHighRisk = riskChange >= 15
    const isHighSpend = balanceChange <= -10000 || savingsChange <= -10000
    const isConservative = riskChange <= -5 && balanceChange >= 0
    const isSavingsBuilder = savingsChange > 0

    // Find the safest alternative
    const saferAlternative = allChoices.find(c =>
        c.id !== selectedChoice.id &&
        (c.riskChange || 0) < riskChange &&
        (c.balanceChange || 0) > balanceChange
    )

    // Find the best savings alternative
    const betterSavings = allChoices.find(c =>
        c.id !== selectedChoice.id &&
        (c.savingsChange || 0) > savingsChange
    )

    let insight = {
        outcome: '',
        whatWentWrong: null,
        improvement: null,
        financialTip: '',
        alternativeSuggestion: null
    }

    // Build outcome description
    const outcomes = []
    if (balanceChange !== 0) {
        outcomes.push(balanceChange > 0
            ? `+₹${balanceChange.toLocaleString()} balance`
            : `-₹${Math.abs(balanceChange).toLocaleString()} balance`)
    }
    if (savingsChange !== 0) {
        outcomes.push(savingsChange > 0
            ? `+₹${savingsChange.toLocaleString()} savings`
            : `-₹${Math.abs(savingsChange).toLocaleString()} savings`)
    }
    if (riskChange !== 0) {
        outcomes.push(riskChange > 0
            ? `+${riskChange} risk exposure`
            : `${riskChange} risk exposure`)
    }
    insight.outcome = outcomes.join(', ')

    // Analyze what went wrong (if applicable)
    if (isHighRisk) {
        insight.whatWentWrong = `This choice increased your risk by ${riskChange} points. High risk exposure means unexpected events could hurt you more.`
        insight.improvement = 'Consider choices that balance potential gains with risk reduction. Financial security comes from measured decisions.'
        insight.financialTip = '💡 Rule of Thumb: Avoid choices that increase risk above 50 points unless the reward is exceptional.'

        if (saferAlternative) {
            insight.alternativeSuggestion = {
                label: saferAlternative.label,
                benefit: `Would have kept risk ${Math.abs(riskChange - (saferAlternative.riskChange || 0))} points lower`
            }
        }
    } else if (isHighSpend && !isSavingsBuilder) {
        const totalSpent = Math.abs(balanceChange) + Math.abs(savingsChange)
        insight.whatWentWrong = `You spent ₹${totalSpent.toLocaleString()} from your funds. Large expenses without savings backup can be dangerous.`
        insight.improvement = 'Try to maintain at least 3 months of expenses in savings before making large purchases.'
        insight.financialTip = '💡 Emergency Fund Rule: Always keep enough savings to cover unexpected expenses.'

        if (betterSavings) {
            insight.alternativeSuggestion = {
                label: betterSavings.label,
                benefit: `Would have preserved ₹${Math.abs(savingsChange - (betterSavings.savingsChange || 0)).toLocaleString()} more`
            }
        }
    } else if (isConservative) {
        insight.whatWentWrong = null // Not wrong, but can improve
        insight.improvement = 'Great conservative choice! To grow wealth faster, consider small calculated risks when your savings are healthy.'
        insight.financialTip = '💡 Balanced Approach: Mix conservative choices with occasional growth opportunities.'
    } else if (isSavingsBuilder) {
        insight.whatWentWrong = null
        insight.improvement = 'Excellent! Building savings is the foundation of financial security. Consider investing once you have 6 months of expenses saved.'
        insight.financialTip = '💡 50/30/20 Rule: Aim to save at least 20% of your income consistently.'
    } else {
        insight.improvement = 'Every financial decision teaches you something. Track your choices to identify patterns.'
        insight.financialTip = '💡 Financial Literacy: Understanding the impact of your choices is the first step to financial freedom.'
    }

    return insight
}

/**
 * Get game summary stats
 * @param {Object} gameState - Current game state
 * @returns {Object}
 */
export function getGameStats(gameState) {
    return {
        month: gameState.month,
        netWorth: getNetWorth(gameState),
        balance: gameState.balance,
        savings: gameState.savings,
        riskScore: gameState.riskScore,
        choicesMade: gameState.history.length
    }
}
