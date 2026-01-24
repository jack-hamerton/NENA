# NENA AI System - Architecture & Technical Deep Dive

## Executive Summary

The NENA AI system is a modular, context-aware assistant ("Kenyan") that provides intelligent support across the platform. Built on a service-oriented architecture with FastAPI, it integrates with community organizing workflows, offering capabilities from text rewriting to collaborative suggestions.

### Key Stats
- **12+ REST endpoints** (8 core, 4 paid)
- **6 core service functions** handling different AI operations
- **4 tone-based rewriting** modes
- **Self-improving**: Continuous learning on startup
- **User-aware**: Context-driven responses
- **Knowledge base**: 3 learning domains

---

## System Architecture

### Layer 1: Presentation Layer (Frontend)

**Components**:
- Floating AI Widget (draggable, collapsible)
- Chat interface
- Tone selection menus
- Integration points in messages, comments, rooms

**Communication**:
- REST API calls via `aiService.js`
- Axios-based client
- Error handling and loading states

### Layer 2: API Gateway (Router Layer)

**Files**:
- `main.py` - Primary `/assist` endpoint
- `endpoints/ai.py` - 12+ supporting endpoints

**Responsibilities**:
- Request validation via Pydantic schemas
- User authentication verification
- Context detection
- Request routing to services

**Pattern**:
```python
@router.post("/endpoint")
def handler(request: RequestSchema, db: Session = Depends(get_db)):
    result = service_function(db, request.param1, request.param2)
    return ResponseSchema(result)
```

### Layer 3: Service Layer (Business Logic)

**Core Services**:

1. **AI Service** (`ai_service.py`)
   - `assist_user()` - Main dispatcher
   - `chat_with_ai()` - Chat with learning
   - `summarize()` - Text extraction
   - `suggest_next_steps()` - Action generation
   - `rewrite_text()` - Tone transformation
   - `assist_in_room()` - Room-specific help

2. **Knowledge Service** (`knowledge_service.py`)
   - `get_knowledge()` - Retrieve from KB
   - `add_knowledge()` - Store in KB
   - `learn_from_public_sources()` - Simulate learning

3. **Chat Memory** (`chat_memory.py`)
   - `get_chat_history()` - Fetch user messages
   - `add_to_chat_history()` - Store message

4. **Transcription** (`transcription.py`)
   - `transcribe_voice()` - Convert audio to text

5. **Study Analysis** (`study_ai_service.py`)
   - `perform_sentiment_analysis()`
   - `extract_key_themes()`
   - `get_key_quotes()`
   - `analyze_study_data()`

6. **Self-Improvement** (`ai_knowledge_base.py`)
   - `run_self_improvement_cycle()`
   - `self_generate_task_challenge()`
   - `attempt_task_solution()`
   - `evaluate_task_performance()`

### Layer 4: Data Layer

**Components**:

1. **Knowledge Base** (File-based JSON)
   ```
   backend/app/ai/knowledge_base/
   ├── general_knowledge/
   ├── advocacy_tasks/
   └── data_analysis_tasks/
   ```

2. **Chat Memory** (In-memory deque)
   ```python
   chat_histories = {
       user_id: deque(maxlen=10)
   }
   ```

3. **Database** (SQLAlchemy ORM)
   - User profiles
   - Room information
   - Study data

4. **Configuration** (Prompts)
   ```python
   REWRITE_PROMPTS = {
       "formal": "prompt...",
       "friendly": "prompt...",
       "respectful": "prompt...",
       "concise": "prompt..."
   }
   ```

### Layer 5: Integration Points

**With Other Platform Components**:

1. **User Module**: Get user profile, search similar users
2. **Room Module**: Get room details, room-specific context
3. **Study Module**: Fetch study answers for analysis
4. **CRUD Operations**: Database queries via ORM

---

## Data Flow Diagrams

### Flow 1: Complete Request-Response Cycle (Text Rewriting)

