# Message Page - Quick Reference Guide

## 10 Key Facts About Message Page

1. **Dual Interface**: Regular chat (1-to-1 messaging) + AI Chat (Nena assistant)
2. **E2E Encrypted**: Messages use X3DH + Double Ratchet for encryption
3. **Two Layouts**: Desktop split-view (ConversationList + ChatWindow) + Mobile full-screen
4. **Real-time**: WebSocket for live messages, reactions, typing indicators
5. **Special Messages**: View-once, disappearing, system messages with filtering
6. **Collaboration**: Shared document editing in "Collaborate" tab
7. **Call Ready**: Integrated call popup for voice/video calls
8. **AI Features**: Message tone rewriting (Formal, Friendly, Respectful, Concise)
9. **File Sharing**: Attachment button for sending files
10. **Unread Tracking**: Badge on conversations showing unread message count

---

## Component Interaction Map

```
MessagesPage (Main Container)
    ├── Condition: selectedConversation === null?
    │   └─→ Render: AIChat (Alternative view)
    │
    ├── Condition: isMobile?
    │   ├─→ YES: Full-screen view
    │   │        Show EITHER ConversationList OR ChatWindow (with back button)
    │   │
    │   └─→ NO: Split-view
    │            Show BOTH ConversationList AND ChatWindow side-by-side
    │
    ├── ConversationList (Always)
    │   ├── Loops: mockConversations array
    │   └── Output: ConversationItem component per conversation
    │
    ├── ChatWindow (When conversation selected)
    │   ├── Sub: ChatHeader
    │   │    ├── Displays: User avatar, name, Call button
    │   │    └── Trigger: onStartCall (shows CallPopup)
    │   │
    │   ├── Sub: Tabs
    │   │    ├── "Chat" tab → Shows MessageList + MessageInput
    │   │    └── "Collaborate" tab → Shows Document editor
    │   │
    │   ├── Sub: MessageList
    │   │    ├── Filters: Removes system messages
    │   │    └── Maps: Each message to Message component
    │   │
    │   ├── Sub: Message (Individual)
    │   │    ├── If isMe → Display immediately
    │   │    └── Else → Decrypt then display
    │   │
    │   └── Sub: MessageInput
    │        ├── Features: Text input, Attachment, AI assist, Send
    │        └── Trigger: handleSendMessage()
    │
    └── CallPopup (Modal, if showCallPopup === true)
         ├── User info
         ├── Call type selection (Voice/Video)
         └── Trigger: handleStartCall(callType)
```

---

## File Structure

```
frontend/src/
├── pages/
│   └── MessagesPage.jsx ...................... Entry point (page-level)
│
├── messages/
│   ├── MessagesPage.jsx ...................... Main container (split/full screen logic)
│   ├── ConversationList.jsx .................. Conversation sidebar
│   ├── ChatWindow.jsx ........................ Chat main area
│   ├── Chat.jsx ............................. Alternative chat component
│   ├── ChatHeader.jsx ........................ Conversation header
│   ├── MessageList.jsx ....................... Message container
│   ├── Message.jsx ........................... Individual message with decryption
│   ├── MessageInput.jsx ...................... Compose message area
│   ├── ThreadedChat.jsx ...................... Threaded replies (optional)
│   ├── DisappearingMessage.jsx ............... Auto-delete wrapper
│   ├── ViewOnceMessage.jsx ................... View-once wrapper
│   ├── CallButton.jsx ........................ Call initiation button
│   ├── IncomingCall.jsx ...................... Incoming call UI
│   │
│   └── e2ee/
│       ├── e2eeManager.js .................... Encryption orchestrator
│       ├── x3dh.js ........................... Key exchange algorithm
│       ├── double-ratchet.js ................. Message encryption
│       ├── DataEncryptor.js .................. Low-level crypto
│       ├── keystore.tsx ...................... Key storage
│       ├── keystore.jsx ...................... Alternative key storage
│       └── crypto.tsx ........................ Crypto utilities
│
└── components/
    ├── AIChat.jsx ............................ AI assistant chat
    └── call/
        ├── CallPopup.jsx ..................... Call initiation dialog
        ├── CallWindow.jsx .................... Active call view
        └── (other call components)
```

