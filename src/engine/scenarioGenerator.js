/**
 * Gemini-Powered Scenario Generator
 * Generates financial life scenarios for Indian student simulator
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

// ============================================
// SYSTEM PROMPT
// ============================================

const SYSTEM_PROMPT = `You are a scenario generator for a financial life simulation game aimed at Indian college students.

Your task is to create realistic financial situations that Indian students commonly face.

RULES:
- Generate exactly ONE scenario with exactly 3 choices
- Use simple, clear language
- Keep monetary values realistic for Indian students (in INR, values between 100-5000)
- Balance changes should be small and realistic
- Risk changes should be between -20 and +20
- Do NOT give financial advice
- Do NOT add explanations or commentary
- Do NOT use emojis or markdown
- Return ONLY valid JSON, nothing else

CONTEXT TO CONSIDER:
- Current month in simulation
- Player's current balance
- Player's current savings
- Player's risk score (0-100, higher = riskier behavior)

SCENARIO THEMES (rotate between these):
- Food choices (canteen vs cooking vs ordering)
- Transport decisions (bus vs auto vs walk)
- Study materials (new books vs second-hand vs pirated)
- Entertainment (movies, subscriptions, outings)
- Part-time work opportunities
- Unexpected expenses (phone repair, medical, fees)
- Peer pressure spending (treats, gifts, group activities)
- Savings opportunities (FD, chit fund, piggy bank)

OUTPUT FORMAT (strict JSON only):
{
  "situation": "A brief description of the scenario the student faces",
  "choices": [
    {
      "id": "choice_1",
      "label": "Short description of first option",
      "balanceChange": -500,
      "riskChange": 5
    },
    {
      "id": "choice_2", 
      "label": "Short description of second option",
      "balanceChange": -200,
      "riskChange": 0
    },
    {
      "id": "choice_3",
      "label": "Short description of third option",
      "balanceChange": 0,
      "riskChange": -5
    }
  ]
}`;

// ============================================
// FALLBACK SCENARIOS
// ============================================

const FALLBACK_SCENARIOS = [
  {
    situation: "Your phone screen cracked and you need to decide what to do.",
    choices: [
      { id: "choice_1", label: "Get it repaired at the local shop", balanceChange: -800, riskChange: 5 },
      { id: "choice_2", label: "Use a screen protector and ignore it", balanceChange: -100, riskChange: 0 },
      { id: "choice_3", label: "Ask parents for help with repair cost", balanceChange: 0, riskChange: -10 }
    ]
  },
  {
    situation: "Your friends are planning a weekend trip to a nearby hill station.",
    choices: [
      { id: "choice_1", label: "Join the trip and split costs", balanceChange: -1500, riskChange: 10 },
      { id: "choice_2", label: "Skip the trip and study instead", balanceChange: 0, riskChange: -5 },
      { id: "choice_3", label: "Go for just one day to save money", balanceChange: -600, riskChange: 5 }
    ]
  },
  {
    situation: "The semester books list is out and you need study materials.",
    choices: [
      { id: "choice_1", label: "Buy new books from the store", balanceChange: -2000, riskChange: -5 },
      { id: "choice_2", label: "Get second-hand books from seniors", balanceChange: -500, riskChange: 0 },
      { id: "choice_3", label: "Use library copies and photocopies", balanceChange: -200, riskChange: 5 }
    ]
  },
  {
    situation: "A senior offers you a part-time tutoring job for school students.",
    choices: [
      { id: "choice_1", label: "Accept the job for extra income", balanceChange: 1500, riskChange: 10 },
      { id: "choice_2", label: "Decline to focus on studies", balanceChange: 0, riskChange: -5 },
      { id: "choice_3", label: "Try it for one month first", balanceChange: 800, riskChange: 5 }
    ]
  },
  {
    situation: "Your laptop is running slow and affecting your assignments.",
    choices: [
      { id: "choice_1", label: "Buy a new budget laptop", balanceChange: -25000, riskChange: 5 },
      { id: "choice_2", label: "Get RAM upgrade from local shop", balanceChange: -2000, riskChange: 0 },
      { id: "choice_3", label: "Use college computer lab instead", balanceChange: 0, riskChange: -5 }
    ]
  }
];

// ============================================
// VALIDATION
// ============================================

/**
 * Validates that the scenario matches expected format
 * @param {Object} scenario - Scenario object to validate
 * @returns {boolean} - True if valid
 */
