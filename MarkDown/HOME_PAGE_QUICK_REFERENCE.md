# HomePage - Quick Reference Guide

## 10 Key Facts About HomePage

1. **Full-Screen Feed**: Posts displayed at 100vh × 100vw (TikTok-style)
2. **Dual Feed Types**: "For You" (algorithm) and "Following" (users you follow)
3. **Swipe Navigation**: Right swipe from left edge opens sidebar, left swipe closes it
4. **Hashtag System**: Auto-detects #hashtags in content, clickable to filter
5. **Touch Optimized**: Built for mobile with minimum 50px swipe distance
6. **User Follow System**: Long press (1s) on avatar opens intent modal (Collaborator/Mentor/Peer)
7. **Post Interactions**: Like, comment, report buttons on each post
8. **Real-Time Posts**: Create posts with content, hashtag, and optional media
9. **State Managed**: Posts, feedType, filters, and modals all in HomePage state
10. **Theme Integrated**: Uses theme for colors (accent: pink, bg: dark)

---

## Component Interaction Map

```
HomePage (Root)
  ├─ FeedControlNav (Sidebar)
  │  └─ Buttons: For You | Following | Create Post | Restart
  │
  ├─ ActivityFeed (Post Container)
  │  └─ PostCard × N (Individual Posts)
  │     ├─ UserAvatar (Long press → Intent modal)
  │     ├─ PostText (With clickable hashtags)
  │     ├─ FeedPoll (If post has poll)
  │     └─ Actions: Like | Comment
  │
  ├─ CreatePostModal
  │  └─ Fields: Content | Hashtag | Media
  │
  └─ IntentModal
     └─ Intents: Collaborator | Mentor | Peer
```

---

## Component Files & Locations

| Component | Location | Lines | Purpose |
|-----------|----------|-------|---------|
| HomePage | `pages/HomePage.jsx` | 180 | Main container & state |
| FeedControlNav | `layout/FeedControlNav.jsx` | 50 | Left sidebar menu |
| ActivityFeed | `feed/ActivityFeed.jsx` | 30 | Post list wrapper |
| PostCard | `feed/PostCard.jsx` | 180 | Individual post UI |
| CreatePostModal | `components/modals/CreatePostModal.jsx` | 122 | Post creation form |
| IntentModal | `components/profile/IntentModal.jsx` | 65 | Follow intent selector |
| PostService | `services/post.service.js` | 40 | API calls for posts |
| Post Model | `backend/app/models/post.py` | 40 | Database schema |

---

## Key Props Flow

```
HomePage
  ↓
  ├─ FeedControlNav
  │  ├─ isOpen: boolean
  │  ├─ feedType: 'for-you' | 'following'
  │  ├─ setFeedType: (type) => void
  │  ├─ handleRestart: () => void
  │  └─ setCreatePostModalOpen: (bool) => void
  │
  ├─ ActivityFeed
  │  ├─ posts: Post[]
  │  ├─ onReportPost: (postId) => void
  │  ├─ onUsernameLongPress: (userId) => void
  │  └─ onHashtagClick: (hashtag) => void
  │     ↓
  │     PostCard × N
  │     ├─ post: Post
  │     ├─ onUsernameLongPress: (userId) => void
  │     └─ onHashtagClick: (hashtag) => void
  │
  ├─ CreatePostModal
  │  ├─ open: boolean
  │  ├─ onClose: () => void
  │  └─ onCreatePost: (postData) => void
  │
  └─ IntentModal
     ├─ open: boolean
     ├─ onClose: () => void
     └─ onFollow: (intent) => void
```

---

## 5 Common Workflows

### Workflow 1: View For You Feed
```
1. User opens app → HomePage mounts
2. feedType defaults to 'for-you'
3. useEffect triggers fetchPosts()
4. getForYouFeed() returns algorithm-based posts
5. ActivityFeed renders posts
6. User scrolls to see more posts
```

### Workflow 2: Create and Post
```
1. User clicks "Create Post" in sidebar
2. CreatePostModal opens
3. User fills: Content, Hashtag, optional Media
4. Clicks "Post" button
5. handleCreatePost() called
6. postService.createPost() sends to backend
7. New post added to top of feed
8. Modal closes
```

### Workflow 3: Like a Post
```
1. PostCard displays like button (heart icon)
2. User clicks heart
3. handleLike() checks hasLiked
4. likePost(postId) calls backend
5. Like count increments
6. Heart fills with color
7. Post saved to user's likes
```

### Workflow 4: Follow User with Intent
```
1. User long presses user avatar (1 second)
2. handlePressStart() triggers IntentModal
3. IntentModal displays 3 options:
   - Collaborator
   - Mentor
   - Peer
4. User selects option
5. handleFollow(intent) called
6. followUser(userId, targetId, intent) sent to backend
7. Follow relationship created
8. Modal closes
```

### Workflow 5: Filter by Hashtag
```
1. User clicks #hashtag in post
2. onHashtagClick(hashtag) called
3. setHashtagFilter(hashtag) removes '#'
4. useEffect detects change
5. fetchPosts() with hashtag filter
6. getPostsByHashtag(hashtag) called
7. HashtagHeader shows "Filtering by: #hashtag"
8. Only posts with hashtag shown
9. User clicks Restart
10. Filter cleared, normal feed restored
```

---

## State Dependency Tree

```
HomePage State Changes
  ↓
useEffect (depends on: feedType, hashtagFilter)
  ↓
fetchPosts()
  ↓
if hashtagFilter → getPostsByHashtag()
else if feedType='for-you' → getForYouFeed()
else if feedType='following' → getFollowingFeed()
  ↓
setPosts(response)
  ↓
ActivityFeed re-renders with new posts
```