```
┌─────────────────────────────────────────────────────────────────┐
│ USER ACTION: Click "AI Assist" → Select "Formal" → Message Text │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
            ┌────────────────────────┐
            │ Frontend (aiService.js)│
            │ POST /ai/assist        │
            └──────────┬─────────────┘
                       │
      ┌────────────────┴────────────────┐
      │ Request Body                    │
      │ {                               │
      │   prompt: "message text",       │
      │   context: {                    │
      │     type: "rewrite",            │
      │     tone: "formal"              │
      │   }                             │
      │ }                               │
      └──────────────┬───────────────────┘
                     │
                     ▼
         ┌───────────────────────────┐
         │ API Gateway (/assist)     │
         │ - Validate request        │
         │ - Verify user auth        │
         │ - Parse context           │
         └──────────┬────────────────┘
                    │
                    ▼
        ┌────────────────────────────┐
        │ assist_user()              │
        │ - Check prompt type        │
        │ - Route by context.type    │
        │ → type="rewrite"           │
        └──────────┬─────────────────┘
                   │
                   ▼
        ┌────────────────────────────┐
        │ rewrite_text()             │
        │ - Get tone from context    │
        │ - Apply tone logic         │
        │ - Formal: Capitalize, I    │
        │ - Return rewritten text    │
        └──────────┬─────────────────┘
                   │
          ┌────────┴──────────┐
          ▼                   ▼
      ┌─────────┐         ┌──────────────┐
      │ Prompts │         │ Rewrite Logic│
      │ REWRITE │         │ (tone based) │
      │_PROMPTS │         └──────┬───────┘
      └─────────┘                │
                                 ▼
                        ┌──────────────────────┐
                        │ Response Object      │
                        │ {                    │
                        │   response: string,  │
                        │   rewritten_text: .. │
                        │ }                    │
                        └──────────┬───────────┘
                                   │
                                   ▼
                        ┌──────────────────────┐
                        │ API Response (200)   │
                        │ JSON with result     │
                        └──────────┬───────────┘
                                   │
                                   ▼
                        ┌──────────────────────┐
                        │ Frontend (Update UI) │
                        │ - Receive response   │
                        │ - Update message box │
                        │ - Show rewritten txt │
                        └──────────────────────┘
```

### Flow 2: Proactive Learning

```
User Chat Input: "Tell me about climate change"
         │
         ▼
chat_with_ai()
         │
         ├─► get_chat_history() → Add to memory
         │
         ├─► Extract topic: "climate change"
         │
         ├─► get_knowledge("general_knowledge", "climate change")
         │   └─► MISS (not in KB)
         │
         ├─► learn_from_public_sources("climate change")
         │   ├─► Simulate Internet Research
         │   ├─► Simulate AI Insights
         │   ├─► Simulate Academic Review
         │   └─► add_knowledge() → Store combined
         │
         ├─► get_knowledge() again → HIT!
         │
         ├─► add_to_chat_history() → Store response
         │
         └─► Return Response to User
                │
                ▼
           User gets answer
           Knowledge base now has "climate change"
           Future queries hit the cache!
```

### Flow 3: Self-Improvement Cycle

```
Application Startup Event
         │
         ▼
run_background_tasks()
         │
    ┌────┴────┐
    ▼         ▼
Advocacy  Study
Tasks     Tasks
    │         │
    ▼         ▼
For Each Domain:
    │
    ├─► run_self_improvement_cycle(domain)
    │   │
    │   ├─► self_generate_task_challenge()
    │   │   └─► Random task from KB
    │   │       Examples:
    │   │       - summarize_discussion
    │   │       - suggest_next_steps
    │   │       - rewrite_for_tone
    │   │       - analyze_study_data
    │   │
    │   ├─► attempt_task_solution(challenge)
    │   │   ├─► Check success_rate
    │   │   ├─► random() < success_rate?
    │   │   │   ├─ Yes: return success
    │   │   │   └─ No: return failure
    │   │   └─► For study tasks: run actual analysis
    │   │
    │   ├─► evaluate_task_performance(solution, challenge)
    │   │   └─► Determine quality and learning
    │   │
    │   └─► update_task_parameters(feedback)
    │       └─► Adjust success_rate
    │           ├─ Success: rate += 0.05
    │           └─ Failure: rate -= 0.02
    │
    └─► Log improvement cycle complete
```

