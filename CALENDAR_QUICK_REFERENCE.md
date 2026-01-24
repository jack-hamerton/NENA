# 📅 Calendar Page - Quick Reference Card

## What is the Calendar Page?

A collaborative event scheduling system where users can:
- **Create events** with title, description, start/end times
- **Add collaborators** (multiple users to same event)
- **Auto-detect conflicts** (prevents double-booking)
- **See suggestions** (available time slots when conflicts occur)
- **View all events** (events they own + events they participate in)

---

## Quick Facts

| Aspect | Details |
|--------|---------|
| **Frontend** | React component using react-big-calendar + Material-UI |
| **Backend** | FastAPI REST API with conflict detection |
| **Database** | 2 tables: `events` + `event_participants` |
| **Key Feature** | Automatic scheduling conflict detection |
| **Status** | Fully implemented and working |

---

## Frontend Files

```
frontend/src/
├── pages/Calendar.jsx               ← Page entry point
├── components/calendar/Calendar.jsx ← Main component (100+ lines)
├── services/calendar.service.js     ← API client
├── layout/MainLayout.jsx            ← Route: /calendar
└── layout/FloatingNav.jsx           ← Nav link
```

## Frontend State
```javascript
{
  events: [],           // All user events from API
  open: false,          // Is create dialog open?
  conflict: null,       // Conflict error details
  formData: {
    title: '',          // Event name
    description: '',    // Event details
    start_time: '',     // ISO datetime (e.g., 2025-01-24T14:00)
    end_time: '',       // ISO datetime (e.g., 2025-01-24T15:00)
    collaborator_ids: '' // Comma-separated user IDs (e.g., "1,2,3")
  }
}
```

---

## Backend Files

```
backend/app/
├── models/calendar.py          ← Event, EventParticipant (models)
├── crud/calendar.py            ← CRUD operations + conflict logic
├── schemas/calendar.py         ← Pydantic schemas
└── api/endpoints/calendar.py   ← REST endpoints
```

## Database Schema

```sql
-- Events table
CREATE TABLE events (
  id UUID PRIMARY KEY,
  title VARCHAR,
  description TEXT,
  start_time TIMESTAMP,
  end_time TIMESTAMP,
  owner_id UUID FOREIGN KEY -> users.id
);

-- Participants junction table
CREATE TABLE event_participants (
  id SERIAL PRIMARY KEY,
  event_id UUID FOREIGN KEY -> events.id,
  user_id UUID FOREIGN KEY -> users.id
);
```

---

## API Endpoints

### 1. GET /api/v1/calendar/events
**Get all events for user**

```javascript
// Request
GET /api/v1/calendar/events
Authorization: Bearer {token}

// Response 200
[
  {
    id: "550e8400-e29b-41d4-a716-446655440000",
    title: "Team Meeting",
    description: "Quarterly sync",
    start_time: "2025-01-24T14:00:00",
    end_time: "2025-01-24T15:00:00",
    owner_id: "550e8400-e29b-41d4-a716-446655440001",
    collaborators: [
      { id: "550e8400-e29b-41d4-a716-446655440002", username: "alice" }
    ]
  }
]
```

### 2. POST /api/v1/calendar/
**Create event with conflict detection**

```javascript
// Request
POST /api/v1/calendar/
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Team Meeting",
  "description": "Quarterly planning",
  "start_time": "2025-01-24T14:00:00",
  "end_time": "2025-01-24T15:00:00",
  "collaborator_ids": ["550e8400-e29b-41d4-a716-446655440002"]
}

// Response 200 (Success)
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Team Meeting",
  ...
}

// Response 409 (Conflict)
{
  "message": "alice is committed at that time of the day. Kindly try these available slots",
  "available_slots": [
    { "start": "2025-01-24T10:00:00", "end": "2025-01-24T11:00:00" },
    { "start": "2025-01-24T15:00:00", "end": "2025-01-24T16:00:00" }
  ]
}
```

---

## How Conflict Detection Works

### The Algorithm

