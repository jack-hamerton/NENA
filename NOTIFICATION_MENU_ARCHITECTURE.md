# NENA Notification Menu - Architecture & Diagrams

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│                        FRONTEND (React / Browser)                          │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                       MainLayout                                     │  │
│  │                         │                                           │  │
│  │                    FloatingNav                                      │  │
│  │                    (Right Sidebar)                                  │  │
│  │                         │                                           │  │
│  │                 NotificationBar                                     │  │
│  │              (Dropdown Menu UI)                                     │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                         │                                                   │
│                         │ Uses                                              │
│                         ▼                                                   │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │         NotificationContext (State Management)                       │  │
│  │                                                                      │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐  │  │
│  │  │              │  │              │  │                          │  │  │
│  │  │ Fetch API    │  │ WebSocket    │  │ Snackbar Integration    │  │  │
│  │  │              │  │              │  │                          │  │  │
│  │  │ GET /notif   │  │ Connect &    │  │ - event_invitation      │  │  │
│  │  │              │  │ Listen       │  │ - event_reminder        │  │  │
│  │  │ Provides:    │  │              │  │ - other types           │  │  │
│  │  │ - markAsRead │  │ Provides:    │  │                          │  │  │
│  │  │ - clearRead  │  │ - Real-time  │  │ Actions:                │  │  │
│  │  │              │  │   updates    │  │ - Accept button         │  │  │
│  │  │              │  │              │  │ - View button           │  │  │
│  │  │              │  │              │  │                          │  │  │
│  │  └──────────────┘  └──────────────┘  └──────────────────────────┘  │  │
│  │                                                                      │  │
│  │  State: notifications = [                                           │  │
│  │           {id, user_id, type, payload, read},                       │  │
│  │           ...                                                       │  │
│  │         ]                                                           │  │
│  │                                                                      │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                   │
                      REST API & WebSocket
                                   │
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│                       BACKEND (FastAPI / Python)                          │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                      API Endpoints                                   │  │
│  │                                                                      │  │
│  │  GET /notifications                                                 │  │
│  │  └─ Returns all notifications for current user                      │  │
│  │                                                                      │  │
│  │  POST /notifications/{id}/read                                      │  │
│  │  └─ Marks notification as read                                      │  │
│  │                                                                      │  │
│  │  DELETE /notifications/read                                         │  │
│  │  └─ Clears all read notifications                                   │  │
│  │                                                                      │  │
│  │  WebSocket /notifications/ws/{user_id}                              │  │
│  │  └─ Real-time connection for pushing notifications                  │  │
│  │                                                                      │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                   │                                         │
│                            Depends on                                       │
│                                   ▼                                         │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │            NotificationService (Business Logic)                      │  │
│  │                                                                      │  │
│  │  ┌─ create_notification()                                           │  │
│  │  ├─ get_notifications_for_user()                                    │  │
│  │  ├─ mark_notification_as_read()                                     │  │
│  │  ├─ mark_as_read() [with user verification]                         │  │
│  │  └─ clear_read()                                                    │  │
│  │                                                                      │  │
│  │  + ConnectionManager (WebSocket)                                    │  │
│  │    ├─ connect(user_id, websocket)                                   │  │
│  │    ├─ disconnect(user_id)                                           │  │
│  │    └─ send_personal_message(message, user_id)                       │  │
│  │                                                                      │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                   │                                         │
│                         Database Access                                    │
│                                   ▼                                         │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │              Notification Model (SQLAlchemy)                         │  │
│  │                                                                      │  │
│  │  Table: notifications                                               │  │
│  │  ├─ id (UUID, PK)                                                   │  │
│  │  ├─ user_id (UUID, FK → users)                                      │  │
│  │  ├─ type (String)                                                   │  │
│  │  ├─ payload (JSON)                                                  │  │
│  │  ├─ read (Boolean, default=False)                                   │  │
│  │  └─ created_at (Timestamp, auto)                                    │  │
│  │                                                                      │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                   │                                         │
│                                   ▼                                         │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │              PostgreSQL Database                                     │  │
│  │                                                                      │  │
│  │  notifications table                                                │  │
│  │  - Partitioned by user_id (optional)                                │  │
│  │  - Indexes: user_id, read status                                    │  │
│  │  - Relationships: user_id FK to users table                          │  │
│  │                                                                      │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Component Interaction Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 1. APP INITIALIZATION                                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  MainLayout                                                                │
│     ↓                                                                      │
│  NotificationProvider wraps app                                           │
│     ↓                                                                      │
│  NotificationContext useEffect fires                                       │
│     ├─ api.get("/notifications") → Fetch existing                         │
│     └─ WebSocket("/notifications/ws/{user_id}") → Connect                 │
│        │                                                                   │
│        └─ ws.onmessage → Listen for new notifications                     │
│           (updates notifications array whenever new msg arrives)          │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 2. USER CLICKS NOTIFICATION BELL                                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  User clicks "Notifications" text                                          │
│     ↓                                                                      │
│  NotificationBar.handleOpen(event)                                         │
│     ├─ setAnchorEl(event.currentTarget)  → Opens menu                     │
│     └─ notifications.forEach(n => markAsRead())                            │
│        │                                                                   │
│        └─ api.post("/notifications/{id}/read")                            │
│           │  Backend marks as read in database                            │
│           └─ Local state updates: read = true                             │
│              (all unread moved to read section)                           │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 3. MENU RENDERS NOTIFICATIONS                                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  NotificationBar renders (open = true)                                     │
│     ├─ Header: "Notifications"                                             │
│     │                                                                      │
│     ├─ Filter: unreadNotifications = notifications.filter(n => !n.read)   │
│     │  └─ If unreadNotifications.length > 0:                              │
│     │     ├─ Display "Unread" subheader                                   │
│     │     └─ Display unreadNotifications as MenuItem[]                    │
│     │                                                                      │
│     ├─ Filter: readNotifications = notifications.filter(n => n.read)      │
│     │  └─ If readNotifications.length > 0:                                │
│     │     ├─ Display "Read" subheader                                     │
│     │     ├─ Display readNotifications as MenuItem[]                      │
│     │     └─ Display "Clear Read" button                                  │
│     │                                                                      │
│     └─ Else (no notifications):                                           │
│        └─ Display "No new notifications"                                  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 4. USER CLEARS READ NOTIFICATIONS                                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  User clicks "Clear Read" button                                           │
│     ↓                                                                      │
│  clearReadNotifications() called                                           │
│     ├─ api.delete("/notifications/read")                                  │
│     │  Backend deletes all notifications where read=true                  │
│     └─ setNotifications(prev => prev.filter(n => !n.read))                │
│        (Remove from frontend state)                                        │
│           ↓                                                                │
│        Menu updates (shows empty state or remaining unread)               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 5. NEW NOTIFICATION ARRIVES VIA WEBSOCKET                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Backend event triggered (e.g., event invitation)                          │
│     ├─ Create Notification in database                                    │
│     └─ await manager.send_personal_message(message, user_id)              │
│        Backend pushes to all connected WebSocket clients for that user     │
│           ↓                                                                │
│        Client receives ws.onmessage event                                  │
│           ├─ Parse JSON notification                                       │
│           ├─ Add to notifications array                                    │
│           └─ If important type:                                            │
│              └─ enqueueSnackbar() shows alert                              │
│                 (e.g., "You are invited to Team Meeting" with Accept btn) │
│                 ↓                                                          │
│                 User can:                                                  │
│                 ├─ Click Accept button (handles action)                   │
│                 ├─ Click View button (navigate)                           │
│                 └─ Dismiss                                                │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## WebSocket Connection Lifecycle

