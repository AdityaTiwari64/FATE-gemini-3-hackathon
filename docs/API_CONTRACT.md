# Frontend–Backend UX Contract

> **Principle**: Frontend renders UI based on hints. Backend owns all financial logic.

---

## Core Separation of Concerns

| Layer    | Responsibilities                                      | Never Does                          |
|----------|-------------------------------------------------------|-------------------------------------|
| Frontend | Render UI, capture user input, route based on uiHint | Compute financial logic             |
| Backend  | Process game state, run simulations, generate hints  | Care about UI components or routing |

---

## Request Payload (Frontend → Backend)

```typescript
interface GameRequest {
  gameState: GameState;
  userPreferences: UserPreferences;
  selectedChoiceId?: string;  // Only when user makes a choice
}
```

### GameState

```typescript
interface GameState {
  month: number;              // Current simulation month (1-based)
  balance: number;            // Current account balance
  savings: number;            // Amount in savings account
  insuranceOpted: boolean;    // Whether player has insurance
  riskScore: number;          // Financial risk score (0-100)
  history: HistoryEntry[];    // Past state snapshots
  currentScenarioId?: string; // Active scenario ID (if any)
}
```

### UserPreferences

```typescript
interface UserPreferences {
  riskTolerance: "conservative" | "moderate" | "aggressive";
  incomeLevel: "low" | "medium" | "high";
  focusAreas: ("savings" | "investment" | "insurance" | "debt")[];
  difficultyLevel: "beginner" | "intermediate" | "advanced";
}
```

### SelectedChoiceId

- **When provided**: Backend processes the choice against current scenario
- **When omitted**: Backend determines next game phase

---

## Response Payload (Backend → Frontend)

```typescript
interface GameResponse {
  scenario: Scenario | null;
  updatedGameState: GameState;
  uiHint: UIHint;
}
```

### Scenario

```typescript
interface Scenario {
  id: string;
  type: "income" | "expense" | "investment" | "emergency" | "opportunity";
  title: string;
  description: string;
  choices: Choice[];
  timeLimit?: number;         // Optional countdown in seconds
  urgency: "low" | "medium" | "high";
}

interface Choice {
  id: string;
  label: string;
  shortDescription: string;
  // Financial impacts are HIDDEN from frontend
  // Backend calculates and applies them
}
```

### UIHint (The Routing Signal)

```typescript
type UIHint = 
  | "scenario"      // Show scenario with choices
  | "reflection"    // Show post-choice reflection/feedback
  | "analysis"      // Show financial analysis/charts
  | "decisions"     // Show pending decisions summary
  | "nextMonth";    // Advance to next month view
```

---

## UI Routing Logic (Frontend Only)

```javascript
function renderBasedOnHint(response) {
  const { uiHint, scenario, updatedGameState } = response;
  
  switch (uiHint) {
    case "scenario":
      return <ScenarioView scenario={scenario} />;
    
    case "reflection":
      return <ReflectionView gameState={updatedGameState} />;
    
    case "analysis":
      return <AnalysisView gameState={updatedGameState} />;
    
    case "decisions":
      return <DecisionsSummaryView gameState={updatedGameState} />;
    
    case "nextMonth":
      return <MonthTransitionView gameState={updatedGameState} />;
  }
}
```

---

## API Endpoints

### POST `/api/game/action`

Unified endpoint for all game interactions.

**Request:**
```json
{
  "gameState": {
    "month": 3,
    "balance": 4500,
    "savings": 1200,
    "insuranceOpted": true,
    "riskScore": 45,
    "history": [...],
    "currentScenarioId": "scenario_medical_emergency_001"
  },
  "userPreferences": {
    "riskTolerance": "moderate",
    "incomeLevel": "medium",
    "focusAreas": ["savings", "insurance"],
    "difficultyLevel": "beginner"
  },
  "selectedChoiceId": "choice_use_savings"
}
```

**Response:**
```json
{
  "scenario": null,
  "updatedGameState": {
    "month": 3,
    "balance": 4500,
    "savings": 200,
    "insuranceOpted": true,
    "riskScore": 35,
    "history": [...],
    "currentScenarioId": null
  },
  "uiHint": "reflection"
}
```

### POST `/api/game/start`

Initialize a new game session.

**Request:**
```json
{
  "userPreferences": {
    "riskTolerance": "moderate",
    "incomeLevel": "medium",
    "focusAreas": ["savings"],
    "difficultyLevel": "beginner"
  }
}
```

**Response:**
```json
{
  "scenario": {
    "id": "scenario_intro_001",
    "type": "income",
    "title": "Your First Paycheck",
    "description": "Congratulations on your new job!...",
    "choices": [
      { "id": "choice_save_50", "label": "Save 50%", "shortDescription": "Be aggressive with savings" },
      { "id": "choice_save_20", "label": "Save 20%", "shortDescription": "Balanced approach" },
      { "id": "choice_spend_all", "label": "Treat Yourself", "shortDescription": "Enjoy your earnings" }
    ],
    "urgency": "low"
  },
  "updatedGameState": {
    "month": 1,
    "balance": 1000,
    "savings": 500,
    "insuranceOpted": false,
    "riskScore": 50,
    "history": [],
    "currentScenarioId": "scenario_intro_001"
  },
  "uiHint": "scenario"
}
```

---

## State Flow Diagram

```
┌─────────────┐     POST /api/game/action     ┌─────────────┐
│   FRONTEND  │ ─────────────────────────────▶│   BACKEND   │
│             │                               │             │
│ gameState   │                               │ Process     │
│ preferences │                               │ choice      │
│ choiceId    │                               │ Update state│
│             │◀───────────────────────────── │ Generate    │
│ Render UI   │     GameResponse              │ uiHint      │
│ based on    │     { scenario,               │             │
│ uiHint      │       updatedGameState,       │             │
│             │       uiHint }                │             │
└─────────────┘                               └─────────────┘
```

---

## uiHint Transition Rules (Backend Logic)

| Current State          | User Action           | Next uiHint     |
|------------------------|-----------------------|-----------------|
| Game start             | —                     | `scenario`      |
| Viewing scenario       | Selects a choice      | `reflection`    |
| Viewing reflection     | Continues             | `analysis`      |
| Viewing analysis       | Continues             | `nextMonth`     |
| Month transition       | Continues             | `scenario` or `decisions` |
| Multiple pending       | —                     | `decisions`     |

---

## Error Handling

```typescript
interface GameErrorResponse {
  error: {
    code: "INVALID_STATE" | "INVALID_CHOICE" | "SESSION_EXPIRED" | "SERVER_ERROR";
    message: string;
  };
  uiHint: "error";  // Frontend shows error state
}
```

---

## Key Invariants

1. **Frontend never sees financial impact numbers** until after choice is made
2. **Backend never returns component names** or routing paths
3. **uiHint is the ONLY signal** frontend uses for navigation
4. **gameState is always returned fresh** after every action
5. **scenario is null** when uiHint is not `"scenario"`
