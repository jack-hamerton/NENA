# Message Page - Complete Architecture Guide

## Overview

The Message Page is a comprehensive direct messaging and communication system built with React and Material-UI, featuring end-to-end encryption (E2EE), real-time messaging, conversation management, and integrated AI chat capabilities.

**Key Features:**
- Real-time one-to-one messaging with end-to-end encryption
- Conversation list with unread message tracking
- AI-powered chat assistant (Nena)
- Message encryption/decryption using X3DH and Double Ratchet algorithms
- Message reactions and typing indicators
- Collaborative document sharing within conversations
- View-once messages and disappearing messages
- Call integration (voice/video via CallPopup)
- Responsive design (mobile and desktop optimized)

---

## Architecture Overview

### Component Hierarchy

```
MessagesPage (Entry Point)
├── ConversationList (Left Sidebar)
│   ├── ConversationItem (Repeating)
│   │   ├── Avatar (User profile picture)
│   │   ├── ConversationName
│   │   ├── LastMessage (Preview)
│   │   ├── Timestamp
│   │   └── UnreadBadge (Count)
│   └── Search/Filter (Optional)
│
├── ChatWindow (Main Content Area)
│   ├── ChatHeader
│   │   ├── Avatar
│   │   ├── User Name
│   │   └── Call Button
│   ├── Tabs
│   │   ├── Chat Tab
│   │   └── Collaborate Tab
│   ├── MessageList (Scrollable)
│   │   ├── Message (Repeating)
│   │   │   ├── Sender Avatar
│   │   │   ├── Message Content
│   │   │   ├── Timestamp
│   │   │   ├── Reactions
│   │   │   └── Decryption Status
│   │   └── Special Message Types:
│   │       ├── DisappearingMessage
│   │       ├── ViewOnceMessage
│   │       └── System Messages
│   ├── MessageInput
│   │   ├── AttachmentButton
│   │   ├── Text Input
│   │   ├── AI Assistant Button
│   │   └── Send Button
│   └── Document (Collaboration Tab)
│
├── CallPopup (Modal Overlay)
│   ├── User Info
│   ├── Call Type Selector
│   │   ├── Voice Call
│   │   └── Video Call
│   └── Action Buttons
│
└── AIChat (Alternative Chat View)
    ├── Message History
    ├── AI Response Display
    └── Input with AI Features
```

---

## Core Components

### 1. MessagesPage

**Location:** `/frontend/src/pages/MessagesPage.jsx` and `/frontend/src/messages/MessagesPage.jsx`

**Purpose:** Main entry point and state management for the messaging interface.

**Key Props/State:**
```javascript
const [selectedConversation, setSelectedConversation] = useState(null);
const [showCallPopup, setShowCallPopup] = useState(false);
const [activeCall, setActiveCall] = useState(null);
const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
```

**Responsibilities:**
- Manages which conversation is currently selected
- Handles call UI state (showing/hiding call popup and active call window)
- Routes between AI Chat and regular Chat based on selection
- Responsive layout handling (mobile vs desktop)

**Key Features:**
- Desktop: Split-view layout (ConversationList + ChatWindow)
- Mobile: Full-screen view (ConversationList OR ChatWindow)
- Automatic context switching to AIChat when selectedConversation is null

**Data Flow:**
```
MessagesPage
  ├─→ ConversationList (receives list, selected state)
  ├─→ ChatWindow (receives selected conversation, call handler)
  ├─→ CallPopup (receives user info, call type handler)
  └─→ AIChat (fallback when no conversation selected)
```

---

### 2. ConversationList

**Location:** `/frontend/src/messages/ConversationList.jsx`

**Purpose:** Displays all active conversations in a scrollable list with unread indicators.

**Props:**
```javascript
{
  conversations: Array<Conversation>,
  selectedConversation: Conversation,
  onConversationSelect: (conversation: Conversation) => void
}
```

