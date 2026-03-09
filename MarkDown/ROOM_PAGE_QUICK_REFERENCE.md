# Room Page - Quick Reference

## Page Structure at a Glance

```
ROOM PAGE (/room/:roomId)
│
├─ MAIN CONTENT (flex-grow: 1)
│  ├─ VIDEO CONTAINER
│  │  ├─ RoomVideoGrid (participant videos in responsive grid)
│  │  └─ Reactions (floating emojis, auto-fade)
│  ├─ CONTROLS BAR (bottom controls)
│  │  ├─ Mute/Unmute Audio 🎤
│  │  ├─ Stop/Start Video 📹
│  │  ├─ Virtual Background 🎨
│  │  ├─ Reactions 😊
│  │  ├─ Screen Share 📺
│  │  └─ Leave Room 🚪
│  └─ HOST CONTROLS (if host)
│     ├─ Mute
│     ├─ Share Screen
│     ├─ Mute All
│     ├─ Stop All Videos
│     ├─ Lock Meeting
│     └─ Waiting Room
│
└─ SIDEBAR (width: 320px)
   ├─ TAB BUTTONS
   │  ├─ Chat Tab (default)
   │  ├─ Polls Tab
   │  └─ Collaborate Tab
   └─ CONTENT AREA (scrollable)
      ├─ Chat (message list + input)
      ├─ Polls (poll list + create form)
      └─ Document (collaborative editor)
```

---

## 10 Key Facts About the Room Page

### Technical Implementation
1. **WebRTC-Based** - Uses WebRTC peer connections for direct video/audio
2. **WebSocket Signaling** - Server at ws://localhost:8000/api/ws/{roomId}/{clientId}
3. **Multi-Participant** - Peer-to-peer mesh network (each user connects to all others)
4. **ICE Servers** - Uses Google STUN servers (stun.l.google.com, stun1.l.google.com)
5. **E2E Encryption Ready** - Infrastructure for encrypted connections via sframe.js

### Features
6. **Tabbed Sidebar** - Chat, Polls, and Collaboration share one sidebar
7. **AI Chat Features** - Context menu on messages for rewriting/editing
8. **Real-Time Reactions** - Emoji reactions appear and fade after 5 seconds
9. **Host Controls** - Includes mute all, stop all videos, lock meeting, waiting room
10. **Media Controls** - Individual audio/video mute, virtual backgrounds, screen share

---

## Component Interaction Map

```
RoomPage (Container)
    │
    ├─→ RoomVideoGrid
    │   └─ ParticipantContainer (for each participant)
    │      ├─ Video (srcObject = remoteStreams[peerId])
    │      └─ UserIdLabel
    │
    ├─→ Reactions
    │   └─ Auto-fades floating emojis after 5s
    │
    ├─→ ControlsBar
    │   ├─ Toggles: audio/video muted state
    │   ├─ Modifies: localStream tracks enabled/disabled
    │   ├─ Shows: ReactionPanel on emoji button
    │   └─ Calls: onSendReaction, onLeave
    │
    ├─→ HostControls (conditional)
    │   ├─ Calls: callService.toggleMute()
    │   └─ Calls: callService.toggleScreenShare()
    │
    └─→ Sidebar
        ├─→ Chat (if sidebarTab === 'chat')
        │   ├─ MessageList (scrollable)
        │   ├─ Message (with AI context menu)
        │   ├─ ChatInput + AiAssistButton
        │   └─ SendButton
        │
        ├─→ Polls (if sidebarTab === 'polls')
        │   ├─ PollContainer (for each poll)
        │   ├─ PollQuestion + PollOptions
        │   ├─ VoteButton (click to vote)
        │   └─ CreatePollForm
        │
        └─→ Document (if sidebarTab === 'collaborate')
            ├─ Editor area
            └─ Participant cursors/edits
```

---

## Data Structures

### RemoteStreams Map
```javascript
{
  "peer-uuid-1": MediaStream {},
  "peer-uuid-2": MediaStream {},
  "peer-uuid-3": MediaStream {}
}
```

### Message Object
```javascript
{
  id: "uuid",
  sender: "John Doe",
  senderId: "user-uuid",
  text: "Hello everyone!",
  timestamp: Date.now(),
  edited: false
}
```

### Poll Object
```javascript
{
  id: "poll-uuid",
  question: "What's your favorite programming language?",
  options: [
    { text: "JavaScript", votes: 5 },
    { text: "Python", votes: 8 },
    { text: "Rust", votes: 3 }
  ],
  createdBy: "host-uuid",
  createdAt: Date.now()
}
```

### Reaction Object
```javascript
{
  id: "reaction-uuid",
  emoji: "👍",
  timestamp: Date.now()
}
```

---

## WebRTC Flow Summary

```
1. User joins → getUserMedia()
2. WebRTCManager created → WebSocket connect
3. Server sends existing peer list
4. For each peer:
   - createPeerConnection()
   - createOffer() → send via WebSocket
5. Receive webrtc_offer from peer
   - createAnswer() → send back
6. Exchange ICE candidates
7. pc.ontrack fires
8. onRemoteStream callback updates state
9. RoomVideoGrid re-renders with new video
```