---

## Quick Lookup: Component Props

### MessagesPage
```javascript
Props: None (self-contained)
State: selectedConversation, activeCall, showCallPopup
Output: ConversationList + ChatWindow OR AIChat
```

### ConversationList
```javascript
Props: {
  conversations: Array<Conversation>,
  selectedConversation: Conversation,
  onConversationSelect: (conversation) => void
}
```

### ChatWindow
```javascript
Props: {
  conversation: Conversation,
  onStartCall: () => void
}
State: messages[], activeTab ('chat'|'collaborate'), userId
```

### Message
```javascript
Props: {
  message: Message,
  e2eeManager: E2EEManager,
  sessionId: string
}
State: displayText (decrypted content)
```

### MessageInput
```javascript
Props: None (pure UI)
State: message (text), anchorEl (AI menu anchor)
Output: Calls handleSendMessage() and handleRewrite()
```

### ChatHeader
```javascript
Props: {
  conversation: Conversation,
  onStartCall: () => void,
  sessionId?: string
}
Output: Header with user info and Call button
```

### AIChat
```javascript
Props: None
State: prompt, messages[], loading
Output: Chat interface with AI responses
```

---

## Common Workflows

### 1. Start a Conversation

```
User clicks ConversationItem
    ↓
onConversationSelect(conversation) fired
    ↓
MessagesPage.setSelectedConversation(conversation)
    ↓
ChatWindow receives new conversation prop
    ↓
ChatWindow.useEffect runs
    ├─→ chatService.establishSession(recipientId)
    ├─→ chatService.getMessages(conversationId)
    ├─→ Setup message listener
    └─→ Setup file listener
    ↓
User sees messages and can compose
```

### 2. Send a Message

```
User types in MessageInput
    ↓
MessageInput.onChange → setMessage(text)
    ↓
User presses Send or clicks Send button
    ↓
handleSendMessage() called
    ↓
ChatService.sendMessage(messageObj)
    ├─→ Establish E2EE session (if not exists)
    ├─→ Encrypt message payload
    └─→ Send via WebSocket
    ↓
Local message added to state immediately
    ↓
User sees message on screen
    ↓
Server broadcasts to recipient
    ↓
Recipient receives → decrypts → sees message
```

### 3. Receive a Message

```
Server emits 'new-message' to recipient
    ↓
realtimeService receives event
    ↓
chatService.handleIncomingMessage() called
    ├─→ Decrypt message payload
    ├─→ Parse decrypted JSON
    ├─→ Emit 'new-message' event
    └─→ Propagate displayText to component
    ↓
Chat.useEffect listener catches event
    ↓
setMessages(prev => [...prev, decryptedMessage])
    ↓
MessageList re-renders with new message
    ↓
Message component displays plaintext
    ↓
User sees message appear
```

### 4. Make a Call

```
User clicks "Start Call" in ChatHeader
    ↓
onStartCall() triggered
    ↓
MessagesPage.setShowCallPopup(true)
    ↓
CallPopup renders
    ↓
User selects call type (Voice/Video)
    ↓
handleStartCall(callType) called
    ↓
MessagesPage.setActiveCall({to, type, callType})
    ↓
CallPopup.setShowCallPopup(false) (hide popup)
    ↓
CallWindow renders with activeCall data
    ↓
Call management handled by CallWindow
    ↓
User clicks Hang Up
    ↓
handleHangUp() → setActiveCall(null)
    ↓
CallWindow unmounts, back to chat
```

### 5. Use AI Features

```
User has message in MessageInput: "hello world"
    ↓
User clicks AI Assist button
    ↓
AI menu appears with tone options:
- Formal
- Friendly
- Respectful
- Concise
    ↓
User selects tone (e.g., "Formal")
    ↓
handleRewrite('formal') called
    ↓
rewriteText(message, tone) API call
    ↓
Server returns rewritten text
    ↓
setMessage(rewrittenText)
    ↓
Input updates with new text
    ↓
User reviews and can send or edit further
```

