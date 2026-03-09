# SignUp Page Complete Implementation Guide

## Overview
The SignUp page has been fully implemented with the following features:
- ✅ Automatic username generation from first and last name
- ✅ Google Sign-Up integration
- ✅ Password strength requirements
- ✅ Complete backend integration with FastAPI

---

## Frontend Components

### 1. SignUpPage.jsx (`/frontend/src/pages/SignUpPage.jsx`)
**Purpose:** Main signup page container
**Features:**
- Uses RegisterForm component
- Handles registration submission via AuthContext
- Shows error/success messages
- Navigates to success page on registration

**Key Points:**
```javascript
const handleRegister = async (firstName, lastName, username, email, password) => {
  await register({ firstName, lastName, username, email, password });
  navigate('/success');
}
```

### 2. RegisterForm.jsx (`/frontend/src/components/auth/RegisterForm.jsx`)
**Purpose:** Signup form component
**Features:**
- Input fields: First Name, Last Name, Email, Password
- ❌ NO Username input field (automatically generated)
- Password strength criteria display
- Google Sign-Up button
- Real-time username preview

**Username Generation:**
```javascript
const generateUsername = (first, last) => {
  const base = `${first.toLowerCase()}.${last.toLowerCase()}`.replace(/\s+/g, '');
  return base.replace(/[^a-z0-9.]/g, '');
};
// Example: "John Smith" → "john.smith"
```

**Password Requirements:**
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character (!@#$%^&*(),.?":{}|<>)

**Google Sign-Up:**
- Uses Firebase Authentication API
- Auto-generates username from Google account name
- Sends credentials to backend

---

## Backend Implementation

### 1. Authentication Endpoints (`/backend/app/api/v1/endpoints/auth.py`)

#### POST /auth/register
**Request:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "username": "john.doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "isGoogleAuth": false
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "access_token": "eyJhbGc...",
  "token_type": "bearer",
  "user": {
    "username": "john.doe",
    "email": "john@example.com"
  }
}
```

**Validation:**
- Password complexity check (unless Google Auth)
- Duplicate email prevention
- Duplicate username handling (appends random 4-digit number)

#### POST /auth/login-google
**Request:**
```json
{
  "email": "user@gmail.com",
  "idToken": "google_id_token_here"
}
```

**Response:** Access token (same as register)

### 2. User Schema (`/backend/app/schemas/user.py`)
**UserCreate Schema:**
```python
class UserCreate(UserBase):
    first_name: str | None = None
    last_name: str | None = None
    password: str
    isGoogleAuth: bool = False
```

### 3. User CRUD (`/backend/app/crud/user.py`)
**User Creation Process:**
1. Checks for duplicate username (appends suffix if needed)
2. Checks for duplicate email
3. Hashes password using bcrypt
4. Stores first_name and last_name
5. Returns created user object

---

## Authentication Flow

### Email/Password Registration:
```
1. User enters: First Name, Last Name, Email, Password
2. Frontend auto-generates username: "firstname.lastname"
3. Form submits to POST /api/v1/auth/register
4. Backend validates password complexity
5. Backend checks duplicates
6. Backend creates user record in PostgreSQL
7. Backend generates JWT access token
8. Frontend stores token in localStorage
9. Frontend redirects to /success page
```

### Google Sign-Up:
```
1. User clicks "Sign up with Google"
2. Firebase redirects to Google login
3. User authorizes app
4. Firebase returns user credentials
5. Frontend extracts: firstName, lastName, email, displayName
6. Frontend calls POST /api/v1/auth/register with Google credentials
7. If user exists: calls POST /api/v1/auth/login-google instead
8. Backend returns access token
9. Frontend stores token and redirects
```

---

## Database Setup

### Tables Created (Automatic)
- `users` table with columns:
  - id (UUID primary key)
  - first_name (String)
  - last_name (String)
  - username (String, unique)
  - email (String, unique)
  - hashed_password (String)
  - is_active (Boolean, default=True)
  - created_at (DateTime)
  - And additional privacy/security settings

### Indexes:
- username (unique)
- email (unique)

---

## Environment Configuration

### Frontend (.env.local):
```
VITE_API_URL=http://localhost:8000
VITE_FIREBASE_API_KEY=AIzaSyDemoKey
VITE_FIREBASE_PROJECT_ID=nena-demo
VITE_FIREBASE_AUTH_DOMAIN=nena-demo.firebaseapp.com
```

### Backend (.env):
```
DATABASE_URL=postgresql://nena_user:nena_password@localhost:5432/nena_db
SECRET_KEY=nena-backend-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

---

## Running the Application

### Prerequisites:
✅ PostgreSQL running (port 5432)
✅ Databases created: nena_db
✅ Python 3.9+ installed
✅ Node.js 18+ installed
✅ npm/yarn installed

