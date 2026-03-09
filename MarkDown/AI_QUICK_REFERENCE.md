# NENA AI System - Quick Reference

## AI Identity
- **Name**: Kenyan
- **Purpose**: Community organizing and advocacy support
- **Tagline**: "I'm Kenyan, your AI assistant. I can help you with tasks like summarizing rooms, suggesting next steps, and rewriting messages. I also learn from our conversations."

---

## Core Capabilities At a Glance

### 1. Text Rewriting (4 Tones)
```
Tone → Effect
formal    → Professional language, business tone
friendly  → Casual, conversational, emoticons
respectful → Constructive, less confrontational
concise   → Brief, key message only
```

### 2. Summarization
**What**: Extract key decisions, actions, proposals from text
**Where**: Rooms, discussions, proposals
**Returns**: 2-3 key sentences with decisions and actions

### 3. Next Steps Suggestion
**What**: Generate 4-6 actionable suggestions
**Where**: After discussions, challenges, projects
**Uses**: NLP entity/action extraction + collaborator matching
**Returns**: ["Suggestion 1", "Suggestion 2", ..., "Collaborator recommendation"]

### 4. Room Assistance
**Commands**:
- "summarize" → Get room discussion summary
- "suggest next steps" → Get action items

### 5. Proactive Learning
**Trigger**: "Learn about [topic]"
**Process**: Research from simulated sources
**Result**: Topic stored in knowledge base

### 6. Chat Memory
**Scope**: Last 10 messages per user
**Format**: User messages + AI responses
**Persistence**: In-memory (migrate to database for production)

---

## API Quick Reference

### Main Endpoint

```bash
POST /assist

Body:
{
    "prompt": "Your message or text",
    "context": {
        "type": "rewrite|summarize|suggest_next_steps|room",
        "tone": "formal|friendly|respectful|concise",  // For rewrite
        "id": "room_id"  // For room context
    }
}

Response:
{
    "response": "AI's response",
    "suggestions": ["item1", "item2"],  // Optional
    "rewritten_text": "rewritten content"  // Optional
}
```

### Alternative Endpoints

| Endpoint | Request | Response |
|----------|---------|----------|
| /ai/conversation | `{"prompt": "", "conversation_history": []}` | `{"response": ""}` |
| /ai/generate_content | `{"prompt": "", "mode": "generate\|rewrite\|summarize"}` | `{"response": ""}` |
| /ai/assist_with_code | `{"code": "", "language": "", "task": ""}` | `{"response": ""}` |
| /ai/translate | `{"text": "", "target_language": ""}` | `{"response": ""}` |
| /ai/solve_problem | `{"problem": ""}` | `{"response": ""}` |

---

## Frontend Components

### Where to Find AI Integration

| Component | Location | Feature |
|-----------|----------|---------|
| AIAssistant | `/frontend/src/components/` | Floating widget |
| AIChat | `/frontend/src/components/` | Chat interface |
| MessageInput | `/frontend/src/messages/` | Text rewriting |
| CommentComposer | `/frontend/src/comments/` | Comment rewriting |
| Room Chat | `/frontend/src/rooms/Chat.jsx` | Room assistance |
| AIModal | `/frontend/src/rooms/AIModal.jsx` | Room summary/suggestions |

### Using AI in Components

```javascript
// Import the AI service
import { rewriteText, summarizeText, suggestNextSteps } from '../services/aiService';

// Rewrite text with tone
const rewritten = await rewriteText(text, 'formal');

// Summarize content
const summary = await summarizeText(text);

// Get next steps
const suggestions = await suggestNextSteps(text);
```

---

## Service Functions (Backend)

### `assist_user(db, prompt, user_id, context)`
Main entry point for all AI requests
- Detects intent from prompt
- Routes to appropriate handler
- Returns contextual response

### `chat_with_ai(db, prompt, user_id)`
Direct conversation with learning
- Maintains chat history
- Proactively learns new topics
- Returns knowledge-based response

### `summarize(db, text, user_id, context)`
Extract key information
- Filters for decisions/actions
- Returns concise summary

### `suggest_next_steps(db, text, user_id, context)`
Generate action suggestions
- NLP entity/action extraction
- Recommends collaborators
- Returns 4-6 suggestions

### `rewrite_text(db, text, user_id, context)`
Rewrite with specific tone
- Applies tone transformations
- Returns rewritten text

### `assist_in_room(db, prompt, user_profile, room_id)`
Room-specific assistance
- Access room context
- Handle summarize/suggest_next_steps
- Room-aware responses

---

## Knowledge Base Structure

```
backend/app/ai/knowledge_base/
├── general_knowledge/
│   ├── climate_change.json
│   ├── community_organizing.json
│   └── [learned_topics].json
└── data_analysis_tasks/
    └── [analysis_topics].json
```

**File Format**:
```json
{
    "content": "Knowledge content string"
}
```

**Learning Formula**:
```
Combined = Internet Summary + AI Insights + Academic Review
```

---

## Data Models

### AIResponse Schema
```python
class AIResponse(BaseModel):
    response: str
```

### Request Patterns
```python
class ConversationRequest(BaseModel):
    prompt: str
    conversation_history: List[str]

class ContentRequest(BaseModel):
    prompt: str
    mode: str  # generate, rewrite, summarize

class CodeAssistRequest(BaseModel):
    code: str
    language: str
    task: str  # generate, explain, debug

class TranslateRequest(BaseModel):
    text: str
    target_language: str

class ProblemSolvingRequest(BaseModel):
    problem: str
```

---

## Context Types

### 1. Room Context
```python
context = {
    "type": "room",
    "id": room_id
}
```
**Effect**: Limits assistance to "summarize" or "suggest_next_steps"