---

## State Flow Diagram

```
MessagesPage (Root State)
├── selectedConversation
│   ├─→ If null: Show AIChat
│   ├─→ If set: Show ChatWindow for that conversation
│   └─→ Used by: ConversationList (highlight), ChatWindow (load messages)
│
├── activeCall
│   ├─→ If null: Don't show CallWindow
│   ├─→ If set: Show CallWindow with call data
│   └─→ Data: { to, type, callType }
│
└── showCallPopup
    ├─→ If true: Show CallPopup (modal)
    ├─→ If false: Hide CallPopup
    └─→ Triggered by: ChatHeader Call button

ChatWindow (Local State)
├── messages: Array of Message objects
│   ├─→ Updated when new message received
│   ├─→ Passed to: MessageList (render)
│   └─→ Source: chatService listener
│
├── activeTab: 'chat' | 'collaborate'
│   ├─→ If 'chat': Show MessageList + MessageInput
│   ├─→ If 'collaborate': Show Document
│   └─→ Updated by: Tab click handlers
│
└── userId: Current user ID
    └─→ Used for: Message sending, E2EE session

Message (Local State)
├── displayText: Decrypted or original message text
│   ├─→ If isMe: Show immediately
│   ├─→ Else: Decrypt then show
│   └─→ On error: Show '[Message could not be decrypted]'
│
└── isMe: boolean (message.sender === 'me')
    └─→ Used for: Alignment, styling, decryption skip

MessageInput (Local State)
├── message: string (current input text)
│   ├─→ Updated by: onChange handler
│   ├─→ Cleared on: Send message
│   └─→ Updated by: AI rewrite
│
└── anchorEl: DOM element (AI menu anchor)
    ├─→ Set when: AI button clicked
    ├─→ Used for: Menu positioning
    └─→ Cleared when: Menu item selected or closed
```

---

## Key Dependencies

### External Libraries
- `react`: UI framework
- `@mui/material`: Material Design components
- `styled-components`: CSS-in-JS styling
- `TweetNaCl.js`: Cryptographic operations (or Web Crypto API)

### Internal Services
- `chatService`: Message handling, E2EE orchestration
- `realtimeService`: WebSocket connection, real-time events
- `AuthContext`: Current user information
- `SnackbarContext`: Toast notifications (success/error)
- `useAI`: Custom hook for AI features

### Custom Hooks
- `useAI()`: { conversation: (prompt) => Promise<response> }
- `useSnackbar()`: { showSnackbar: (message, type) => void }
- `useMediaQuery()`: Screen size detection for responsive design

---

## Testing Checklist

- [ ] Send message in plaintext (before encryption ready)
- [ ] Send message with E2EE (encrypted properly)
- [ ] Receive message (decrypts correctly)
- [ ] Message ordering (chronological)
- [ ] Unread count updates
- [ ] Switch between conversations
- [ ] Open AIChat (when no conversation selected)
- [ ] Disappearing message countdown
- [ ] View-once message (disappears after click)
- [ ] File attachment (upload and display)
- [ ] Message reactions (add/remove)
- [ ] Typing indicator (shows/hides)
- [ ] Call popup (shows on button click)
- [ ] Chat/Collaborate tabs (switch between)
- [ ] Mobile responsive (full-screen each)
- [ ] Desktop responsive (split-view)
- [ ] Encryption/decryption errors (graceful)
- [ ] AI message rewriting (tone changes)
- [ ] Incoming message notification (snackbar)
- [ ] Connection lost (show error, auto-reconnect)

---

## Common Errors & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| "E2EE session not established" | Session establishment failed | Check browser console, verify recipient keys |
| "Message could not be decrypted" | Mismatched keys or corrupted data | Refresh, restart session |
| Messages not updating | WebSocket disconnected or listener not attached | Check network, restart chat |
| AI rewrite not working | API endpoint down or rate limited | Check server logs, wait and retry |
| Call button disabled | No E2EE session | Wait for session establishment |
| Conversation list empty | Mock data issue or API failure | Check mock data, verify backend |
| Mobile view shows both panels | useMediaQuery not working | Clear cache, restart browser |
| Decryption shows "Decrypting..." forever | Network timeout | Check connection, restart |