```
When user tries to create event:
  1. Get all users to check: [owner] + [collaborators]
  2. For each user:
       Check if they have event overlapping with new event
       Overlap = (existing.start < new.end) AND (existing.end > new.start)
  3. If any user has conflict:
       - Find available time slots
       - Return 409 error with suggestions
  4. If no conflicts:
       - Create event
       - Add all collaborators as participants
       - Return 200 OK
```

### Time Overlap Logic

```
Event A: 2pm-3pm       |--------|
Event B: 2:30pm-3:30pm   |--------|  → CONFLICT (overlap 30 min)

Event A: 2pm-3pm       |--------|
Event B: 3pm-4pm                |--------|  → NO CONFLICT (back-to-back OK)

Formula: (A.start < B.end) AND (A.end > B.start)
```

### Example Scenario

```
User Alice wants to create "Planning" for Jan 24, 2pm-3pm
Collaborators: Bob, Charlie

Check Alice: No events 2pm-3pm ✓
Check Bob:   Has "1:1 with Manager" 1:30pm-2:30pm ✗ CONFLICT!
Check Charlie: Free 2pm-3pm (not checked, already found conflict)

Result:
  Status: 409 Conflict
  Message: "Bob is committed at that time of the day"
  Available slots for all:
    - 10am-11am ✓
    - 3pm-4pm ✓
    - 4:30pm-5:30pm ✓

Alice adjusts to 3pm-4pm and retries → Success!
```

---

## Frontend Flow

```
User clicks "Create Event"
    ↓
Dialog opens with form
    ↓
User fills: title, description, start_time, end_time, collaborator_ids
    ↓
User clicks "Create"
    ↓
handleSubmit() called:
    - Parse collaborator IDs from comma-separated string
    - Convert times to ISO format
    - POST to /api/v1/calendar/
        ├─ If 409 (Conflict):
        │   - Store conflict details in state
        │   - Display error message + available slots
        │   - User can adjust times and retry
        │
        └─ If 200 (Success):
            - Call fetchEvents() to refresh
            - Close dialog
            - Calendar updates with new event
```

---

## Component Functions

### fetchEvents()
```javascript
const fetchEvents = async () => {
  const response = await api.get('/calendar/events', {});
  setEvents(response.data.map(event => ({
    ...event,
    start: new Date(event.start_time),  // Convert for BigCalendar
    end: new Date(event.end_time)
  })));
};
// Called: On mount, after event creation, when notification received
```

### handleSubmit()
```javascript
const handleSubmit = async () => {
  try {
    // Parse collaborator IDs
    const collaborator_ids = formData.collaborator_ids
      .split(',')
      .map(id => parseInt(id.trim()))
      .filter(id => !isNaN(id));
    
    // Create event
    await api.post('/calendar/', {
      ...formData,
      collaborator_ids,
      start_time: new Date(formData.start_time).toISOString(),
      end_time: new Date(formData.end_time).toISOString()
    });
    
    fetchEvents();      // Refresh calendar
    handleClose();      // Close dialog
  } catch (error) {
    if (error.response?.status === 409) {
      setConflict(error.response.data.detail);  // Show conflict
    }
  }
};
```

---

## Key Rules

| Rule | Details |
|------|---------|
| **Who checks for conflicts?** | Owner + all collaborators |
| **What is a conflict?** | Any time overlap (even 1 minute) |
| **Back-to-back events** | Allowed (2-3pm + 3-4pm is OK) |
| **Empty collaborator list** | Creates event with only owner |
| **User ID format** | Comma-separated: "1,2,3" or "550e8400-e29b-41d4-a716-446655440002" |

---

## UI Components

**Calendar Widget** (react-big-calendar)
- Shows monthly view
- Color-coded events
- Click to see details
- Drag-to-reschedule (if enabled)

**Create Button**
- Blue button: "Create Event"
- Opens dialog modal

**Create Dialog** (Material-UI)
- Title: "Create a New Event"
- Fields:
  - Title (text input)
  - Description (text input)
  - Start Time (datetime-local picker)
  - End Time (datetime-local picker)
  - Collaborator IDs (text, comma-separated)