### Start Backend (Python):
```bash
cd /workspaces/NENA/backend
python main.py
# Runs on http://localhost:8000
```

### Start Frontend (React):
```bash
cd /workspaces/NENA/frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

### Access the App:
```
Frontend: http://localhost:5173
Sign Up: http://localhost:5173/signup
```

---

## API Integration Points

### Frontend ↔ Backend:
1. **API Client** (`/frontend/src/services/api.js`)
   - Base URL: http://localhost:8000/api/v1
   - Automatic JWT token injection in headers

2. **User Service** (`/frontend/src/services/user.service.js`)
   - GET /users/me (fetch current user)
   - PUT /users/{userId} (update profile)
   - Other user operations

3. **Auth Context** (`/frontend/src/contexts/AuthContext.jsx`)
   - Manages authentication state
   - Stores JWT token in localStorage
   - Provides register() method
   - Provides loginWithGoogle() method

---

## Testing the Signup Page

### Test Case 1: Email/Password Registration
1. Navigate to http://localhost:5173
2. Click "Sign Up" (or navigate to /signup)
3. Enter:
   - First Name: "John"
   - Last Name: "Doe"
   - Email: "john@example.com"
   - Password: "SecurePass123!"
4. Verify username preview shows "john.doe"
5. Click "Register"
6. Should be redirected to /success
7. Check browser localStorage for token:
   ```javascript
   localStorage.getItem('token') // Should have JWT
   ```

### Test Case 2: Google Sign-Up
1. Navigate to signup page
2. Click "Sign up with Google"
3. Complete Google login flow
4. Should be registered and redirected to /success

### Test Case 3: Duplicate Email
1. Try to register with same email twice
2. Should see error: "Email already registered"

### Test Case 4: Duplicate Username
1. Register two users with same first/last names
2. Second user's username should have suffix: "john.doe1234"

### Test Case 5: Weak Password
1. Try password without special character
2. Should see validation error
3. Cannot submit form

---

## Troubleshooting

### Issue: "Connection refused to localhost:8000"
**Solution:** 
1. Ensure backend is running: `python backend/main.py`
2. Check DATABASE_URL in backend/.env
3. Verify PostgreSQL is running

### Issue: "Email already registered"
**Solution:**
1. Use a different email address
2. Or clear the database and restart

### Issue: Password validation not showing
**Solution:**
1. Hard refresh browser (Ctrl+Shift+R)
2. Clear browser cache
3. Verify JavaScript is enabled

### Issue: Google Sign-Up not working
**Solution:**
1. Verify VITE_FIREBASE_API_KEY in frontend/.env
2. Check Firebase project settings in Google Cloud Console
3. Ensure authorized domains include localhost:5173

---

## Security Considerations

1. **JWT Security:**
   - Tokens stored in localStorage (httpOnly recommended for production)
   - Token expires in 30 minutes
   - SECRET_KEY should be changed in production

2. **Password Security:**
   - Passwords hashed with bcrypt
   - Salt rounds: 12
   - Never stored in plain text

3. **Google OAuth:**
   - Uses Firebase SDK
   - ID token validated on backend
   - Credentials sent over HTTPS in production

4. **CORS:**
   - Configured for localhost:5173 in development
   - Should be restricted in production

---

## File Summary

### Modified/Created Files:
1. ✅ `frontend/src/pages/SignUpPage.jsx` - Main signup page
2. ✅ `frontend/src/components/auth/RegisterForm.jsx` - Form component with Google option
3. ✅ `frontend/src/utils/firebase.js` - Firebase authentication setup
4. ✅ `frontend/src/contexts/AuthContext.jsx` - Auth state management
5. ✅ `frontend/src/services/api.js` - API client configuration
6. ✅ `frontend/src/services/user.service.js` - User API calls
7. ✅ `frontend/.env.local` - Frontend environment config
8. ✅ `backend/app/api/v1/endpoints/auth.py` - Auth endpoints
9. ✅ `backend/app/schemas/user.py` - User schemas with Google support
10. ✅ `backend/app/core/config.py` - Configuration settings
11. ✅ `backend/.env` - Backend environment config
12. ✅ `frontend/package.json` - Added Firebase dependency
13. ✅ `docker-compose.yml` - Database services configuration

---

## Next Steps

1. **Email Verification** (Optional)
   - Send confirmation email after signup
   - Require email verification before account activation

2. **Profile Completion** (Optional)
   - After signup, redirect to complete profile
   - Add profile photo, bio, interests

3. **Social Login** (Future)
   - Add GitHub OAuth
   - Add Microsoft OAuth
   - Add Apple Sign-In

4. **Two-Factor Authentication** (Future)
   - SMS verification
   - Authenticator app support

5. **Session Management** (Future)
   - Refresh token implementation
   - Remember me functionality
   - Device management

---

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review error messages in browser console
3. Check backend logs: `python backend/main.py`
4. Check browser Network tab for API responses