---

## Performance Tips

1. **Reduce Message History**: Load only recent 50 messages, paginate older
2. **Virtualize Long Lists**: Use react-window for 100+ messages
3. **Memoize Components**: Wrap Message in React.memo
4. **Lazy Load Attachments**: Load file previews on demand
5. **Batch Crypto**: Process multiple messages together
6. **Debounce Typing**: Only send typing events every 300ms
7. **Index Encrypted Data**: Server-side indexing for search
8. **Optimize Re-renders**: Use useCallback for event handlers

---

## Debug Commands

```javascript
// In browser console:

// Check ChatService state
chatService.getCurrentSessionId()
// Output: "session-abc123" or null

// View all messages
console.log(messages)

// Check E2EE Manager
chatService.e2eeManager.getSession(sessionId)

// Monitor WebSocket
realtimeService.on('*', (event, data) => console.log(event, data))

// Trigger message send (manual)
chatService.sendMessage({ 
  text: 'Test message',
  sender: { id: '123', name: 'User' }
})

// Clear encryption session
chatService.currentSessionId = null

// Force decrypt check
if (message.iv && message.ciphertext) {
  chatService.e2eeManager.decryptMessage(sessionId, message.iv, message.ciphertext)
}
```

---

## API Endpoints Summary

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/conversations` | GET | Fetch all conversations |
| `/api/conversations/{id}` | GET | Fetch conversation details |
| `/api/conversations/{id}/messages` | GET | Fetch message history |
| `/api/conversations/{id}/messages` | POST | Send message |
| `/api/messages/{id}` | DELETE | Delete message |
| `/api/reactions` | POST | Add reaction to message |
| `/api/files/upload` | POST | Upload attachment |
| `/ws/messages` | WS | Real-time message streaming |

---

## Entry Points

**Page Route:**
```
/messages → MessagesPage (pages/MessagesPage.jsx)
```

**Navigation:**
```javascript
import MessagesPage from './pages/MessagesPage';

// In Router
<Route path="/messages" component={MessagesPage} />
```

---

## Quick Feature Summary

| Feature | Component | Enabled |
|---------|-----------|---------|
| 1-to-1 Chat | Chat.jsx | ✅ |
| AI Chat | AIChat.jsx | ✅ |
| E2E Encryption | e2eeManager.js | ✅ |
| Message Reactions | Message.jsx | ✅ |
| Typing Indicator | ChatWindow.jsx | ✅ |
| View-once Messages | ViewOnceMessage.jsx | ✅ |
| Disappearing Messages | DisappearingMessage.jsx | ✅ |
| File Sharing | MessageInput.jsx | ✅ |
| Collaboration | Document.jsx | ✅ |
| Voice Calls | CallWindow.jsx | ✅ |
| Video Calls | CallWindow.jsx | ✅ |
| Group Chat | - | ❌ |
| Message Search | - | ❌ |
| Message Editing | - | ❌ |
| Voice Messages | - | ❌ |

---

## Summary

The Message Page provides a rich, secure messaging experience with real-time communication, end-to-end encryption, and AI assistance. The architecture is modular and extensible, making it easy to add new features or modify existing ones.

**Key Points:**
- **Structure**: Clear separation of concerns (components, services, contexts)
- **Security**: Military-grade encryption with X3DH + Double Ratchet
- **Real-time**: WebSocket-based messaging with instant updates
- **UX**: Responsive design, loading states, error handling
- **AI**: Integrated message rewriting and AI assistant
- **Testing**: Comprehensive error handling and user feedback

For detailed information, see [MESSAGE_PAGE_COMPLETE_GUIDE.md](MESSAGE_PAGE_COMPLETE_GUIDE.md).
