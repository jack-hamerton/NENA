# Room Page - Architecture & Technical Details

## System Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React)                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  RoomPage Component (Main Container)                     │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │                                                          │  │
│  │  LEFT: MainContent                RIGHT: Sidebar        │  │
│  │  ┌──────────────┐                ┌──────────────────┐  │  │
│  │  │ VideoContainer              │ TabContainer     │  │  │
│  │  │ ┌───────────┐              │ ├─ Chat         │  │  │
│  │  │ │ Grid      │              │ ├─ Polls        │  │  │
│  │  │ │ Videos    │              │ └─ Collaborate  │  │  │
│  │  │ └───────────┘              │                 │  │  │
│  │  │ ┌───────────┐              │ SidebarContent  │  │  │
│  │  │ │ Reactions │              │ ├─ Chat Box     │  │  │
│  │  │ │ (floating)│              │ ├─ Polls        │  │  │
│  │  │ └───────────┘              │ └─ Document     │  │  │
│  │  └──────────────┘              └──────────────────┘  │  │
│  │  ┌──────────────┐                                     │  │
│  │  │ ControlsBar  │ (Audio/Video/Screen/Leave)        │  │
│  │  └──────────────┘                                     │  │
│  │  ┌──────────────┐                                     │  │
│  │  │ HostControls │ (if isHost) (Mute/Lock/etc)       │  │
│  │  └──────────────┘                                     │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────────┘
                          │
                          │ WebRTC & WebSocket
                          ↓
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND SERVICES                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  WebSocket Server                   API Server                  │
│  (ws://localhost:8000)              (REST endpoints)            │
│  ├─ Signaling                       ├─ Room management          │
│  │  ├─ Offer/Answer                 ├─ Message persistence      │
│  │  ├─ ICE candidates               ├─ Poll management          │
│  │  └─ Peer list                    └─ User management          │
│  │                                                              │
│  └─ Message Relay                                              │
│     ├─ Chat messages                                           │
│     ├─ Polls                                                   │
│     └─ Reactions                                               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                          │
                          │ (Optional)
                          ↓
                    Database (Persistence)
```

---

## Component Hierarchy

```
RoomPage
├── <ThemeProvider>
│   └── RoomContainer
│       ├── MainContent
│       │   ├── VideoContainer
│       │   │   ├── RoomVideoGrid
│       │   │   │   └── ParticipantContainer (×N participants)
│       │   │   │       ├── Video (ref)
│       │   │   │       └── UserIdLabel
│       │   │   └── Reactions
│       │   │       └── reaction-emoji (×N)
│       │   ├── ControlsBar
│       │   │   ├── ControlButton (Mute Audio)
│       │   │   ├── ControlButton (Mute Video)
│       │   │   ├── ControlButton (Virtual BG)
│       │   │   ├── ControlButton (Reactions)
│       │   │   │   └── ReactionPanel
│       │   │   │       └── EmojiButton (×6)
│       │   │   ├── ControlButton (Screen Share)
│       │   │   └── ControlButton (Leave)
│       │   └── HostControls (conditional)
│       │       ├── HostControlButton (Mute)
│       │       ├── HostControlButton (Share Screen)
│       │       ├── HostControlButton (Mute All)
│       │       ├── HostControlButton (Stop All Videos)
│       │       ├── HostControlButton (Lock Meeting)
│       │       └── HostControlButton (Waiting Room)
│       └── Sidebar
│           ├── TabContainer
│           │   ├── TabButton (Chat)
│           │   ├── TabButton (Polls)
│           │   └── TabButton (Collaborate)
│           └── SidebarContent
│               ├── Chat (conditional)
│               │   ├── MessageList
│               │   │   └── Message (×N)
│               │   │       ├── MessageSender
│               │   │       └── MessageText
│               │   └── ChatInputContainer
│               │       ├── ChatInput (input)
│               │       ├── AiAssistButton
│               │       └── SendButton
│               ├── Polls (conditional)
│               │   ├── PollContainer (×N)
│               │   │   ├── PollQuestion
│               │   │   ├── PollOption (×N)
│               │   │   │   └── VoteButton
│               │   │   └── PollStats
│               │   └── CreatePollForm
│               │       ├── CreatePollInput
│               │       └── CreatePollButton
│               └── Document (conditional)
│                   └── Editor
```

---

## State Flow Diagram

```
┌─────────────────────────────────────────────┐
│         RoomPage State                      │
├─────────────────────────────────────────────┤
│ • sidebarTab: 'chat' | 'polls' | 'collaborate'
│ • reactions: Reaction[]
│ • localStream: MediaStream | null
│ • remoteStreams: { [peerId]: MediaStream }
│ • isHost: boolean
│ • webRTCManager: WebRTCManager (ref)
└─────────────────────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
        ↓            ↓            ↓
    ┌───────┐   ┌──────┐   ┌──────────┐
    │ Chat  │   │Polls │   │ControBar │
    └───────┘   └──────┘   └──────────┘
        │            │            │
        ├─messages   ├─polls      ├─isAudioMuted
        │            ├─options    ├─isVideoMuted
        ├─input      │            ├─showBG
        │            └─votes      └─showReactions
        └─sender
```

---

## Event Flow Diagram

### User Joins Room
```
User navigates to /room/:roomId
        ↓
    useEffect
        ↓
    getUserMedia({ video, audio })
        ↓
    WebRTCManager created
        ↓
    WebSocket connects to ws://localhost:8000/api/ws/{roomId}/{clientId}
        ↓
    Server sends { type: 'existing-peers', peerIds: [...] }
        ↓
    For each peerId, call webRTCManager.call(peerId)
        ↓
    createPeerConnection(peerId)
        ↓
    pc.createOffer()
        ↓
    Send { type: 'webrtc_offer', to: peerId, data: offer }
        ↓
    Other peers receive offer
        ↓
    Other peers create answer
        ↓
    Send { type: 'webrtc_answer', to: clientId, data: answer }
        ↓
    Exchange ICE candidates
        ↓
    pc.ontrack fires with remote stream
        ↓
    onRemoteStream(peerId, stream) callback
        ↓
    setRemoteStreams(prev => ({ ...prev, [peerId]: stream }))
        ↓
    RoomVideoGrid re-renders
        ↓
    Remote participant video displays
```

### User Sends Chat Message
```
User types message and clicks Send
        ↓
    Form submits
        ↓
    Create message object:
    {
      id: uuid(),
      sender: currentUser.name,
      text: messageText,
      timestamp: Date.now()
    }
        ↓
    setMessages([...messages, newMessage])  // Optimistic
        ↓
    roomService.sendMessage(roomId, newMessage)
        ↓
    WebSocket sends message to server
        ↓
    Server broadcasts to all clients:
    { type: 'message', roomId, message }
        ↓
    All Chat components receive onmessage
        ↓
    setMessages(prev => [...prev, newMessage])
        ↓
    MessageList re-renders
        ↓
    All users see message
```

### Host Mutes All Participants
```
Host clicks "Mute All" button
        ↓
    callService.muteAll()
        ↓
    Server receives request
        ↓
    Server sends { type: 'mute_all' } to all clients
        ↓
    All clients receive mute_all command
        ↓
    All localStream audio tracks disabled
        ↓
    isAudioMuted = true for all
        ↓
    ControlsBar updates UI (shows unmute button)
        ↓
    All muted status reflected in UI
```

---

## WebRTC Peer Connection Details

### RTCPeerConnection Lifecycle

```
1. Create Connection
   ├─ new RTCPeerConnection(iceServers)
   ├─ addTrack(track, stream) for all local tracks
   └─ Set event handlers

2. Signal
   ├─ createOffer() [initiator]
   ├─ setLocalDescription(offer)
   ├─ Send offer via WebSocket
   │
   ├─ Receive offer [receiver]
   ├─ setRemoteDescription(offer)
   ├─ createAnswer()
   ├─ setLocalDescription(answer)
   ├─ Send answer via WebSocket
   │
   └─ Receive answer [initiator]
      └─ setRemoteDescription(answer)

3. ICE Candidates
   ├─ pc.onicecandidate fires
   ├─ Send candidate via WebSocket
   ├─ Receive candidate from peer
   ├─ pc.addIceCandidate(candidate)
   └─ Repeat until connected

4. Connected
   ├─ pc.ontrack fires when remote stream arrives
   ├─ Callback: onRemoteStream(peerId, stream)
   ├─ Update React state with remoteStreams
   └─ Video displays in grid

5. Disconnect
   ├─ Peer leaves room
   ├─ Server sends { type: 'peer-left', peerId }
   ├─ handlePeerLeft(peerId) called
   ├─ pc.close() for that peer
   ├─ Remove from remoteStreams state
   └─ Video disappears from grid
```

---

## ICE Candidate Exchange

```
Client A                        Server                        Client B
│                                │                                │
├─ onicecandidate ─────────────→ Server ─────────────────────────→│
│   { type: 'ice_candidate',    │ (relays to B)                   │ addIceCandidate()
│     from: A,                   │                                │
│     data: RTCIceCandidate }    │                                │
│                                │                                │
│ ← ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ Server ← ─ ─ ─ ─ onicecandidate │
│ addIceCandidate()              │ (relays to A)                   │
│ { type: 'ice_candidate',       │                                │
│   from: B,                     │                                │
│   data: RTCIceCandidate }      │                                │
│                                │                                │
└─ (Repeat until all candidates gathered and connection established)
```

---

## Message Flow Architecture

### Chat Messages
```
┌─ Message Component ────────────────────┐
│ Right-click                            │
│ ↓                                      │
│ Context Menu appears                  │
│ ├─ "Rewrite as professional"          │
│ ├─ "Rewrite as casual"                │
│ ├─ "Rewrite as friendly"              │
│ ├─ "Fix grammar"                      │
│ ├─ "Shorten"                          │
│ └─ "Expand"                           │
│                                       │
│ Click option                          │
│ ↓                                     │
│ aiService.rewriteText(text, style)   │
│ ↓                                     │
│ AI returns rewritten text             │
│ ↓                                     │
│ Show in edit box                      │
│ ↓                                     │
│ User can edit & send as new message   │
└────────────────────────────────────────┘
```

### Chat Storage (Optimistic Update)
```
┌─────────────────────────┐
│ Send Button Click       │
├─────────────────────────┤
│ 1. Create message obj   │
│    with UUID            │
│                         │
│ 2. setMessages([...])   │ ← Shows immediately (optimistic)
│                         │
│ 3. roomService.send()   │ ← Request to server
│                         │
│ 4a. [Success]           │ ← Server confirms
│     Message persisted   │
│                         │
│ 4b. [Failure]           │ ← Retry or show error
│     Remove from UI      │
└─────────────────────────┘
```

---

## Performance Characteristics

### Memory Usage
- **Video Grid**: O(n) where n = number of participants
- **Reactions**: Auto-clear after 5s (constant small set)
- **Messages**: Potentially unbounded (should paginate)
- **Peer Connections**: O(n) WebRTC connections for n participants

### Network Usage
```
Per Participant:
├─ Audio: ~50-100 kbps
├─ Video: ~500-2500 kbps (depends on resolution)
├─ Signaling: ~1-5 kbps (offers/answers/ICE)
└─ Chat: ~1 kbps (messages)

Total per participant ≈ 550-2600 kbps
```

### Latency
```
Typical WebRTC latency: 100-300ms
├─ Network round trip: 20-50ms (x2 for RTT)
├─ Encoding: 20-50ms
├─ Transmission: 10-30ms
├─ Decoding: 20-50ms
└─ Buffering: 20-100ms
```

---

## Security Considerations

### Current Implementation
- [ ] HTTPS required for getUserMedia() in production
- [ ] WebSocket should be WSS (WebSocket Secure)
- [ ] STUN servers are Google's (no auth needed)
- [ ] No TURN servers configured (behind NAT issues)

### Recommended Additions
- [ ] JWT tokens for WebSocket authentication
- [ ] Message encryption before sending
- [ ] Room access control (invite-only)
- [ ] End-to-end encryption via sframe.js
- [ ] TURN servers for NAT traversal
- [ ] Rate limiting on message/poll creation

---

## Scaling Considerations

### Mesh Network Limitations
```
With N participants:
- Each client connects to N-1 peers
- Total connections = N*(N-1)/2
- Each connection requires resources

Practical limits:
- 2-5 participants: Excellent
- 5-10 participants: Good
- 10-20 participants: Degraded
- 20+ participants: Requires SFU/MCU
```

### Optimization Strategy
```
For large meetings, migrate to:
├─ SFU (Selective Forwarding Unit)
│  ├─ All participants send to SFU
│  ├─ SFU sends back selected streams
│  └─ Reduces bandwidth per client
│
└─ MCU (Multipoint Conferencing Unit)
   ├─ All participants send to MCU
   ├─ MCU mixes all streams
   └─ One composite stream sent back
```

---

## Debugging

### WebRTC Stats
```javascript
// Check connection stats
const stats = await pc.getStats();
stats.forEach(report => {
  if (report.type === 'inbound-rtp') {
    console.log('Bytes received:', report.bytesReceived);
    console.log('Packets lost:', report.packetsLost);
  }
  if (report.type === 'outbound-rtp') {
    console.log('Bytes sent:', report.bytesSent);
  }
});
```

### WebSocket Debugging
```javascript
ws.onopen = () => console.log('Connected');
ws.onmessage = (e) => console.log('Message:', JSON.parse(e.data));
ws.onerror = (e) => console.error('Error:', e);
ws.onclose = () => console.log('Disconnected');
```

### Console Errors to Watch
- `DOMException: NotAllowedError` - Camera/mic permission denied
- `TypeError: Failed to execute 'addTrack'` - Stream already has track
- `WebSocket is closed before the connection is established` - Server down
- `TypeError: Cannot read property 'getTracks'` - No local stream

---

## Browser Compatibility

| Browser | WebRTC Support | Status |
|---------|---|---|
| Chrome | Full | ✅ Excellent |
| Firefox | Full | ✅ Excellent |
| Safari | Partial | ⚠️ Use webkit prefixes |
| Edge | Full | ✅ Excellent |
| Opera | Full | ✅ Excellent |
| IE 11 | None | ❌ Not supported |

---

## Deployment Notes

### Required Environment Variables
```
REACT_APP_SOCKET_URL=ws://localhost:8000
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_STUN_SERVERS=["stun:stun.l.google.com:19302"]
```

### Production Checklist
- [ ] HTTPS/WSS configured
- [ ] TURN servers added
- [ ] SFU/MCU for >10 participants
- [ ] Message persistence
- [ ] User authentication
- [ ] Rate limiting
- [ ] Error logging
- [ ] Performance monitoring
