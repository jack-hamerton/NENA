# Discover Page - Architecture & Implementation Guide 📐

**Detailed Technical Deep Dive**

---

## System Architecture

### High-Level Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────────┐
│                           DISCOVER SYSTEM                             │
├──────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │                    FRONTEND (React)                            │  │
│  ├────────────────────────────────────────────────────────────────┤  │
│  │                                                                │  │
│  │  ┌─────────────────────────────────────────────────────────┐ │  │
│  │  │ Discover.jsx (Main Component)                          │ │  │
│  │  │ - State: searchQuery, searchType, searchResults       │ │  │
│  │  │ - Event Handlers: handleSearchChange                 │ │  │
│  │  │ - useEffect: Debounced API calls                     │ │  │
│  │  │ - Render: Search UI + SearchResults component       │ │  │
│  │  └─────────────────────────────────────────────────────────┘ │  │
│  │                           ↓                                   │  │
│  │  ┌─────────────────────────────────────────────────────────┐ │  │
│  │  │ SearchResults.jsx (Router Component)                   │ │  │
│  │  │ - Receives: results array, search type                │ │  │
│  │  │ - Logic: Maps results to type-specific components    │ │  │
│  │  │ - Renders: Appropriate *SearchResult components      │ │  │
│  │  └─────────────────────────────────────────────────────────┘ │  │
│  │           ↓           ↓            ↓           ↓              │  │
│  │  ┌──────────────┬──────────────┬──────────────┬──────────────┐│  │
│  │  │ User         │ Post         │ Hashtag      │ Room         ││  │
│  │  │ SearchResult │ SearchResult │ SearchResult │ SearchResult ││  │
│  │  │              │              │              │              ││  │
│  │  │ - Avatar     │ - Author     │ - Name       │ - Name       ││  │
│  │  │ - Name       │ - Content    │ - PostCount  │ - Desc       ││  │
│  │  │ - Handle     │              │              │              ││  │
│  │  └──────────────┴──────────────┴──────────────┴──────────────┘│  │
│  │                                                                │  │
│  │  ┌─────────────────────────────────────────────────────────┐ │  │
│  │  │ discover.service.js (API Layer)                        │ │  │
│  │  │ - Function: search(query, type)                       │ │  │
│  │  │ - Returns: Promise with API response                 │ │  │
│  │  │ - URL: /discover/search?query=X&type=Y              │ │  │
│  │  └─────────────────────────────────────────────────────────┘ │  │
│  │                                                                │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                           ↕ HTTP                                      │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │                    BACKEND (FastAPI)                           │  │
│  ├────────────────────────────────────────────────────────────────┤  │
│  │                                                                │  │
│  │  GET /discover/search?query={q}&type={t}                     │  │
│  │  ├── Search Users: users table WHERE name LIKE %q%          │  │
│  │  ├── Search Posts: posts table WHERE content LIKE %q%       │  │
│  │  ├── Search Hashtags: hashtags table WHERE name LIKE %q%    │  │
│  │  └── Search Rooms: rooms table WHERE name LIKE %q%          │  │
│  │                                                                │  │
│  │  Returns: { data: [...] }                                     │  │
│  │                                                                │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                           ↕ DB Query                                  │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │                    DATABASE (PostgreSQL)                       │  │
│  ├────────────────────────────────────────────────────────────────┤  │
│  │  - users table (id, name, handle, avatar, bio)               │  │
│  │  - posts table (id, content, author_id, created_at)          │  │
│  │  - hashtags table (id, name, post_count)                     │  │
│  │  - rooms table (id, name, description, created_by)           │  │
│  │                                                                │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                        │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Component Interaction Flow

### User Actions & Component Response

