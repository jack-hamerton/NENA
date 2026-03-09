# Room Page - Complete Architecture & Implementation Guide

## Overview

The Room Page is a fully-featured video conferencing and collaboration platform with real-time WebRTC communication, live chat, polls, and collaborative document editing. It supports multiple participants, host controls, and advanced features like reactions, screen sharing, and virtual backgrounds.

**Key Features:**
✅ Multi-participant video conferencing (WebRTC)
✅ Real-time chat with AI text rewriting
✅ Live polling system
✅ Reactions/emojis during calls
✅ Host controls (mute, screen sharing, mute all, etc.)
✅ Collaborative document editing
✅ Audio/Video toggle controls
✅ Virtual background support
✅ Speaker highlighting
✅ Screen sharing capability
✅ End-to-end encryption ready

---

## Frontend Structure

### Directory Layout
```
frontend/src/
├── pages/
│   ├── RoomPage.jsx (Main page container)
│   ├── Room.jsx (Alternative room component)
│   └── Rooms.jsx (Room list/discovery)
├── rooms/
│   ├── RoomVideoGrid.jsx (Video display grid)
│   ├── Chat.jsx (Chat messages & input)
│   ├── Polls.jsx (Polls display & creation)
│   ├── Reactions.jsx (Emoji reactions)
│   ├── ControlsBar.jsx (Media controls)
│   ├── HostControls.jsx (Host-only controls)
│   ├── ReactionPanel.jsx (Emoji selector)
│   ├── ParticipantTile.jsx (Individual participant tile)
│   ├── SpeakerHighlight.jsx (Speaker detection)
│   ├── VirtualBackground.jsx (BG effects)
│   ├── RoomControls.jsx (Legacy controls)
│   ├── AdminControls.jsx (Admin-specific)
│   ├── RoleBadges.jsx (Participant roles)
│   ├── Room.jsx (Room component)
│   ├── RoomsPage.jsx (Rooms listing)
│   ├── ScreenShareTile.jsx (Screen share display)
│   ├── AIModal.jsx (AI features)
│   ├── CreatePoll.jsx (Poll creation)
│   ├── Chat.css / ChatMessage.css / Reactions.css (Styles)
│   └── e2ee/
│       ├── webrtc.js (WebRTC manager)
│       └── sframe.js (Encryption utility)
└── services/
    ├── callService.js (Call management)
    ├── roomService.js (Room API)
    └── aiService.js (AI operations)
```

---

## MAIN COMPONENTS

### 1. RoomPage.jsx (Primary Entry Point)

**Purpose:** Main container that orchestrates all room functionality

**Key Props:**
- `roomId` - Retrieved from URL params

**State Variables:**
```javascript
const [sidebarTab, setSidebarTab] = useState('chat');  // 'chat', 'polls', 'collaborate'
const [reactions, setReactions] = useState([]);
const [localStream, setLocalStream] = useState(null);
const [remoteStreams, setRemoteStreams] = useState({});
const [isHost, setIsHost] = useState(true);  // Mock - should come from backend
const webRTCManager = useRef(null);
```

**Layout:**
```
┌─────────────────────────────────────────────┐
│           RoomPage Container                │
├─────────────────────────────────────────────┤
│  MainContent (flex-grow: 1)                 │
│  ├─ VideoContainer                          │
│  │  ├─ RoomVideoGrid (all participants)     │
│  │  └─ Reactions (floating emojis)          │
│  ├─ ControlsBar (audio/video toggles)       │
│  └─ HostControls (if isHost)                │
│                                             │
│  Sidebar (width: 320px)                     │
│  ├─ TabContainer                            │
│  │  ├─ Chat Tab Button                      │
│  │  ├─ Polls Tab Button                     │
│  │  └─ Collaborate Tab Button               │
│  └─ SidebarContent                          │
│     ├─ Chat (if sidebarTab === 'chat')      │
│     ├─ Polls (if sidebarTab === 'polls')    │
│     └─ Document (if collaborate)            │
└─────────────────────────────────────────────┘
```