### Flow 4: Next Steps Suggestion

```
User Input Text
         │
         ▼
suggest_next_steps()
         │
    ┌────┴────┬────────────┬──────────┐
    ▼         ▼            ▼          ▼
Extract   Extract      Detect     Search
Entities  Actions      Questions  Users
    │         │            │          │
    ├─► NLP: -tion, -ment  │          │
    │   -or, -er           │          │
    │                      │          │
    ├─► NLP: -ing, -ize    │          │
    │   -ate               │          │
    │                      │          │
    └────────┬─────────────┴──────────┘
             │
             ▼
   Generate Suggestions (4-6 items)
             │
    ┌────────┼────────────┬──────────┐
    ▼        ▼            ▼          ▼
  Entity   Only        Only        Multiple
  +Action  Entities    Actions     Entities
    │        │            │          │
    ├─►Project├─►Discuss  ├─►Create ├─►Connect
    │ Creation│ Topic     │ Task    │ Similar
    │         │           │ List    │ Users
    │         │           │         │
    └─────────┼───────────┼─────────┘
              │
              ▼
        Return JSON
        [
          "Create project around [entity]",
          "Start discussion about [entity]",
          "Collaborate with user X",
          "Connect with users interested in [entity1] & [entity2]",
          "Answer open questions"
        ]
```

---

## State Diagram: AI Request Processing

```
                ┌─────────────────┐
                │  REQUEST INIT   │
                │  (HTTP POST)    │
                └────────┬────────┘
                         │
                ┌────────▼────────┐
                │ VALIDATE REQUEST│
                │ - Schema check  │
                │ - Auth check    │
                └────────┬────────┘
                         │
            ┌────────────┴────────────┐
            │ PARSE CONTEXT TYPE      │
            └────┬───┬───┬───────┬────┘
                 │   │   │       │
        ┌────────┘   │   │       └──────────┐
        │            │   │                  │
    REWRITE      SUMMARIZE SUGGEST       ROOM
        │            │         NEXT       │
        │            │         STEPS      │
        ▼            ▼         │          ▼
    ┌─────┐    ┌────────┐     │    ┌──────────┐
    │Tone │    │Extract │     │    │Room      │
    │Xform│    │Summary │     │    │Context  │
    └─────┘    └────────┘     │    └──────────┘
        │            │         │        │
        └────┬───────┴─────────┴────────┘
             │
        ┌────▼──────────────────┐
        │  SERVICE EXECUTION    │
        │  - Load user context  │
        │  - Process logic      │
        │  - Update memory      │
        └────┬─────────────────┘
             │
        ┌────▼──────────────────┐
        │  FORMAT RESPONSE      │
        │  {response, ...}      │
        └────┬─────────────────┘
             │
        ┌────▼──────────────────┐
        │  RETURN (200 OK)      │
        │  JSON response        │
        └────┬─────────────────┘
             │
        ┌────▼──────────────────┐
        │  FRONTEND HANDLES     │
        │  - Parse response     │
        │  - Update UI          │
        │  - User sees result   │
        └───────────────────────┘
```

---

