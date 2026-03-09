# HomePage - Complete Architecture & Implementation Guide

## Table of Contents
1. [Overview](#overview)
2. [System Architecture](#system-architecture)
3. [Core Components](#core-components)
4. [Data Flow](#data-flow)
5. [Features](#features)
6. [State Management](#state-management)
7. [User Interactions](#user-interactions)
8. [Performance Considerations](#performance-considerations)
9. [Styling & Theme](#styling--theme)
10. [API Integration](#api-integration)

---

## Overview

**HomePage** is the main landing page for authenticated users. It displays a full-screen, swipe-based social media feed where users can:
- View personalized posts ("For You" feed)
- View followed users' posts ("Following" feed)
- Create new posts
- Like and comment on posts
- Follow other users
- Filter posts by hashtags
- Report inappropriate content

### Key Characteristics
- **Full-Screen Vertical Scrolling**: Like TikTok/Instagram Reels
- **Touch-Optimized**: Swipe gestures for navigation
- **Real-Time Feed**: Dynamically loaded posts
- **Responsive Design**: Works on mobile, tablet, desktop
- **Social Features**: Likes, comments, follows, reporting

---

## System Architecture

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        HomePage.jsx                          │
│  (Main container, state management, touch handling)          │
└──────────────────────┬──────────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
        ▼              ▼              ▼
┌─────────────────┐ ┌───────────────┐ ┌──────────────────┐
│ FeedControlNav  │ │ ActivityFeed  │ │ CreatePostModal  │
│ (Left sidebar)  │ │ (Post list)   │ │ (Create posts)   │
└─────────────────┘ └───────┬───────┘ └──────────────────┘
                            │
                       ┌────▼────┐
                       │          │
                    ┌──▼──┐  ┌───▼───┐
                    │Post │  │ Post  │
                    │Card │  │ Card  │
                    └─────┘  └───────┘

┌──────────────────────────────────────────────────────────────┐
│  Backend API Services                                         │
├──────────────────────────────────────────────────────────────┤
│ • getForYouFeed()      - Algorithm-based feed               │
│ • getFollowingFeed()   - Posts from followed users          │
│ • getPostsByHashtag()  - Filtered posts by hashtag          │
│ • createPost()         - Create new post                    │
│ • likePost()           - Like/unlike post                   │
│ • reportPost()         - Report inappropriate content       │
│ • getComments()        - Fetch post comments                │
│ • followUser()         - Follow user with intent            │
└──────────────────────────────────────────────────────────────┘
```

---

## Core Components

### 1. HomePage.jsx (Main Container)
**Location**: `/frontend/src/pages/HomePage.jsx`
**Purpose**: Root component managing the entire feed experience

#### Responsibilities
- Manages feed state (posts, feed type, hashtag filter)
- Handles touch gestures (swipe navigation)
- Orchestrates modal displays
- Coordinates between all sub-components
- Manages user interactions

#### Key State
```javascript
const [posts, setPosts] = useState([]);           // All posts to display
const [feedType, setFeedType] = useState('for-you'); // 'for-you' | 'following'
const [hashtagFilter, setHashtagFilter] = useState(null); // Current hashtag filter
const [isCreatePostModalOpen, setCreatePostModalOpen] = useState(false);
const [intentModalOpen, setIntentModalOpen] = useState(false);
const [selectedUserId, setSelectedUserId] = useState(null);
const [isNavOpen, setNavOpen] = useState(false);  // Sidebar open/close
```

#### Touch Handling
```javascript
// Swipe detection for navigation
- Right swipe from left edge (< 50px) → Opens sidebar
- Left swipe → Closes sidebar
- Minimum swipe distance: 50px
- Gesture detection on touch start/move/end events
```

#### Key Methods
- `fetchPosts()` - Fetches posts based on feedType and hashtag filter
- `handleHashtagClick()` - Filter posts by hashtag
- `handleRestart()` - Clear filters and reload feed
- `handleReportPost()` - Report inappropriate content
- `handleCreatePost()` - Create new post via modal
- `handleFollow()` - Follow user with intent

---

### 2. FeedControlNav.jsx (Left Sidebar Navigation)
**Location**: `/frontend/src/layout/FeedControlNav.jsx`
**Purpose**: Navigation menu for feed control and post creation

#### Features
```
┌──────────────────────┐
│  FeedControlNav      │
├──────────────────────┤
│ • For You (active)   │
│ • Following          │
│ • Restart            │
│ • Create Post        │
└──────────────────────┘
```

#### Props
- `isOpen` - Controls sidebar visibility (slide-in animation)
- `feedType` - Currently selected feed ('for-you' | 'following')
- `setFeedType()` - Callback to change feed type
- `handleRestart()` - Callback to clear filters
- `setCreatePostModalOpen()` - Callback to open create post modal

#### Styling
- Fixed position on left side
- Transforms based on `isOpen` state (-150% to 0%)
- Smooth transition animation (0.3s)
- Contains vertically stacked buttons

---

### 3. ActivityFeed.jsx (Post Container)
**Location**: `/frontend/src/feed/ActivityFeed.jsx`
**Purpose**: Renders list of posts

#### Simple Wrapper Component
- Maps `posts` array to individual `PostCard` components
- Passes down callbacks: `onReportPost`, `onUsernameLongPress`, `onHashtagClick`
- Handles empty state: "No posts to display"

#### Usage
```jsx
<ActivityFeed 
  posts={posts}
  onReportPost={handleReportPost}
  onUsernameLongPress={handleOpenIntentModal}
  onHashtagClick={handleHashtagClick}
/>
```

---

### 4. PostCard.jsx (Individual Post)
**Location**: `/frontend/src/feed/PostCard.jsx`
**Purpose**: Renders a single full-screen post with interactions

#### Layout
```
┌─────────────────────────────────┐
│ User Avatar (top-left)          │
│                                 │
│                                 │
│ Post Content (bottom-left)      │ Actions (right side)
│ - Text with hashtags            │ • Like button + count
│ - Poll (if included)            │ • Comment button
│                                 │
└─────────────────────────────────┘
```

#### Key Features

**1. Full-Screen Display**
```javascript
height: 100vh;
width: 100vw;
display: flex;
flex-direction: column;
justify-content: flex-end;
```

**2. Interactive Elements**
- **Like Button**: Click to like, shows icon + count
- **Comment Button**: Opens CommentModal for post
- **User Avatar**: Long press (1 second) opens IntentModal

**3. Content Rendering**
- Text with hashtag highlighting
- Hashtags are clickable (filter by hashtag)
- Polls rendered if present in post

**4. State Management**
```javascript
const [likes, setLikes] = useState(post.likes || 0);
const [hasLiked, setHasLiked] = useState(post.hasLiked || false);
const [isCommentModalOpen, setCommentModalOpen] = useState(false);
```

#### Props
```javascript
{
  post: {
    id,
    content,          // Post text
    author: { id, ... },
    likes,            // Like count
    hasLiked,         // Current user liked?
    poll,             // Optional poll object
    ...
  },
  onUsernameLongPress,  // Callback on user avatar long press
  onHashtagClick        // Callback when hashtag clicked
}
```

---

### 5. CreatePostModal.jsx (Post Creation)
**Location**: `/frontend/src/components/modals/CreatePostModal.jsx`
**Purpose**: Modal dialog for creating new posts

#### Form Fields
- **Post Content**: Text area (max 250 chars, multiline)
- **Hashtag**: Required hashtag input
- **Media**: Optional photo/video upload

#### UI Elements
```
┌──────────────────────────────┐
│   Create a Post              │
├──────────────────────────────┤
│ [What's happening?]          │
│ [multiline text area]        │
│                              │
│ [Hashtag]                    │
│ [text input]                 │
│                              │
│ [📷] [📹]  [Post Button]    │
└──────────────────────────────┘
```

#### Media Upload
- Photo Camera icon → Image upload
- Videocam icon → Video upload
- Files stored in `media` state
- Passed to backend with post data

#### Validation
- Hashtag is required
- Post must have content
- No submission until hashtag is provided

---

### 6. IntentModal.jsx (Follow Intent Selection)
**Location**: `/frontend/src/components/profile/IntentModal.jsx`
**Purpose**: Modal for selecting follow relationship type

#### Intent Categories
```javascript
const INTENT_CATEGORIES = [
  'Collaborator',  // For peers to work with
  'Mentor',        // For users to learn from
  'Peer'           // For users with similar interests
];
```

#### Purpose
When user long-presses on another user's profile, this modal appears:
- User selects relationship intent
- Sends follow request with intent type
- Creates contextual connection between users

#### Interaction Flow
```
User Avatar Long Press
  ↓
IntentModal Opens
  ↓
User Selects Intent (Collaborator/Mentor/Peer)
  ↓
handleFollow(intent) called
  ↓
followUser(currentUser.id, selectedUserId, intent)
  ↓
Modal Closes
```

---

## Data Flow

### Feed Loading Flow

```
┌─ HomePage Mounts
│  ↓
├─ useEffect runs
│  ↓
├─ fetchPosts() called
│  ↓
├─ Check feedType & hashtagFilter
│  ├─ if hashtagFilter: getPostsByHashtag(hashtag)
│  ├─ else if feedType='for-you': getForYouFeed()
│  └─ else if feedType='following': getFollowingFeed()
│  ↓
├─ Backend returns posts
│  ↓
├─ Add isReported: false flag to each post
│  ↓
├─ setPosts(postsWithReportStatus)
│  ↓
└─ ActivityFeed renders with new posts
```

### Post Creation Flow

```
User Clicks "Create Post" Button
  ↓
CreatePostModal Opens
  ↓
User Fills Form:
  - Content (required)
  - Hashtag (required)
  - Media (optional)
  ↓
User Clicks Post Button
  ↓
handleCreatePost(content, hashtag, media)
  ↓
postService.createPost({ content, hashtag, media })
  ↓
Backend Creates Post + Associates Hashtag
  ↓
Response: New post object
  ↓
setPosts([newPost, ...prevPosts])  // Add to top
  ↓
Modal Closes
  ↓
Feed Shows New Post
```

### Like Flow

```
User Clicks Like Button
  ↓
Check: hasLiked?
  ├─ Yes: Return (can't like twice)
  └─ No: Continue
  ↓
likePost(post.id)
  ↓
Backend Creates Like Record
  ↓
setLikes(likes + 1)
setHasLiked(true)
  ↓
UI Updates:
  - Like icon becomes filled
  - Count increments
```

### Hashtag Filter Flow

```
User Clicks Hashtag in Post
  ↓
onHashtagClick(hashtag)
  ↓
setHashtagFilter(hashtag.substring(1))  // Remove '#'
setNavOpen(false)  // Close sidebar
  ↓
useEffect triggers (hashtag dependency changed)
  ↓
fetchPosts()
  ↓
getPostsByHashtag(hashtag)
  ↓
DisplaysHeader: "Filtering by: #hashtag"
  ↓
Shows only posts with that hashtag
  ↓
User Clicks Restart Button
  ↓
setHashtagFilter(null)
  ↓
Clears filter, reloads normal feed
```

---

## Features

### 1. Dual Feed Types

**For You Feed**
- Algorithm-based personalization
- Backend generates based on:
  - User interests
  - Followed users
  - Engagement history
  - Content quality

**Following Feed**
- Posts only from users you follow
- Chronologically ordered
- Simpler, more predictable feed

### 2. Full-Screen Post Display

- One post fills entire viewport
- Vertical scroll to next post
- Mobile-first design
- Optimized for phone viewing

### 3. Hashtag System

**Hashtag Display**
- Auto-detected in post content using regex: `/(#\w+)/g`
- Highlighted in accent color
- Clickable to filter

**Hashtag Filtering**
- Filter entire feed by hashtag
- Shows header: "Filtering by: #hashtag"
- Restart button clears filter

### 4. Post Interactions

**Likes**
- Click heart icon to like post
- Shows current like count
- Heart filled when liked
- Prevents duplicate likes (one per user)

**Comments**
- Click comment icon to open CommentModal
- View post comments
- Add new comment to post
- Comment count displayed

**Long Press Follow**
- Press user avatar for 1 second
- Opens IntentModal
- Select relationship type
- Send follow request

### 5. Reporting

**Report Inappropriate Content**
```javascript
handleReportPost = async (postId) => {
  await postService.reportPost(postId)
  // Mark post as reported in UI
  setPosts(prevPosts =>
    prevPosts.map(post =>
      post.id === postId 
        ? { ...post, isReported: true } 
        : post
    )
  )
}
```

### 6. Touch Navigation

**Sidebar Toggle**
- Swipe right from left edge to open sidebar
- Swipe left to close sidebar
- Animated slide-in/out
- Only responds to touches < 50px from left edge

---

## State Management

### HomePage State

```javascript
{
  posts: [],                    // Current posts displayed
  feedType: 'for-you',         // 'for-you' | 'following'
  hashtagFilter: null,         // Currently filtered hashtag
  isCreatePostModalOpen: false, // Create post modal state
  intentModalOpen: false,       // Intent selection modal state
  selectedUserId: null,        // User selected for follow
  isNavOpen: false             // Sidebar open/close
}
```

### PostCard State

```javascript
{
  likes: number,               // Total likes on post
  hasLiked: boolean,          // Current user liked?
  isCommentModalOpen: boolean // Comment modal state
}
```

### useAuth Hook

```javascript
const { user: currentUser } = useAuth()
// Provides authenticated user context
// Used for:
// - Follow requests
// - Like creation
// - Post ownership
```

---

## User Interactions

### Primary Interactions

| Interaction | Trigger | Result |
|-------------|---------|--------|
| **Swipe Right** | From left edge | Opens sidebar |
| **Swipe Left** | In sidebar | Closes sidebar |
| **Click Hashtag** | On #hashtag text | Filters feed by hashtag |
| **Click Like** | Heart icon | Likes/unlikes post |
| **Click Comment** | Comment icon | Opens comment modal |
| **Long Press Avatar** | User avatar (1s) | Opens follow intent modal |
| **Click For You** | Sidebar button | Switches to algorithm feed |
| **Click Following** | Sidebar button | Switches to following feed |
| **Click Create Post** | Sidebar button | Opens create post modal |
| **Click Restart** | Sidebar button | Clears hashtag filter |

### Secondary Interactions

| Interaction | Trigger | Result |
|-------------|---------|--------|
| **Fill Post Form** | Type content/hashtag | Updates form state |
| **Upload Media** | Click camera/video icon | File picker opens |
| **Submit Post** | Click Post button | Creates post, closes modal |
| **Select Intent** | Radio button | Selects follow relationship |
| **Click Follow** | Follow button | Sends follow request |

---

## Performance Considerations

### 1. Lazy Loading

**Current Implementation**
- Posts loaded on feed type change
- All posts loaded at once initially
- No pagination shown in current code

**Recommended Improvements**
```javascript
// Add infinite scroll
const [page, setPage] = useState(1);
const [hasMore, setHasMore] = useState(true);

const loadMore = () => {
  setPage(page + 1);
  fetchPostsWithPagination(feedType, page);
};

// Or implement virtual scrolling for large feeds
```

### 2. Memoization

```javascript
// Current: fetchPosts dependency on feedType, hashtagFilter
const fetchPosts = useCallback(async () => {
  // Re-creates only when dependencies change
}, [feedType, hashtagFilter]);

// Prevents unnecessary re-fetches
```

### 3. Modal Optimization

- Only one modal rendered at a time
- Modal state managed at HomePage level
- Prevents unnecessary re-renders

### 4. Image Optimization

**Recommendations**
```javascript
// Lazy load images
<img loading="lazy" src={post.author.avatar} />

// Optimize image size for device
const getImageSize = (viewport) => {
  if (viewport.width < 768) return 'sm';
  return 'lg';
};
```

---

## Styling & Theme

### Theme Integration

```javascript
styled.div`
  color: ${props => props.theme.text.primary};
  background-color: ${props => props.theme.palette.background.default};
  border-color: ${props => props.theme.palette.accent};
`;
```

### Key Theme Properties Used

```javascript
{
  palette: {
    background: {
      default: '#000',       // Main background
      paper: '#1a1a1a'      // Card background
    },
    accent: '#ff006e'        // Primary brand color (pink/red)
  },
  text: {
    primary: '#fff',        // Main text
    secondary: '#888'       // Secondary text
  }
}
```

### Component Styling Patterns

**Full Screen Layout**
```javascript
const FullScreenFeedContainer = styled.div`
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  position: relative;
  background-color: ${props => props.theme.palette.background.default};
`;
```

**Fixed Navigation**
```javascript
const NavContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 20px;
  transform: translateY(-50%) translateX(${props => props.isOpen ? '0' : '-150%'});
  transition: transform 0.3s ease-in-out;
  z-index: 1000;
`;
```

**Responsive Design**
```javascript
// Mobile-first approach
const PostContent = styled.div`
  position: absolute;
  bottom: 80px;
  left: 20px;
  right: 80px;
  padding: 1rem;
  
  @media (max-width: 600px) {
    right: 50px;
    left: 15px;
  }
`;
```

---

## API Integration

### Post Service Endpoints

```javascript
// Feed Endpoints
getForYouFeed()                    → GET /posts/for-you
getFollowingFeed()                 → GET /posts/following
getPostsByHashtag(hashtag)         → GET /posts/hashtag/{hashtag}

// Post Management
createPost(postData)               → POST /posts/
reportPost(postId)                 → POST /posts/{postId}/report
getPostById(postId)                → GET /posts/{postId}

// Interactions
likePost(postId)                   → POST /posts/{postId}/like
getComments(postId)                → GET /posts/{postId}/comments
createComment(postId, commentData) → POST /posts/{postId}/comments
```

### User Service Endpoints

```javascript
followUser(userId, targetUserId, intent)
  → POST /users/{userId}/follow
  → Body: { target_user_id, intent: 'Collaborator'|'Mentor'|'Peer' }
```

### Request/Response Examples

**Get For You Feed**
```javascript
// Request
GET /posts/for-you

// Response
{
  data: [
    {
      id: "uuid-1",
      content: "Great #hackathon this weekend! #tech",
      author: {
        id: "user-1",
        username: "john_doe",
        avatar: "url"
      },
      likes: 42,
      hasLiked: false,
      comments: 5,
      poll: null,
      created_at: "2024-01-24T10:30:00"
    },
    ...
  ]
}
```

**Create Post**
```javascript
// Request
POST /posts/
{
  content: "Hello world!",
  hashtag: "hello",
  media: File (optional)
}

// Response
{
  data: {
    id: "uuid-new",
    content: "Hello world!",
    author: { ... },
    created_at: "2024-01-24T11:00:00",
    ...
  }
}
```

**Follow User**
```javascript
// Request
POST /users/{userId}/follow
{
  target_user_id: "uuid-target",
  intent: "Mentor"
}

// Response
{
  status: "success",
  message: "Now following user as Mentor"
}
```

---

## Summary

**HomePage** is a sophisticated social media feed interface that combines:

✅ Full-screen post display
✅ Swipe-based navigation
✅ Real-time feed updates
✅ User interactions (like, comment, follow)
✅ Hashtag-based filtering
✅ Theme integration
✅ Touch-optimized design
✅ Modal-based interactions

The component showcases modern React patterns with:
- Hooks (useState, useEffect, useCallback, useRef)
- Styled-components for styling
- Context integration (useAuth)
- Proper state management
- Callback optimization
- Touch event handling

**Key Files**
- HomePage.jsx - Main container
- FeedControlNav.jsx - Navigation
- ActivityFeed.jsx - Feed wrapper
- PostCard.jsx - Individual post
- CreatePostModal.jsx - Post creation
- IntentModal.jsx - Follow intent