```
┌─────────────────────────────────────────────────────────────┐
│ WEBSOCKET CONNECTION LIFECYCLE                              │
└─────────────────────────────────────────────────────────────┘

PHASE 1: INITIATION
┌──────────────────────────────────────────────────────────────┐
│ Frontend:                                                    │
│ const ws = new WebSocket(                                    │
│   `ws://localhost:8000/notifications/ws/${user.id}`         │
│ );                                                           │
│                                                              │
│ Backend receives connection request:                         │
│ @router.websocket("/ws/{user_id}")                          │
│ async def websocket_endpoint(websocket, user_id):           │
│   await manager.connect(user_id, websocket)                 │
│   ├─ await websocket.accept()                              │
│   └─ self.active_connections[user_id] = websocket           │
│                                                              │
│ Result: Connection established & connection stored in       │
│ active_connections dict                                     │
└──────────────────────────────────────────────────────────────┘
                           ↓
PHASE 2: LISTENING
┌──────────────────────────────────────────────────────────────┐
│ Backend:                                                     │
│ try:                                                         │
│   while True:                                                │
│     data = await websocket.receive_text()                   │
│     # Currently just waits, doesn't process                 │
│ except WebSocketDisconnect:                                 │
│   manager.disconnect(user_id)                              │
│   └─ del self.active_connections[user_id]                 │
│                                                              │
│ Result: Connection remains open, waiting for events         │
└──────────────────────────────────────────────────────────────┘
                           ↓
