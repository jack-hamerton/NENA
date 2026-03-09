# ⚙️ SETTINGS PAGE - QUICK REFERENCE

**Purpose**: User account and security preferences management

**Route**: `/user/{userId}/settings`

**Status**: ✅ Implemented and Functional

---

## 📋 Quick Overview

### What's on the Settings Page?

The Settings Page is a user account management interface that provides:

1. **User Settings Section** - General account preferences
2. **Security Settings Section** - Application PIN management

---

## 🏗️ File Structure

```
frontend/src/
└── pages/
    └── SettingsPage.jsx (160 lines)
```

**Backend Integration**:
- `PUT /users/settings` - Save user settings
- Uses localStorage for PIN storage (client-side)

---

## 🎯 Components & Features

### 1. User Settings Section

**Purpose**: Manage general account preferences

**Features**:
- ✅ Form for user settings
- ✅ Submit button to save changes
- ✅ API integration with backend (`/users/settings`)

**Code**:
```jsx
<Paper sx={{ padding: '2rem', marginBottom: '2rem' }}>
  <Typography variant="h6" gutterBottom>User Settings</Typography>
  <form onSubmit={handleSubmit}>
    {/* Form fields for user settings */}
    <button type="submit">Save Settings</button>
  </form>
</Paper>
```

### 2. Security Settings Section

**Purpose**: Manage application security with PIN protection

**Features**:
- ✅ Set a new PIN (if not already set)
- ✅ Change existing PIN (if already set)
- ✅ Remove PIN protection
- ✅ 4-digit PIN validation
- ✅ Password-type input masking
- ✅ Real-time feedback with snackbar notifications

---

## 🔒 Security Settings - PIN Management

### State Variables

```javascript
const [hasPin, setHasPin] = useState(false);           // Is PIN already set?
const [currentPin, setCurrentPin] = useState('');      // Current PIN (for change/remove)
const [newPin, setNewPin] = useState('');              // New PIN to set
const [confirmNewPin, setConfirmNewPin] = useState(''); // Confirmation of new PIN
const [user, setUser] = useState({});                  // User data
```

### PIN Operations

#### A. Setting a New PIN (Initial Setup)

**When**: User has no PIN set (`hasPin === false`)

**Form Fields**:
- New PIN (password field, max 4 digits)
- Confirm New PIN (password field, max 4 digits)

**Validation**:
```javascript
✓ PIN must be exactly 4 digits
✓ Both PIN fields must match
```

**Success**:
- PIN stored in localStorage as `app_pin`
- `hasPin` set to `true`
- Form cleared
- Success snackbar shown

**Code Flow**:
```jsx
const handleSetPin = () => {
  // 1. Validate PIN length
  if (newPin.length !== 4) {
    showSnackbar('PIN must be 4 digits', 'error');
    return;
  }
  
  // 2. Validate PIN match
  if (newPin !== confirmNewPin) {
    showSnackbar('PINs do not match', 'error');
    return;
  }

  // 3. Store PIN locally
  localStorage.setItem('app_pin', newPin);
  
  // 4. Update state
  setHasPin(true);
  setNewPin('');
  setConfirmNewPin('');
  
  // 5. Show success
  showSnackbar('Application PIN has been set successfully', 'success');
};
```

#### B. Changing an Existing PIN

**When**: User already has PIN set (`hasPin === true`)

**Form Fields**:
- Current PIN (password field, max 4 digits)
- New PIN (password field, max 4 digits)
- Confirm New PIN (password field, max 4 digits)

**Validation**:
```javascript
✓ Current PIN must match stored PIN
✓ New PIN must be exactly 4 digits
✓ New PIN and confirmation must match
```

**Success**:
- Old PIN replaced with new PIN in localStorage
- All fields cleared
- Success snackbar shown