## Service Interaction Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    assist_user() [Main Dispatcher]              │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                    ┌────────────┴────────────┐
                    │ Context Detection      │
                    └────┬──┬──┬──┬────┬─────┘
                         │  │  │  │    │
        ┌────────────────┘  │  │  │    └──────────────────┐
        │                   │  │  │                       │
        ▼                   ▼  ▼  ▼                       ▼
    Special          ┌──────────────────┐          assist_in_room()
    Command:         │   Context Type   │               │
    "learn about"    └──────────────────┘               │
        │                    │                          │
        ▼            ┌───────┴───────┐                  ▼
    learn_from_   ┌──┴──┬──┬──────┐  │          ┌──────────────────┐
    public_sources()│   │  │      │  │          │  Room-Specific   │
        │      REWRITE SUMMARIZE SUGGEST      │  Help            │
        ▼          │   │  │      │  │          └──────────────────┘
    add_knowledge()│   │  │      │  │          (summarize room,
        │          ▼   ▼  ▼      ▼  ▼           suggest next steps)
        │      ┌────────────────────────┐
        │      │rewrite_text()  Uses    │       ┌──────────────────┐
        │      │ REWRITE_PROMPTS        │       │ chat_with_ai()   │
        │      │ Transforms by tone     │       │ (proactive learn)│
        │      │                        │       │                  │
        │      │summarize()             │       │ - Extract topic  │
        │      │ NLP filtering          │       │ - Query KB       │
        │      │ Key sentences          │       │ - If miss: learn │
        │      │                        │       │ - Store response │
        │      │suggest_next_steps()    │       │                  │
        │      │ Entity extraction      │       └──────────────────┘
        │      │ Action extraction      │
        │      │ Collaborator search    │       ┌──────────────────┐
        │      │ Suggestion generation  │       │transcribe_voice()│
        │      └────────────────────────┘       │ Returns random   │
        │                 │                     │ mock transcript  │
        └─────────────────┼─────────────────────┼──────────────────┘
                          │
                    ┌─────▼──────┐
                    │Response    │
                    │{response,..}
                    └────────────┘
```

---

## Database Integration

### ORM Queries Used

```python
# Get user profile
user_profile = crud_user.get(db, id=user_id)
# Returns: User object with id, username, profile data

# Get room details
room_details = crud_room.get(db, id=room_id)
# Returns: Room object with participants, description, theme

# Search similar users
similar_users = crud_user.search(db, query=search_term)
# Returns: List of User objects matching query

# Get study answers
answers = get_answers_for_study(db, study_id=study_id)
# Returns: List of Answer objects with text content
```

### Models Referenced

- **User**: id, username, profile, causes, activity_level
- **Room**: id, name, participants, description, advocacy_theme
- **Study**: id, questions, answers
- **Answer**: id, study_id, text, user_id

---

## Error Handling Strategy

### Request Validation Errors
```python
# Schema mismatch
→ Pydantic raises ValidationError
→ FastAPI returns 422 Unprocessable Entity
→ User gets clear error message
```

### Runtime Errors
```python
# User not found
→ crud_user.get() returns None
→ Service checks for None
→ Returns error response: {"response": "User not found"}

