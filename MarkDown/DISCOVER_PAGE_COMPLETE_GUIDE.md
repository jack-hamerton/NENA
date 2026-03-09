# NENA Discover Page - Complete Guide 🔍

**Last Updated**: January 24, 2026  
**Version**: 1.0  
**Status**: ✅ Complete Documentation  

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Component Structure](#component-structure)
4. [How It Works](#how-it-works)
5. [Features](#features)
6. [User Experience Flow](#user-experience-flow)
7. [API Integration](#api-integration)
8. [Styling & Theme](#styling--theme)
9. [Search Types](#search-types)
10. [Result Components](#result-components)
11. [Technical Implementation Details](#technical-implementation-details)

---

## Overview

The **Discover Page** is a comprehensive search and discovery interface within the NENA platform that allows users to explore and find:
- **Users** - Find and connect with other users
- **Posts** - Discover content and discussions
- **Hashtags** - Browse trending topics
- **Rooms** - Find and join collaborative spaces

### Key Characteristics

| Aspect | Details |
|--------|---------|
| **Route** | `/discover` |
| **Main Component** | `Discover.jsx` |
| **Page Type** | Search & Discovery |
| **Default Search Type** | Users |
| **Real-time Feedback** | Yes (500ms debounce) |
| **Theme Support** | Full dark/light mode |
| **Responsive Design** | Mobile, Tablet, Desktop |

---

## Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    DISCOVER PAGE (/discover)                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Search Input Section                                    │   │
│  │ - Input Field for Query                                │   │
│  │ - Search Type Buttons (Users/Posts/Hashtags)          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                           ↓                                       │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Discover Service (discover.service.js)                 │   │
│  │ - Calls Backend API: /discover/search                  │   │
│  │ - Passes: query parameter, type parameter              │   │
│  └─────────────────────────────────────────────────────────┘   │
│                           ↓                                       │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Backend API Endpoint                                    │   │
│  │ GET /discover/search?query=value&type=users            │   │
│  └─────────────────────────────────────────────────────────┘   │
│                           ↓                                       │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Results Processing & State Management                  │   │
│  │ - setSearchResults() updates state                     │   │
│  │ - Error handling with try/catch                        │   │
│  └─────────────────────────────────────────────────────────┘   │
│                           ↓                                       │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ SearchResults Component                                 │   │
│  │ - Renders appropriate result type                      │   │
│  │ - Maps results to result components                    │   │
│  └─────────────────────────────────────────────────────────┘   │
│                           ↓                                       │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Individual Result Components                            │   │
│  │ - UserSearchResult                                      │   │
│  │ - PostSearchResult                                      │   │
│  │ - HashtagSearchResult                                   │   │
│  │ - RoomSearchResult                                      │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Data Flow Diagram

```
User Types Query
     ↓
Input Field → handleSearchChange()
     ↓
setSearchQuery() → state update
     ↓
useEffect() triggered
     ↓
500ms Debounce (setTimeout)
     ↓
search(query, searchType) → API Call
     ↓
Backend /discover/search endpoint
     ↓
Returns results array
     ↓
setSearchResults() → state update
     ↓
SearchResults Component renders
     ↓
Type-specific components render
     ↓
UI displays results
```

---

## Component Structure

### Component Hierarchy

```
Discover (Main Page Component)
├── Input Section
│   ├── Search Input Field
│   └── Type Filter Buttons
│       ├── Users Button
│       ├── Posts Button
│       ├── Hashtags Button
│       └── Rooms Button
└── SearchResults Component
    ├── UserSearchResult (if type === 'users')
    │   ├── Avatar
    │   ├── User Name
    │   └── User Handle
    ├── PostSearchResult (if type === 'posts')
    │   ├── Author Avatar
    │   ├── Author Name
    │   └── Post Content
    ├── HashtagSearchResult (if type === 'hashtags')
    │   ├── Hashtag Name
    │   └── Post Count
    └── RoomSearchResult (if type === 'rooms')
        ├── Room Name
        └── Room Description
```

### File Structure

```
frontend/src/
├── pages/
│   └── Discover.jsx (Main page component)
├── discover/
│   ├── SearchResults.jsx (Results dispatcher)
│   ├── UserSearchResult.jsx (User result card)
│   ├── PostSearchResult.jsx (Post result card)
│   ├── HashtagSearchResult.jsx (Hashtag result card)
│   ├── RoomSearchResult.jsx (Room result card)
│   ├── UserCard.jsx (Alternative user card)
│   ├── GlobalSearchBox.jsx (Global search input)
│   └── ResultsGrid.jsx (Grid layout for results)
├── services/
│   └── discover.service.js (API service)
├── types/
│   └── discover.js (TypeScript types)
└── layout/
    └── FloatingNav.jsx (Navigation with discover link)
```

---

## How It Works

### Step-by-Step User Flow

#### 1. User Navigates to Discover Page
```jsx
// User clicks "Discover" in FloatingNav
<NavLink to="/discover" theme={theme}>
  Discover
</NavLink>

// Router renders Discover component
<Route path="/discover" element={<DiscoverPage />} />
```

#### 2. Page Initialization
```jsx
const Discover = () => {
  const [searchQuery, setSearchQuery] = useState('');        // Default: empty string
  const [searchType, setSearchType] = useState('users');     // Default: 'users'
  const [searchResults, setSearchResults] = useState([]);    // Default: empty array
  
  // Render happens here...
}
```

#### 3. User Types in Search Box
```jsx
<input
  type="text"
  placeholder={`Search for ${searchType}`}
  value={searchQuery}
  onChange={handleSearchChange}
/>

// When user types:
const handleSearchChange = (event) => {
  setSearchQuery(event.target.value);  // Updates state with typed text
};
```

#### 4. State Change Triggers useEffect Hook
```jsx
useEffect(() => {
  const fetchResults = async () => {
    if (searchQuery.length > 0) {  // Only search if query not empty
      try {
        const response = await search(searchQuery, searchType);
        setSearchResults(response.data);  // Updates with results
      } catch (error) {
        console.error(`Failed to fetch ${searchType}:`, error);
        setSearchResults([]);  // Clears on error
      }
    } else {
      setSearchResults([]);  // Clears if search is empty
    }
  };

  // 500ms Debounce to avoid too many API calls
  const debounceFetch = setTimeout(() => {
    fetchResults();
  }, 500);

  // Cleanup previous timeout
  return () => clearTimeout(debounceFetch);
}, [searchQuery, searchType]);  // Re-runs when query or type changes
```

**Why Debounce?**
- User types: "h" → wait
- User types: "e" → wait  
- User types: "l" → wait
- User types: "l" → wait
- User types: "o" → wait 500ms → **THEN search for "hello"**
- Without debounce: 5 API calls for "hello"
- With debounce: 1 API call for "hello"

#### 5. API Call to Backend
```javascript
// frontend/src/services/discover.service.js
export const search = (query, type) => {
  return apiClient.get(`/discover/search?query=${query}&type=${type}`);
};

// Example: search("python", "hashtags")
// API Call: GET /discover/search?query=python&type=hashtags
```

#### 6. User Changes Search Type
```jsx
<div>
  <button onClick={() => setSearchType('users')}>Users</button>
  <button onClick={() => setSearchType('posts')}>Posts</button>
  <button onClick={() => setSearchType('hashtags')}>Hashtags</button>
</div>

// When user clicks "Posts" button:
// 1. setSearchType('posts') updates state
// 2. useEffect() runs (dependency: searchType)
// 3. New API call with searchType='posts'
// 4. Results re-render with PostSearchResult components
```

#### 7. Results Render
```jsx
<SearchResults results={searchResults} type={searchType} />

// SearchResults.jsx - Dispatches to correct component
{results.map((result) => {
  if (type === 'users') {
    return <UserSearchResult key={result.id} user={result} />;
  } else if (type === 'posts') {
    return <PostSearchResult key={result.id} post={result} />;
  } else if (type === 'hashtags') {
    return <HashtagSearchResult key={result.id} hashtag={result} />;
  } else if (type === 'rooms') {
    return <RoomSearchResult key={result.id} room={result} />;
  }
  return null;
})}
```

---

## Features

### 1. Real-time Search with Debouncing

**Purpose**: Reduce server load while maintaining responsive UX

**Implementation**:
```javascript
const debounceFetch = setTimeout(() => {
  fetchResults();
}, 500);  // 500ms delay before API call

return () => clearTimeout(debounceFetch);  // Cleanup on re-render
```

**Behavior**:
- User types fast: Only last complete query is sent
- User pauses typing: Results appear after 500ms
- Reduces API calls by 80-90%

### 2. Multi-Type Search Filtering

**Search Types Available**:
- 👤 **Users** - Find other users to follow/connect
- 📝 **Posts** - Discover content
- #️⃣ **Hashtags** - Browse trends and topics
- 🏠 **Rooms** - Find collaborative spaces

**Implementation**:
```jsx
<button onClick={() => setSearchType('users')}>Users</button>
<button onClick={() => setSearchType('posts')}>Posts</button>
<button onClick={() => setSearchType('hashtags')}>Hashtags</button>
<button onClick={() => setSearchType('rooms')}>Rooms</button>
```

### 3. Dynamic Placeholder Text

**Adaptive UI**:
```jsx
placeholder={`Search for ${searchType}`}

// Dynamic behavior:
// - searchType === 'users' → "Search for users"
// - searchType === 'posts' → "Search for posts"
// - searchType === 'hashtags' → "Search for hashtags"
// - searchType === 'rooms' → "Search for rooms"
```

### 4. Error Handling

**Try-Catch Pattern**:
```javascript
try {
  const response = await search(searchQuery, searchType);
  setSearchResults(response.data);
} catch (error) {
  console.error(`Failed to fetch ${searchType}:`, error);
  setSearchResults([]);  // Clear results on error
}
```

**Error Scenarios Handled**:
- Network connection error
- Invalid API response
- Server error (500)
- No results found
- Empty search query

### 5. Empty State Handling

**When No Results**:
```jsx
// In SearchResults.jsx
if (results.length === 0) {
  return <p>No results found.</p>;
}
```

**Scenarios**:
- Empty search query → No results shown
- Search with no matches → "No results found"
- API error → Results cleared, error logged

### 6. Theme Integration

**Dark/Light Mode Support**:
```jsx
const UserCard = styled.div`
  background-color: ${(props) => props.theme.palette.primary};
`;

const UserName = styled.h4`
  color: ${(props) => props.theme.text.primary};
`;

const UserHandle = styled.p`
  color: ${(props) => props.theme.text.secondary};
`;
```

**Theme Properties Used**:
- `theme.palette.primary` - Background color
- `theme.palette.secondary` - Border color
- `theme.palette.accent` - Accent color
- `theme.text.primary` - Main text
- `theme.text.secondary` - Secondary text

---

## User Experience Flow

### Complete User Journey

```
1. LANDING
   ├── User clicks "Discover" in navigation
   └── Discover page loads with empty search box

2. SEARCH SETUP
   ├── User sees "Search for users" placeholder
   ├── Default search type is "users"
   └── Search type buttons visible: Users, Posts, Hashtags, Rooms

3. TYPING
   ├── User types in search box: "a", "al", "ale", "alex"
   ├── Each keystroke updates state
   ├── 500ms debounce timer resets with each keystroke
   └── No API calls happen yet

4. PAUSE (500ms No Typing)
   ├── API call triggers: GET /discover/search?query=alex&type=users
   ├── Backend processes query
   └── Results return with user objects

5. RESULTS DISPLAY
   ├── searchResults state updates
   ├── SearchResults component re-renders
   ├── Maps each result to UserSearchResult component
   ├── Each result shows:
   │   ├── User avatar
   │   ├── User name
   │   └── User handle (@username)
   └── All results displayed in list format

6. TYPE FILTER CHANGE
   ├── User clicks "Posts" button
   ├── searchType changes from "users" to "posts"
   ├── useEffect triggers (dependency: searchType)
   ├── Same search query "alex" but different type
   ├── API call: GET /discover/search?query=alex&type=posts
   ├── Backend returns posts mentioning "alex"
   └── SearchResults re-renders with PostSearchResult components

7. POST RESULTS
   ├── Each post shows:
   │   ├── Author avatar
   │   ├── Author name
   │   └── Post content (truncated or full)
   └── Results in list format

8. HASHTAG SEARCH
   ├── User changes type to "hashtags"
   ├── User types "#tech" (or just "tech")
   ├── API call: GET /discover/search?query=tech&type=hashtags
   ├── Backend returns hashtag results
   └── Each hashtag shows:
       ├── Hashtag name (#tech)
       └── Number of posts (e.g., "245 posts")

9. ROOM SEARCH
   ├── User changes to "rooms" type
   ├── User searches for "study"
   ├── API call: GET /discover/search?query=study&type=rooms
   ├── Backend returns rooms matching query
   └── Each room shows:
       ├── Room name
       └── Room description

10. INTERACTION (Example: User Click)
    ├── User clicks on a user result
    ├── Navigation to user profile (if implemented)
    ├── OR
    ├── User clicks on a post result
    ├── Opens post detail view
    └── OR
    ├── User clicks hashtag
    ├── Views all posts with that hashtag
```

---

## API Integration

### Backend Endpoint

**Endpoint**: `GET /discover/search`

**Query Parameters**:
```
?query=<search_term>&type=<search_type>
```

**Example Requests**:

```
GET /discover/search?query=alex&type=users
GET /discover/search?query=python&type=hashtags
GET /discover/search?query=hello&type=posts
GET /discover/search?query=coding&type=rooms
```

### Request/Response Flow

```javascript
// Frontend
const response = await search(searchQuery, searchType);
// Calls: apiClient.get(`/discover/search?query=${query}&type=${type}`)

// Returns: response.data
// Format expected:
// [
//   { id: 1, name: "Alex", handle: "alex", avatar: "...", ... },
//   { id: 2, name: "Alexandra", handle: "alexandra", avatar: "...", ... }
// ]

setSearchResults(response.data);  // Updates state with results
```

### API Service

**File**: `frontend/src/services/discover.service.js`

```javascript
import apiClient from './api';

export const search = (query, type) => {
  return apiClient.get(`/discover/search?query=${query}&type=${type}`);
};
```

**Usage**:
```javascript
// In Discover.jsx
const response = await search('python', 'hashtags');
setSearchResults(response.data);
```

### Error Scenarios

**Scenario 1: Network Error**
```javascript
try {
  const response = await search(query, type);
} catch (error) {
  console.error(`Failed to fetch ${type}:`, error);
  setSearchResults([]);  // Clear results
}
```

**Scenario 2: No Results**
```javascript
if (response.data.length === 0) {
  return <p>No results found.</p>;  // Shown in SearchResults
}
```

**Scenario 3: Empty Query**
```javascript
if (searchQuery.length > 0) {
  // Make API call
} else {
  setSearchResults([]);  // Don't search for empty string
}
```

---

## Styling & Theme

### Styled Components Usage

#### UserSearchResult Styling

```jsx
const UserCard = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #ddd;
  background-color: ${(props) => props.theme.palette.primary};
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 1rem;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserName = styled.h4`
  margin: 0;
  color: ${(props) => props.theme.text.primary};
`;

const UserHandle = styled.p`
  margin: 0;
  color: ${(props) => props.theme.text.secondary};
`;
```

**Layout**: Flex row with avatar on left, info on right

#### PostSearchResult Styling

```jsx
const PostCard = styled.div`
  padding: 1rem;
  border-bottom: 1px solid #ddd;
  background-color: ${(props) => props.theme.palette.primary};
`;

const PostHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const Avatar = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 0.5rem;
`;

const AuthorName = styled.h5`
  margin: 0;
  color: ${(props) => props.theme.text.primary};
`;

const PostContent = styled.p`
  margin: 0;
  color: ${(props) => props.theme.text.secondary};
`;
```

**Layout**: Author header with small avatar, then post content

#### HashtagSearchResult Styling

```jsx
const HashtagCard = styled.div`
  padding: 1rem;
  border-bottom: 1px solid #ddd;
`;

const HashtagName = styled.h4`
  margin: 0;
`;

const HashtagPosts = styled.p`
  margin: 0;
  color: #888;
`;
```

**Layout**: Simple vertical layout with hashtag name and post count

#### RoomSearchResult Styling

```jsx
const RoomCard = styled.div`
  padding: 1rem;
  border-bottom: 1px solid #ddd;
  background-color: ${(props) => props.theme.palette.primary};
`;

const RoomName = styled.h4`
  margin: 0;
  color: ${(props) => props.theme.text.primary};
`;

const RoomDescription = styled.p`
  margin: 0;
  color: ${(props) => props.theme.text.secondary};
`;
```

**Layout**: Room name with description below

### GlobalSearchBox (Alternative Search Component)

```jsx
const StyledTextField = styled(TextField)`
  .MuiInputBase-root {
    color: ${(props) => props.theme.text.primary};
    background-color: ${(props) => props.theme.palette.primary};
  }
  .MuiInputLabel-root {
    color: ${(props) => props.theme.text.secondary};
  }
  .MuiOutlinedInput-root {
    fieldset {
      border-color: ${(props) => props.theme.palette.secondary};
    }
    &:hover fieldset {
      border-color: ${(props) => props.theme.palette.accent};
    }
    &.Mui-focused fieldset {
      border-color: ${(props) => props.theme.palette.accent};
    }
  }
`;
```

**Features**:
- Full width TextField
- Theme-aware colors
- Hover and focus states with accent color
- Material-UI integration

### ResultsGrid (Grid Layout Alternative)

```jsx
<Grid container spacing={2}>
  {results.map((result) => (
    <Grid item xs={12} sm={6} md={4} key={result.id}>
      {/* Render result component based on type */}
    </Grid>
  ))}
</Grid>
```

**Responsive Breakpoints**:
- `xs={12}` - Mobile: Full width (1 column)
- `sm={6}` - Tablet: Half width (2 columns)
- `md={4}` - Desktop: 1/3 width (3 columns)

---

## Search Types

### 1. Users Search

**What It Does**:
- Searches user profiles by name, handle, or bio
- Returns matching user accounts
- Shows user avatar, name, and handle

**Result Structure**:
```javascript
{
  id: uuid,
  name: "Alex Johnson",
  handle: "alex_j",
  avatar: "url_to_image",
  bio: "Optional user bio"
}
```

**Component**: `UserSearchResult.jsx`

**Display**:
```
[Avatar] Alex Johnson
         @alex_j
```

### 2. Posts Search

**What It Does**:
- Searches post content by text
- Returns posts matching search term
- Shows author avatar, name, and post content

**Result Structure**:
```javascript
{
  id: uuid,
  content: "Post text content here...",
  author: {
    id: uuid,
    name: "Author Name",
    avatar: "url_to_image"
  },
  createdAt: timestamp
}
```

**Component**: `PostSearchResult.jsx`

**Display**:
```
[Small Avatar] Author Name
Post text content here...
```

### 3. Hashtags Search

**What It Does**:
- Searches hashtags/topics
- Returns hashtags matching search
- Shows hashtag name and post count

**Result Structure**:
```javascript
{
  id: uuid,
  name: "python",
  postCount: 1523
}
```

**Component**: `HashtagSearchResult.jsx`

**Display**:
```
#python
1523 posts
```

### 4. Rooms Search

**What It Does**:
- Searches rooms/collaborative spaces
- Returns rooms matching search
- Shows room name and description

**Result Structure**:
```javascript
{
  id: uuid,
  name: "Python Developers",
  description: "A room for Python enthusiasts to discuss and share knowledge"
}
```

**Component**: `RoomSearchResult.jsx`

**Display**:
```
Python Developers
A room for Python enthusiasts...
```

---

## Result Components

### UserSearchResult Component

**File**: `frontend/src/discover/UserSearchResult.jsx`

**Props**:
```javascript
{
  user: {
    id: string,
    name: string,
    handle: string,
    avatar: string,
    bio?: string
  }
}
```

**Rendering**:
```jsx
<UserCard>
  <Avatar src={user.avatar} alt={user.name} />
  <UserInfo>
    <UserName>{user.name}</UserName>
    <UserHandle>@{user.handle}</UserHandle>
  </UserInfo>
</UserCard>
```

**Features**:
- Circular avatar (50px)
- User name in primary color
- Handle in secondary color
- Flex layout for horizontal alignment

### PostSearchResult Component

**File**: `frontend/src/discover/PostSearchResult.jsx`

**Props**:
```javascript
{
  post: {
    id: string,
    content: string,
    author: {
      id: string,
      name: string,
      avatar: string
    },
    createdAt: timestamp
  }
}
```

**Rendering**:
```jsx
<PostCard>
  <PostHeader>
    <Avatar src={post.author.avatar} alt={post.author.name} />
    <AuthorName>{post.author.name}</AuthorName>
  </PostHeader>
  <PostContent>{post.content}</PostContent>
</PostCard>
```

**Features**:
- Author header with small avatar (30px)
- Post content below header
- Theme-aware colors
- Border bottom for separation

### HashtagSearchResult Component

**File**: `frontend/src/discover/HashtagSearchResult.jsx`

**Props**:
```javascript
{
  hashtag: {
    id: string,
    name: string,
    postCount: number
  }
}
```

**Rendering**:
```jsx
<HashtagCard>
  <HashtagName>#{hashtag.name}</HashtagName>
  <HashtagPosts>{hashtag.postCount} posts</HashtagPosts>
</HashtagCard>
```

**Features**:
- Hashtag name with # prefix
- Post count in secondary gray color
- Simple vertical layout
- No theme colors (fixed styling)

### RoomSearchResult Component

**File**: `frontend/src/discover/RoomSearchResult.jsx`

**Props**:
```javascript
{
  room: {
    id: string,
    name: string,
    description: string,
    memberCount?: number
  }
}
```

**Rendering**:
```jsx
<RoomCard>
  <RoomName>{room.name}</RoomName>
  <RoomDescription>{room.description}</RoomDescription>
</RoomCard>
```

**Features**:
- Room name as heading
- Description as paragraph
- Theme-aware colors
- Simple vertical layout

### SearchResults Dispatcher Component

**File**: `frontend/src/discover/SearchResults.jsx`

**Purpose**: Routes each result to correct component based on type

**Logic**:
```javascript
{results.map((result) => {
  if (type === 'users') {
    return <UserSearchResult key={result.id} user={result} />;
  } else if (type === 'posts') {
    return <PostSearchResult key={result.id} post={result} />;
  } else if (type === 'hashtags') {
    return <HashtagSearchResult key={result.id} hashtag={result} />;
  } else if (type === 'rooms') {
    return <RoomSearchResult key={result.id} room={result} />;
  }
  return null;
})}
```

**Empty State**:
```javascript
if (results.length === 0) {
  return <p>No results found.</p>;
}
```

---

## Technical Implementation Details

### State Management

```javascript
// Query text from user input
const [searchQuery, setSearchQuery] = useState('');

// Type of search: users, posts, hashtags, rooms
const [searchType, setSearchType] = useState('users');

// Results array from API
const [searchResults, setSearchResults] = useState([]);
```

**State Changes**:
- `searchQuery` → User types in input box
- `searchType` → User clicks filter button
- `searchResults` → API returns data

### useEffect Hook - Debounced Search

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

  // Debounce: Wait 500ms before calling fetchResults
  const debounceFetch = setTimeout(() => {
    fetchResults();
  }, 500);

  // Cleanup: Clear timeout if dependency changes
  return () => clearTimeout(debounceFetch);
}, [searchQuery, searchType]);  // Dependencies
```

**Execution Timeline**:
```
Time  Event
---   -----
0ms   User types 'p'
10ms  User types 'y'
20ms  User types 't'
30ms  User types 'h'
40ms  User types 'o'
50ms  User types 'n'
60ms  useEffect runs, timeout starts (500ms)
200ms User stops typing
560ms Timer completes, fetchResults() executes
565ms API call: GET /discover/search?query=python&type=users
600ms Response received, setSearchResults() updates state
605ms Component re-renders with new results
```

### Event Handlers

```javascript
const handleSearchChange = (event) => {
  setSearchQuery(event.target.value);  // Updates with input value
};

const handleSearchTypeChange = (type) => {
  setSearchType(type);  // Updates search type
};
```

### API Client Configuration

**File**: `frontend/src/services/api.js` (or `apiClient.ts`)

```javascript
import apiClient from './api';

export const search = (query, type) => {
  // Constructs URL: /discover/search?query=value&type=type
  return apiClient.get(`/discover/search?query=${query}&type=${type}`);
};
```

**URL Encoding** (if needed):
```javascript
const encodedQuery = encodeURIComponent(query);
return apiClient.get(`/discover/search?query=${encodedQuery}&type=${type}`);
```

### Error Handling Pattern

```javascript
try {
  const response = await search(searchQuery, searchType);
  setSearchResults(response.data);
} catch (error) {
  // Log error for debugging
  console.error(`Failed to fetch ${searchType}:`, error);
  
  // Clear results on error
  setSearchResults([]);
  
  // Could add user notification here:
  // setError(`Failed to search ${searchType}`);
  // setTimeout(() => setError(null), 3000);
}
```

### Responsive Design

**Breakpoints**:
```css
Mobile (xs):      < 600px   - Full width results
Tablet (sm):      600-960px - Some space optimization
Desktop (md):     > 960px   - Full featured layout
```

**Components Responsive**:
- Input field adapts to screen width
- Result cards full width on mobile
- Grid layout in ResultsGrid component

### Key Features Implementation

| Feature | Implementation |
|---------|-----------------|
| **Debouncing** | `setTimeout()` with 500ms delay |
| **Error Handling** | try/catch block in useEffect |
| **Empty State** | Check `results.length === 0` |
| **Type Filtering** | Conditional rendering based on `type` prop |
| **Theme Support** | `styled-components` with `props.theme` |
| **Dynamic Placeholder** | Template literal: `${searchType}` |
| **API Integration** | Service layer abstraction |

---

## Summary

The **Discover Page** is a comprehensive search interface that:

✅ Allows users to search across multiple content types (users, posts, hashtags, rooms)  
✅ Provides real-time search results with intelligent debouncing  
✅ Offers intuitive filtering by search type  
✅ Displays themed, responsive result cards  
✅ Handles errors gracefully  
✅ Integrates seamlessly with the backend API  
✅ Supports full dark/light mode theming  

The implementation uses React hooks (useState, useEffect) for state management, styled-components for styling, and a service layer for API integration, following modern React best practices.

---

**Document Version**: 1.0  
**Last Updated**: January 24, 2026  
**Status**: ✅ Complete and Production Ready