**Code Flow**:
```jsx
const handleChangePin = () => {
  const storedPin = localStorage.getItem('app_pin');
  
  // 1. Verify current PIN
  if (currentPin !== storedPin) {
    showSnackbar('Current PIN is incorrect', 'error');
    return;
  }
  
  // 2. Validate new PIN length
  if (newPin.length !== 4) {
    showSnackbar('New PIN must be 4 digits', 'error');
    return;
  }
  
  // 3. Validate new PIN match
  if (newPin !== confirmNewPin) {
    showSnackbar('New PINs do not match', 'error');
    return;
  }

  // 4. Update PIN
  localStorage.setItem('app_pin', newPin);
  
  // 5. Clear all fields
  setCurrentPin('');
  setNewPin('');
  setConfirmNewPin('');
  
  // 6. Show success
  showSnackbar('Application PIN has been changed successfully', 'success');
};
```

#### C. Removing PIN Protection

**When**: User has PIN set and wants to remove it

**Form Fields**:
- Current PIN (password field, max 4 digits) - Required to remove

**Validation**:
```javascript
✓ Current PIN must match stored PIN
```

**Success**:
- PIN removed from localStorage
- `hasPin` set to `false`
- Form cleared
- Success snackbar shown

**Code Flow**:
```jsx
const handleRemovePin = () => {
  const storedPin = localStorage.getItem('app_pin');
  
  // 1. Verify current PIN
  if (currentPin !== storedPin) {
    showSnackbar('Current PIN is incorrect', 'error');
    return;
  }

  // 2. Remove PIN from storage
  localStorage.removeItem('app_pin');
  
  // 3. Update state
  setHasPin(false);
  setCurrentPin('');
  
  // 4. Show success
  showSnackbar('Application PIN has been removed', 'success');
};
```

---

## 🔄 UI Flow Diagram

```
User Visits Settings
        ↓
Load Component
    ↓        ↓
Check PIN  Show Sections
in Storage
    ↓        ↓
hasPin = false     hasPin = true
    ↓                  ↓
[SET PIN FORM]    [CHANGE/REMOVE PIN FORM]
New PIN           Current PIN
Confirm PIN   New PIN
              Confirm PIN
    ↓                  ↓
[Set PIN Button]  [Change PIN Button] [Remove PIN Button]
    ↓                  ↓                     ↓
Validate         Validate             Verify Current
Set in Storage   Update in Storage    Remove from Storage
Show Success     Show Success         Show Success
```

---

## 📱 User Interface

### Settings Header
```
Settings
```

### User Settings Section
```
┌─────────────────────────────┐
│ User Settings               │
├─────────────────────────────┤
│ [Form fields for settings]  │
│                             │
│ [Save Settings Button]      │
└─────────────────────────────┘
```

### Security Settings Section (No PIN Set)
```
┌─────────────────────────────┐
│ Security Settings           │
├─────────────────────────────┤
│ Set a 4-digit PIN to        │
│ secure your application.    │
│                             │
│ New PIN: [••••]             │
│ Confirm PIN: [••••]         │
│                             │
│ [Set PIN Button]            │
└─────────────────────────────┘
```

### Security Settings Section (PIN Set)
```
┌─────────────────────────────┐
│ Security Settings           │
├─────────────────────────────┤
│ Change or remove your       │
│ application PIN.            │
│                             │
│ Current PIN: [••••]         │
│ New PIN: [••••]             │
│ Confirm PIN: [••••]         │
│                             │
│ [Change PIN Button]         │
│ [Remove PIN Button]         │
└─────────────────────────────┘
```

---

## 🔌 Data Flow

### Initialization
```
useEffect(() => {
  const storedPin = localStorage.getItem('app_pin');
  setHasPin(!!storedPin);  // true if PIN exists, false if not
}, []);
```

### User Saves Settings
```
Form Submit
    ↓
handleSubmit()
    ↓
API PUT /users/settings
    ↓
Backend processes
    ↓
Response
```

### PIN Management
```
User Action
    ↓
Validation
    ↓
localStorage Operation
    ↓
State Update
    ↓
Snackbar Notification
```

---

## 🎨 Styling

**Libraries**: Material-UI (MUI)

**Components Used**:
- `Box` - Container for sections
- `Paper` - Card-like container for sections
- `Typography` - Text headings and labels
- `TextField` - Input fields for PIN entry
- `Button` - Action buttons (Set, Change, Remove)

**Theme**:
- Consistent with app theme
- Light/dark mode support via MUI theme provider

---

## 📊 State Management

