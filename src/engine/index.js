/**
 * Game Engine Module Exports
 */
export {
  initializeGameState,
  advanceMonth,
  applyIncome,
  applyChoice,
  cloneState,
  getNetWorth,
} from './gameEngine.js';

export {
  generateScenario,
  validateScenario,
  getFallbackScenario,
  FALLBACK_SCENARIOS,
} from './scenarioGenerator.js';