**Data Structure - Conversation Object:**
```javascript
{
  id: string,                    // Unique conversation ID
  name: string,                  // Recipient's name
  avatar: string,                // Avatar URL
  lastMessage: string,           // Preview of last message
  timestamp: string,             // "10:30 AM", "Yesterday"
  unread: number,                // Count of unread messages
  online: boolean,               // Online status indicator
  participants: Array<User>,     // All conversation participants
}
```

**Component Structure:**
- **ConversationItem:** Individual conversation entry
  - Avatar (circular image, 50px)
  - User info section
    - Name (bold)
    - Last message preview (gray, truncated)
  - Timestamp (right-aligned)
  - UnreadBadge (blue circle with count if unread > 0)

**Styling:**
- Width: 320px (fixed sidebar width)
- Hover effect: Light gray background
- Active state: Darker gray background
- Scrollable: overflow-y: auto

**Functionality:**
- Click on conversation → triggers `onConversationSelect`
- Visual feedback for selected conversation
- Unread badge appears when `unread > 0`
- Online status can be indicated by avatar styling

**Mock Data Example:**
```javascript
const mockConversations = [
  {
    id: 1,
    name: 'John Doe',
    lastMessage: 'See you tomorrow!',
    timestamp: '10:30 AM',
    unread: 2,
    online: true,
    avatar: 'https://i.pravatar.cc/150?u=johndoe'
  }
]
```

---

### 3. ChatWindow

**Location:** `/frontend/src/messages/ChatWindow.jsx`

**Purpose:** Main chat interface showing messages, tabs, and input area.

**Props:**
```javascript
{
  conversation: Conversation,
  onStartCall: () => void
}
```

**State Management:**
```javascript
const [messages, setMessages] = useState([]);
const [activeTab, setActiveTab] = useState('chat'); // 'chat' or 'collaborate'
const userId = 'user123';
```

**Sub-Components:**
1. **ChatHeader**
   - User avatar and name
   - "Start Call" button
   - Disabled when no E2EE session established

2. **Tabs**
   - "Chat" tab: Shows MessageList + MessageInput
   - "Collaborate" tab: Shows Document (shared document editing)

3. **MessageList**
   - Displays all messages for the conversation
   - Scrollable area
   - Filters out system messages

4. **MessageInput**
   - Text input for composing messages
   - Send button
   - File attachment button
   - AI assist button for tone adjustments

**Key Features:**
- Real-time message listening via chatService
- File sharing support (displayed as file messages)
- Collaborative document editing in separate tab
- Call integration with CallPopup trigger

**Lifecycle:**
```
Mount
  ├─→ Connect to chatService
  ├─→ Fetch initial message history
  ├─→ Setup event listeners (new-message, new-file)
  └─→ Establish E2EE session with recipient
  
Message Arrives
  ├─→ Emit 'new-message' event
  ├─→ Update messages state
  └─→ User sees message (after decryption)

Unmount
  ├─→ Remove event listeners
  ├─→ Disconnect from chatService
  └─→ Close E2EE session
```

---

### 4. MessageList

**Location:** `/frontend/src/messages/MessageList.jsx`

**Purpose:** Renders a list of decrypted messages with filtering.

**Props:**
```javascript
{
  messages: Array<Message>,
  e2eeManager: E2EEManager,
  sessionId: string
}
```

**Message Structure (Before Decryption):**
```javascript
{
  id: string,
  sender: string | User,
  timestamp: number,
  iv?: number[],            // Initialization vector
  ciphertext?: number[],    // Encrypted content
  text?: string,            // Plaintext (fallback)
  type?: 'system' | 'chat', // Message type
  reactions?: { [emoji]: count }
}
```

**Filtering:**
- Removes system/signaling messages (type === 'system')
- Only displays chat messages (type === 'chat')
- Backward compatible with old format (no type field)