```
USER ACTION                  COMPONENT         STATE UPDATE    API CALL
──────────────────────────────────────────────────────────────────────
Navigates to /discover  →    Discover.jsx      Initialize
                                                - searchQuery = ''
                                                - searchType = 'users'
                                                - searchResults = []

Types 'a'               →    input onChange     setSearchQuery('a')
Types 'al'              →    input onChange     setSearchQuery('al')
Types 'ale'             →    input onChange     setSearchQuery('ale')
Types 'alex'            →    input onChange     setSearchQuery('alex')

Wait 500ms              →    useEffect runs     (after debounce)
                                                                GET /search
                                                                ?query=alex
                                                                &type=users

API Response            →    setSearchResults   searchResults = [
                                                  {id:1, name:'Alex...'},
                                                  {id:2, name:'Alexandra...'}
                                                ]

Component Re-render     →    SearchResults      Renders
                             UserSearchResult   UserSearchResult
                             (multiple)         components

Clicks "Posts" button   →    setSearchType      searchType = 'posts'
                             triggers useEffect
                                                                GET /search
                                                                ?query=alex
                                                                &type=posts

API Response            →    setSearchResults   searchResults = [
                                                  {id:1, content:'...'},
                                                  {id:2, content:'...'}
                                                ]

Component Re-render     →    SearchResults      Renders
                             PostSearchResult   PostSearchResult
                             (multiple)         components

Clicks on result        →    (Optional)         Navigate to
                                                detail page
```

---

## State Management Deep Dive

### State Variables & Their Lifecycle

#### 1. searchQuery
```javascript
// INITIAL STATE
const [searchQuery, setSearchQuery] = useState('');

// LIFECYCLE
// ↓ User types 'p' → setSearchQuery('p')
// ↓ Input value: 'p'
// ↓ useEffect dependency triggered
// ↓ 500ms debounce starts
// ↓ User types 'y' before 500ms → setSearchQuery('py')
// ↓ Previous timeout cleared
// ↓ New 500ms debounce starts
// ↓ 500ms no typing → API call with 'py'

// WHEN EMPTY
// - Does NOT trigger API call
// - setSearchResults([])
// - No "No results" message shown
```

#### 2. searchType
```javascript
// INITIAL STATE
const [searchType, setSearchType] = useState('users');

// LIFECYCLE
// ↓ User clicks "Posts" button
// ↓ setSearchType('posts')
// ↓ useEffect dependency triggered
// ↓ New API call with type='posts'
// ↓ Same searchQuery but different type
// ↓ Results re-render with PostSearchResult components

// VALUES: 'users' | 'posts' | 'hashtags' | 'rooms'
// CHANGES: User clicks filter button
```

#### 3. searchResults
```javascript
// INITIAL STATE
const [searchResults, setSearchResults] = useState([]);

// LIFECYCLE
// ↓ API response received
// ↓ setSearchResults(response.data)
// ↓ Component re-renders
// ↓ SearchResults component receives new data
// ↓ Maps over results and renders appropriate components

// SUCCESS
setSearchResults([
  { id: 1, name: 'Result 1', ... },
  { id: 2, name: 'Result 2', ... }
]);

// NO RESULTS
setSearchResults([]);
// → Shows "No results found."

// ERROR
setSearchResults([]);
// → Results cleared, error logged
```

---

## useEffect Hook - Complete Analysis

### Hook Definition

```javascript
useEffect(() => {
  const fetchResults = async () => {
    if (searchQuery.length > 0) {
      try {
        const response = await search(searchQuery, searchType);
        setSearchResults(response.data);
      } catch (error) {
        console.error(`Failed to fetch ${searchType}:`, error);
        setSearchResults([]);
      }
    } else {
      setSearchResults([]);
    }
  };

  const debounceFetch = setTimeout(() => {
    fetchResults();
  }, 500);

  return () => clearTimeout(debounceFetch);
}, [searchQuery, searchType]);
```

### Execution Trace

**When `searchQuery` changes to "python"**:

```javascript
STEP 1: Dependency detected → searchQuery changed
        useEffect body executes

STEP 2: const fetchResults = async () => { ... }
        Function defined (not called yet)

STEP 3: const debounceFetch = setTimeout(() => { ... }, 500)
        Timer started, waits 500ms

STEP 4: return () => clearTimeout(debounceFetch)
        Cleanup function registered

        [WAIT 500ms]

STEP 5A: If more typing before 500ms:
         - searchQuery changes again
         - useEffect re-runs
         - CLEANUP RUNS: clearTimeout(debounceFetch) from previous
         - New timer started from step 3
         - Previous call never executes

STEP 5B: If no typing for 500ms:
         - Timer completes
         - fetchResults() executes
         - search('python', searchType) called
         - API request sent
```

