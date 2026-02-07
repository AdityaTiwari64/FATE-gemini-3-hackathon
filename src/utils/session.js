// Session management utilities

/**
 * Generate a random guest ID
 */
function generateGuestId() {
    return `guest-${Math.random().toString(36).substring(2, 10)}`
}

/**
 * Get or create user session
 * @returns {{ userId: string, isGuest: boolean }}
 */
export function getUserSession() {
    let userId = localStorage.getItem('fate_userId')
    let isGuest = true

    if (!userId) {
        userId = generateGuestId()
        localStorage.setItem('fate_userId', userId)
    } else if (!userId.startsWith('guest-')) {
        isGuest = false
    }

    return { userId, isGuest }
}

/**
 * Save user preferences
 * @param {string} userId 
 * @param {object} preferences 
 */
export function savePreferences(userId, preferences) {
    localStorage.setItem(`preferences_${userId}`, JSON.stringify(preferences))
}

/**
 * Get user preferences
 * @param {string} userId 
 * @returns {object|null}
 */
export function getPreferences(userId) {
    const prefs = localStorage.getItem(`preferences_${userId}`)
    return prefs ? JSON.parse(prefs) : null
}

/**
 * Save game state
 * @param {string} userId 
 * @param {object} gameState 
 */
export function saveGameState(userId, gameState) {
    localStorage.setItem(`gameState_${userId}`, JSON.stringify(gameState))
}

/**
 * Get game state
 * @param {string} userId 
 * @returns {object|null}
 */
export function getGameState(userId) {
    const state = localStorage.getItem(`gameState_${userId}`)
    return state ? JSON.parse(state) : null
}

/**
 * Clear all user data (for testing/reset)
 * @param {string} userId 
 */
export function clearUserData(userId) {
    localStorage.removeItem(`preferences_${userId}`)
    localStorage.removeItem(`gameState_${userId}`)
}
