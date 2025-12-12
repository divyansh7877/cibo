I'll start by reading the hackathon document to understand the grading criteria and requirements.Let me view the full document:Now I have a comprehensive understanding of the hackathon. Let me provide you with a thorough analysis.

---

## Grading Criteria Analysis

The hackathon uses **5 criteria, each scored 1-5**:

| Criterion | Weight Signal | What Gets Top Scores |
|-----------|---------------|---------------------|
| **Working Prototype** | Table stakes | Must run end-to-end, polished demo |
| **Technical Complexity & Integration** | High importance | Multi-modal (browser + voice), multiple agents, real-world data pipelines |
| **Innovation & Creativity** | Differentiator | Novel concept, new use-case or paradigm |
| **Real-World Impact** | High importance | Solves tangible problem, large-scale potential |
| **Theme Alignment** | Critical | Must showcase **at least 2 partner technologies**, conversational agent focus |

**Key insight from Theme Alignment criterion:** Score of 4 requires "multi-agent implementation that showcases at least two partner technologies." Score of 5 requires "integrating conversational agents into a cohesive autonomous assistant."

---

## Strengths of Your Food Agent Idea

| Strength | How It Scores |
|----------|---------------|
| **Clear real-world problem** | Food decision paralysis is universal—strong on Real-World Impact (4-5) |
| **Natural voice use case** | Calling restaurants is inherently voice—perfect Theme Alignment |
| **Multi-modal flow** | Swipe UI → Voice conversation hits Technical Complexity well |
| **Tech stack alignment** | Convex + Clerk + ElevenLabs + potential Anam = multiple sponsor prizes eligible |
| **Demo-friendly** | Easy to understand, visceral to watch someone order food via AI |

---

## Weaknesses & Risks

| Weakness | Grading Impact | Risk Level |
|----------|----------------|------------|
| **Restaurant data acquisition** | Without data, can't demo properly | 🔴 High |
| **Phone calling complexity** | Outbound calls to real restaurants won't work in demo; mocking adds complexity | 🔴 High |
| **Two-screen flow adds scope** | Swipe interface + voice agent = 2 products to build | 🟡 Medium |
| **Novelty concerns** | Food recommendation + voice ordering exists (think Alexa + DoorDash) | 🟡 Medium |
| **No clear "multiple agents"** | Current design is single agent—doesn't hit max Theme Alignment | 🟡 Medium |
| **N8N not clearly utilized** | Missing a sponsor track you mentioned wanting | 🟢 Low |

---

## Proposed Changes to Strengthen the Concept

### 1. **Reframe as Multi-Agent Architecture** (Theme Alignment boost)
Instead of one conversational agent, make it explicitly **3 agents working together**:
- **Preference Agent**: Conversational agent that learns what you want
- **Discovery Agent**: Searches/filters restaurants, returns options
- **Ordering Agent**: Handles the outbound call/order placement

This hits the "multi-agent" score of 5 on Theme Alignment.

### 2. **Simplify the Demo Scope** (Working Prototype de-risk)
- **Kill the swipe interface** for the hackathon. It's cool but costs precious time.
- Start with pure voice: "Hey, I'm hungry. What should I eat?"
- The preference agent asks 3-4 smart questions, then hands off to discovery, then to ordering.

### 3. **Mock the Restaurant Data Smartly**
- Pre-seed 10-15 curated NYC restaurants with structured data (menu items, cuisine, price range, location)
- Store in Convex directly—no scraping needed
- This is sufficient for a compelling demo

### 4. **Mock the Phone Call Brilliantly** (this is your demo moment)
- One teammate's phone becomes "Joe's Pizza"
- ElevenLabs agent calls that number
- Teammate answers in character OR you use a second ElevenLabs agent as the "restaurant"
- **Two AI agents talking to each other** = incredibly demo-friendly and technically impressive

### 5. **Add N8N for Orchestration** (Sponsor prize eligibility)
- Use N8N to coordinate the multi-agent handoffs
- Preference Agent → N8N workflow → Discovery Agent → N8N workflow → Ordering Agent
- This also adds "robust orchestration" for Technical Complexity

---

## 2-Hour Implementation Plan for 4 People

**Assumption:** You're in NYC (based on local prizes: Convex, Anam, Redis)

### Team Role Assignment

| Person | Role | Focus |
|--------|------|-------|
| **Person 1** | Preference Agent + ElevenLabs | Core conversational agent that gathers preferences |
| **Person 2** | Backend + Convex | Data models, restaurant data, API endpoints |
| **Person 3** | Discovery Logic + N8N | Restaurant matching, orchestration workflows |
| **Person 4** | Ordering Agent + Demo Prep | Outbound call agent, mock restaurant setup, demo script |

