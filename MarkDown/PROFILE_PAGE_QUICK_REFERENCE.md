# 👤 PROFILE PAGE - QUICK REFERENCE

## PAGE STRUCTURE AT A GLANCE

```
PROFILE PAGE (/profile/:id)
│
├─ PROFILE HEADER
│  ├─ User Avatar (clickable for upload)
│  ├─ Display Name & Username (@handle)
│  ├─ Role Badge
│  ├─ Tagline/Bio
│  ├─ Follower/Following Counts
│  └─ Follow Buttons (Supporter, Amplifier, Learner)
│
├─ SOCIAL NETWORK VISUALIZATION
│  ├─ Current User (green center node)
│  ├─ Direct Followers (first ring)
│  ├─ Followers of Followers (second ring)
│  ├─ Connection Labels (intent types)
│  └─ Interactive Controls (pan, zoom, click info)
│
├─ POSTS SECTION
│  ├─ Grid Layout (4 columns desktop, responsive)
│  ├─ Shows 8 posts by default
│  ├─ Post Cards with media + content
│  └─ "Show More / Show Less" toggle
│
├─ PODCASTS SECTION
│  ├─ Grid Layout (similar to posts)
│  ├─ Shows 4 podcasts by default
│  ├─ "Create Podcast" button
│  └─ "Show More / Show Less" toggle
│
└─ METRICS SECTION
   ├─ Follower Intent Breakdown
   │  ├─ Supporters: XX
   │  ├─ Amplifiers: XX
   │  ├─ Learners: XX
   │  ├─ Mentors: XX
   │  ├─ Peers: XX
   │  └─ Collaborators: XX
   │
   ├─ Topics Engaged
   │  └─ Hashtag tags with counts
   │
   └─ Community Badges
      └─ Achievement badges with descriptions
```

---

## 10 KEY FACTS

### User Profile Data
1. **UUID Primary Key** - Users identified by UUID, not incremental ID
2. **Unique Username** - Usernames are indexed and unique across platform
3. **Email Optional** - Email can be optional but unique if provided
4. **Account Status** - Users can be active/inactive, regular/superuser
5. **Two-Factor Auth** - Optional PIN-based two-step verification