PHASE 3: SENDING (When notification triggered)
┌──────────────────────────────────────────────────────────────┐
│ Backend (any endpoint/service):                             │
│                                                              │
│ await manager.send_personal_message(                         │
│   json.dumps(notification_dict),                            │
│   user_id                                                   │
│ )                                                            │
│                                                              │
│ ConnectionManager:                                          │
│ async def send_personal_message(message, user_id):          │
│   if user_id in self.active_connections:                    │
│     await self.active_connections[user_id]                  │
│       .send_text(message)                                   │
│                                                              │
│ Result: Message sent through WebSocket to client            │
└──────────────────────────────────────────────────────────────┘
                           ↓
PHASE 4: RECEIVING (Frontend)
┌──────────────────────────────────────────────────────────────┐
│ Frontend:                                                    │
│ ws.onmessage = (event) => {                                 │
│   const notificationData = JSON.parse(event.data);          │
│   const newNotification = {                                 │
│     ...notificationData,                                    │
│     id: new Date().getTime(),                               │
│     read: false                                             │
│   };                                                         │
│   setNotifications(prev => [...prev, newNotification]);     │
│ };                                                           │
│                                                              │
│ Result: Notification added to React state, re-renders       │
└──────────────────────────────────────────────────────────────┘
                           ↓
PHASE 5: CLEANUP (On disconnect)
┌──────────────────────────────────────────────────────────────┐
│ Frontend (useEffect cleanup):                               │
│ return () => {                                              │
│   ws.close();  // Close WebSocket                           │
│ };                                                           │
│                                                              │
│ Backend:                                                     │
│ except WebSocketDisconnect:                                 │
│   manager.disconnect(user_id)                              │
│   └─ Remove from active_connections                        │
│                                                              │
│ Result: Connection closed, resources cleaned up             │
└──────────────────────────────────────────────────────────────┘
```

---

## Data Flow Diagrams

### Flow 1: Creating a Notification (Backend → Frontend)

```
Backend Service/Endpoint
│
├─ Detect event (e.g., event invitation)
│  └─ Get affected user_id
│
├─ Create Notification object:
│  NotificationCreate(
│    user_id=user_id,
│    type="event_invitation",
│    payload={
│      "message": "You are invited to Team Meeting",
│      "event": {event_data}
│    }
│  )
│
├─ Save to database:
│  NotificationService.create_notification(db, notification_in)
│  ├─ notification = Notification(**notification_in.dict())
│  ├─ db.add(notification)
│  ├─ db.commit()
│  └─ db.refresh(notification)
│
├─ Send via WebSocket (if user connected):
│  await manager.send_personal_message(
│    json.dumps(notification.dict()),
│    user_id
│  )
│  ├─ Check if user_id in active_connections
│  └─ Send JSON over WebSocket
│
└─ [Notification persisted + delivered]
```

### Flow 2: Marking as Read

```
Frontend (NotificationBar)
│
├─ User clicks notification bell
│
├─ handleOpen() fired:
│  └─ Call markAsRead(id) for each unread notification
│
├─ markAsRead() function:
│  ├─ await api.post(`/notifications/${notificationId}/read`)
│  │  ├─ GET /notifications/{id}/read endpoint
│  │  │
│  │  Backend:
│  │  ├─ Get current user from auth
│  │  ├─ Find notification where:
│  │  │  - id == notification_id
│  │  │  - user_id == current_user.id
│  │  ├─ Set read = true
│  │  └─ Commit to database
│  │
│  └─ Update local state:
│     setNotifications(prev =>
│       prev.map(n => 
│         n.id === notificationId 
│           ? {...n, read: true}
│           : n
│       )
│     )
│
└─ [Notification marked as read in DB + UI]
```

### Flow 3: Clearing Read Notifications

```
Frontend (NotificationBar)
│
├─ User clicks "Clear Read" button
│
├─ clearReadNotifications() function:
│  ├─ await api.delete("/notifications/read")
│  │  ├─ DELETE /notifications/read endpoint
│  │  │
│  │  Backend:
│  │  ├─ Get current user
│  │  ├─ Delete from notifications table where:
│  │  │  - user_id == current_user.id
│  │  │  - read == true
│  │  └─ Commit deletion
│  │
│  └─ Update local state:
│     setNotifications(prev =>
│       prev.filter(n => !n.read)
│     )
│
└─ [All read notifications deleted from DB + UI]
```

---

## State Management Pattern

```
NotificationContext State:
┌─────────────────────────────────────────┐
│ notifications: Notification[] = [       │
│   {                                     │
│     id: uuid,                          │
│     user_id: uuid,                     │
│     type: string,                      │
│     payload: object,                   │
│     read: boolean                      │
│   },                                    │
│   ...                                   │
│ ]                                       │
└─────────────────────────────────────────┘