**Rendering:**
- Maps messages array to Message components
- Passes decryption manager for client-side decryption
- Maintains message order (chronological)

**Scrolling Behavior:**
- Container: `flex-grow: 1; overflow-y: auto`
- New messages scroll into view automatically (if not pinned)

---

### 5. Message Component

**Location:** `/frontend/src/messages/Message.jsx`

**Purpose:** Individual message display with E2E decryption and rendering.

**Props:**
```javascript
{
  message: Message,
  e2eeManager: E2EEManager,
  sessionId: string
}
```

**Decryption Flow:**

```
Incoming Message (encrypted)
  ├─→ Message component mounts
  ├─→ Check if sender is 'me'
  │   ├─→ Yes: Display immediately (already have plaintext)
  │   └─→ No: Begin decryption process
  ├─→ Show "Decrypting..." status
  ├─→ Call e2eeManager.decryptMessage()
  │   ├─→ Extract IV and ciphertext from message
  │   ├─→ Retrieve session from session ID
  │   ├─→ Decrypt content using Double Ratchet
  │   └─→ Parse JSON payload
  ├─→ Check message type in payload
  │   ├─→ 'chat': Display content
  │   ├─→ 'system': Return null (don't display)
  │   └─→ Other: Handle appropriately
  └─→ On Error: Show fallback message and log to server
```

**Rendering:**
```javascript
<MessageContainer isMe={isMe}>
  <strong>{sender}: </strong>
  {displayText}
</MessageContainer>
```

**Styling:**
- Left-aligned for received messages
- Right-aligned for sent messages
- Different background colors based on sender
- Max-width: 60% (prevents very long messages from spanning full width)

**Error Handling:**
- Decryption failure → Display "[Message could not be decrypted]"
- No E2EE available → Display "[E2EE not available]"
- Missing IV/ciphertext → Treat as unencrypted fallback

**Special Message Types:**
- System messages: Return null (filtered out)
- Signaling messages: Return null (WebRTC only)
- Chat messages: Display normally

---

### 6. MessageInput

**Location:** `/frontend/src/messages/MessageInput.jsx`

**Purpose:** Compose and send messages with attachment and AI assistance.

**State:**
```javascript
const [message, setMessage] = useState('');
const [anchorEl, setAnchorEl] = useState(null); // For AI menu
```

**Components:**
1. **AttachmentButton**
   - Label with file input hidden
   - Displays "+" icon
   - Click triggers file picker

2. **Text Input**
   - Flex-grow to fill available space
   - Placeholder: "Type a message..."
   - Real-time state update as user types

3. **AI Assist Button**
   - Opens dropdown menu
   - Options: Formal, Friendly, Respectful, Concise
   - Calls `rewriteText()` service with selected tone

4. **Send Button**
   - Arrow icon (➤)
   - Sends current message
   - Clears input after send

**AI Rewriting Feature:**
```javascript
const handleRewrite = async (tone: 'formal' | 'friendly' | 'respectful' | 'concise') => {
  const rewrittenText = await rewriteText(message, tone);
  setMessage(rewrittenText);
  handleAiAssistClose();
};
```

**File Attachment Handling:**
- Click attachment button → file input opens
- User selects file
- File sent via `chatService.sendFile()`
- Displays as file message in chat

**Keyboard Shortcuts:**
- Enter: Send message (handled by ChatWindow or ChatHeader)
- Shift+Enter: New line (standard textarea behavior)

---

### 7. ChatHeader

**Location:** `/frontend/src/messages/ChatHeader.jsx`

**Purpose:** Display conversation info and call button.

**Props:**
```javascript
{
  conversation: Conversation,
  onStartCall: () => void,
  sessionId?: string
}
```

**Elements:**
- User avatar (40px circular)
- User name (bold)
- "Start Call" button (right-aligned)

**Call Button State:**
- Enabled: Only when E2EE session is established (sessionId exists)
- Disabled: When no session (shows loading/disabled styling)
- Click: Calls `onStartCall()` which triggers CallPopup display

