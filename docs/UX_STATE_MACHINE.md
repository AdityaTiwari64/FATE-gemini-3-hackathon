# Frontend UX State Machine

> **Rule**: Frontend state = f(backend uiHint). No exceptions.

---

## State Definitions

| State | Triggered By | Screen |
|-------|--------------|--------|
| `SHOW_SCENARIO` | `uiHint: "scenario"` | Scenario card with choices |
| `SHOW_CONSEQUENCE` | `uiHint: "consequence"` | Immediate outcome card |
| `SHOW_REFLECTION` | `uiHint: "reflection"` | Emotional reflection card |
| `SHOW_ANALYSIS` | `uiHint: "analysis"` | What happened card |
| `SHOW_DECISIONS` | `uiHint: "decisions"` | Pending decisions screen |
| `SHOW_NEXT_MONTH` | `uiHint: "nextMonth"` | Month transition card |

---

## State Transition Table

```
┌──────────────────┐
│   SHOW_SCENARIO  │ ◀─── Game starts here
└────────┬─────────┘
         │ User picks choice
         ▼
┌──────────────────┐
│ SHOW_CONSEQUENCE │  "Here's what happened"
└────────┬─────────┘
         │ Continue
         ▼
┌──────────────────┐
│ SHOW_REFLECTION  │  "How do you feel?"
└────────┬─────────┘
         │ Continue
         ▼
┌──────────────────┐
│  SHOW_ANALYSIS   │  "One thing to know"
└────────┬─────────┘
         │ Continue
         ▼
┌──────────────────┐
│ SHOW_NEXT_MONTH  │  "Month 2 begins..."
└────────┬─────────┘
         │ Continue
         ▼
┌──────────────────┐
│  SHOW_SCENARIO   │  Next scenario
└──────────────────┘
```

---

## Example Flow: Month 1

### 1. SHOW_SCENARIO
```
┌─────────────────────────────────┐
│  🎉 Your First Paycheck         │
│                                 │
│  You just got paid ₹50,000.     │
│  What's your move?              │
│                                 │
│  ○ Save half for later          │
│  ○ Pay off that phone bill      │
│  ○ Treat yourself               │
│                                 │
│         [ Choose ]              │
└─────────────────────────────────┘
```

### 2. SHOW_CONSEQUENCE
```
┌─────────────────────────────────┐
│  ✓ Nice choice!                 │
│                                 │
│  You saved ₹25,000.             │
│  That's money you can't         │
│  accidentally spend.            │
│                                 │
│         [ Continue ]            │
└─────────────────────────────────┘
```

### 3. SHOW_REFLECTION
```
┌─────────────────────────────────┐
│  💭                             │
│                                 │
│  Saving feels boring,           │
│  but future-you will            │
│  thank present-you.             │
│                                 │
│         [ Continue ]            │
└─────────────────────────────────┘
```

### 4. SHOW_ANALYSIS
```
┌─────────────────────────────────┐
│  📚 Pay Yourself First          │
│                                 │
│  Rich people save before        │
│  they spend. Poor people        │
│  spend before they save.        │
│                                 │
│         [ Got it ]              │
└─────────────────────────────────┘
```

### 5. SHOW_NEXT_MONTH
```
┌─────────────────────────────────┐
│  📅 Month 2                     │
│                                 │
│  Life continues...              │
│                                 │
│         [ Begin ]               │
└─────────────────────────────────┘
```

---

## Card Design Constraints

| Rule | Limit |
|------|-------|
| Max lines of text | 3–4 |
| Buttons per card | 1 |
| Button label | Single word |
| Charts/graphs | ❌ None |
| Scores/numbers | ❌ Hidden |
| Swipeable concepts | ✅ Optional |

---

## Frontend Implementation

```jsx
function GameScreen({ response }) {
  const { uiHint, scenario, updatedGameState, content } = response;

  const screens = {
    scenario:    <ScenarioCard scenario={scenario} />,
    consequence: <ConsequenceCard content={content} />,
    reflection:  <ReflectionCard content={content} />,
    analysis:    <AnalysisCard content={content} />,
    decisions:   <DecisionsCard gameState={updatedGameState} />,
    nextMonth:   <NextMonthCard month={updatedGameState.month} />
  };

  return screens[uiHint] || <LoadingCard />;
}
```

---

## Card Components

### ReflectionCard (Emotional)
```jsx
function ReflectionCard({ content }) {
  return (
    <Card>
      <Emoji>{content.emoji}</Emoji>
      <Text>{content.message}</Text>
      <Button onClick={onContinue}>Continue</Button>
    </Card>
  );
}
```

### AnalysisCard (Educational)
```jsx
function AnalysisCard({ content }) {
  return (
    <Card>
      <Icon>📚</Icon>
      <Title>{content.conceptTitle}</Title>
      <Text>{content.conceptExplainer}</Text>
      <Button onClick={onContinue}>Got it</Button>
    </Card>
  );
}
```

### ConceptSwiper (Optional Deep Dive)
```jsx
function ConceptSwiper({ concepts }) {
  // Only shown if user opts in
  // Max 3 concepts, swipeable
  return (
    <Swiper>
      {concepts.map(c => (
        <ConceptCard key={c.id}>
          <Title>{c.title}</Title>
          <Text>{c.explainer}</Text>
        </ConceptCard>
      ))}
    </Swiper>
  );
}
```

---

## Backend Response Additions

```typescript
interface CardContent {
  emoji?: string;           // For reflection cards
  message: string;          // 2-3 lines max
  conceptTitle?: string;    // For analysis cards
  conceptExplainer?: string;
  concepts?: Concept[];     // Optional swipeable concepts
}

interface GameResponse {
  scenario: Scenario | null;
  updatedGameState: GameState;
  uiHint: UIHint;
  content?: CardContent;    // NEW: Card-specific content
}
```

---

## UX Philosophy

```
┌─────────────────────────────────────────┐
│  Less is more.                          │
│                                         │
│  • One question at a time               │
│  • One concept at a time                │
│  • One button at a time                 │
│                                         │
│  The goal is learning, not overwhelm.   │
└─────────────────────────────────────────┘
```
