# HomePage - Deep Technical Architecture

## Table of Contents
1. [System Design](#system-design)
2. [Rendering Pipeline](#rendering-pipeline)
3. [State Management Deep Dive](#state-management-deep-dive)
4. [Event Handling & Gestures](#event-handling--gestures)
5. [Feed Algorithm Integration](#feed-algorithm-integration)
6. [Performance Optimization](#performance-optimization)
7. [Error Handling](#error-handling)
8. [Security Considerations](#security-considerations)
9. [Deployment Considerations](#deployment-considerations)

---

## System Design

### Architecture Overview

```
┌──────────────────────────────────────────────────────────┐
│                     Browser Client                       │
├──────────────────────────────────────────────────────────┤
│  HomePage.jsx (State Container)                          │
│  ├─ Feed State Management                                │
│  ├─ Touch Gesture Detection                              │
│  ├─ Modal Orchestration                                  │
│  └─ Callback Coordination                                │
└──────────────────────────────────────────────────────────┘
                         ▲
                         │ React Component Tree
                         │
        ┌────────────────┼────────────────┐
        ▼                ▼                ▼
   ┌─────────────┐  ┌──────────────┐  ┌─────────────┐
   │FeedControl  │  │ActivityFeed  │  │CreatePost   │
   │Nav (50LOC)  │  │(30LOC)       │  │Modal (122)  │
   └─────────────┘  └──────┬───────┘  └─────────────┘
                          │
                ┌─────────┴─────────┐
                ▼                   ▼
            PostCard × N      (Full Screen)
           (180LOC each)       (100vh × 100vw)
           
┌──────────────────────────────────────────────────────────┐
│                    React DOM                             │
├──────────────────────────────────────────────────────────┤
│ DOM Tree (Virtual → Real)                                │
│ Styled Components CSS-in-JS                              │
│ Theme Provider Context                                   │
└──────────────────────────────────────────────────────────┘
                         ▲
                         │ Network
                         │
┌──────────────────────────────────────────────────────────┐
│              Backend API Server                          │
├──────────────────────────────────────────────────────────┤
│ POST Endpoints:                                          │
│  • GET /posts/for-you          (Personalized feed)      │
│  • GET /posts/following         (Following feed)        │
│  • GET /posts/hashtag/{tag}     (Filtered posts)        │
│  • POST /posts/                 (Create post)           │
│  • POST /posts/{id}/like        (Like post)             │
│  • POST /posts/{id}/report      (Report post)           │
│  • POST /posts/{id}/comments    (Comment on post)       │
│  • POST /users/{id}/follow      (Follow user)           │
└──────────────────────────────────────────────────────────┘
                         ▲
                         │ SQL Queries
                         │
┌──────────────────────────────────────────────────────────┐
│            PostgreSQL Database                           │
├──────────────────────────────────────────────────────────┤
│ Tables:                                                  │
│  • posts (id, content, author_id, created_at, ...)     │
│  • users (id, username, email, ...)                     │
│  • likes (post_id, user_id, created_at)                │
│  • comments (id, post_id, user_id, content, ...)       │
│  • follows (follower_id, followed_id, intent)          │
│  • post_hashtags (post_id, hashtag_id)                 │
│  • hashtags (id, tag, created_at)                       │
└──────────────────────────────────────────────────────────┘
```

---

## Rendering Pipeline

### Initialization Sequence

```
1. HomePage Component Mounts
   └─ useEffect hooks registered
   
2. Auth Context Accessed
   └─ currentUser obtained from useAuth()
   
3. Initial State Created
   ├─ posts: []
   ├─ feedType: 'for-you'
   ├─ hashtagFilter: null
   ├─ All modals: closed
   └─ Navigation: closed
   
4. useEffect Triggers
   └─ [feedType, hashtagFilter] dependencies
   
5. fetchPosts() Executes
   ├─ if hashtagFilter: getPostsByHashtag(hashtag)
   ├─ else if feedType='for-you': getForYouFeed()
   └─ else if feedType='following': getFollowingFeed()
   
6. API Request Sent
   └─ Network request to backend
   
7. Response Received
   └─ Posts array returned
   
8. State Updated
   └─ setPosts(posts)
   
9. Re-render Triggered
   └─ Components re-render with new posts
   
10. ActivityFeed Renders
    └─ PostCard × N rendered in DOM
    
11. CSS-in-JS Applied
    └─ Styled components rendered
    
12. DOM Mutations
    └─ Browser paints new content
    
13. User Can See Feed
    └─ Ready for interaction
```

### Component Render Order

```
HomePageRender (Root)
  │
  ├─ FullScreenFeedContainer renders
  │  └─ Div with touch handlers attached
  │
  ├─ HashtagHeader renders (if hashtagFilter)
  │  └─ Shows "Filtering by: #hashtag"
  │
  ├─ FeedControlNav renders
  │  ├─ Sidebar div
  │  └─ 4 buttons inside
  │
  ├─ CreatePostModal renders
  │  ├─ Modal backdrop
  │  └─ ModalContainer with form
  │
  ├─ ActivityFeed renders
  │  └─ PostCard × N map
  │     ├─ FullScreenCard (full viewport)
  │     ├─ UserAvatar
  │     ├─ PostContent
  │     │  ├─ PostText
  │     │  └─ FeedPoll (if exists)
  │     └─ VerticalActions
  │        ├─ Like button + count
  │        └─ Comment button
  │
  └─ IntentModal renders
     ├─ Modal backdrop
     └─ Box with radio buttons
```

---

## State Management Deep Dive

### State Mutations Flow

```javascript
// 1. User Clicks "For You" Button
onClick={() => setFeedType('for-you')}

// 2. State Updated
feedType: 'for-you' (was 'following')

// 3. useEffect Dependency Triggers
useEffect(() => {
  fetchPosts();  // Executes because feedType changed
}, [feedType, hashtagFilter])

// 4. Fetch Logic Executes
const fetchPosts = useCallback(async () => {
  try {
    let response;
    if (hashtagFilter) {
      // hashtagFilter is null, so skip this
    } else {
      if (feedType === 'for-you') {  // ← TRUE NOW
        response = await postService.getForYouFeed();
      } else {
        response = await postService.getFollowingFeed();
      }
    }
    const postsWithReportStatus = response.data.map(post => ({
      ...post,
      isReported: false
    }));
    setPosts(postsWithReportStatus);  // ← STATE UPDATE
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    setPosts([]);
  }
}, [feedType, hashtagFilter])

// 5. Component Re-renders
// ActivityFeed receives new posts prop
// PostCard × N components re-render

// 6. Browser Re-paints
// New posts visible on screen
```

### Complex State Change: Hashtag Filter

```javascript
// User clicks hashtag in post
<Hashtag onClick={() => onHashtagClick(part)}>{part}</Hashtag>

// ↓ Callback invoked
onHashtagClick('#technology')

// ↓ In HomePage
const handleHashtagClick = (hashtag) => {
  setHashtagFilter(hashtag.substring(1));  // Remove '#'
  setNavOpen(false);  // Close sidebar
}

// State becomes:
{
  hashtagFilter: 'technology',  // Was null
  isNavOpen: false              // Was possibly true
}

// useEffect triggers (hashtagFilter changed)
useEffect(() => {
  fetchPosts();
}, [feedType, hashtagFilter])  // ← hashtagFilter is dependency

// fetchPosts checks:
if (hashtagFilter) {  // ← TRUE now
  response = await postService.getPostsByHashtag(hashtagFilter);
  // Gets only posts with 'technology' hashtag
}

// Result:
// - Header shows: "Filtering by: #technology"
// - Only posts with #technology displayed
// - All other posts hidden
```

### Modal State Management

```javascript
// Create Post Modal
const [isCreatePostModalOpen, setCreatePostModalOpen] = useState(false)

// Flow: Closed → Open → Closed
setCreatePostModalOpen(true)   // User clicks button
// ↓
<CreatePostModal open={true} />
// Modal renders, form displayed, user fills it
// ↓
handleCreatePost(content, hashtag, media)
setCreatePostModalOpen(false)  // Form submitted
// ↓
<CreatePostModal open={false} />
// Modal unmounts, user sees feed again with new post
```

---

## Event Handling & Gestures

### Touch Gesture Recognition

```javascript
// Setup: Store starting and ending X positions
const touchStartX = useRef(0);
const touchEndX = useRef(0);
const minSwipeDistance = 50;

// Step 1: Touch Starts
const handleTouchStart = (e) => {
  touchStartX.current = e.targetTouches[0].clientX;  // Save start X
  touchEndX.current = e.targetTouches[0].clientX;    // Initialize end X
}

// Step 2: Touch Moves
const handleTouchMove = (e) => {
  touchEndX.current = e.targetTouches[0].clientX;  // Update end X as finger moves
}

// Step 3: Touch Ends - Gesture Recognition
const handleTouchEnd = () => {
  const distance = touchStartX.current - touchEndX.current;
  
  // Calculate distances
  const isLeftSwipe = distance > minSwipeDistance;   // Negative distance
  const isRightSwipe = distance < -minSwipeDistance; // Positive distance
  
  // Logic:
  if (touchStartX.current < 50 && isRightSwipe) {
    // Started in left edge (< 50px) AND moved right
    setNavOpen(true);  // Open sidebar
  }
  
  if (isNavOpen && isLeftSwipe) {
    // Sidebar is open AND moved left
    setNavOpen(false);  // Close sidebar
  }
}

// Attach to container
<FullScreenFeedContainer
  onTouchStart={handleTouchStart}
  onTouchMove={handleTouchMove}
  onTouchEnd={handleTouchEnd}
>
```

### Long Press Detection (PostCard)

```javascript
const pressTimer = useRef();

const handlePressStart = useCallback(() => {
  // Timer set to 1 second
  pressTimer.current = setTimeout(() => {
    onUsernameLongPress(post.author.id);  // Trigger after 1 second
  }, 1000);
}, [onUsernameLongPress, post.author.id]);

const handlePressEnd = useCallback(() => {
  clearTimeout(pressTimer.current);  // Cancel timer if released early
}, []);

// Attached to user avatar
<div
  onMouseDown={handlePressStart}      // Desktop: Mouse down
  onMouseUp={handlePressEnd}          // Desktop: Mouse up
  onMouseLeave={handlePressEnd}       // Desktop: Mouse leaves element
  onTouchStart={handlePressStart}     // Mobile: Touch start
  onTouchEnd={handlePressEnd}         // Mobile: Touch end
>
```

### Click Event Handling

```javascript
// Like Button Click
const handleLike = async () => {
  if (hasLiked) return;  // Already liked, ignore
  
  try {
    await likePost(post.id);  // API call
    setLikes(likes + 1);      // Optimistic update
    setHasLiked(true);        // Mark as liked
  } catch (error) {
    console.error("Failed to like post:", error);
    // Revert on error
  }
}

// Hashtag Click
const renderContentWithHashtags = (content) => {
  const hashtagRegex = /(#\w+)/g;
  const parts = content.split(hashtagRegex);
  
  return parts.map((part, index) => {
    if (part.match(hashtagRegex)) {
      return (
        <Hashtag
          key={index}
          onClick={() => onHashtagClick(part)}  // ← Click handler
        >
          {part}
        </Hashtag>
      );
    }
    return part;
  });
}
```

---

## Feed Algorithm Integration

### For You Feed Algorithm (Backend)

```python
# Pseudo-code: Backend algorithm
def get_for_you_feed(user_id, limit=20):
    """
    Algorithm:
    1. Get user interests/profile
    2. Get users they follow
    3. Fetch posts from multiple sources:
       - Posts from followed users (40%)
       - Posts from recommended users (30%)
       - Trending posts (20%)
       - Posts matching interests (10%)
    4. Rank by engagement, recency, relevance
    5. Return top 20 posts
    """
    
    user = get_user(user_id)
    followed_users = get_followed_users(user_id)
    user_interests = get_user_interests(user_id)
    
    # Fetch posts from different sources
    following_posts = get_posts_from_users(
        followed_users,
        limit=8,  # 40%
        sort_by='recent'
    )
    
    recommended_posts = get_posts_from_recommended_users(
        user_id,
        limit=6,  # 30%
        sort_by='engagement'
    )
    
    trending_posts = get_trending_posts(
        limit=4  # 20%
    )
    
    interest_posts = get_posts_by_interests(
        user_interests,
        limit=2  # 10%
    )
    
    # Combine and rank
    all_posts = following_posts + recommended_posts + trending_posts + interest_posts
    ranked_posts = rank_posts_by_score(all_posts, user_id)
    
    return ranked_posts[:limit]
```

### Following Feed (Simple)

```python
# Simple query: Posts from followed users only
def get_following_feed(user_id, limit=20):
    """
    1. Get all users that user_id follows
    2. Get all posts from those users
    3. Sort by recency
    4. Return top 20
    """
    followed_users = db.query(Follow).filter_by(follower_id=user_id).all()
    followed_user_ids = [f.followed_id for f in followed_users]
    
    posts = db.query(Post).filter(
        Post.author_id.in_(followed_user_ids)
    ).order_by(Post.created_at.desc()).limit(limit).all()
    
    return posts
```

### Hashtag Filter

```python
def get_posts_by_hashtag(hashtag, limit=20):
    """
    1. Get hashtag record
    2. Find all posts with that hashtag
    3. Sort by recency
    4. Return top 20
    """
    hashtag_record = db.query(Hashtag).filter_by(tag=hashtag).first()
    
    if not hashtag_record:
        return []
    
    posts = db.query(Post).join(
        PostHashtag
    ).filter(
        PostHashtag.hashtag_id == hashtag_record.id
    ).order_by(Post.created_at.desc()).limit(limit).all()
    
    return posts
```

---

## Performance Optimization

### 1. Render Optimization

**Current Implementation**
```javascript
// useCallback memoizes function, only recreates when dependencies change
const fetchPosts = useCallback(async () => {
  // Only recreates when feedType or hashtagFilter changes
}, [feedType, hashtagFilter])
```

**Recommendation: Memoize Components**
```javascript
// PostCard is re-rendered every time parent renders
// Should be memoized if it receives same props
const PostCard = memo(({ post, onUsernameLongPress, onHashtagClick }) => {
  // Component only re-renders if props change
  return (...)
}, (prevProps, nextProps) => {
  // Custom comparison if needed
  return prevProps.post.id === nextProps.post.id;
})
```

### 2. Lazy Loading & Pagination

**Current State**: All posts loaded at once
```javascript
// Issue: Loads all posts, can be 100+ items in DOM
const [posts, setPosts] = useState([])

// Solution: Implement pagination
const [posts, setPosts] = useState([])
const [page, setPage] = useState(1)
const [hasMore, setHasMore] = useState(true)

const fetchMorePosts = async () => {
  const response = await postService.getForYouFeed(page + 1)
  setPosts([...posts, ...response.data])
  setPage(page + 1)
  setHasMore(response.data.length > 0)
}

// Attach to scroll event
useEffect(() => {
  const handleScroll = () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
      if (hasMore) fetchMorePosts()
    }
  }
  window.addEventListener('scroll', handleScroll)
  return () => window.removeEventListener('scroll', handleScroll)
}, [page, hasMore])
```

### 3. Image Optimization

```javascript
// Add loading="lazy" to all images
<img
  loading="lazy"
  src={post.author.avatar}
  alt={post.author.username}
  width={50}
  height={50}
/>

// Implement responsive images
const getImageUrl = (url, size = 'medium') => {
  // Return different URLs based on device size
  if (window.innerWidth < 768) return `${url}?size=sm`
  return `${url}?size=lg`
}
```

### 4. Virtual Scrolling

```javascript
// For 100+ posts, render only visible items
import { FixedSizeList } from 'react-window'

const VirtualPostFeed = ({ posts }) => (
  <FixedSizeList
    height={window.innerHeight}
    itemCount={posts.length}
    itemSize={window.innerHeight}
    width="100%"
  >
    {({ index, style }) => (
      <div style={style}>
        <PostCard post={posts[index]} />
      </div>
    )}
  </FixedSizeList>
)
```

---

## Error Handling

### 5 Error Scenarios

### Scenario 1: Network Error During Feed Load

```javascript
const fetchPosts = useCallback(async () => {
  try {
    let response;
    if (hashtagFilter) {
      response = await postService.getPostsByHashtag(hashtagFilter);
    } else {
      response = feedType === 'for-you'
        ? await postService.getForYouFeed()
        : await postService.getFollowingFeed();
    }
    const postsWithReportStatus = response.data.map(post => ({
      ...post,
      isReported: false
    }));
    setPosts(postsWithReportStatus);
  } catch (error) {  // ← Network error caught
    console.error("Failed to fetch posts:", error);
    setPosts([]);  // Empty feed
    // TODO: Show error toast to user
    // toast.error("Failed to load posts. Please try again.")
  }
}, [feedType, hashtagFilter]);
```

### Scenario 2: Post Creation Fails

```javascript
const handleCreatePost = async (content) => {
  try {
    const response = await postService.createPost({ content });
    setPosts(prevPosts => [response.data, ...prevPosts]);
    setCreatePostModalOpen(false);
  } catch (error) {  // ← Creation failed
    console.error("Failed to create post:", error);
    // TODO: Show error to user
    // toast.error(error.response?.data?.message || "Failed to create post")
  }
};
```

### Scenario 3: Like Fails

```javascript
const handleLike = async () => {
  if (hasLiked) return;
  try {
    await likePost(post.id);
    setLikes(likes + 1);
    setHasLiked(true);
  } catch (error) {  // ← Like failed
    console.error("Failed to like post:", error);
    // Revert optimistic update
    setHasLiked(false);
    // toast.error("Failed to like post")
  }
};
```

### Scenario 4: Follow Request Fails

```javascript
const handleFollow = async (intent) => {
  if (!selectedUserId) return;
  try {
    await followUser(currentUser.id, selectedUserId, intent);
    handleCloseIntentModal();
  } catch (error) {  // ← Follow failed
    console.error("Error following user:", error);
    // Keep modal open, show error
    // toast.error("Failed to follow user")
  }
};
```

### Scenario 5: Report Post Fails

```javascript
const handleReportPost = async (postId) => {
  try {
    await postService.reportPost(postId);
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId ? { ...post, isReported: true } : post
      )
    );
  } catch (error) {  // ← Report failed
    console.error("Failed to report post:", error);
    // Revert optimistic update
    // toast.error("Failed to report post")
  }
};
```

---

## Security Considerations

### 1. Input Sanitization

```javascript
// Post content is user input - must be sanitized
const handleCreatePost = async (content) => {
  // MUST sanitize before sending to backend
  const sanitized = DOMPurify.sanitize(content)
  
  await postService.createPost({
    content: sanitized
  })
}

// Or use backend validation
// Backend should reject posts with scripts, HTML tags, etc.
```

### 2. XSS Prevention

```javascript
// Hashtags in post content are clicked
// Must prevent malicious hashtags

const renderContentWithHashtags = (content) => {
  const hashtagRegex = /(#\w+)/g;  // Only matches word characters
  const parts = content.split(hashtagRegex);
  
  return parts.map((part, index) => {
    if (part.match(hashtagRegex)) {
      return (
        <Hashtag
          key={index}
          onClick={() => onHashtagClick(part)}  // ← Safe: only passes matched string
        >
          {part}
        </Hashtag>
      );
    }
    return part;  // ← Safe: React escapes text nodes
  });
}
```

### 3. Authentication & Authorization

```javascript
const HomePage = () => {
  const { user: currentUser } = useAuth();  // ← Check user is authenticated
  
  if (!currentUser) {
    return <Redirect to="/login" />
  }
  
  // Only authenticated users can see this page
  // All API calls include authentication token in headers
}
```

### 4. Rate Limiting

```javascript
// Frontend should prevent rapid clicks
const [isLiking, setIsLiking] = useState(false)

const handleLike = async () => {
  if (isLiking || hasLiked) return;  // ← Prevent rapid clicks
  
  setIsLiking(true)
  try {
    await likePost(post.id)
    setLikes(likes + 1)
    setHasLiked(true)
  } finally {
    setIsLiking(false)
  }
}

// Backend should also rate limit
// POST /posts/{id}/like → Max 1 like per user per post
```

### 5. Content Moderation

```javascript
// Posts can be reported for moderation
const handleReportPost = async (postId) => {
  // Store report in database
  // Backend can flag post if N reports received
  // Moderators can review flagged posts
  
  await postService.reportPost(postId)
  // UI shows post as reported by current user
}
```

---

## Deployment Considerations

### Pre-Deployment Checklist

```javascript
□ API endpoints all working
  ├─ GET /posts/for-you
  ├─ GET /posts/following
  ├─ GET /posts/hashtag/{tag}
  ├─ POST /posts/
  ├─ POST /posts/{id}/like
  └─ POST /posts/{id}/report

□ Database tables exist
  ├─ posts
  ├─ likes
  ├─ post_hashtags
  ├─ hashtags
  └─ follows

□ Error handling
  ├─ Network errors show user message
  ├─ API errors handled
  └─ Timeouts configured

□ Performance
  ├─ Pagination implemented
  ├─ Images lazy loaded
  ├─ Components memoized
  └─ Virtual scrolling for 100+ posts

□ Security
  ├─ Input sanitized
  ├─ XSS prevention
  ├─ Authentication required
  ├─ Rate limiting enabled
  └─ Content moderation system

□ Responsive Design
  ├─ Mobile layout (< 768px)
  ├─ Tablet layout (768px - 1024px)
  ├─ Desktop layout (> 1024px)
  └─ Touch gestures work
```

### Environment Variables

```bash
REACT_APP_API_URL=https://api.nena.com
REACT_APP_ENV=production
REACT_APP_LOG_LEVEL=error

# Optional: Feature flags
REACT_APP_ENABLE_STORIES=true
REACT_APP_ENABLE_LIVE_CHAT=false
REACT_APP_MAX_POST_LENGTH=250
```

### Monitoring

```javascript
// Track key metrics
analytics.track('HomePage_View', {
  feedType: 'for-you',
  postsDisplayed: posts.length,
  timestamp: new Date()
})

analytics.track('Post_Created', {
  hasMedia: !!media,
  hashtagLength: hashtag.length
})

analytics.track('Post_Liked', {
  postId: post.id,
  authorId: post.author.id
})

analytics.track('User_Followed', {
  followedUserId: selectedUserId,
  intent: intent
})
```

---

## Summary

**HomePage Architecture** is a sophisticated frontend for social media:

✅ Full-screen scrolling feed
✅ Multiple feed types with backend algorithms
✅ Touch-optimized gestures
✅ Real-time post interactions
✅ Hashtag discovery and filtering
✅ User relationship system
✅ Comprehensive error handling
✅ Security considerations
✅ Performance optimizations
✅ Deployment ready

**Key Technical Achievements:**
- Touch gesture recognition (swipe, long press)
- Proper React patterns (hooks, callbacks, memoization)
- State coordination between components
- API integration with error handling
- Responsive design for all devices
- Theme-integrated styling