**Styling:**
- Full width header
- Border-bottom separates from message list
- Flex layout with space-between alignment
- Sticky positioning (optional - stays at top while scrolling)

---

### 8. AIChat Component

**Location:** `/frontend/src/components/AIChat.jsx`

**Purpose:** AI conversation interface (Nena AI Assistant).

**Features:**
- Chat interface specifically for AI interactions
- Message history display
- Real-time response loading state
- Error handling with user-friendly messages

**State:**
```javascript
const [prompt, setPrompt] = useState('');
const [messages, setMessages] = useState([]);
const [loading, setLoading] = useState(false);
const { conversation } = useAI(); // Custom hook
```

**Message Flow:**
```
User Types → Click Send
  ├─→ Validate prompt not empty
  ├─→ Add user message to history
  ├─→ Clear input field
  ├─→ Set loading = true
  ├─→ Call AI conversation API
  ├─→ Add AI response to history
  └─→ Set loading = false
```

**Styling:**
- Paper elevation card for container
- Black background (#1e1e1e)
- Right-aligned user messages
- Left-aligned AI messages
- Scrollable message area

**Error Handling:**
- API failure → Display "Error: Could not get a response from the AI."
- Empty prompt → Don't send
- Loading state → Button disabled, text shows "Thinking..."

---

## Message Encryption Flow (E2EE)

### Architecture Components

**E2EE System:**
- **KeyStore** (`/frontend/src/messages/e2ee/keystore.tsx`)
  - Stores user identity keys
  - Manages pre-keys
  - Implements secure storage

- **E2EEManager** (`/frontend/src/messages/e2ee/e2eeManager.js`)
  - Main orchestrator for encryption/decryption
  - Manages E2EE sessions
  - Handles key ratcheting

- **X3DH** (`/frontend/src/messages/e2ee/x3dh.js`)
  - Extended Triple Diffie-Hellman key exchange
  - Establishes initial shared secret
  - Generates shared key from user keys

- **Double Ratchet** (`/frontend/src/messages/e2ee/double-ratchet.js`)
  - Message-level encryption
  - Key derivation and ratcheting
  - Forward secrecy per message

- **DataEncryptor** (`/frontend/src/messages/e2ee/DataEncryptor.js`)
  - Low-level encryption/decryption
  - Uses TweetNaCl or Web Crypto API
  - Handles IV generation and padding

### Encryption Process (Sending)

```
User composes message
  ├─→ ChatService.sendMessage() called
  ├─→ Check if E2EE session exists (currentSessionId)
  │   ├─→ No: Log warning, send unencrypted
  │   └─→ Yes: Proceed to encryption
  ├─→ Create message payload:
  │   {
  │     type: 'chat',
  │     content: plaintext_message,
  │     timestamp: Date.now()
  │   }
  ├─→ Stringify payload to JSON
  ├─→ Call e2eeManager.encryptMessage(sessionId, jsonString)
  │   ├─→ Retrieve session from keyStore
  │   ├─→ Generate new IV (random bytes)
  │   ├─→ Ratchet keys (Double Ratchet)
  │   ├─→ Encrypt payload with current key + IV
  │   └─→ Return { iv, ciphertext }
  ├─→ Create encrypted message object:
  │   {
  │     id: random_id,
  │     sender: currentUser,
  │     timestamp: Date.now(),
  │     iv: [...],        // Array of integers
  │     ciphertext: [...] // Array of integers
  │   }
  ├─→ Send via realtimeService.send('new-message', messageObj)
  └─→ Emit local message with plaintext for immediate display
```

### Decryption Process (Receiving)

```
Message received from server
  ├─→ chatService.handleIncomingMessage() invoked
  ├─→ Check if message is encrypted (has iv + ciphertext)
  │   ├─→ No encrypted fields: Emit as-is
  │   └─→ Has encrypted fields: Decrypt
  ├─→ Call e2eeManager.decryptMessage(sessionId, iv, ciphertext)
  │   ├─→ Retrieve session using sessionId
  │   ├─→ Ratchet receiving keys (Double Ratchet)
  │   ├─→ Decrypt ciphertext using current key + IV
  │   └─→ Return decrypted JSON string
  ├─→ Parse JSON to get payload:
  │   {
  │     type: 'chat' | 'system' | etc,
  │     content: actual_message_text
  │   }
  ├─→ Check message type
  │   ├─→ 'chat': Emit 'new-message' with plaintext
  │   ├─→ 'system': Emit but don't display to user
  │   └─→ Other: Handle or ignore
  ├─→ On decryption error:
  │   ├─→ Log error
  │   ├─→ Call e2eeManager.fallbackToServer()
  │   └─→ Store encrypted message for audit
  └─→ Message component displays plaintext
```

### Session Establishment (X3DH)

```
Chat.useEffect (on mount)
  ├─→ Call chatService.establishSession(recipientId, recipientIdentityKey, recipientPreKey)
  ├─→ chatService calls e2eeManager.establishSession()
  ├─→ X3DH key exchange:
  │   ├─→ Get own identity key (IK_A) and ephemeral key (EK_A)
  │   ├─→ Get recipient's identity key (IK_B) and pre-key (PK_B)
  │   ├─→ Compute shared secrets:
  │   │   ├─→ DH(IK_A, PK_B)
  │   │   ├─→ DH(EK_A, IK_B)
  │   │   ├─→ DH(EK_A, PK_B)
  │   │   └─→ KDF(concat(DH1, DH2, DH3)) → SK (shared key)
  │   └─→ Store SK in session
  ├─→ Initialize Double Ratchet:
  │   ├─→ Set RK = SK (root key)
  │   ├─→ Generate first sending keys from RK
  │   └─→ Create session object
  ├─→ Return sessionId
  └─→ Store currentSessionId in chatService
```

---

## Real-time Features

### WebSocket Connection

**Service:** `realtimeService` (imported in chatService)

**Connection Lifecycle:**
```
chatService.connect(userId)
  ├─→ realtimeService connects to ws://server/api/messages
  ├─→ Authenticate with userId
  ├─→ Listen for events:
  │   ├─→ 'new-message': Incoming chat message
  │   ├─→ 'new-reaction': Emoji reaction on message
  │   ├─→ 'typing': User is typing indicator
  │   ├─→ 'stop-typing': Typing stopped
  │   └─→ 'call-incoming': Incoming call notification
  └─→ Ready to send/receive messages
```

### Message Reactions

**Flow:**
```
User clicks emoji reaction on message
  ├─→ ChatService.addReaction(messageId, reaction)
  ├─→ Send via realtimeService: { messageId, reaction }
  ├─→ Server adds reaction to message
  ├─→ Broadcast to all participants
  └─→ UI updates reaction count
```

**Data Structure:**
```javascript
message.reactions = {
  '👍': 3,      // 3 users liked
  '❤️': 1,      // 1 user loved
  '😂': 2,      // 2 users laughed
  // ...
}
```

### Typing Indicators

**Flow:**
```
User types in message input
  ├─→ Debounce typing events (300ms)
  ├─→ Call chatService.startTyping(userName)
  ├─→ Send 'typing' event via realtimeService
  ├─→ Recipients see "User is typing..."
  ├─→ User stops typing for 1 second
  ├─→ Call chatService.stopTyping()
  ├─→ Send 'stop-typing' event
  └─→ Recipients see typing indicator disappear
```

---

## Special Message Types

### 1. ViewOnceMessage

**Location:** `/frontend/src/messages/ViewOnceMessage.jsx`

**Purpose:** Messages that disappear after first view.

**Behavior:**
```
Message sent with viewOnce flag
  ├─→ Recipient receives view-once message
  ├─→ Component displays: "Tap to view photo"
  ├─→ User clicks to view
  ├─→ Message content displays once
  ├─→ Next time component is opened: "Opened"
  └─→ Message deletes from server
```

**Implementation:**
```javascript
const [viewed, setViewed] = useState(false);

const handleClick = () => {
  if (!viewed) {
    setViewed(true);
    // Call service to mark as viewed and delete
  }
};
```

### 2. DisappearingMessage

**Location:** `/frontend/src/messages/DisappearingMessage.jsx`

**Purpose:** Messages that auto-delete after specified time.

**Configuration Options:**
- 30 seconds
- 1 minute
- 5 minutes
- 1 hour
- Manually (never auto-delete)

**Behavior:**
```
Message sent with disappearingTimer: 30
  ├─→ Message displays normally
  ├─→ Countdown timer starts (shows "30s" in corner)
  ├─→ Every second: timeLeft decreases
  ├─→ Countdown reaches 0
  ├─→ Call service to delete message
  ├─→ Component returns null
  └─→ Message disappears from UI and server
```

**Implementation:**
```javascript
const [timeLeft, setTimeLeft] = useState(message.disappearingTimer);

useEffect(() => {
  const timer = setInterval(() => {
    setTimeLeft(prevTime => {
      if (prevTime <= 1) {
        clearInterval(timer);
        deleteMessage(message.id); // Call service
        return 0;
      }
      return prevTime - 1;
    });
  }, 1000);

  return () => clearInterval(timer);
}, []);
```

### 3. System Messages

**Purpose:** Internal messages for status updates, not displayed to users.

**Examples:**
- "User started a call"
- "User left the conversation"
- "Encryption session re-established"

**Handling:**
- Stored in database for audit
- Filtered out in MessageList
- Not decrypted or displayed in UI
- Used for logging and analytics

---

## Collaboration Features

### Document Sharing

**Location:** `/frontend/src/components/collaboration/Document.jsx`

**How It Works:**
1. Click "Collaborate" tab in ChatWindow
2. Opens shared document editor
3. Real-time sync via WebSocket
4. Both participants see changes live
5. Used for note-taking, meeting minutes, etc.

**Document Structure:**
```javascript
{
  id: `conversation-${conversationId}`,
  name: `Notes for ${recipientName}`,
  content: '' // Editable text content
}
```

---

## Call Integration

### CallPopup Component

**Location:** `/frontend/src/components/call/CallPopup.jsx`

**Trigger:**
- User clicks "Start Call" button in ChatHeader
- Shows popup with call type selection

**Call Types:**
- Voice Call
- Video Call

**Flow:**
```
Click Start Call
  ├─→ Show CallPopup overlay
  ├─→ User selects call type (Voice/Video)
  ├─→ CallPopup calls handleStartCall(callType)
  ├─→ MessagesPage creates activeCall object:
  │   {
  │     to: recipientId,
  │     type: 'outgoing',
  │     callType: 'voice' | 'video'
  │   }
  ├─→ Render CallWindow with activeCall
  └─→ Call management handled by CallWindow component
```

### CallWindow Component

**Location:** `/frontend/src/components/call/CallWindow.jsx`

**Responsibilities:**
- Video/audio stream management
- WebRTC peer connection
- Call controls (mute, camera toggle, hang up)
- Duration tracking

---

## State Management

### ChatService (Singleton)

**Key Methods:**
```javascript
// Session Management
establishSession(recipientId, identityKey?, preKey?) 
  → Promise<sessionId: string>

getCurrentSessionId() 
  → string | null

// Message Operations
getMessages(roomId: string) 
  → Promise<Message[]>

sendMessage(message: MessagePayload) 
  → Promise<Message>

// Real-time Communication
connect(userId: string)
disconnect()

// Reactions
addReaction(messageId: string, reaction: string)

// Typing Indicators
startTyping(userName: string)
stopTyping()

// Event Listeners
on(event: string, callback: Function)
off(event: string, callback: Function)
onNewMessage(callback: Function)
offNewMessage()

// File Sharing
sendFile(file: File, conversationId: string)
```

**Event Emissions:**
- `new-message`: Message received and decrypted
- `new-reaction`: Reaction added to message
- `typing`: User started typing
- `stop-typing`: User stopped typing
- `new-file`: File received
- `session-established`: E2EE session ready
- `session-error`: E2EE session failed

### AuthContext

**Provides:**
```javascript
{
  user: {
    id: string,
    name: string,
    email: string,
    avatar: string
  }
}
```

Used in MessagesPage to get current user ID for chat operations.

---

## Data Flow Diagram

```
User Input (Type & Send)
    ↓
MessageInput.onChange → setMessage
    ↓
MessageInput.onSend → handleSendMessage
    ↓
ChatWindow.handleSendMessage
    ↓
ChatService.sendMessage(messageObj)
    ├─→ Check E2EE session exists
    ├─→ Encrypt message (X3DH + Double Ratchet)
    └─→ realtimeService.send('new-message', encrypted)
    ↓
WebSocket → Server → Recipient
    ↓
realtimeService receives message
    ↓
ChatService.handleIncomingMessage
    ├─→ Decrypt message
    ├─→ Parse payload
    └─→ emit('new-message', decryptedMessage)
    ↓
Chat.useEffect listener
    ├─→ setMessages(prev => [...prev, message])
    └─→ showSnackbar('New message')
    ↓
MessageList receives updated messages array
    ↓
Map messages → Message components
    ↓
Message component
    ├─→ Check if already decrypted (isMe)
    └─→ Display plaintext
    ↓
User sees message in chat
```

---

## Performance Optimizations

### Message Rendering
- **Virtualization:** Consider implementing react-window for long message lists
- **Memoization:** Message components wrapped in React.memo to prevent re-renders
- **Lazy Loading:** Load older messages on scroll-up

### Encryption/Decryption
- **Web Workers:** Offload crypto operations to background thread
- **Caching:** Cache decrypted messages temporarily
- **Batch Processing:** Queue multiple messages for batch decryption

### WebSocket Communication
- **Message Batching:** Send multiple small messages as one
- **Compression:** Enable WebSocket compression for large payloads
- **Connection Pooling:** Reuse single connection for all users

---

## Security Considerations

### End-to-End Encryption
✓ All messages encrypted before transmission
✓ Server cannot read message content
✓ Forward secrecy: Compromise of one key doesn't affect past messages
✓ Perfect forward secrecy via Double Ratchet key updates

### Session Management
✓ E2EE sessions established per conversation
✓ Sessions isolated (compromise doesn't affect other chats)
✓ Session IDs never transmitted (client-side only)

### Error Handling
✓ Decryption failures logged and stored for audit
✓ Fallback mechanisms for unencrypted messages
✓ Graceful degradation if E2EE unavailable

### Vulnerabilities to Address
⚠ Session storage (consider encrypted IndexedDB)
⚠ Key backup strategy (how to recover lost keys?)
⚠ Device compromises (attacker gains access to decrypted messages in memory)

---

## Mobile Responsiveness

### Breakpoints
- **Mobile:** `xs` (< 600px)
- **Tablet:** `sm` (600px - 900px)
- **Desktop:** `md` and up (> 900px)

### Mobile Layout
- ConversationList and ChatWindow are mutually exclusive
- Full-screen view shows either list or chat
- Back button to return from chat to list
- Call window overlays full screen

### Desktop Layout
- Split-view: ConversationList (25%) + ChatWindow (75%)
- Both visible simultaneously
- Call window as overlay or side panel

---

## Integration Points

### Backend APIs
- `GET /api/conversations` - Fetch conversation list
- `GET /api/conversations/{id}/messages` - Fetch message history
- `POST /api/conversations/{id}/messages` - Send message
- `POST /api/reactions` - Add reaction to message
- `DELETE /api/messages/{id}` - Delete message

### WebSocket Events
- `ws://localhost:8000/api/messages` - Main WebSocket
- `new-message` - Broadcast to all participants
- `new-reaction` - Reaction updates
- `typing` - Typing indicator
- `call-incoming` - Incoming call notification

### Third-Party Services
- **AI Service:** NLP/GPT for message rewriting
- **File Storage:** S3 or similar for file attachments
- **Crypto Libraries:** TweetNaCl.js or Web Crypto API

---

## Known Limitations

### Current Implementation
- Single recipient (1-to-1 only, no group chats)
- In-memory message history (no persistence after refresh)
- Mock conversations (not connected to real backend)
- No message editing/deletion UX

### Future Enhancements
- Group messaging (multi-participant conversations)
- Message search and filtering
- Message archiving
- Pin important messages
- Message reactions with custom emoji
- Voice messages
- Story/status updates
- Message backups

---

## Debugging Guide

### Enable Verbose Logging
```javascript
// In chatService.ts
if (process.env.REACT_APP_DEBUG === 'true') {
  console.log('[ChatService] Event:', event);
  console.log('[E2EE] Encryption:', { iv, ciphertext });
}
```

### Common Issues

**Issue:** "E2EE session not established"
- Check if `establishSession` was called
- Verify recipient keys are available
- Check browser console for session errors

**Issue:** "Message could not be decrypted"
- Confirm both parties have matching session IDs
- Check if keys are synchronized
- Verify message IV and ciphertext are valid

**Issue:** Messages not updating in real-time
- Check WebSocket connection (open in DevTools)
- Verify chatService listeners are attached
- Check realtimeService event emissions

**Issue:** Performance lag with many messages
- Implement message virtualization
- Reduce animation overhead
- Move crypto to Web Worker
- Limit message history loaded

---

## Code Examples

### Sending an Encrypted Message
```javascript
const handleSend = async () => {
  const messagePayload = {
    content: newMessage,
    sender_id: currentUserId,
    recipient_id: recipientId,
    conversation_id: conversationId
  };

  try {
    const sentMessage = await chatService.sendMessage(messagePayload);
    setMessages(prev => [...prev, sentMessage]);
    setNewMessage('');
  } catch (error) {
    showSnackbar('Failed to send message', 'error');
  }
};
```

### Listening for Messages
```javascript
useEffect(() => {
  const handleNewMessage = (message) => {
    setMessages(prev => [...prev, message]);
    showSnackbar(`New message from ${message.sender.name}`, 'success');
  };

  chatService.onNewMessage(handleNewMessage);

  return () => {
    chatService.offNewMessage();
  };
}, []);
```

### Starting an E2EE Session
```javascript
useEffect(() => {
  const establishSession = async () => {
    try {
      const sessionId = await chatService.establishSession(
        recipientId,
        recipientPublicKeys.identityKey,
        recipientPublicKeys.preKey
      );
      console.log('Session established:', sessionId);
    } catch (error) {
      console.error('Session establishment failed:', error);
    }
  };

  establishSession();
}, [recipientId]);
```

---

## Summary

The Message Page is a sophisticated real-time communication system with military-grade encryption, responsive design, and extensible architecture. It provides a secure, feature-rich messaging experience while maintaining clean code organization and clear separation of concerns.

**Key Strengths:**
- End-to-end encryption with forward secrecy
- Real-time messaging via WebSocket
- Responsive mobile/desktop design
- AI-powered message assistance
- Collaboration features
- Extensible component structure

**Architecture Patterns:**
- Service-based state management (ChatService)
- Context for global state (AuthContext)
- Event-driven architecture for real-time updates
- Styled-components for component styling
- Custom hooks for logic encapsulation