**Key Lifecycle:**
```javascript
useEffect(() => {
  // 1. Get user media (audio + video)
  navigator.mediaDevices.getUserMedia({ video: true, audio: true })
  
  // 2. Initialize WebRTC manager
  webRTCManager.current = new WebRTCManager(
    roomId,
    stream,
    (clientId, stream) => setRemoteStreams(prev => ({ 
      ...prev, 
      [clientId]: stream 
    })),
    (clientId) => setRemoteStreams(prev => {
      const newState = { ...prev };
      delete newState[clientId];
      return newState;
    })
  );
  
  // 3. Cleanup on unmount
  return () => {
    webRTCManager.current.close();
    localStream.getTracks().forEach(track => track.stop());
  };
}, [roomId]);
```

---

### 2. RoomVideoGrid.jsx

**Purpose:** Displays video streams from all participants in a responsive grid layout

**Props:**
```javascript
{
  participants: Array<{
    userId: string,
    stream: MediaStream
  }>
}
```

**Layout:**
```
GridContainer (display: grid, auto-fill, minmax(250px, 1fr))
├─ ParticipantContainer
│  ├─ Video (width: 100%, height: 100%, object-fit: cover)
│  └─ UserIdLabel (bottom-left corner)
├─ ParticipantContainer
│  ├─ Video
│  └─ UserIdLabel
└─ ... (one for each participant)
```

**Key Features:**
- Responsive grid that adapts to number of participants
- Shows participant user ID in bottom-left
- Covers video to fill container without stretching
- Uses `useRef` to attach MediaStream to video element

---

### 3. Chat.jsx

**Purpose:** Real-time chat interface with AI text rewriting capabilities

**State:**
```javascript
const [messages, setMessages] = useState([]);
const [messageText, setMessageText] = useState('');
const [contextMenu, setContextMenu] = useState(null);
const [selectedMessage, setSelectedMessage] = useState(null);
```

**Components:**
- **MessageList** - Scrollable container of messages
- **Message** - Individual message with sender name
- **ChatInput** - Input field for typing
- **AiAssistButton** - Opens AI rewriting menu
- **SendButton** - Sends message

**AI Integration:**
```javascript
// Right-click context menu on messages offers AI options:
- "Rewrite as professional"
- "Rewrite as casual"
- "Rewrite as friendly"
- "Fix grammar"
- "Shorten"
- "Expand"
```

Uses `rewriteText()` from `aiService` to transform message text

**Message Structure:**
```javascript
{
  id: string,
  sender: string,
  text: string,
  timestamp: Date,
  userId: string
}
```

---

### 4. Polls.jsx

**Purpose:** Create and participate in real-time polls

**State:**
```javascript
const [polls, setPolls] = useState([]);
const [showCreatePoll, setShowCreatePoll] = useState(false);
const [question, setQuestion] = useState('');
const [options, setOptions] = useState(['', '']);
```

**Features:**
- **Create Poll** - Form with question and multiple options
- **Vote** - Click vote button to submit answer
- **Results** - Show vote counts/percentages

**Poll Structure:**
```javascript
{
  id: string,
  question: string,
  options: Array<{
    text: string,
    votes: number
  }>,
  createdBy: string,
  createdAt: Date
}
```

**Workflow:**
1. Host clicks "Create Poll"
2. Enters question and options (can add more)
3. Submits poll to all participants
4. Participants click option to vote
5. Results update in real-time

---

### 5. ControlsBar.jsx

**Purpose:** Media control buttons for audio/video toggle, reactions, and screen sharing

**State:**
```javascript
const [isAudioMuted, setIsAudioMuted] = useState(false);
const [isVideoMuted, setIsVideoMuted] = useState(false);
const [showVirtualBackground, setShowVirtualBackground] = useState(false);
const [showReactionPanel, setShowReactionPanel] = useState(false);
```