---

## Key API Endpoints

### WebSocket Messages

| From | Type | To | Payload | Purpose |
|------|------|----|---------|---------| 
| Server | `existing-peers` | Client | `{ peerIds: [] }` | List current peers |
| Server | `new-peer` | Clients | `{ peerId: str }` | Announce new user |
| Server | `peer-left` | Clients | `{ peerId: str }` | Announce user left |
| Client | `webrtc_offer` | Server→Peer | `{ from, data: SDP }` | Offer peer connection |
| Client | `webrtc_answer` | Server→Peer | `{ from, data: SDP }` | Answer peer connection |
| Client | `webrtc_ice_candidate` | Server→Peer | `{ from, data: ICE }` | ICE candidate |

### Services

**callService**
- `joinCall(roomId)` → WebRTC setup
- `leaveCall()` → Cleanup
- `toggleMute()` → Audio control
- `toggleScreenShare()` → Screen sharing

**roomService**
- `sendMessage(roomId, message)` → Chat
- `createPoll(roomId, poll)` → Polling
- `votePoll(roomId, pollId, option)` → Poll vote

**aiService**
- `rewriteText(text, style)` → AI text transformation
  - Styles: professional, casual, friendly, grammar, shorten, expand

---

## State Management Pattern

```javascript
// RoomPage holds:
const [sidebarTab, setSidebarTab] = useState('chat');  // UI state
const [reactions, setReactions] = useState([]);        // Live reactions
const [localStream, setLocalStream] = useState(null);  // Local media
const [remoteStreams, setRemoteStreams] = useState({}); // All remote media

// ControlsBar holds:
const [isAudioMuted, setIsAudioMuted] = useState(false);  // Audio state
const [isVideoMuted, setIsVideoMuted] = useState(false);  // Video state

// Chat holds:
const [messages, setMessages] = useState([]);     // Chat history
const [messageText, setMessageText] = useState(''); // Current input

// Polls holds:
const [polls, setPolls] = useState([]);           // All polls
const [showCreatePoll, setShowCreatePoll] = useState(false);
```

---

## Styling Key Classes

```
ChatContainer - flex column, full height, primary bg
MessageList - flex-grow, overflow-y auto, scrollable
ChatInputContainer - flex, form at bottom
Message - margin-bottom 15px, flex column
MessageText - speech bubble style

ControlsBarContainer - flex center, padding 10px
ControlButton - margin 0 10px, transitions

ReactionPanelContainer - position absolute, grid 4 cols
EmojiButton - large font, no styling, cursor pointer

TabContainer - flex, border-bottom
TabButton - flex 1, active state changes bg color
SidebarContent - flex-grow, overflow auto
```

---

## Common Workflows

### Join a Room
```javascript
1. Navigate to /room/:roomId
2. RoomPage useEffect triggers
3. getUserMedia() asks for camera/microphone permission
4. WebRTCManager created with localStream
5. WebSocket connects to signaling server
6. Receive existing-peers message
7. Create peer connections & exchange offers
8. Remote streams start arriving
9. Video grid populates
```

### Send a Chat Message
```javascript
1. User types in ChatInput
2. User clicks SendButton
3. Message object created with id, sender, text, timestamp
4. Message added to local state (optimistic update)
5. Message sent to server via roomService.sendMessage()
6. Server broadcasts to all clients
7. All Chat components receive & display same message
```

### Use AI to Rewrite Message
```javascript
1. User right-clicks on message
2. Context menu appears with rewrite options
3. User selects "Rewrite as professional" (etc.)
4. rewriteText(text, 'professional') called
5. AI service returns rewritten text
6. Text shown to user for review
7. User can edit further or send as new message
```

### Create & Vote on Poll
```javascript
1. Host clicks "Create Poll" in Polls tab
2. Form appears for question + options
3. Host enters details and submits
4. Poll created and broadcast to all
5. Participants see poll in their Polls tab
6. Click option button to vote
7. Vote sent to server
8. All participants see updated vote counts
```

---

## Performance Tips

- **Video Grid** respects `minmax(250px, 1fr)` for responsive layout
- **Reactions** clear after 5 seconds to prevent memory buildup
- **Messages** load in scrollable container for smooth UX
- **Tracks** are stopped on component unmount
- **WebRTC ICE** candidates sent only when generated
- **Document Tab** has independent scroll context

---

## Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| No video showing | getUserMedia() denied | Check permissions, use HTTPS |
| Audio echo | Both audio going through speaker | Use headphones or mute |
| Slow peer connections | No TURN servers | Add TURN server config for NAT |
| Message lag | WebSocket disconnected | Check server at ws://localhost:8000 |
| Poll not updating | Stale state | Force re-render or refresh |
| Reactions not showing | Styles not loaded | Check Reactions.css import |

---

## Future Enhancements

- [ ] Recording (local & server-side)
- [ ] Virtual backgrounds (BodyPix/ML support)
- [ ] Hand raise feature
- [ ] Breakout rooms
- [ ] Live transcription
- [ ] Engagement analytics
- [ ] Call scheduling
- [ ] Screen annotation
- [ ] Advanced moderation (kick, mute all)