---

## Testing Checklist (20 Tests)

### Feed Display (3 tests)
- [ ] For You feed loads with posts
- [ ] Following feed loads with posts
- [ ] Empty feed shows "No posts to display"

### Feed Type Switching (2 tests)
- [ ] Clicking "For You" switches feed type
- [ ] Clicking "Following" switches feed type

### Post Creation (3 tests)
- [ ] Create Post modal opens
- [ ] Can fill content and hashtag
- [ ] New post appears at top of feed

### Post Interactions (4 tests)
- [ ] Like button increments count
- [ ] Can't like twice (button disabled)
- [ ] Comment button opens modal
- [ ] Report post marks it as reported

### Hashtag Filtering (3 tests)
- [ ] Clicking hashtag filters feed
- [ ] Header shows "Filtering by: #hashtag"
- [ ] Restart button clears filter

### Navigation (3 tests)
- [ ] Swipe right from left edge opens sidebar
- [ ] Swipe left closes sidebar
- [ ] Sidebar buttons are clickable

### Follow Intent (2 tests)
- [ ] Long press on avatar opens modal
- [ ] Selecting intent sends follow request

---

## Common Props Reference

### HomePage Props (None - Top Level)
```javascript
// No props - manages its own state
```

### FeedControlNav Props
```javascript
{
  isOpen: boolean,                          // Sidebar visible?
  feedType: 'for-you' | 'following',       // Current feed
  setFeedType: (type: string) => void,     // Change feed type
  handleRestart: () => void,                // Clear filters
  setCreatePostModalOpen: (bool) => void   // Open modal
}
```

### PostCard Props
```javascript
{
  post: {
    id: uuid,
    content: string,
    author: { id, username, avatar },
    likes: number,
    hasLiked: boolean,
    poll?: Poll,
    ...
  },
  onUsernameLongPress: (userId) => void,
  onHashtagClick: (hashtag) => void
}
```

### IntentModal Props
```javascript
{
  open: boolean,
  onClose: () => void,
  onFollow: (intent: 'Collaborator'|'Mentor'|'Peer') => void
}
```

---

## Common Errors & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| Posts not loading | API error or network issue | Check network tab, verify API endpoint |
| Like button not working | hasLiked state already true | Clear local state, refresh page |
| Hashtag not filtering | Regex not matching | Ensure hashtag format is #word (no spaces) |
| Sidebar not opening | Swipe distance < 50px | Swipe further, check touch handlers |
| Modal not closing | onClose callback not called | Verify callback is passed and triggered |
| Theme colors wrong | Theme context not provided | Check theme provider in root component |
| Posts not created | Form validation failed | Fill hashtag field (required) |
| Follow intent not sent | selectedUserId is null | Long press avatar first to set userId |

---

## Performance Tips

### For Users
1. **Faster Loading**: Limit to 20-30 posts per feed load
2. **Smoother Scrolling**: Use virtual scrolling for 100+ posts
3. **Faster Interactions**: Show optimistic updates for likes/follows

### For Developers
1. **Memoize Callbacks**: Use `useCallback()` for handlers
2. **Lazy Load Images**: Add `loading="lazy"` to avatars
3. **Pagination**: Load more posts on scroll down
4. **Caching**: Cache feed results to prevent re-fetches

---

## API Integration Points

```javascript
// Feed Loading
getForYouFeed()      GET /posts/for-you
getFollowingFeed()   GET /posts/following

// Post Management
createPost(data)     POST /posts/
likePost(postId)     POST /posts/{postId}/like
reportPost(postId)   POST /posts/{postId}/report

// Interactions
getComments(postId)  GET /posts/{postId}/comments
createComment(data)  POST /posts/{postId}/comments

// Users
followUser(data)     POST /users/{userId}/follow
```

---

## File Structure

```
frontend/src/
├── pages/
│  └── HomePage.jsx (180 lines)
├── layout/
│  └── FeedControlNav.jsx (50 lines)
├── feed/
│  ├── ActivityFeed.jsx (30 lines)
│  ├── PostCard.jsx (180 lines)
│  └── FeedPoll.jsx (?)
├── components/
│  ├── modals/
│  │  └── CreatePostModal.jsx (122 lines)
│  ├── profile/
│  │  └── IntentModal.jsx (65 lines)
│  └── UserAvatar.jsx (?)
├── services/
│  └── post.service.js (40 lines)
└── contexts/
   └── AuthContext.jsx (for useAuth)
```

---

## Quick Tips

💡 **Tips for Extending HomePage**

1. **Add Story Support**: Create StoryBar component above feed
2. **Add DM Floating Button**: Floating action button for messages
3. **Add Notifications**: Badge on notification icon
4. **Add Search**: Search bar in sidebar
5. **Add Trending**: Show trending hashtags section
6. **Add Stories**: Horizontal carousel of friend stories
7. **Add Repost**: Right-swipe action to repost
8. **Add Share**: QR code or link sharing for posts

---

## Summary

**HomePage** provides:
- ✅ Full-screen social media feed
- ✅ Multiple feed types (For You, Following)
- ✅ User interactions (like, comment, follow)
- ✅ Hashtag filtering and discovery
- ✅ Post creation with media
- ✅ Touch-optimized navigation
- ✅ Theme-integrated styling
- ✅ Real-time post updates

**Perfect for**: Social media, discovery, content consumption, user networking