**Controls:**
| Button | Action | Effect |
|--------|--------|--------|
| 🎤 Mute/Unmute | Toggle audio | Disable audio track |
| 📹 Stop/Start Video | Toggle video | Disable video track |
| 🎨 Virtual BG | Show BG options | Enable background effects |
| 😊 Reactions | Show emoji panel | Send emoji reaction |
| 📺 Screen Share | Start sharing | Share screen instead of camera |
| 🚪 Leave | Exit room | Stop all tracks and navigate away |

**Audio/Video Toggle Logic:**
```javascript
useEffect(() => {
  if (localStream) {
    if (localStream.getAudioTracks().length > 0) {
      localStream.getAudioTracks()[0].enabled = !isAudioMuted;
    }
    if (localStream.getVideoTracks().length > 0) {
      localStream.getVideoTracks()[0].enabled = !isVideoMuted;
    }
  }
}, [localStream, isAudioMuted, isVideoMuted]);
```

---

### 6. HostControls.jsx

**Purpose:** Host-only controls for managing the meeting

**State:**
```javascript
const [isMuted, setIsMuted] = useState(false);
const [isScreenSharing, setIsScreenSharing] = useState(false);
```

**Host-Only Buttons:**
| Button | Action |
|--------|--------|
| Mute | Toggle host's audio |
| Share Screen | Start screen sharing |
| Mute All | Disable all participants' audio |
| Stop All Videos | Disable all participants' video |
| Lock Meeting | Prevent new participants from joining |
| Waiting Room | Enable waiting room for new joiners |

**Integration:**
```javascript
const handleMuteToggle = () => {
  callService.toggleMute();
  setIsMuted(!isMuted);
};

const handleScreenShareToggle = () => {
  callService.toggleScreenShare();
  setIsScreenSharing(!isScreenSharing);
};
```

---

### 7. ReactionPanel.jsx

**Purpose:** Emoji selector for sending reactions during meeting

**Available Emojis:**
```javascript
['👍', '❤️', '😂', '😮', '😢', '👏']
```

**Layout:**
```
ReactionPanelContainer (grid: 4 columns)
├─ EmojiButton (👍)
├─ EmojiButton (❤️)
├─ EmojiButton (😂)
├─ EmojiButton (😮)
├─ EmojiButton (😢)
└─ EmojiButton (👏)
```

**On Selection:**
```javascript
onClick={() => onSelect(emoji)}
  ↓
onSendReaction(emoji)
  ↓
Add to reactions array
  ↓
Display floating emoji for 5 seconds
```

---

### 8. Reactions.jsx

**Purpose:** Display floating emoji reactions that fade out

**Props:**
```javascript
{
  reactions: Array<{
    id: string,
    emoji: string,
    timestamp: Date
  }>
}
```

**Auto-Fade Logic:**
```javascript
useEffect(() => {
  setVisibleReactions(reactions);
  const timer = setTimeout(() => {
    setVisibleReactions([]);  // Clear after 5 seconds
  }, 5000);
  return () => clearTimeout(timer);
}, [reactions]);
```

**Visual:**
```
reactions-container (floating position)
├─ reaction-emoji (👍)
├─ reaction-emoji (❤️)
└─ reaction-emoji (😂)
   [Auto-fades after 5 seconds]
```

---

### 9. WebRTCManager (e2ee/webrtc.js)

**Purpose:** Handles all WebRTC peer connections and signaling

**Key Methods:**