function validateScenario(scenario) {
  // Check top-level structure
  if (!scenario || typeof scenario !== 'object') {
    return false;
  }

  // Check situation
  if (typeof scenario.situation !== 'string' || scenario.situation.length === 0) {
    return false;
  }

  // Check choices array
  if (!Array.isArray(scenario.choices) || scenario.choices.length !== 3) {
    return false;
  }

  // Validate each choice
  for (const choice of scenario.choices) {
    if (typeof choice.id !== 'string' || choice.id.length === 0) {
      return false;
    }
    if (typeof choice.label !== 'string' || choice.label.length === 0) {
      return false;
    }
    if (typeof choice.balanceChange !== 'number') {
      return false;
    }
    if (typeof choice.riskChange !== 'number') {
      return false;
    }
  }

  return true;
}

/**
 * Attempts to parse JSON from Gemini response, handling potential issues
 * @param {string} text - Raw text response from Gemini
 * @returns {Object|null} - Parsed object or null if invalid
 */
function parseGeminiResponse(text) {
  try {
    // Try direct parse first
    return JSON.parse(text);
  } catch {
    // Try to extract JSON from response (in case of extra text)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch {
        return null;
      }
    }
    return null;
  }
}

/**
 * Gets a random fallback scenario
 * @returns {Object} - A fallback scenario
 */
function getFallbackScenario() {
  const index = Math.floor(Math.random() * FALLBACK_SCENARIOS.length);
  return { ...FALLBACK_SCENARIOS[index] };
}

// ============================================
// MAIN GENERATOR FUNCTION
// ============================================

/**
 * Generates a scenario using Gemini AI
 * @param {Object} gameState - Current game state
 * @param {string} apiKey - Google Gemini API key
 * @returns {Promise<Object>} - Generated scenario
 */
export async function generateScenario(gameState, apiKey) {
  // If no API key, return fallback
  if (!apiKey) {
    console.warn('No API key provided, using fallback scenario');
    return getFallbackScenario();
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Use gemini-2.5-flash model
    const modelOptions = ['gemini-2.5-flash'];
    let lastError = null;
    
    for (const modelName of modelOptions) {
      try {
        const model = genAI.getGenerativeModel({ 
          model: modelName,
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 500,
          }
        });

        // Build context from game state
        const context = `
Current game state:
- Month: ${gameState.month}
- Balance: ₹${gameState.balance}
- Savings: ₹${gameState.savings}
- Risk Score: ${gameState.riskScore}/100

Generate a new financial scenario for this Indian college student.`;

        // Create chat with system instruction
        const chat = model.startChat({
          history: [
            {
              role: 'user',
              parts: [{ text: SYSTEM_PROMPT }]
            },
            {
              role: 'model', 
              parts: [{ text: 'Understood. I will generate realistic financial scenarios for Indian college students and return only valid JSON in the specified format.' }]
            }
          ]
        });

        // Generate scenario
        const result = await chat.sendMessage(context);
        const response = await result.response;
        const text = response.text();

        // Parse and validate
        const scenario = parseGeminiResponse(text);
        
        if (scenario && validateScenario(scenario)) {
          console.log(`✓ Using model: ${modelName}`);
          return scenario;
        }
      } catch (modelError) {
        lastError = modelError;
        console.warn(`Model ${modelName} failed, trying next...`);
        continue;
      }
    }
    
    // All models failed
    console.error('All Gemini models failed:', lastError?.message);
    return getFallbackScenario();

  } catch (error) {
    console.error('Gemini initialization error:', error.message);
    return getFallbackScenario();
  }
}

// Export for testing
export { validateScenario, parseGeminiResponse, getFallbackScenario, FALLBACK_SCENARIOS, SYSTEM_PROMPT };