### Debounce Timing Example

```
Time  Event
────  ─────────────────────────────────────────────────────
0ms   User types 'p' → useEffect #1 runs, timer #1 starts
10ms  User types 'y' → Cleanup #1, useEffect #2 runs, timer #2 starts
20ms  User types 't' → Cleanup #2, useEffect #3 runs, timer #3 starts
30ms  User types 'h' → Cleanup #3, useEffect #4 runs, timer #4 starts
40ms  User types 'o' → Cleanup #4, useEffect #5 runs, timer #5 starts
50ms  User types 'n' → Cleanup #5, useEffect #6 runs, timer #6 starts
60ms  (no typing)     → Timer #6 continues
300ms (no typing)     → Timer #6 continues
560ms (no typing)     → Timer #6 completes
      → fetchResults() executes
      → search('python', type) called
570ms ← API response received
      → setSearchResults() updates state
      → Component re-renders
```

**Result**: 6 keystrokes = 1 API call (vs 6 API calls without debounce)

---

## API Service Layer

### discover.service.js

```javascript
import apiClient from './api';

export const search = (query, type) => {
  return apiClient.get(`/discover/search?query=${query}&type=${type}`);
};

// Usage:
// const response = await search('python', 'hashtags');
// response.data → [{id, name, postCount}, ...]
```

### API Client (api.js / apiClient.ts)

```javascript
// Configured to:
// - Add authorization headers
// - Handle base URL
// - Add request/response interceptors
// - Set timeout
// - Add error handling

// Request:
apiClient.get(url) → Promise

// Response:
{
  data: [...],      // Array of results
  status: 200,      // HTTP status
  headers: {...}    // Response headers
}
```

### Error Scenarios

```javascript
// Scenario 1: Network Error
try {
  const response = await search(...);
} catch (error) {
  // error.message: "Network Error"
  // error.code: "ECONNABORTED" or similar
  console.error(...);
  setSearchResults([]);
}

// Scenario 2: Server Error (500)
// - Caught by catch block
// - Same handling as network error

// Scenario 3: Not Found (404)
// - Request completes successfully
// - response.data = []
// - No catch block triggered
// - searchResults = []
// - UI shows "No results found."

// Scenario 4: Invalid Parameters
// - Backend validation fails
// - response.status = 400
// - Caught by catch block (if axios configured)
// - Or handled by response check
```

---

## Data Models

### Result Types & Structures

#### User Result
```javascript
{
  id: "550e8400-e29b-41d4-a716-446655440000",
  name: "Alex Johnson",
  handle: "alex_j",
  avatar: "https://cdn.example.com/avatars/alex.jpg",
  bio: "Software developer passionate about Python",
  followerCount: 1523,
  followingCount: 432
}
```

#### Post Result
```javascript
{
  id: "660e8400-e29b-41d4-a716-446655440001",
  content: "Just finished a great Python project!",
  author: {
    id: "550e8400-e29b-41d4-a716-446655440000",
    name: "Alex Johnson",
    avatar: "https://cdn.example.com/avatars/alex.jpg"
  },
  likes: 234,
  comments: 45,
  createdAt: "2026-01-24T10:30:00Z",
  updatedAt: "2026-01-24T10:30:00Z"
}
```

#### Hashtag Result
```javascript
{
  id: "770e8400-e29b-41d4-a716-446655440002",
  name: "python",
  postCount: 12450,
  trendingScore: 8.5,
  createdAt: "2025-06-15T00:00:00Z"
}
```

#### Room Result
```javascript
{
  id: "880e8400-e29b-41d4-a716-446655440003",
  name: "Python Developers",
  description: "A community for Python enthusiasts",
  memberCount: 5432,
  isPublic: true,
  createdBy: {
    id: "550e8400-e29b-41d4-a716-446655440000",
    name: "Alex Johnson"
  },
  createdAt: "2025-01-01T00:00:00Z"
}
```