# Room not found
→ crud_room.get() returns None
→ Service returns: {"response": "I'm sorry, I couldn't find..."}
```

### Knowledge Base Errors
```python
# Topic not in KB
→ get_knowledge() returns None
→ Trigger learn_from_public_sources()
→ Store learned knowledge
→ Return combined knowledge
```

### Database Errors
```python
# Connection failure
→ SQLAlchemy raises exception
→ Caught by dependency injection
→ Returns 500 Internal Server Error
```

---

## Performance Characteristics

### Execution Times (Estimated)

| Operation | Duration | Constraints |
|-----------|----------|-------------|
| assist_user() dispatcher | < 10ms | Simple string operations |
| chat_with_ai() | 50-200ms | Knowledge lookup, potential learning |
| summarize() | 20-50ms | Text processing, NLP filtering |
| suggest_next_steps() | 100-300ms | NLP + collaborator search |
| rewrite_text() | 10-30ms | String transformation |
| learn_from_public_sources() | 100-500ms | Simulated research |
| study analysis | 200-1000ms | Sentiment + themes + quotes |
| Database query | 10-100ms | Index-dependent |

### Scalability Bottlenecks

1. **Chat Memory**: In-memory deque, OK for < 1000 users
2. **Knowledge Base**: File-based, OK for < 10,000 topics
3. **Collaborator Search**: Database query, OK for < 100,000 users
4. **Self-improvement**: Runs at startup, one-time cost

### Optimization Opportunities

1. **Caching**: Redis for knowledge base queries
2. **Async**: Background tasks for learning
3. **Indexing**: Database indexes for user search
4. **Batching**: Combine multiple operations

---

## Security Considerations

### Input Validation
- ✅ Pydantic schema validation
- ✅ Required field checks
- ⚠️ No explicit sanitization (risks: prompt injection, XSS)

### Authentication
- ✅ User dependency verification
- ✅ get_current_user() check
- ⚠️ No role-based access control

### Authorization
- ✅ User context validated
- ⚠️ No paid feature access control
- ⚠️ No usage quotas enforced

### Data Privacy
- ⚠️ Chat history in memory (no encryption)
- ⚠️ Knowledge base accessible to all users
- ⚠️ No data deletion mechanisms

### Recommended Improvements
1. Input sanitization for prompt injection prevention
2. Output encoding to prevent XSS
3. Rate limiting per user/API key
4. Encryption for sensitive data at rest
5. GDPR compliance (data deletion, export)

---

## Testing Strategy

### Unit Tests Needed
```python
test_assist_user()           # Context routing
test_chat_with_ai()          # Learning flow
test_summarize()             # Key extraction
test_suggest_next_steps()    # NLP + suggestions
test_rewrite_text()          # Tone transformation
test_learn_from_public_sources()  # Knowledge storage
test_transcribe_voice()      # Mock transcription
test_study_analysis()        # Sentiment/themes
```

### Integration Tests Needed
```python
test_end_to_end_rewrite()       # Full workflow
test_room_assistance()           # Room context
test_proactive_learning()        # Learn + respond
test_self_improvement_cycle()    # Startup cycle
test_database_integration()      # ORM usage
```

### Load Tests Needed
```python
test_concurrent_requests()       # 100+ simultaneous
test_large_text_input()          # 10,000+ chars
test_many_users()                # 1000+ users
test_knowledge_base_scaling()    # 10,000+ topics
```

---

## Deployment Scenarios

### Development
```
- In-memory storage
- File-based knowledge base
- Mock transcription
- Local database
- Single instance
```

### Staging
```
- Redis for chat memory
- Database knowledge base
- Mock or real transcription
- Staging database
- Load balancer
```

### Production
```
- Redis with persistence
- Managed database (RDS, Cloud SQL)
- Real speech-to-text API
- Production database
- Multi-region deployment
- CDN for assets
- Monitoring & alerting
```

---

## Integration Checklist

### Core Features
- [x] Text rewriting (4 tones)
- [x] Summarization
- [x] Next steps suggestion
- [x] Room assistance
- [x] Proactive learning
- [x] Chat memory
- [x] Study analysis

### API Endpoints
- [x] /assist (main)
- [x] /ai/conversation
- [x] /ai/generate_content
- [x] /ai/assist_with_code
- [x] /ai/translate
- [x] /ai/solve_problem
- [x] Paid features (stubs)
- [x] Learning endpoints

### Frontend Integration
- [x] Floating AI widget
- [x] Chat interface
- [x] Message rewriting
- [x] Comment rewriting
- [x] Room summarization
- [x] Next steps suggestions

### Backend Services
- [x] AI service layer
- [x] Knowledge management
- [x] Chat memory
- [x] Self-improvement cycle
- [x] Study analysis

### Production Ready
- [ ] Persistent storage migration
- [ ] Real LLM integration
- [ ] Speech-to-text API
- [ ] Rate limiting
- [ ] Comprehensive logging
- [ ] Error handling
- [ ] Security audit
- [ ] Load testing
- [ ] GDPR compliance
- [ ] Monitoring

---

## Future Roadmap

### Phase 1: Enhancement (Weeks 1-4)
- Real LLM integration (OpenAI/Claude)
- Database migration for persistence
- Advanced transcription features

### Phase 2: Scale (Weeks 5-8)
- Async task processing
- Advanced caching strategies
- Multi-region deployment

### Phase 3: Intelligence (Weeks 9-12)
- Fine-tuned models for advocacy
- Advanced NLP understanding
- Collaborative filtering

### Phase 4: Monetization (Weeks 13+)
- Implement paid feature access control
- Usage tracking and billing
- Premium AI models

---

## Related Documentation

- [AI Complete Guide](./AI_COMPLETE_GUIDE.md) - Comprehensive reference
- [AI Quick Reference](./AI_QUICK_REFERENCE.md) - Cheat sheet
- [Analytics Architecture](./ANALYTICS_ARCHITECTURE.md)
- [HomePage Architecture](./HOMEPAGE_ARCHITECTURE.md)