### 2. Rewrite Context
```python
context = {
    "type": "rewrite",
    "tone": "formal|friendly|respectful|concise"
}
```
**Effect**: Triggers text rewriting with specified tone

### 3. Summarize Context
```python
context = {
    "type": "summarize"
}
```
**Effect**: Extracts key information from text

### 4. Suggest Next Steps Context
```python
context = {
    "type": "suggest_next_steps"
}
```
**Effect**: Generates action suggestions

---

## NLP Logic (Simplified)

### Entity Extraction
Words ending in: `-tion`, `-ment`, `-or`, `-er`
```
Examples: "action", "proposal", "collaborator", "member"
```

### Action Extraction
Words ending in: `-ing`, `-ize`, `-ate`
```
Examples: "creating", "organizing", "collaborate"
```

### Question Detection
Sentences containing: `?`

### Stop Words
Ignored: the, a, is, in, it, and, of, to, for, was

---

## Self-Improvement Cycle

### Domains

**advocacy_tasks**:
- summarize_discussion (success: 80%)
- suggest_next_steps (success: 70%)
- recommend_collaborator (success: 75%)
- rewrite_for_tone (success: 85%)

**study_tasks**:
- analyze_study_data (success: 90%)

### Cycle Steps
1. Generate random task challenge
2. Attempt solution
3. Evaluate performance
4. Update success metrics
5. Repeat on each startup

### Performance Adjustment
```
Success → success_rate += 0.05
Failure → success_rate -= 0.02
```

---

## Chat Memory

### Storage
```python
chat_histories = {
    user_id: deque(maxlen=10)  # Last 10 messages
}
```

### Message Format
```
"User: [prompt]"
"Kenyan: [response]"
```

### Functions
```python
get_chat_history(user_id)           # Returns messages
add_to_chat_history(user_id, msg)   # Add message
```

---

## Transcription

### Current Implementation
Mock transcription using pre-written transcripts

### Mock Transcripts Available
1. Climate action & youth storytelling
2. Community space inclusion
3. City council election
4. Public art project
5. Food insecurity solutions

### Production Path
- Integrate speech-to-text API (Google, AWS, OpenAI Whisper)
- Handle audio streaming
- Support multiple languages

---

## Study Analysis

### Analysis Output
```python
{
    "sentiment": {
        "positive": count,
        "negative": count,
        "neutral": count
    },
    "themes": [
        ("theme1", frequency),
        ("theme2", frequency)
    ],
    "key_quotes": {
        "theme1": "representative quote",
        "theme2": "representative quote"
    }
}
```

### Functions
- `extract_words()` - Tokenization
- `perform_sentiment_analysis()` - Sentiment detection
- `extract_key_themes()` - Top N themes
- `get_key_quotes()` - Quote extraction
- `analyze_study_data()` - Main orchestration

---

## Common Patterns

### Pattern 1: Rewrite Message
```
User Types: "This is my message"
Clicks: AI Assist → Formal
Result: Formal version of message
```

### Pattern 2: Summarize Room
```
User in Room
Clicks: Summarize
Result: Key decisions + actions extracted
```

### Pattern 3: Get Next Steps
```
User Types: Discussion transcript
Clicks: AI Assist → Suggest Next Steps
Result: 4-6 action suggestions + collaborators
```

### Pattern 4: Learn New Topic
```
User Prompts: "Learn about climate change"
AI Learns: From simulated sources
Result: Topic added to knowledge base
Benefit: Future queries about climate change faster
```

---

## File Organization

```
backend/app/ai/
├── main.py                      # /assist endpoint
├── schemas.py                   # Request/response models
├── prompts.py                   # Rewrite prompts
├── endpoints/
│   └── ai.py                   # 12+ endpoints
└── services/
    ├── ai_service.py           # Core logic (158 LOC)
    ├── ai_knowledge_base.py    # Self-improvement
    ├── knowledge_service.py    # Knowledge management
    ├── chat_memory.py          # Chat storage
    ├── transcription.py        # Voice to text
    ├── transcripts.py          # Mock data
    └── study_ai_service.py     # Study analysis

frontend/src/
├── components/
│   ├── AIAssistant.jsx         # Floating widget
│   └── AIChat.jsx              # Chat interface
├── services/
│   └── aiService.js            # API client
├── hooks/
│   └── useAI.jsx               # Context provider
├── messages/
│   └── MessageInput.jsx        # Message rewrite
├── comments/
│   └── CommentComposer.jsx    # Comment rewrite
└── rooms/
    ├── Chat.jsx                # Room chat
    └── AIModal.jsx             # Room summary
```

---

## Production Checklist

- [ ] Migrate in-memory storage to database/Redis
- [ ] Integrate real LLM API
- [ ] Implement persistent chat history
- [ ] Add real speech-to-text
- [ ] Implement rate limiting
- [ ] Add comprehensive logging
- [ ] Security audit (input validation, XSS prevention)
- [ ] Load testing
- [ ] Error handling improvements
- [ ] User feedback system
- [ ] GDPR compliance
- [ ] Advanced endpoint implementation

---

## Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| Chat not remembering | In-memory storage cleared | Implement persistent storage |
| Slow responses | Proactive learning delay | Implement async/background tasks |
| Knowledge not found | Topic not learned yet | Trigger learning manually |
| Room context not working | Room ID mismatch | Verify room exists in database |
| Tone rewriting not applying | Mock implementation | Switch to real LLM |

---

## Related Documents

- [AI Complete Guide](./AI_COMPLETE_GUIDE.md) - Full documentation
- [Analytics Complete Guide](./ANALYTICS_COMPLETE_GUIDE.md) - Analytics system
- [HomePage Complete Guide](./HOMEPAGE_COMPLETE_GUIDE.md) - HomePage features
- [START_HERE.md](./START_HERE.md) - Platform overview