---

## Event Handler Flow

### handleSearchChange

```javascript
const handleSearchChange = (event) => {
  const value = event.target.value;  // Get input value
  setSearchQuery(value);             // Update state
  
  // What happens next (automatic):
  // 1. React updates searchQuery state
  // 2. Component re-renders with new input value
  // 3. useEffect dependency [searchQuery] detected
  // 4. useEffect runs (500ms debounce starts)
};

// Example:
// User types: "a"
// event.target.value: "a"
// setSearchQuery("a")
// Input displays: "a"
// useEffect triggered
```

### Type Button Handlers

```javascript
<button onClick={() => setSearchType('users')}>
  Users
</button>

// When clicked:
// 1. onClick event fires
// 2. setSearchType('users') executes
// 3. searchType state changes: '' → 'users'
// 4. Component re-renders
// 5. useEffect dependency [searchType] detected
// 6. useEffect runs with new type
// 7. API call: search(searchQuery, 'users')
```

---

## Rendering Logic

### SearchResults Component Logic

```javascript
const SearchResults = ({ results, type }) => {
  // Condition 1: Empty results
  if (results.length === 0) {
    return <p>No results found.</p>;  // Exit early
  }

  // Condition 2: Render results based on type
  return (
    <div>
      {results.map((result) => {
        // Type === 'users'
        if (type === 'users') {
          return <UserSearchResult key={result.id} user={result} />;
        }
        // Type === 'posts'
        else if (type === 'posts') {
          return <PostSearchResult key={result.id} post={result} />;
        }
        // Type === 'hashtags'
        else if (type === 'hashtags') {
          return <HashtagSearchResult key={result.id} hashtag={result} />;
        }
        // Type === 'rooms'
        else if (type === 'rooms') {
          return <RoomSearchResult key={result.id} room={result} />;
        }
        // Unknown type
        return null;
      })}
    </div>
  );
};
```

### Rendering Decision Tree

```
                    ┌─ results.length === 0 ──→ "No results found."
SearchResults ──────┤
                    │
                    └─ results.length > 0 ────→ Map & Render
                                                  ├── type === 'users' → UserSearchResult
                                                  ├── type === 'posts' → PostSearchResult
                                                  ├── type === 'hashtags' → HashtagSearchResult
                                                  ├── type === 'rooms' → RoomSearchResult
                                                  └── default → null
```

---

## Styling Architecture

### Theme Object Structure

```javascript
theme = {
  palette: {
    primary: "#ffffff",      // Main background
    secondary: "#e0e0e0",    // Border/divider color
    accent: "#1976d2"        // Highlight/hover color
  },
  text: {
    primary: "#000000",      // Main text color
    secondary: "#757575"     // Secondary text color
  }
}
```

### Component Styling Pattern

```jsx
// UserSearchResult.jsx
const UserCard = styled.div`
  display: flex;
  padding: 1rem;
  background-color: ${props => props.theme.palette.primary};
  border-bottom: 1px solid #ddd;
  
  &:hover {
    background-color: ${props => props.theme.palette.accent};
    cursor: pointer;
  }
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 1rem;
`;

const UserName = styled.h4`
  color: ${props => props.theme.text.primary};
  margin: 0;
`;

const UserHandle = styled.p`
  color: ${props => props.theme.text.secondary};
  margin: 0;
`;
```

---

## Performance Optimization

### 1. Debouncing (500ms)

**Problem**: Without debounce
```
User types "python" (6 characters)
↓
6 API calls (one per character)
↓
Increased server load
↓
Slower UI response
```

**Solution**: With debounce
```
User types "python" (6 characters)
↓
Waits 500ms
↓
1 API call with complete "python"
↓
Reduced server load by 83%
```

### 2. Conditional Rendering

```javascript
// Avoid rendering if no results
if (results.length === 0) {
  return <p>No results found.</p>;  // Early exit
}

// Avoid rendering empty queries
if (searchQuery.length === 0) {
  setSearchResults([]);  // Don't search
}
```

### 3. React Key Prop