### Social Features
6. **Intent-Based Following** - Follow relationships include intent (why you're following)
7. **Three Intent Types in Modal** - Collaborator, Mentor, Peer (plus 3 button variants)
8. **Follower Notifications** - System notifies user when followed
9. **Social Graph** - Can view followers of followers (2 hops deep)
10. **Privacy Controls** - Profile, about, and online status have privacy settings

---

## API ENDPOINTS SUMMARY

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/users/{user_id}` | GET | Get user profile |
| `/users/{user_id}/followers` | GET | List followers |
| `/users/{user_id}/following` | GET | List following |
| `/users/{user_id}/followers-of-followers` | GET | Get 2-hop social graph |
| `/users/{user_id}/follow` | POST | Follow user with intent |
| `/users/{user_id}/follow` | DELETE | Unfollow user |
| `/users/{user_id}/posts` | GET | Get user's posts |
| `/users/{user_id}/podcasts` | GET | Get user's podcasts |
| `/users/{user_id}/follower-intent-metrics` | GET | Follower breakdown by intent |
| `/users/{user_id}/hashtag-metrics` | GET | Hashtags user engages with |
| `/users/{user_id}/badges` | GET | User's achievement badges |
| `/profile/{user_id}` | PUT | Update profile (bio, picture) |

---

## COMPONENT INTERACTION MAP

```
ProfilePage (Container)
    │
    ├─→ ProfileHeader
    │   ├─ Calls: uploadImage(), updateProfile()
    │   └─ Emits: onFollow() → opens IntentModal
    │
    ├─→ IntentModal
    │   ├─ Waits for: intent selection
    │   └─ Calls: followUser(id, intent)
    │
    ├─→ SpiderWebCanvas
    │   ├─ Receives: currentUser, follows, followersOfFollowers, metrics
    │   └─ Renders: React Flow graph visualization
    │
    ├─→ PostsGrid
    │   ├─ Receives: posts array
    │   └─ Renders: Card grid of posts
    │
    ├─→ PodcastsGrid
    │   ├─ Receives: podcasts array
    │   ├─ Renders: Card grid of podcasts
    │   └─ Emits: onCreate() → opens CreatePodcast modal
    │
    ├─→ CreatePodcast
    │   └─ Calls: createPodcast(formData)
    │
    └─→ ProfileMetrics
        └─ Receives: metrics, hashtags, badges
```

---

## FRONTEND COMPONENTS QUICK LOOKUP

### ProfilePage.jsx
- **File**: `/frontend/src/pages/ProfilePage.jsx`
- **Lines**: 168 total
- **Purpose**: Main container, data fetching, state management
- **Key State**: user, followers, posts, podcasts, metrics, etc.
- **Key Methods**: fetchUserData(), handleFollow()

### ProfileHeader.jsx
- **File**: `/frontend/src/components/profile/ProfileHeader.jsx`
- **Lines**: 123 total
- **Purpose**: Display user info and basic profile data
- **Key Methods**: handleAvatarClick(), handleFileChange()

### PostsGrid.jsx
- **File**: `/frontend/src/components/profile/PostsGrid.jsx`
- **Lines**: ~40 total
- **Purpose**: Display user posts in grid
- **Key Elements**: GridContainer, PostCard (with media + content)

### PodcastsGrid.jsx
- **File**: `/frontend/src/components/profile/PodcastsGrid.jsx`
- **Lines**: ~20 total
- **Purpose**: Display user podcasts in grid
- **Key Elements**: GridContainer, PodcastCard components

### SpiderWebCanvas.jsx
- **File**: `/frontend/src/components/profile/SpiderWebCanvas.jsx`
- **Lines**: ~80 total
- **Purpose**: Social network graph visualization
- **Key Library**: React Flow Renderer

### IntentModal.jsx
- **File**: `/frontend/src/components/profile/IntentModal.jsx`
- **Lines**: ~50 total
- **Purpose**: Select follow intent
- **Key Elements**: RadioGroup with 3-6 intent options

### CreatePodcast.jsx
- **File**: `/frontend/src/components/profile/CreatePodcast.jsx`
- **Lines**: 126 total
- **Purpose**: Form to create new podcast
- **Key Fields**: title, notes, recommendations, file

### ProfileMetrics.jsx
- **File**: `/frontend/src/components/profile/ProfileMetrics.jsx`
- **Lines**: ~60 total
- **Purpose**: Display metrics and badges
- **Key Elements**: Metric boxes, topic tags, badge list

---

## BACKEND MODELS QUICK LOOKUP

### User Model
- **File**: `/backend/app/models/user.py`
- **Table**: `users`
- **Key Fields**: id (UUID), username, email, first_name, last_name, created_at
- **Privacy Fields**: profile_photo_privacy, about_privacy, online_status_privacy
- **Relationships**: followers, following, profile, posts, podcasts, user_badges

### Profile Model
- **File**: `/backend/app/models/profile.py`
- **Table**: `profiles`
- **Key Fields**: id (UUID), user_id (FK), bio, profile_picture_url
- **Relationships**: user (1:1)

### Follower Model
- **File**: `/backend/app/models/follower.py`
- **Table**: `followers`
- **Key Fields**: id, follower_id (FK), followed_id (FK), intent, created_at
- **Intent Values**: Collaborator, Mentor, Peer, Supporter, Amplifier, Learner
- **Relationships**: follower, followed (both to User model)

### Badge Model
- **File**: `/backend/app/models/badge.py`
- **Table**: `badges`
- **Key Fields**: id, name, description, icon_url
- **Relationships**: user_badges (1:many)

### UserBadge Model
- **File**: `/backend/app/models/badge.py`
- **Table**: `user_badges`
- **Key Fields**: id, user_id (FK), badge_id (FK), awarded_at
- **Relationships**: user, badge (both FK)

---

## BACKEND SERVICES QUICK LOOKUP

### CRUDUser (user.py)
**Methods:**
- `get_by_email()` - Find user by email
- `get_by_username()` - Find user by username
- `create()` - Create new user with hashed password
- `authenticate()` - Login: verify username + password
- `update()` - Update user info
- `search()` - Search users by username/name
- `get_follower_intent_metrics()` - Follower breakdown by intent
- `get_followers_of_followers()` - 2-hop social graph

### CRUDBadge (crud_badge.py)
**Methods:**
- `get_by_name()` - Find badge by name
- `get_user_badges()` - Get all badges for user
- `award_badge()` - Award badge to user

---

## USER FLOW - FOLLOW SOMEONE

```
1️⃣  User visits /profile/:id
    ↓
2️⃣  Page loads 9 API calls in parallel
    ↓
3️⃣  User sees profile with avatar, posts, metrics
    ↓
4️⃣  User clicks "Follow" button
    ↓
5️⃣  IntentModal opens with radio buttons
    ↓
6️⃣  User selects intent (e.g., "Collaborator")
    ↓
7️⃣  User clicks "Follow" button in modal
    ↓
8️⃣  Frontend POSTs to /users/{id}/follow with { intent: "Collaborator" }
    ↓
9️⃣  Backend creates Follower(follower_id=current_user, followed_id=user_id, intent="Collaborator")
    ↓
🔟  Backend sends notification to followed user
    ↓
1️⃣1️⃣ Modal closes, followers list refreshed
    ↓
1️⃣2️⃣ Follower count updated in header
```

---

## USER FLOW - EDIT PROFILE PICTURE

```
1️⃣  User hovers over avatar
    ↓
2️⃣  Edit icon (pencil) appears
    ↓
3️⃣  User clicks avatar
    ↓
4️⃣  Browser file picker opens
    ↓
5️⃣  User selects PNG/JPEG/GIF image
    ↓
6️⃣  handleFileChange() triggered
    ↓
7️⃣  uploadImage(file) → returns image URL from cloud storage
    ↓
8️⃣  updateProfile(user.id, { profile_picture_url: imageUrl })
    ↓
9️⃣  Backend updates profile.profile_picture_url
    ↓
🔟  window.location.reload() - full page refresh
    ↓
1️⃣1️⃣ User avatar updated everywhere
```

---

## STYLING SYSTEM

**Theme Object:**
```javascript
{
  palette: {
    dark: "#1a1a1a",       // Main dark background
    light: "#333333",      // Secondary lighter background
    primary: "#6200ea",    // Primary purple action color
    secondary: "#03dac6"   // Secondary teal accent
  },
  text: {
    primary: "#FAFAFA",    // Light text on dark backgrounds
    secondary: "#aaa"      // Dimmer secondary text
  }
}
```

**Key Styled Components:**
- `ProfilePageContainer` - Main container with dark background
- `HeaderSection` - User header area, centered
- `SpiderWebCanvasSection` - Fixed height 400px
- `ContentSection` - Posts/podcasts sections with headers
- `MetricsSection` - Dark background for metrics
- `GridContainer` - CSS Grid for posts/podcasts
- `PostCard` / `PodcastCard` - Individual content cards
- `MetricValue` - Large bold metric numbers
- `TopicTag` - Small tag-style hashtag pills

---

## COMMON PATTERNS

### State Management Pattern
```javascript
const [user, setUser] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await getUser(id);
      setUser(response.data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, [id]);
```

### Error Boundary Pattern
```javascript
if (loading) return <CircularProgress />;
if (!user) return <Typography>User not found</Typography>;
return <ThemeProvider theme={theme}>{/* content */}</ThemeProvider>;
```

### Modal Pattern
```javascript
const [modalOpen, setModalOpen] = useState(false);

return (
  <>
    <Button onClick={() => setModalOpen(true)}>Open Modal</Button>
    <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
      {/* modal content */}
    </Modal>
  </>
);
```

---

## PERFORMANCE TIPS

### Frontend Optimization
- ✅ **Parallel loading** - 9 API calls in Promise.all(), not sequential
- ✅ **Show More** - Grid shows 8 posts, rest hidden until clicked
- ✅ **Memoization** - SpiderWeb graph uses useMemo() to prevent recalculation
- ✅ **Error states** - Loading/not-found handled gracefully

### Backend Optimization
- ✅ **Relationships** - User.followers automatically loads related Followers
- ✅ **Aggregation** - Metrics calculated with GROUP BY, not in application
- ✅ **Indexing** - username and email indexed for fast lookups

---

## DEBUGGING CHECKLIST

### Profile Not Loading?
- [ ] User ID in URL is valid UUID
- [ ] User exists in database
- [ ] API endpoints responding with 200 status
- [ ] Check browser console for errors

### Avatar Upload Not Working?
- [ ] File is PNG/JPEG/GIF format
- [ ] File size under limit
- [ ] uploadImage() service configured
- [ ] Profile update endpoint responding

### Followers Not Updating?
- [ ] Follow intent modal closing properly
- [ ] followUser() API call succeeding
- [ ] getFollowers() refresh called after follow
- [ ] No 400 error for duplicate follow

### Metrics Not Showing?
- [ ] followerIntentMetrics state populated
- [ ] hashtagMetrics has data
- [ ] badges array not empty
- [ ] API endpoints returning data

---

## TROUBLESHOOTING

| Issue | Cause | Solution |
|-------|-------|----------|
| Blank profile | User ID invalid | Check URL parameter |
| No posts shown | User has no posts | Expected behavior |
| Avatar not updating | Upload failed | Check upload service |
| Can't follow self | Frontend prevents it | Add validation |
| Already following error | Duplicate follow | Check database for existing |
| No metrics | API not called | Check Promise.all in useEffect |
| Graph visualization missing | React Flow not loaded | Check imports |
| Modal stuck open | State not updated | Check onClose handler |

---

## SUMMARY TABLE

| Aspect | Count | Technology |
|--------|-------|------------|
| Frontend Components | 8 | React, Styled-components, Material-UI |
| API Endpoints | 12+ | FastAPI, SQLAlchemy |
| Database Models | 4 main | PostgreSQL, SQLAlchemy ORM |
| State Variables | 11 | React Hooks |
| API Calls on Load | 9 parallel | Promise.all() |
| Follow Intent Types | 6 | Collaborator, Mentor, Peer, Supporter, Amplifier, Learner |
| Content Grid Columns | 4 responsive | CSS Grid, auto-fill |
| Social Graph Depth | 2 hops | Follower → Follower of Follower |

---

**Quick Start:** Navigate to `/profile/{userId}` → Full profile loads with 9+ data types → Visualize social network → Follow with intent → View content → Edit avatar

---

**Version:** 1.0  
**Last Updated:** January 24, 2026  
**Status:** Production Ready