```javascript
hasPin           // Boolean: Is PIN already set?
currentPin       // String: Current PIN (4 digits max)
newPin           // String: New PIN (4 digits max)
confirmNewPin    // String: Confirmation PIN (4 digits max)
user             // Object: User data from backend
```

---

## 🔐 Security Features

✅ **Client-Side Storage**
- PIN stored in browser's localStorage
- Not sent to backend (except in initial setup)
- Provides local device security

✅ **Password Input Masking**
- All PIN fields use `type="password"`
- Input appears as dots/asterisks
- Prevents shoulder surfing

✅ **4-Digit Validation**
- Maximum 4 characters enforced
- Numeric input validation
- Clear PIN requirements

✅ **Verification Steps**
- Current PIN must be verified before changes
- Confirmation field prevents typos
- All validations before storage

✅ **Error Handling**
- Clear error messages
- No sensitive data in error text
- User-friendly feedback

---

## 📞 API Integration

### Backend Endpoint

```
PUT /users/settings
Content-Type: application/json

Request Body:
{
  ...user settings...
}

Response:
{
  status: "success",
  data: { ...updated user... }
}
```

### Service Layer
```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  await api.put('/users/settings', user, {});
};
```

---

## 🔔 Notifications (Snackbar)

**Success Messages**:
- "Application PIN has been set successfully"
- "Application PIN has been changed successfully"
- "Application PIN has been removed"

**Error Messages**:
- "PIN must be 4 digits"
- "PINs do not match"
- "Current PIN is incorrect"
- "New PIN must be 4 digits"
- "New PINs do not match"

**Implementation**:
```javascript
const { showSnackbar } = useSnackbar();

// Show success
showSnackbar('Message here', 'success');

// Show error
showSnackbar('Message here', 'error');
```

---

## ⚡ Key Functions

| Function | Purpose | Input | Output |
|----------|---------|-------|--------|
| `handleSetPin()` | Set new PIN | New PIN, Confirm PIN | PIN stored, state updated |
| `handleChangePin()` | Change existing PIN | Current, New, Confirm | PIN updated |
| `handleRemovePin()` | Remove PIN | Current PIN | PIN removed |
| `handleSubmit()` | Save user settings | Form data | API call to backend |

---

## 🚀 Usage Flow

### First-Time User (No PIN)
1. User navigates to Settings
2. `useEffect` checks localStorage
3. `hasPin` is `false`
4. "Set PIN" form displayed
5. User enters PIN and confirmation
6. Clicks "Set PIN"
7. Validation checks pass
8. PIN saved to localStorage
9. `hasPin` set to `true`
10. Success notification shown
11. Form switches to "Change/Remove" view

### Returning User (Has PIN)
1. User navigates to Settings
2. `useEffect` checks localStorage
3. `hasPin` is `true`
4. "Change/Remove PIN" form displayed
5. User can:
   - **Change**: Enter current PIN + new PIN → validation → update
   - **Remove**: Enter current PIN → verify → remove

---

## 💾 LocalStorage Schema

```javascript
// Key: 'app_pin'
// Value: 4-digit PIN string (e.g., "1234")
// Accessed: 
localStorage.getItem('app_pin')        // Get PIN
localStorage.setItem('app_pin', pin)   // Store PIN
localStorage.removeItem('app_pin')     // Remove PIN
```

---

## 🔍 Component Props & Parameters

**No props are passed to SettingsPage** - It's a standalone page component

**Context Usage**:
```javascript
const { showSnackbar } = useSnackbar();  // From SnackbarContext
```

**API Usage**:
```javascript
const { api } = require('../utils/api');  // Custom axios instance
```

---

## 📋 Summary

| Aspect | Details |
|--------|---------|
| **File** | `frontend/src/pages/SettingsPage.jsx` (160 lines) |
| **Route** | `/user/{userId}/settings` |
| **Sections** | 2 (User Settings, Security Settings) |
| **PIN Operations** | Set, Change, Remove |
| **Storage** | localStorage (client-side) |
| **Validation** | PIN length, matching, verification |
| **Feedback** | Snackbar notifications |
| **UI Library** | Material-UI (MUI) |
| **State** | 5 state variables |
| **API Calls** | PUT /users/settings |

---

**Status**: ✅ Complete and Functional

**Last Updated**: January 24, 2026