```javascript
{results.map((result) => (
  <UserSearchResult 
    key={result.id}  // ← Helps React reconciliation
    user={result} 
  />
))}
```

**Why important**:
- React uses `key` to identify elements
- Without key, DOM updates inefficiently
- With key, only changed items re-render

---

## Error Handling Patterns

### Try-Catch Block

```javascript
try {
  // Attempt API call
  const response = await search(searchQuery, searchType);
  
  // Success path
  setSearchResults(response.data);
} catch (error) {
  // Error path
  console.error(`Failed to fetch ${searchType}:`, error);
  
  // Clear results
  setSearchResults([]);
  
  // Optional: Show user error
  // setError(`Failed to search ${searchType}`);
}
```

### Error Types Handled

| Error Type | Cause | Handling |
|-----------|-------|----------|
| Network Error | Connection failed | Caught, logged, results cleared |
| Server Error | Backend returns 500 | Caught, logged, results cleared |
| Timeout | Request takes too long | Caught, logged, results cleared |
| Invalid Response | Malformed JSON | Caught, logged, results cleared |
| API Not Found | Wrong endpoint | Caught, logged, results cleared |

---

## Complete User Interaction Example

### Scenario: Search for "Python Hashtags"

```
TIME EVENT                          STATE CHANGE              API CALL
──── ─────────────────────────────────────────────────────────────────
0ms  User navigates to /discover   searchQuery = ''
                                   searchType = 'users'
                                   searchResults = []

10ms User clicks "Hashtags" btn     searchType = 'hashtags'
                                   useEffect triggers

20ms useEffect runs                 (500ms timer starts)

520ms User starts typing "p"        searchQuery = 'p'
      (after 500ms no activity)    useEffect triggers
                                   (500ms timer starts)      GET /search
                                                             ?query=p
                                                             &type=hashtags

530ms User types "y"                Cleanup #1 runs
                                   searchQuery = 'py'
                                   useEffect triggers
                                   (500ms timer resets)

540ms User types "t"                Cleanup #2 runs
                                   searchQuery = 'pyt'
                                   useEffect triggers
                                   (500ms timer resets)

550ms User types "h"                Cleanup #3 runs
                                   searchQuery = 'pyth'
                                   useEffect triggers
                                   (500ms timer resets)

560ms User types "o"                Cleanup #4 runs
                                   searchQuery = 'pytho'
                                   useEffect triggers
                                   (500ms timer resets)

570ms User types "n"                Cleanup #5 runs
                                   searchQuery = 'python'
                                   useEffect triggers
                                   (500ms timer resets)

600ms User stops typing            (no change)

1070ms 500ms timer completes       fetchResults() executes   GET /search
                                                             ?query=python
                                                             &type=hashtags

1100ms API response received        searchResults = [
                                     {name:'#python', posts:15000},
                                     {name:'#pythonic', posts:2300},
                                     {name:'#pythonista', posts:890}
                                   ]

1105ms Component re-renders         SearchResults component
                                   maps results
                                   renders 3 HashtagSearchResult
                                   components

1110ms UI displays hashtag results  #python - 15000 posts
                                   #pythonic - 2300 posts
                                   #pythonista - 890 posts
```

---

## Summary Table

| Aspect | Details |
|--------|---------|
| **Main Component** | `Discover.jsx` |
| **State Variables** | searchQuery, searchType, searchResults |
| **API Endpoint** | GET `/discover/search?query=X&type=Y` |
| **Debounce Delay** | 500ms |
| **Result Types** | users, posts, hashtags, rooms |
| **Result Components** | UserSearchResult, PostSearchResult, HashtagSearchResult, RoomSearchResult |
| **Error Handling** | Try-catch, clears results on error |
| **Empty State** | "No results found." message |
| **Styling** | styled-components with theme |
| **Performance** | Debouncing reduces API calls by ~83% |
| **Responsive** | Mobile, tablet, desktop breakpoints |
| **Theme Support** | Full dark/light mode |

---

**Version**: 1.0  
**Last Updated**: January 24, 2026  
**Status**: ✅ Production Ready