---

### Minute-by-Minute Timeline

#### **Phase 1: Setup (0:00-0:20)**

| Time | Person 1 | Person 2 | Person 3 | Person 4 |
|------|----------|----------|----------|----------|
| 0:00-0:10 | Set up ElevenLabs account, redeem credits | Initialize Convex project, set up Clerk auth | Set up N8N cloud account | Create GitHub repo, README template |
| 0:10-0:20 | Create first ElevenLabs conversational agent (Preference Agent) | Define Convex schema: users, preferences, restaurants, orders | Connect N8N to Convex | Seed 10 restaurants into Convex with sample data |

**Deliverable:** Boilerplate ready, accounts connected, base data seeded.

---

#### **Phase 2: Core Build (0:20-1:20)**

| Time | Person 1 | Person 2 | Person 3 | Person 4 |
|------|----------|----------|----------|----------|
| 0:20-0:40 | Configure Preference Agent prompts: "What cuisine?", "Budget?", "Dietary restrictions?", "Group size?" | Build Convex functions: `savePreferences()`, `getRestaurants()`, `createOrder()` | Build N8N workflow: Preference → Discovery trigger | Create Ordering Agent in ElevenLabs with restaurant-calling persona |
| 0:40-1:00 | Add tool use: agent calls Convex to save preferences | Add semantic matching logic (simple keyword/tag matching is fine) | Build N8N workflow: Discovery → Order trigger | Configure outbound calling in ElevenLabs |
| 1:00-1:20 | Test Preference Agent end-to-end | Build `getRecommendations()` that returns top 3 matches | Test full orchestration flow | Set up teammate's phone as mock restaurant |

**Deliverable:** All three agents functional, orchestration working, mock call target ready.

---

#### **Phase 3: Integration & Polish (1:20-1:50)**

| Time | Person 1 | Person 2 | Person 3 | Person 4 |
|------|----------|----------|----------|----------|
| 1:20-1:35 | Connect Preference Agent to N8N trigger | Add error handling, edge cases | End-to-end integration testing | Write demo script, practice restaurant responses |
| 1:35-1:50 | Polish agent personality/voice | Create simple web UI showing conversation state (optional, Bolt) | Debug any orchestration issues | Record backup demo video |

**Deliverable:** Fully integrated system, demo rehearsed.

---

#### **Phase 4: Submission & Demo Prep (1:50-2:00)**

| All Team Members |
|------------------|
| - Push final code to GitHub |
| - Write README with architecture diagram |
| - Record 2-min demo video |
| - Submit to AI Tinkerers portal |
| - List all tools: ElevenLabs, Convex, Clerk, N8N |

---

### Simplified Technical Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER (Voice)                            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│               PREFERENCE AGENT (ElevenLabs)                     │
│  "What are you in the mood for? Any dietary restrictions?"      │
│  Tools: savePreferences() → Convex                              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     N8N ORCHESTRATION                           │
│  Trigger: preferences_saved → Run discovery                     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                  DISCOVERY AGENT (Logic in Convex)              │
│  Matches preferences to restaurants, returns top 3              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│              ORDERING AGENT (ElevenLabs Outbound)               │
│  Calls restaurant, places order on user's behalf                │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                 MOCK RESTAURANT (Teammate's Phone)              │
│  OR second ElevenLabs agent playing the restaurant              │
└─────────────────────────────────────────────────────────────────┘
```

---

### Sponsor Prize Eligibility

| Prize Track | How You Qualify |
|-------------|-----------------|
| **ElevenLabs Main** | Conversational agents are the entire product |
| **Convex (NYC Local)** | Backend data storage and functions |
| **N8N** | Orchestration between agents |
| **Clerk** | User authentication |
| **Bolt** | Quick frontend if time permits |
| **Anam (NYC Local)** | Stretch goal: visual avatar for preference agent |

---

### Critical Success Factors

1. **The demo moment**: Two AIs talking to each other (ordering agent calling mock restaurant) will be memorable
2. **Keep scope ruthlessly small**: No swipe UI, no real restaurant data, no real phone calls to businesses
3. **Nail the narrative**: "We built a multi-agent system that understands what you want to eat and orders it for you"
4. **Test early, test often**: Do a full run-through at the 1:20 mark

---

Want me to help you draft the specific ElevenLabs agent prompts, the Convex schema, or the N8N workflow configurations?