State Transitions:
┌──────────────────────┐
│  New notification    │
│  arrives via WS      │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────────────┐
│ setNotifications([           │
│   ...prev,                   │
│   newNotification            │ ◄─ Append new
│ ])                           │
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────────┐
│ notification: read = false       │
│ (appears in Unread section)      │
└──────────┬───────────────────────┘
           │
      (user opens menu OR API call)
           │
           ▼
┌──────────────────────────────────┐
│ markAsRead(id)                   │
│ └─ POST /notifications/{id}/read │
└──────────┬───────────────────────┘
           │
           ▼
┌──────────────────────────────────┐
│ setNotifications([               │
│   ...prev.map(n =>               │
│     n.id === id                  │
│       ? {...n, read: true}       │ ◄─ Toggle read
│       : n                        │
│   )                              │
│ ])                               │
└──────────┬───────────────────────┘
           │
           ▼
┌──────────────────────────────────┐
│ notification: read = true        │
│ (moves to Read section)          │
└──────────┬───────────────────────┘
           │
      (user clicks Clear Read)
           │
           ▼
┌──────────────────────────────────────┐
│ clearReadNotifications()              │
│ └─ DELETE /notifications/read        │
└──────────┬───────────────────────────┘
           │
           ▼
┌──────────────────────────────────┐
│ setNotifications([               │
│   ...prev.filter(n => !n.read)   │ ◄─ Remove read
│ ])                               │
└──────────┬───────────────────────┘
           │
           ▼
┌──────────────────────────────────┐
│ notification: DELETED            │
│ (removed from state and DB)      │
└──────────────────────────────────┘
```

---

## Database Schema Visualization

```
PostgreSQL: notifications table

Column Name    │ Type           │ Nullable │ Default  │ Index
───────────────┼────────────────┼──────────┼──────────┼──────────
id             │ UUID           │ NO       │ gen_uuid │ PK
user_id        │ UUID           │ NO       │          │ FK, IDX
type           │ VARCHAR(255)   │ YES      │          │
payload        │ JSONB          │ YES      │          │
read           │ BOOLEAN        │ NO       │ false    │ IDX
created_at     │ TIMESTAMP      │ NO       │ now()    │

Relationships:
user_id ──FK──> users.id

Indexes:
- PRIMARY KEY: id
- FOREIGN KEY: user_id → users.id
- INDEX: user_id (for quick lookup by user)
- INDEX: read (for filtering read/unread)
- COMPOSITE: (user_id, read) - optimal for filtering user's unread
```

---

## Authentication & Authorization Flow

```
┌─────────────────────────────────────────────────────────────┐
│ AUTHENTICATION & AUTHORIZATION                              │
└─────────────────────────────────────────────────────────────┘

1. INITIAL SETUP
   ├─ User logs in → Auth token created
   └─ Token stored in localStorage/sessionStorage

2. API REQUESTS
   Frontend:
   ├─ GET /notifications
   │  ├─ Include Authorization header with token
   │  └─ get_current_user dependency validates token
   │
   Backend:
   ├─ @router.get("")
   │  └─ current_user: User = Depends(get_current_user)
   │     └─ Extracts user from token
   │
   ├─ return NotificationService.get_notifications_for_user(
   │        db, current_user.id
   │    )
   └─ Only returns notifications for current_user.id

3. WEBSOCKET CONNECTION
   Frontend:
   ├─ ws = new WebSocket(`/notifications/ws/${user.id}`)
   │  └─ Include token in URL or headers
   │
   Backend:
   ├─ @router.websocket("/ws/{user_id}")
   │  ├─ Validate user_id matches authenticated user
   │  └─ Connection established only if valid
   │
   └─ ConnectionManager maintains connection

4. SECURITY MEASURES
   ├─ User ID verification on all operations
   ├─ mark_as_read() checks both notification_id AND user_id
   ├─ clear_read() only deletes current user's notifications
   └─ WebSocket requires authentication before accepting
```

---

## Summary

The notification system uses:
- ✅ React Context for frontend state management
- ✅ WebSocket for real-time push notifications
- ✅ REST API for CRUD operations
- ✅ PostgreSQL for persistent storage
- ✅ FastAPI for backend routing
- ✅ Material-UI components for UI
- ✅ Styled Components for theming
- ✅ Authentication/Authorization throughout

All components work together to provide a seamless, real-time notification experience!