**Constructor:**
```javascript
constructor(roomId, localStream, onRemoteStream, onPeerLeft) {
  this.roomId = roomId;
  this.localStream = localStream;
  this.onRemoteStream = onRemoteStream;  // Callback when remote stream arrives
  this.onPeerLeft = onPeerLeft;  // Callback when peer disconnects
  this.peerConnections = {};  // Map of peerId → RTCPeerConnection
  this.clientId = uuidv4();
  
  // WebSocket for signaling
  this.ws = new WebSocket(`ws://localhost:8000/api/ws/${roomId}/${this.clientId}`);
  this.ws.onmessage = this.handleWebSocketMessage.bind(this);
}
```

**Message Types:**

| Message Type | Payload | Purpose |
|--------------|---------|---------|
| `existing-peers` | `{ peerIds: [] }` | New user gets list of existing peers |
| `new-peer` | `{ peerId: string }` | Notify of new participant |
| `peer-left` | `{ peerId: string }` | Notify of participant leaving |
| `webrtc_offer` | `{ from: string, data: RTCSessionDescription }` | SDP offer for new peer connection |
| `webrtc_answer` | `{ from: string, data: RTCSessionDescription }` | SDP answer response |
| `webrtc_ice_candidate` | `{ from: string, data: RTCIceCandidate }` | ICE candidate for NAT traversal |

**Peer Connection Flow:**

```
1. New peer joins room
   ↓
2. Server sends "existing-peers" with all current peer IDs
   ↓
3. New peer calls call(peerId) for each existing peer
   ↓
4. createPeerConnection(peerId) creates RTCPeerConnection
   ↓
5. pc.createOffer() → send via WebSocket
   ↓
6. Remote peer receives offer → createAnswer() → send back
   ↓
7. Both peers exchange ICE candidates
   ↓
8. pc.ontrack fires with remote stream
   ↓
9. onRemoteStream callback receives stream
```

**Key ICE Configuration:**
```javascript
const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
};
```

**Code Snippet - Create Peer Connection:**
```javascript
async createPeerConnection(remoteClientId) {
  const pc = new RTCPeerConnection(ICE_SERVERS);
  
  // Add all local tracks to connection
  this.localStream.getTracks().forEach(track => {
    pc.addTrack(track, this.localStream);
  });
  
  // Send ICE candidates as they're generated
  pc.onicecandidate = (event) => {
    if (event.candidate) {
      this.sendWebSocketMessage('webrtc_ice_candidate', remoteClientId, event.candidate);
    }
  };
  
  // Handle incoming remote stream
  pc.ontrack = (event) => {
    this.onRemoteStream(remoteClientId, event.streams[0]);
  };
  
  // Store connection
  this.peerConnections[remoteClientId] = pc;
  return pc;
}
```

---

### 10. Chat.jsx - Detailed Implementation

**Complete Message Structure:**
```javascript
{
  id: "uuid",
  sender: "John Doe",
  senderId: "user-uuid",
  text: "Hello everyone!",
  timestamp: Date.now(),
  edited: false,
  reactions: {}
}
```

**Context Menu Actions:**
```javascript
const contextMenuOptions = [
  { label: 'Rewrite as professional', style: 'professional' },
  { label: 'Rewrite as casual', style: 'casual' },
  { label: 'Rewrite as friendly', style: 'friendly' },
  { label: 'Fix grammar', style: 'grammar' },
  { label: 'Shorten', style: 'shorten' },
  { label: 'Expand', style: 'expand' }
];

