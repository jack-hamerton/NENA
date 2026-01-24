# NENA AI System - Complete Implementation Guide

## Table of Contents
1. [System Overview](#system-overview)
2. [AI Architecture](#ai-architecture)
3. [Core Components](#core-components)
4. [API Endpoints](#api-endpoints)
5. [Service Layer](#service-layer)
6. [Knowledge Management](#knowledge-management)
7. [Frontend Integration](#frontend-integration)
8. [Data Flows](#data-flows)
9. [Self-Improvement Mechanism](#self-improvement-mechanism)
10. [Deployment Considerations](#deployment-considerations)

---

## System Overview

The NENA AI system ("Kenyan") is a comprehensive, context-aware AI assistant integrated throughout the platform. It provides intelligent assistance for advocacy tasks, community organizing, content creation, and real-time collaboration.

### Key Capabilities
- **Context-Aware Assistance**: Room-specific help, user-aware responses
- **Content Enhancement**: Text rewriting by tone, summarization, next steps suggestion
- **Knowledge Management**: Proactive learning from public sources
- **Self-Improvement**: Continuous learning from task performance
- **Multilingual Support**: Translation capabilities
- **Advanced Features**: Code assistance, problem-solving, data analysis, image handling, voice conversations

### AI Identity
- **Name**: Kenyan
- **Purpose**: Support community organizing, advocacy campaigns, and collaborative problem-solving
- **Personalization**: User-specific memory, adaptive responses, feedback learning

---

## AI Architecture

### System Design Pattern
The NENA AI follows a **service-oriented architecture** with:
- **Router Layer**: FastAPI routers for HTTP endpoints
- **Service Layer**: Business logic and context processing
- **Knowledge Layer**: Knowledge base and learning mechanisms
- **Memory Layer**: Chat history and user preferences
- **Integration Layer**: Frontend connections and user interactions

### Architecture Diagram
```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend Components                       │
├─────────────────────────────────────────────────────────────┤
│ AIAssistant | AIChat | MessageInput | RoomChat | Comments   │
└────────────────────────┬────────────────────────────────────┘
                         │
                    HTTP Requests
                         │
┌─────────────────────────┴────────────────────────────────────┐
│                    API Router Layer                           │
├──────────────────────────────────────────────────────────────┤
│ /ai/assist (main) | /ai/conversation | /ai/generate_content  │
│ /ai/translate | /ai/solve_problem | /ai/assist_with_code    │
│ + Advanced paid features (web_browse, analyze_image, etc)    │
└────────────────────────┬─────────────────────────────────────┘
                         │
┌────────────────────────┴─────────────────────────────────────┐
│              Core Service Layer                              │
├──────────────────────────────────────────────────────────────┤
│ ┌──────────────────────────────────────────────────────────┐ │
│ │ assist_user()        - Main prompt processor            │ │
│ │ chat_with_ai()       - Proactive learning chat          │ │
│ │ summarize()          - Text summarization               │ │
│ │ suggest_next_steps() - Action suggestion with NLP       │ │
│ │ assist_in_room()     - Room-specific help               │ │
│ │ rewrite_text()       - Tone-based text rewriting        │ │
│ └──────────────────────────────────────────────────────────┘ │
└────────────────────────┬─────────────────────────────────────┘
                         │
         ┌───────────────┼───────────────┐
         │               │               │
    ┌────▼─────┐  ┌─────▼──────┐  ┌────▼─────┐
    │ Knowledge │  │    Chat    │  │ Study AI │
    │   Base    │  │  Memory    │  │ Analysis │
    │           │  │            │  │          │
    │ General   │  │ Per-user   │  │ Sentiment│
    │ Advocacy  │  │ 10-msg max │  │ Themes   │
    │ Data-ana  │  │ Deque      │  │ Quotes   │
    └───────────┘  └────────────┘  └──────────┘
```

### Directory Structure
```
backend/app/ai/
├── main.py                           # Main router with /assist endpoint
├── schemas.py                        # Request/response schemas
├── prompts.py                        # Prompt templates for tone-based rewriting
├── endpoints/
│   └── ai.py                        # 12+ REST endpoints
├── services/
│   ├── ai_service.py                # Core AI logic (158 LOC)
│   ├── ai_knowledge_base.py         # Self-improvement cycles
│   ├── knowledge_service.py         # Knowledge retrieval/storage
│   ├── chat_memory.py               # Chat history management
│   ├── transcription.py             # Voice transcription
│   ├── transcripts.py               # Mock transcript data
│   └── study_ai_service.py          # Study analysis
└── knowledge_base/
    └── data_analysis_tasks/         # Domain-specific knowledge
```

---

## Core Components

### 1. Main Router (`main.py`)

**Purpose**: Entry point for AI assistance requests

**Key Endpoint**: `POST /assist`
```python
@router.post("/assist", response_model=AIResponse)
def post_assistance(
    request: AIRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Main AI assistance endpoint"""
    response = assist_user(db, request.prompt, current_user.id, request.context)
    return AIResponse(response=response)
```

**Startup Event**:
- Triggers self-improvement cycles on application startup
- Loads knowledge base for advocacy and data analysis tasks
- Initializes learning models

**Domains**:
- `advocacy_tasks`: Community organizing, proposal drafting, collaboration
- `data_analysis_tasks`: Pattern recognition, insights extraction

---

### 2. Service Layer (`ai_service.py`)

**Purpose**: Core business logic for AI operations

#### Function: `assist_user()`
**Responsibility**: Process prompts with context awareness

**Processing Flow**:
1. Normalize input (lowercase, strip whitespace)
2. Get user profile from database
3. Check for special commands:
   - `"learn about [topic]"` → Trigger knowledge learning
   - Context type checks → Route to specific handlers
4. Return contextual response or general chat

**Code**:
```python
def assist_user(db: Session, prompt: str, user_id: int, context: dict = None):
    prompt = prompt.lower().strip()
    user_profile = crud_user.get(db, id=user_id)
    
    # Special: Learning trigger
    if prompt.startswith("learn about"):
        topic = prompt.replace("learn about", "").strip()
        response = learn_from_public_sources(topic)
        return {"response": response}
    
    # Context-based routing
    if context and context.get("type") == "room":
        room_id = context.get("id")
        return assist_in_room(db, prompt, user_profile, room_id)
    
    # Other contexts: rewrite, summarize, suggest_next_steps
    # ... context routing logic ...
    
    # General chat fallback
    return chat_with_ai(db, prompt, user_id)
```

**Return Format**:
```python
{
    "response": "string",              # Main response text
    "suggestions": ["option1", ...],  # Optional suggestions
    "rewritten_text": "string"         # Optional (for rewrites)
}
```

---

#### Function: `chat_with_ai()`
**Responsibility**: Direct conversation with proactive learning

**Features**:
- Chat history persistence (in-memory, last 10 messages per user)
- Proactive knowledge acquisition
- Topic-based knowledge retrieval
- Learning fallback (if knowledge doesn't exist)

**Process**:
1. Add user message to chat history
2. Extract topic from prompt
3. Query knowledge base
4. If no knowledge: trigger `learn_from_public_sources()`
5. Add AI response to history
6. Return response

**Code Snippet**:
```python
def chat_with_ai(db: Session, prompt: str, user_id: int):
    add_to_chat_history(user_id, f"User: {prompt}")
    
    topic = prompt.strip('?').strip()
    knowledge = get_knowledge("general_knowledge", topic)
    
    if knowledge:
        response = knowledge
    else:
        # Proactively learn
        learning_response = learn_from_public_sources(topic)
        new_knowledge = get_knowledge("general_knowledge", topic)
        response = new_knowledge or "I couldn't find information"
    
    add_to_chat_history(user_id, f"Kenyan: {response}")
    return {"response": response}
```

---

#### Function: `summarize()`
**Responsibility**: Extract key information from text

**Algorithm**:
1. Split text into sentences
2. Filter for decision/action/proposal keywords
3. If no key sentences, use digit-containing sentences
4. Fallback: use first 2 sentences
5. Join filtered sentences as summary

**Parameters**:
- `text`: Input text to summarize
- `user_id`: User context (for personalization)
- `context`: Optional context (e.g., room_id for room-specific summaries)

**Use Cases**:
- Room discussion summarization
- Decision point extraction
- Action item identification

---

#### Function: `suggest_next_steps()`
**Responsibility**: Generate actionable suggestions with NLP analysis

**Features**:
- Entity extraction (nouns with common suffixes)
- Action extraction (verbs with common suffixes)
- Question detection
- Collaborator recommendations
- Multi-entity pattern recognition

**NLP Approach** (Simplified):
```python
# Extract entities: words ending in -tion, -ment, -or, -er
entities = [word for word in words 
            if word.endswith(('tion', 'ment', 'or', 'er'))]

# Extract actions: words ending in -ing, -ize, -ate
actions = [word for word in words 
           if word.endswith(('ing', 'ize', 'ate'))]

# Suggestion generation rules:
1. If entities + actions: "Consider creating project around [entity]"
2. If only entities: "Start discussion about [entity]"
3. If only actions: "Create task list for [action]"
4. If questions exist: "Answer open questions"
5. If multiple entities: "Connect with similar users"
```

**Collaboration Integration**:
- Searches for users with similar interests
- Recommends specific collaborations
- Suggests project creation

---

#### Function: `assist_in_room()`
**Responsibility**: Provide room-specific AI assistance

**Context Awareness**:
- Access room details (participants, theme, discussion)
- Room-specific summarization
- Discussion-aware suggestions
- Participant relationship awareness

**Capabilities**:
- "summarize" command → Transcribe and summarize
- "suggest next steps" command → Context-aware actions
- General chat → Room context in responses

**Code**:
```python
def assist_in_room(db: Session, prompt: str, user_profile, room_id: int):
    room_details = crud_room.get(db, id=room_id)
    if not room_details:
        return {"response": "I'm sorry, I couldn't find the details for this room."}
    
    if "summarize" in prompt:
        voice_data = "mock_voice_data"
        transcript = transcribe_voice(voice_data)
        return summarize(db, transcript, user_profile.id, 
                        context={"type": "room", "id": room_id})
    
    elif "suggest next steps" in prompt:
        voice_data = "mock_voice_data"
        transcript = transcribe_voice(voice_data)
        return suggest_next_steps(db, transcript, user_profile.id,
                                 context={"type": "room", "id": room_id})
    else:
        # General room chat with history
        add_to_chat_history(user_profile.id, f"User: {prompt}")
        history = get_chat_history(user_profile.id)
        response = f"I'm Kenyan, and I'm here to help. In this room, you can ask me to 'summarize' or 'suggest next steps'."
        add_to_chat_history(user_profile.id, f"AI: {response}")
        return {"response": response}
```

---

#### Function: `rewrite_text()`
**Responsibility**: Rewrite text with specified tone

**Tones Supported**:
1. **Formal**: Professional, business/academic tone
2. **Friendly**: Casual, conversational, contractions allowed
3. **Respectful**: Constructive, less confrontational
4. **Concise**: Brief, to-the-point, key message only

**Rewriting Strategies**:
```python
REWRITE_PROMPTS = {
    "formal": "Rewrite to be more formal and professional...",
    "friendly": "Rewrite to be more friendly and casual...",
    "respectful": "Rewrite to be more respectful and constructive...",
    "concise": "Rewrite to be more concise and to the point..."
}

# Simplified implementations:
- formal: Capitalize, fix pronouns (i → I)
- friendly: Lowercase, add emoticons
- concise: Use first 5 words + ellipsis
- respectful: Prepend understanding phrase
```

**Use Cases**:
- Comment composition refinement
- Message tone adjustment
- Proposal language improvement

---

### 3. Knowledge Management (`knowledge_service.py`)

**Purpose**: Manage AI's knowledge base and learning

#### Knowledge Base Structure
```
knowledge_base/
├── general_knowledge/
│   └── [topic].json
├── advocacy_tasks/
│   └── [topic].json
└── data_analysis_tasks/
    └── [topic].json
```

#### Key Functions

**`get_knowledge(domain, topic)`**:
- Retrieves JSON knowledge file
- Returns content string or None
- Topic names normalized (spaces → underscores, lowercase)

**`add_knowledge(domain, topic, content)`**:
- Creates domain directory if needed
- Stores knowledge as JSON
- Enables dynamic learning

**`learn_from_public_sources(topic)`**:
- Simulates multi-source learning
- Combines:
  - Internet summaries
  - AI insights
  - Academic reviews
- Stores learned knowledge
- Returns learning confirmation

**Learning Formula**:
```
Combined Knowledge = 
    Internet Summary +
    AI Insights +
    Academic Review
```

**Example**:
```
Topic: "climate change"

Internet Summary: "Multifaceted issue with significant social impact"
AI Insights: "Key drivers include economics, policy, technology"
Academic Review: "Growing research, more longitudinal studies needed"

Result: Combined content stored in general_knowledge/climate_change.json
```

---

### 4. Chat Memory (`chat_memory.py`)

**Purpose**: Maintain per-user conversation context

**Implementation**:
- In-memory storage using Python `deque`
- Circular buffer: Last 10 messages per user
- Format: User messages and AI responses combined

**Functions**:
```python
# Data Structure
chat_histories = {
    user_id: deque(maxlen=10)  # Store last 10 messages
}

# API
get_chat_history(user_id)          # Returns deque of messages
add_to_chat_history(user_id, msg)  # Appends message
```

**Message Format**:
```
"User: [prompt]"
"Kenyan: [response]"
```

**Production Considerations**:
- Currently in-memory (volatile)
- Should migrate to persistent database (Redis, PostgreSQL)
- Include timestamps for history tracking
- Implement privacy safeguards

---

### 5. Transcription (`transcription.py`)

**Purpose**: Convert voice data to text

**Current Implementation**:
- Mock transcription using pre-written transcripts
- Returns random transcript from library
- Simulates speech-to-text API

**Function**:
```python
def transcribe_voice(voice_data: str) -> str:
    """Simulates voice transcription"""
    return random.choice(TRANSCRIPTS)
```

**Mock Transcript Examples**:
1. Climate action and youth involvement storytelling
2. Community space inclusion challenges
3. City council election discussions
4. Public art project collaboration
5. Food insecurity and community solutions

**Production Path**:
- Integrate with speech-to-text API (Google Cloud, AWS, OpenAI Whisper)
- Handle audio file processing
- Support multiple languages
- Implement streaming for real-time transcription

---

### 6. Study AI Analysis (`study_ai_service.py`)

**Purpose**: Analyze study responses using AI

**Core Functions**:

**`extract_words(text)`**: Simple tokenization

**`perform_sentiment_analysis(answers)`**:
- Simulates sentiment detection
- Returns counts: positive, negative, neutral

**`extract_key_themes(answers, top_n=10)`**:
- Extracts meaningful words from answers
- Filters stop words
- Returns most common themes
- Uses `Counter` for frequency analysis

**`get_key_quotes(answers, themes)`**:
- Matches theme words to actual quotes
- Returns one representative quote per theme
- Preserves original user voice

**`analyze_study_data(db_session, study_id)`**:
- Main orchestration function
- Fetches study answers
- Performs all analyses
- Returns structured results:
  ```python
  {
      "sentiment": {"positive": 5, "negative": 2, "neutral": 3},
      "themes": [("theme1", count), ("theme2", count), ...],
      "key_quotes": {"theme1": "quote text", "theme2": "quote text"}
  }
  ```

---

### 7. Self-Improvement Cycle (`ai_knowledge_base.py`)

**Purpose**: Continuous AI learning and performance optimization

#### Knowledge Base Structure
```python
knowledge_base = {
    "advocacy_tasks": {
        "summarize_discussion": {"success_rate": 0.8, "attempts": 20},
        "suggest_next_steps": {"success_rate": 0.7, "attempts": 15},
        "recommend_collaborator": {"success_rate": 0.75, "attempts": 25},
        "rewrite_for_tone": {"success_rate": 0.85, "attempts": 30},
    },
    "study_tasks": {
        "analyze_study_data": {"success_rate": 0.9, "attempts": 10},
    }
}
```

#### Self-Improvement Cycle Process

**`run_self_improvement_cycle(domain)`**:
1. Generate random task challenge
2. Attempt solution
3. Evaluate performance
4. Update task parameters
5. Log cycle completion

**Workflow**:
```python
def run_self_improvement_cycle(domain="advocacy_tasks"):
    challenge = self_generate_task_challenge(domain)
    solution = attempt_task_solution(challenge)
    feedback = evaluate_task_performance(solution, challenge)
    update_task_parameters(feedback)
```

**Task Generation**:
- Randomly selects task from domain
- Returns task details with domain context

**Task Attempt**:
- For study tasks: Executes analysis function
- For advocacy tasks: Uses success_rate to simulate outcome
- Returns success flag + output

**Performance Evaluation**:
- Judges solution quality
- Determines success/failure
- Extracts learning points

**Parameter Updates**:
- Adjusts success rates based on feedback
- Increments attempt counters
- Tracks improvement trajectory

**Startup Trigger**:
- Runs on application startup
- Background task (shouldn't block startup)
- Runs for both advocacy_tasks and study_tasks domains

---

### 8. Prompts (`prompts.py`)

**Purpose**: Template prompts for tone-based rewriting

```python
REWRITE_PROMPTS = {
    "formal": "Rewrite the following text to be more formal and professional. "
              "Ensure that the tone is appropriate for a business or academic setting.",
    
    "friendly": "Rewrite the following text to be more friendly and casual. "
                "Feel free to use contractions and a conversational tone.",
    
    "respectful": "Rewrite the following text to be more respectful and considerate. "
                  "Express ideas in a more constructive and less confrontational way.",
    
    "concise": "Rewrite the following text to be more concise and to the point. "
               "Remove unnecessary words without losing core meaning."
}
```

**Usage**:
- Concatenated with user text in `rewrite_text()`
- Prompt context for AI rewriting logic
- Extensible for additional tones

---

## API Endpoints

### Main Endpoints

#### 1. **POST /assist** (Primary Endpoint)
**Location**: `/backend/app/ai/main.py`

**Purpose**: Main AI assistance entry point

**Request**:
```json
{
    "prompt": "string",
    "context": {
        "type": "room|rewrite|summarize|suggest_next_steps",
        "id": "optional_id",
        "tone": "formal|friendly|respectful|concise"
    }
}
```

**Response**:
```json
{
    "response": "string",
    "suggestions": ["string"],
    "rewritten_text": "string"
}
```

**Authentication**: Required (current_user dependency)

---

#### 2. **POST /ai/conversation**
**Location**: `/backend/app/ai/endpoints/ai.py`

**Purpose**: Natural language conversation

**Request**:
```json
{
    "prompt": "string",
    "conversation_history": ["string"]
}
```

**Response**:
```json
{
    "response": "string"
}
```

---

#### 3. **POST /ai/generate_content**
**Location**: `/backend/app/ai/endpoints/ai.py`

**Purpose**: Content generation, rewriting, summarization

**Request**:
```json
{
    "prompt": "string",
    "mode": "generate|rewrite|summarize"
}
```

**Response**:
```json
{
    "response": "string"
}
```

---

#### 4. **POST /ai/assist_with_code**
**Location**: `/backend/app/ai/endpoints/ai.py`

**Purpose**: Code assistance (generation, explanation, debugging)

**Request**:
```json
{
    "code": "string",
    "language": "python|javascript|...",
    "task": "generate|explain|debug"
}
```

**Response**:
```json
{
    "response": "string"
}
```

---

#### 5. **POST /ai/translate**
**Location**: `/backend/app/ai/endpoints/ai.py`

**Purpose**: Multilingual translation

**Request**:
```json
{
    "text": "string",
    "target_language": "es|fr|de|..."
}
```

**Response**:
```json
{
    "response": "string"
}
```

---

#### 6. **POST /ai/solve_problem**
**Location**: `/backend/app/ai/endpoints/ai.py`

**Purpose**: Reasoning and problem-solving

**Request**:
```json
{
    "problem": "string"
}
```

**Response**:
```json
{
    "response": "string"
}
```

---

### Advanced/Paid Endpoints

#### 7. **POST /ai/web_browse**
Purpose: Web browsing capability

#### 8. **POST /ai/analyze_image**
Purpose: Image analysis

#### 9. **POST /ai/generate_image**
Purpose: Image generation

#### 10. **POST /ai/analyze_data**
Purpose: Data analysis on uploaded files

#### 11. **POST /ai/voice_conversation**
Purpose: Real-time voice conversations
- Accepts audio file upload
- Returns transcribed + analyzed response

#### 12. **POST /ai/run_agent**
Purpose: Multi-step AI agents
- Handles complex task execution
- Breaks down large problems

#### 13. **POST /ai/custom_gpt**
Purpose: Custom GPT integration

---

### Learning Endpoints

#### 14. **POST /ai/update_memory**
**Purpose**: Update AI memory with conversation data

**Request**:
```json
{
    "conversation_data": {}
}
```

**Response**:
```json
{
    "status": "Memory updated"
}
```

---

#### 15. **POST /ai/feedback**
**Purpose**: AI learning from user feedback

**Request**:
```json
{
    "feedback_data": {}
}
```

**Response**:
```json
{
    "status": "AI is adapting"
}
```

---

## Service Layer

### Dependency Injection Pattern

All services use FastAPI's dependency injection:

```python
# Database session injection
db: Session = Depends(get_db)

# User authentication
current_user: User = Depends(get_current_user)

# Service functions receive these automatically
def handle_request(db: Session, current_user: User, ...):
    ...
```

### Error Handling

**Service-Level**:
- Database errors handled at CRUD layer
- Missing resources return None or raise HTTPException
- Invalid inputs validated at schema level

**API-Level**:
- Request validation via Pydantic schemas
- Response type validation
- Status codes: 200 (success), 400 (validation), 401 (auth), 500 (error)

### Database Integration

Services interact with database via CRUD operations:
```python
# Get user
user_profile = crud_user.get(db, id=user_id)

# Get room
room_details = crud_room.get(db, id=room_id)

# Search users
similar_users = crud_user.search(db, query=search_term)
```

---

## Frontend Integration

### Components Using AI

#### 1. **AIAssistant Component**
**Location**: `/frontend/src/components/AIAssistant.jsx`

**Features**:
- Floating draggable widget
- Collapse/expand functionality
- Consent toggle for data usage
- Real-time response streaming
- Error handling

**Usage**:
```jsx
const handleSend = async () => {
    const res = await conversation(prompt);
    setResponse(res.data.response);
};
```

---

#### 2. **AIChat Component**
**Location**: `/frontend/src/components/AIChat.jsx`

**Features**:
- Multi-turn conversation
- Message history tracking
- Loading states
- Error messages

---

#### 3. **Message Input AI Assist**
**Location**: `/frontend/src/messages/MessageInput.jsx`

**Features**:
- AI assist button
- Tone selection menu (Formal, Friendly, Respectful, Concise)
- Text rewriting in-place

**Integration**:
```jsx
const handleRewrite = async (tone) => {
    const rewrittenText = await rewriteText(message, tone);
    setMessage(rewrittenText);
};
```

---

#### 4. **Comment Composer AI**
**Location**: `/frontend/src/comments/CommentComposer.jsx`

**Features**:
- AI assist button on comments
- Same tone selection as messages
- In-place text rewriting

---

#### 5. **Room Chat AI**
**Location**: `/frontend/src/rooms/Chat.jsx`

**Features**:
- Message rewriting (same tones)
- Context-aware assistance
- Room-specific prompts

---

#### 6. **AI Modal**
**Location**: `/frontend/src/rooms/AIModal.jsx`

**Features**:
- Room summarization
- Next steps suggestion
- Transcript-based analysis

**Usage**:
```jsx
const handleSummarize = async () => {
    const res = await summarize(roomTranscript);
    setResult(res.data.summary);
};
```

---

### AI Service Client
**Location**: `/frontend/src/services/aiService.js`

**API Wrapper Functions**:

```javascript
// Text rewriting
rewriteText = (text, tone) =>
    apiClient.post('/ai/assist', {
        prompt: text,
        context: { type: 'rewrite', tone }
    })

// Text summarization
summarizeText = (text) =>
    apiClient.post('/ai/assist', {
        prompt: text,
        context: { type: 'summarize' }
    })

// Next steps suggestion
suggestNextSteps = (text) =>
    apiClient.post('/ai/assist', {
        prompt: text,
        context: { type: 'suggest_next_steps' }
    })
```

### AI Hook
**Location**: `/frontend/src/hooks/useAI.jsx`

**Provides**:
- `processPrompt()`: Handle general prompts
- `conversation()`: Chat interface

**Context-based provider for component tree**

---

## Data Flows

### Flow 1: Text Rewriting

```
User Input (message/comment)
    ↓
Click "AI Assist" button
    ↓
Select Tone (Formal/Friendly/Respectful/Concise)
    ↓
POST /ai/assist
{
    prompt: text,
    context: { type: 'rewrite', tone }
}
    ↓
rewrite_text() processing
    ↓
Apply tone-specific transformation
    ↓
Return rewritten text
    ↓
Update UI with rewritten version
```

### Flow 2: Room Summarization

```
User in Room
    ↓
Click "Summarize" button
    ↓
Fetch room transcript
    ↓
POST /ai/assist
{
    prompt: transcript,
    context: { type: 'summarize', id: room_id }
}
    ↓
assist_in_room() routing
    ↓
transcribe_voice() (if needed)
    ↓
summarize() processing
    ↓
Extract key sentences/decisions
    ↓
Return summary
    ↓
Display in modal
```

### Flow 3: Proactive Learning

```
User: "Tell me about climate change"
    ↓
Chat context (no context specified)
    ↓
chat_with_ai() execution
    ↓
Extract topic: "climate change"
    ↓
Check knowledge base
    ↓
NOT FOUND → Trigger learning
    ↓
learn_from_public_sources("climate change")
    ↓
Generate simulated insights
    ↓
Store in knowledge_base/general_knowledge/climate_change.json
    ↓
Retrieve and return to user
    ↓
Future queries hit knowledge base
```

### Flow 4: Next Steps Suggestion

```
Room discussion text
    ↓
User: "What should we do next?"
    ↓
POST /ai/assist
{
    prompt: text,
    context: { type: 'suggest_next_steps' }
}
    ↓
suggest_next_steps() NLP processing
    ↓
Extract entities (nouns)
    ↓
Extract actions (verbs)
    ↓
Detect questions
    ↓
Generate suggestions (4-6 options)
    ↓
Search for collaborators
    ↓
Return [
    "Create project around [entity]",
    "Start discussion about [entity]",
    "Connect with user X"
]
    ↓
Display in UI
```

### Flow 5: Self-Improvement Cycle

```
Application Startup
    ↓
Trigger run_self_improvement_cycle()
    ↓
For each domain (advocacy_tasks, study_tasks):
    ├── Generate random task
    ├── Attempt solution
    ├── Evaluate performance
    └── Update success metrics
    ↓
Knowledge base updated with performance data
    ↓
AI becomes progressively better at tasks
```

---

## Self-Improvement Mechanism

### Purpose
Enable the AI system to continuously learn and improve without human intervention.

### Components

**1. Knowledge Base Metrics**:
- Task name
- Success rate (0-1)
- Attempt count

**2. Challenge Generation**:
- Randomly select task from domain
- Example challenges:
  - "summarize_discussion"
  - "suggest_next_steps"
  - "recommend_collaborator"
  - "rewrite_for_tone"
  - "analyze_study_data"

**3. Solution Attempt**:
```python
# For study tasks
if task == "analyze_study_data":
    result = analyze_study_data(mock_study_id, mock_raw_data)
    if result: return {"success": True, "output": result}

# For advocacy tasks
success_rate = knowledge_base[domain][task]["success_rate"]
if random.random() < success_rate:
    return {"success": True, "output": "high-quality result"}
```

**4. Performance Evaluation**:
- Judge quality of output
- Extract learning points
- Determine improvement trajectory

**5. Parameter Updates**:
- Adjust success rates
- Increment attempt counts
- Log improvements

### Improvement Trajectory Example

```
Cycle 1: summarize_discussion
  - Success rate: 0.8
  - Result: SUCCESS
  - Adjustment: success_rate += 0.05 → 0.85

Cycle 2: suggest_next_steps
  - Success rate: 0.7
  - Result: FAILURE
  - Adjustment: success_rate -= 0.02 → 0.68

Cycle 3: recommend_collaborator
  - Success rate: 0.75
  - Result: SUCCESS
  - Adjustment: success_rate += 0.03 → 0.78
```

### Integration Points

**Startup Event**:
```python
@router.on_event("startup")
def startup_event():
    run_background_tasks()

def run_background_tasks():
    # Trigger self-improvement cycles
    run_self_improvement_cycle("advocacy_tasks")
    run_self_improvement_cycle("study_tasks")
```

### Future Enhancements

1. **Persistent Storage**: Move knowledge base to database
2. **Real Performance Metrics**: Track actual task success vs simulated
3. **User Feedback Integration**: Learn from user ratings
4. **Domain Expansion**: Add new domains dynamically
5. **Scheduled Cycles**: Run improvements on interval (hourly/daily)
6. **Distributed Learning**: Share improvements across instances

---

## Deployment Considerations

### Production Readiness Checklist

#### 1. **Chat Memory**
- [ ] Current: In-memory, volatile
- [ ] Needed: Persistent storage (Redis or PostgreSQL)
- [ ] Implement: User-session based cleanup
- [ ] Security: Encrypt sensitive data in storage

#### 2. **Knowledge Base**
- [ ] Current: File-based JSON
- [ ] Needed: Database storage for scalability
- [ ] Implement: Caching layer (Redis)
- [ ] Version control: Track knowledge updates

#### 3. **Transcription**
- [ ] Current: Mock transcripts
- [ ] Needed: Real speech-to-text API integration
- [ ] Options: Google Cloud Speech-to-Text, AWS Transcribe, OpenAI Whisper
- [ ] Async processing: Handle large audio files

#### 4. **LLM Integration**
- [ ] Current: Simplified business logic
- [ ] Needed: Real LLM API integration (OpenAI, Anthropic, etc.)
- [ ] Implement: API key management and rate limiting
- [ ] Error handling: Fallbacks for API failures

#### 5. **Authentication & Authorization**
- [ ] Verify: User context properly validated
- [ ] Implement: Role-based access to advanced features
- [ ] Track: Usage per user for billing/quotas
- [ ] Secure: API keys stored in environment variables

#### 6. **Performance Optimization**
- [ ] Caching: Knowledge base queries (Redis)
- [ ] Batch processing: Study analysis (async tasks)
- [ ] Rate limiting: Per-user API call limits
- [ ] Connection pooling: Database connections

#### 7. **Error Handling**
- [ ] Graceful degradation: Fallback responses
- [ ] Logging: Comprehensive error logging
- [ ] Monitoring: Track API failures and latency
- [ ] User feedback: Clear error messages

#### 8. **Security**
- [ ] Input validation: Sanitize all prompts
- [ ] SQL injection prevention: Use ORM (already done)
- [ ] XSS prevention: Escape AI responses
- [ ] Rate limiting: Prevent abuse

#### 9. **Compliance**
- [ ] Data privacy: User data handling policies
- [ ] GDPR: Data deletion mechanisms
- [ ] Terms of Service: AI limitations disclosure
- [ ] Bias mitigation: Monitor for discriminatory outputs

#### 10. **Testing**
- [ ] Unit tests: All service functions
- [ ] Integration tests: API endpoints
- [ ] Load tests: Handle concurrent requests
- [ ] Edge cases: Invalid inputs, missing data

### Environment Variables
```bash
# LLM Configuration
OPENAI_API_KEY=xxx
LLM_MODEL=gpt-4
LLM_TEMPERATURE=0.7

# Knowledge Base
KB_STORAGE=database|redis|file
KB_CACHE_TTL=3600

# Chat Memory
CHAT_MEMORY_SIZE=10
CHAT_MEMORY_STORAGE=memory|redis

# Transcription
TRANSCRIPTION_SERVICE=google|aws|openai
TRANSCRIPTION_API_KEY=xxx

# Rate Limiting
AI_REQUESTS_PER_MINUTE=60
AI_REQUESTS_PER_HOUR=1000

# Logging
LOG_LEVEL=INFO
LOG_FILE=/var/log/nena-ai.log
```

### Scaling Strategy

**Phase 1** (Current):
- Single instance
- In-memory storage
- File-based knowledge base

**Phase 2** (Production):
- Database backend for persistence
- Redis for caching
- Real LLM integration
- Rate limiting

**Phase 3** (Scale):
- Distributed knowledge base
- Async processing queues (Celery)
- Multi-region deployment
- Advanced monitoring

---

## API Contract Summary

| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| /assist | POST | Main AI assistance | Core |
| /ai/conversation | POST | Natural conversation | Core |
| /ai/generate_content | POST | Content generation | Core |
| /ai/assist_with_code | POST | Code assistance | Core |
| /ai/translate | POST | Translation | Core |
| /ai/solve_problem | POST | Problem-solving | Core |
| /ai/web_browse | POST | Web browsing | Paid |
| /ai/analyze_image | POST | Image analysis | Paid |
| /ai/generate_image | POST | Image generation | Paid |
| /ai/analyze_data | POST | Data analysis | Paid |
| /ai/voice_conversation | POST | Voice chat | Paid |
| /ai/run_agent | POST | Multi-step agent | Paid |
| /ai/custom_gpt | POST | Custom GPT | Paid |
| /ai/update_memory | POST | Update memory | Learning |
| /ai/feedback | POST | User feedback | Learning |

---

## Integration Checklist

- [x] AI service layer implemented
- [x] Main /assist endpoint working
- [x] Chat memory system in place
- [x] Knowledge base framework
- [x] Text rewriting with tones
- [x] Summarization logic
- [x] Next steps suggestion engine
- [x] Room-specific assistance
- [x] Frontend component integration
- [x] Self-improvement cycle
- [x] Study analysis functions
- [ ] Real LLM integration
- [ ] Persistent storage migration
- [ ] Advanced endpoint implementation
- [ ] Comprehensive testing
- [ ] Performance optimization
- [ ] Production deployment

---

## Related Documentation

- [Analytics Complete Guide](./ANALYTICS_COMPLETE_GUIDE.md)
- [HomePage Complete Guide](./HOMEPAGE_COMPLETE_GUIDE.md)
- [Message Page Test Summary](./backend/tests/CALENDAR_TEST_README.md)
- [START_HERE.md](./START_HERE.md)