- Conflict display (if error)
  - Red error message
  - List of available slots
- Actions: Cancel, Create buttons

---

## Integration Points

### With Notifications
```javascript
// When new event invitation received:
useEffect(() => {
  const eventInvitation = notifications.find(n => n.type === 'event_invitation');
  if (eventInvitation) {
    fetchEvents();  // Reload calendar
  }
}, [notifications]);
```

### With User System
- User must be logged in (token required)
- Collaborator IDs must be valid UUIDs
- Owner automatically set to current_user.id

---

## Common Issues & Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| Form doesn't submit | Invalid datetime format | Use ISO format: 2025-01-24T14:00:00 |
| Collaborator not added | User ID doesn't exist | Verify user ID is valid UUID |
| Can't create event | Syntax error in collaborator IDs | Use comma-separated: "id1,id2,id3" |
| Events don't show | Fetch failed | Check API response status |
| Conflict not detected | User ID not in collaborators | Make sure all attendees are listed |

---

## Code Copy-Paste Snippets

### Check if time overlaps
```python
def times_overlap(start1, end1, start2, end2):
    return (start1 < end2) and (end1 > start2)

# Usage
overlap = times_overlap(
    event.start_time,
    event.end_time,
    new_start,
    new_end
)
```

### Parse collaborator IDs from string
```javascript
const parseCollaborators = (idString) => {
  return idString
    .split(',')
    .map(id => parseInt(id.trim()))
    .filter(id => !isNaN(id));
};

// Usage
const ids = parseCollaborators("1, 2, 3, 4");
// Result: [1, 2, 3, 4]
```

### Convert datetime-local to ISO
```javascript
const localToISO = (localString) => {
  return new Date(localString).toISOString();
};

// Usage
const isoTime = localToISO("2025-01-24T14:00");
// Result: "2025-01-24T14:00:00.000Z"
```

---

## Performance Tips

- **Limit events displayed**: Paginate or filter to last 90 days
- **Cache available slots**: Pre-compute and cache next 7 days
- **Index timestamps**: Add DB index on (owner_id, start_time, end_time)
- **Batch conflict checks**: Check multiple users in parallel

---

## Future Enhancements

- [ ] Recurring events (daily, weekly, monthly)
- [ ] Event reminders (email, in-app)
- [ ] RSVP responses (accept/decline)
- [ ] Time zone support
- [ ] Calendar sharing
- [ ] Event editing
- [ ] Google Calendar integration
- [ ] Outlook integration

---

## Quick Test Scenarios

### Test 1: Create Event (No Conflict)
1. Click "Create Event"
2. Fill form: "Team Sync", "Weekly sync", Jan 24, 2pm-3pm, no collaborators
3. Click Create
4. Should see event on calendar

### Test 2: Create Event (Conflict)
1. Create event 1: Jan 24, 2pm-3pm
2. Try to create event 2: Jan 24, 2:30pm-3:30pm (same user)
3. Should see error: "User is committed at that time of the day"
4. Should see available slots
5. Select 3pm-4pm
6. Retry → Success

### Test 3: Multi-User Conflict
1. User A creates event: Jan 24, 2pm-3pm
2. User A adds User B as collaborator
3. Try to create another event for User B: Jan 24, 2:30pm-3:30pm
4. Should detect User B's conflict
5. Should suggest available slots

---

## Files to Read

| Priority | File | Why |
|----------|------|-----|
| 🔴 HIGH | [Calendar.jsx](../frontend/src/components/calendar/Calendar.jsx) | Main component code |
| 🔴 HIGH | [calendar.py (endpoints)](../backend/app/api/endpoints/calendar.py) | API logic |
| 🟡 MED | [calendar.py (crud)](../backend/app/crud/calendar.py) | Conflict detection |
| 🟡 MED | [calendar.py (models)](../backend/app/models/calendar.py) | Database schema |
| 🟢 LOW | [calendar.service.js](../frontend/src/services/calendar.service.js) | API client |

---

**Last Updated**: 2025-01-24  
**Version**: 1.0  
**Status**: Production Ready