// On selection:
const rewrittenText = await rewriteText(messageText, selectedStyle);
// User can then edit and resend
```

**Sending Message Flow:**
```javascript
<form onSubmit={(e) => {
  e.preventDefault();
  
  // 1. Create message object
  const newMessage = {
    id: uuid(),
    sender: currentUser.name,
    senderId: currentUser.id,
    text: messageText,
    timestamp: Date.now()
  };
  
  // 2. Add to local state (optimistic update)
  setMessages([...messages, newMessage]);
  
  // 3. Send via WebSocket or API
  roomService.sendMessage(roomId, newMessage);
  
  // 4. Clear input
  setMessageText('');
}>
```

---

## Data Flow

### WebRTC Connection Flow

```
User Joins Room (RoomPage mounted)
  ↓
getUserMedia() → local stream
  ↓
new WebRTCManager(roomId, localStream, callbacks)
  ↓
WebSocket connects to ws://localhost:8000/api/ws/{roomId}/{clientId}
  ↓
Server sends "existing-peers" message
  ↓
For each existing peer:
  - createPeerConnection()
  - createOffer() & send
  ↓
Receive "webrtc_offer" from other peer
  ↓
createAnswer() & send back
  ↓
Exchange ICE candidates
  ↓
pc.ontrack fires
  ↓
onRemoteStream(peerId, stream) updates remoteStreams state
  ↓
RoomVideoGrid re-renders with new participant
```

### Message Flow

```
User types in Chat input
  ↓
Form submits
  ↓
Message added to local state (optimistic update)
  ↓
Sent via WebSocket: { type: 'message', roomId, message }
  ↓
Server broadcasts to all room participants
  ↓
Other users receive message via WebSocket
  ↓
All Chat components receive same message & display
```

### Poll Flow

```
Host creates poll (question + options)
  ↓
Poll added to polls array
  ↓
Sent to all participants via WebSocket
  ↓
Participants see poll in Polls tab
  ↓
Click option to vote
  ↓
Vote sent to server: { type: 'vote', pollId, option }
  ↓
Server increments vote count
  ↓
Updated poll broadcast to all
  ↓
All UIs update with new results
```

---

## Key Services

### callService.js
- `joinCall(roomId)` - Join a video call
- `leaveCall()` - Leave and cleanup
- `toggleMute()` - Toggle audio
- `toggleScreenShare()` - Start/stop screen sharing
- `onLocalStream` - Callback when local stream ready
- `onParticipantsChanged` - Callback on participant list change

### roomService.js
- `getRooms()` - Fetch list of rooms
- `createRoom(name)` - Create new room
- `sendMessage(roomId, message)` - Send chat message
- `getMessages(roomId)` - Fetch message history
- `createPoll(roomId, poll)` - Create poll
- `votePoll(roomId, pollId, option)` - Vote on poll

### aiService.js
- `rewriteText(text, style)` - Rewrite text using AI
  - Styles: 'professional', 'casual', 'friendly', 'grammar', 'shorten', 'expand'

---

## Styling & Theme

All components use `styled-components` with theme tokens:

```javascript
const theme = {
  palette: {
    dark: '#1a1a1a',
    primary: '#2a2a2a',
    secondary: '#3a3a3a',
    accent: '#0066ff',
    highlight: '#4a4a4a'
  },
  text: {
    primary: '#ffffff',
    secondary: '#cccccc'
  }
};
```

---

## Error Handling & Edge Cases

### WebRTC Connection Failures
```javascript
try {
  const stream = await navigator.mediaDevices.getUserMedia({ 
    video: true, 
    audio: true 
  });
} catch (error) {
  // Handle permission denied, device not found, etc.
  console.error("Error initializing WebRTC manager:", error);
  // Show user-friendly error message
}
```

### Peer Disconnection
```javascript
// Handles graceful cleanup
handlePeerLeft(peerId) {
  this.closePeerConnection(peerId);
  this.onPeerLeft(peerId);
}

// UI updates via callback
(clientId) => setRemoteStreams(prev => {
  const newState = { ...prev };
  delete newState[clientId];
  return newState;
})
```

### Message Sending
- Optimistic updates (show message immediately)
- Fallback to server response for confirmation
- Retry mechanism for failed sends

---

## Performance Optimizations

1. **Video Grid** - Responsive layout prevents layout thrashing
2. **Reactions** - Auto-fade after 5s to prevent memory leaks
3. **Message List** - Scroll container with `overflow-y: auto`
4. **Document Collaboration** - Independent scrolling with `SidebarContent`
5. **MediaStream Cleanup** - All tracks stopped on unmount
6. **WebRTC ICE Candidates** - Only sent when new candidate available

---

## Future Enhancements

- [ ] Recording support
- [ ] Advanced speaker detection with highlight
- [ ] Virtual backgrounds (currently stub)
- [ ] Hand raise feature
- [ ] Breakout rooms
- [ ] Live transcription
- [ ] Advanced moderation tools
- [ ] Analytics/engagement tracking
- [ ] Integration with calendar
