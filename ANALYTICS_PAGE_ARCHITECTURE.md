# Analytics Page - Deep Architecture & Technical Details

## System Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│                          FRONTEND LAYER                          │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  FloatingNav ─→ Link to "/analytics"                            │
│       ↓                                                          │
│  MainLayout ─→ Routes "/analytics" to AnalyticsBar              │
│       ↓                                                          │
│  AnalyticsBar (EMPTY - needs wrapper implementation)            │
│       ↓                                                          │
│  AnalyticsDashboard (receives userId prop)                      │
│  ├─→ AdvocacyImpactMatrix                                       │
│  │   ├─ useEffect: fetch → /api/v1/analytics/advocacy-matrix   │
│  │   ├─ State: [matrixData, loading, error]                    │
│  │   ├─ Render: 3×3 Grid with bubble circles                   │
│  │   └─ Display: Recommendation box                            │
│  │                                                              │
│  ├─→ UserEngagementChart                                        │
│  │   ├─ useEffect: fetch → /api/v1/analytics/user-engagement   │
│  │   ├─ State: [userEngagement] (no error state!)              │
│  │   └─ Render: Material-UI Table (5 columns, N rows)          │
│  │                                                              │
│  └─→ PostEngagementChart                                        │
│      ├─ useEffect: fetch → /api/v1/analytics/post-engagement   │
│      ├─ State: [postEngagement] (no error state!)              │
│      └─ Render: Material-UI Table (4 columns, N rows)          │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
                              ↑↑↑
                      HTTP Requests (3 parallel)
                              ↓↓↓
┌──────────────────────────────────────────────────────────────────┐
│                         BACKEND LAYER                            │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  app/api/v1/endpoints/analytics.py                              │
│  ├─ @router.get("/advocacy-matrix/{user_id}")                  │
│  │  └─ Endpoint Handler:                                       │
│  │     1. Fetch user's Posts, Documents, Polls, Studies, etc.  │
│  │     2. Categorize each by type (Awareness/Will/Action)     │
│  │     3. Group by audience (Public/Influencers/Stakeholders) │
│  │     4. Build 3×3 matrix                                    │
│  │     5. Find min cell → generate recommendation             │
│  │     6. Return as JSON                                      │
│  │                                                             │
│  └─ @router.get("/user-engagement") [NOT FOUND IN CODE]       │
│  └─ @router.get("/post-engagement") [NOT FOUND IN CODE]       │
│                                                                  │
│  app/models/                                                    │
│  ├─ analytics.py (empty)                                        │
│  ├─ post.py → Post model with author_id, audience             │
│  ├─ document.py → Document model with author_id, audience     │
│  ├─ poll.py → Poll model with author_id, audience             │
│  ├─ study.py → Study model with author_id, audience           │
│  ├─ event.py → Event model with owner_id                      │
│  └─ challenge.py → Challenge model with creator_id            │
│                                                                  │
│  app/schemas/analytics.py                                       │
│  └─ AdvocacyImpactMatrix schema:                               │
│     ├─ matrix: List[List[int]]                                │
│     └─ recommendation: str                                    │
│                                                                  │
│  app/crud/analytics.py (empty)                                  │
│                                                                  │
│  app/services/analytics.py (empty)                              │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## Component Lifecycle Analysis

### AnalyticsBar Lifecycle (Current - BROKEN)

```
Mount
  ↓
Render: <AnalyticsBar /> (empty file)
  ↓
Result: Blank page
  ↓
Expected: Should render <AnalyticsDashboard userId={currentUserId} />
```

### AnalyticsDashboard Lifecycle

```
Mount (with userId prop)
  ↓
Render Layout:
  ├─ Typography "Analytics Dashboard"
  ├─ Box with AdvocacyImpactMatrix
  ├─ Box with UserEngagementChart  
  └─ Box with PostEngagementChart
  ↓
All 3 child components mount in parallel
  ↓
Each child triggers its own useEffect
```

### AdvocacyImpactMatrix Lifecycle (Detailed)

```
MOUNT PHASE:
  Initialize state:
    matrixData = null
    loading = true
    error = null
  ↓
  useEffect runs (dependencies: [userId])
    ↓
    fetchData() async function:
      ├─ setLoading(true)
      ├─ API call: apiClient.get(`/api/v1/analytics/advocacy-matrix/${userId}`)
      ├─ On success:
      │  ├─ setMatrixData(response.data)
      │  └─ setError(null)
      ├─ On error:
      │  ├─ setError('Failed to load advocacy impact data...')
      │  └─ console.error(err)
      └─ Finally: setLoading(false)

RENDER PHASE (based on state):
  ├─ if loading === true
  │  └─ Return <CircularProgress />
  │
  ├─ if error !== null
  │  └─ Return <Alert severity="error">{error}</Alert>
  │
  ├─ if matrixData === null
  │  └─ Return <Typography>No data available...</Typography>
  │
  └─ if matrixData exists
     └─ Render full matrix:
        ├─ Paper container with elevation 3
        ├─ Title: "Your Advocacy Impact Matrix"
        ├─ Description text
        ├─ Grid layout:
        │  ├─ Y-axis labels (Awareness, Will, Action)
        │  ├─ 3×3 matrix cells (each with bubble)
        │  └─ X-axis labels (Public, Influencers, Stakeholders)
        ├─ Recommendation box
        └─ All wrapped in Paper with border

UPDATE PHASE:
  if userId prop changes:
    ├─ useEffect runs again (because userId in dependencies)
    ├─ setLoading(true)
    ├─ New API call with new userId
    └─ State updates trigger re-render

BUBBLE RENDERING (within each cell):
  ├─ Calculate maxVal from all matrix values
  ├─ For each cell value:
  │  ├─ scale = Math.max(0.1, value / maxVal)
  │  ├─ Render Box with:
  │  │  ├─ width: ${scale * 80}%
  │  │  ├─ height: ${scale * 80}%
  │  │  ├─ backgroundColor: rgba(74, 89, 105, ${scale})
  │  │  ├─ borderRadius: 50%
  │  │  ├─ On hover: transform scale(1.1)
  │  │  └─ Text label: {value}
  │  └─ Text color:
  │     ├─ white if scale > 0.5
  │     └─ black if scale <= 0.5
  └─ Transition: 0.3s ease-in-out
```

### UserEngagementChart Lifecycle

```
MOUNT:
  State: userEngagement = []
  ↓
  useEffect runs (dependencies: [])
    → Fetches /api/v1/analytics/user-engagement
    → setUserEngagement(data)
    → No error handling (silent fail!)
  ↓
RENDER:
  ├─ TableContainer with Paper
  ├─ Table with TableHead:
  │  ├─ User (left-aligned)
  │  ├─ Posts (right-aligned)
  │  ├─ Comments (right-aligned)
  │  ├─ Following (right-aligned)
  │  └─ Followers (right-aligned)
  ├─ TableBody:
  │  └─ For each user in userEngagement:
  │     ├─ TableRow
  │     ├─ TableCell: user.full_name
  │     ├─ TableCell (right): user.posts_count
  │     ├─ TableCell (right): user.comments_count
  │     ├─ TableCell (right): user.following_count
  │     └─ TableCell (right): user.followers_count
  └─ Paper elevation (default)

NOTE: No dependency array logic means:
  - Fetches only once on mount
  - No re-fetches if data changes server-side
  - No manual refresh capability
```

### PostEngagementChart Lifecycle

```
MOUNT:
  State: postEngagement = []
  ↓
  useEffect runs (dependencies: [])
    → Fetches /api/v1/analytics/post-engagement
    → setPostEngagement(data)
    → No error handling (silent fail!)
  ↓
RENDER:
  ├─ TableContainer with Paper
  ├─ Table with TableHead:
  │  ├─ Post (left-aligned)
  │  ├─ Author (left-aligned)
  │  ├─ Comments (right-aligned)
  │  └─ Likes (right-aligned)
  ├─ TableBody:
  │  └─ For each post in postEngagement:
  │     ├─ TableRow
  │     ├─ TableCell: post.text (truncated by cell width)
  │     ├─ TableCell: post.author
  │     ├─ TableCell (right): post.comments_count
  │     └─ TableCell (right): post.likes_count
  └─ Paper elevation (default)

SAME ISSUE: No refresh capability
```

---

## State Flow Diagram

### AdvocacyImpactMatrix State Machine

```
Initial State:
  matrixData = null
  loading = true
  error = null

useEffect triggered (userId provided)
         ↓
         ├─→ setLoading(true)
         ├─→ API Call
         │
         ├─→ Success Branch:
         │  ├─→ setMatrixData({matrix: [...], recommendation: "..."})
         │  └─→ setError(null)
         │      ↓
         │      Render: Full matrix visualization
         │
         └─→ Failure Branch:
            ├─→ setError("Failed to load...")
            └─→ setMatrixData(null)
                ↓
                Render: Error alert

Then in both cases:
setLoading(false)
  ↓
If success: Loading spinner → Matrix renders
If failure: Loading spinner → Error alert renders
```

### Dependency Injection Analysis

```
AdvocacyImpactMatrix:
  Dependencies: [userId]
  - If userId changes → fetch again
  - If userId undefined → don't fetch
  - Good: Reactive to prop changes

UserEngagementChart:
  Dependencies: []
  - Fetch runs once on mount
  - No re-fetch ever
  - Bad: Stale data, no refresh

PostEngagementChart:
  Dependencies: []
  - Fetch runs once on mount
  - No re-fetch ever
  - Bad: Stale data, no refresh
```

---

## Data Transformation Pipeline

### Advocacy Matrix Calculation (Backend)

```
User Activities Input:
  ├─ Posts: [p1, p2, ..., pN]
  ├─ Documents: [d1, d2, ..., dM]
  ├─ Polls: [poll1, poll2, ...]
  ├─ Studies: [s1, s2, ...]
  ├─ Events: [e1, e2, ...]
  └─ Challenges: [c1, c2, ...]

STEP 1: Categorize Each Activity
  post p1 with audience="PUBLIC"
    ↓
    categorize_activity(p1) = ("awareness", "public")
  
  document d1 with audience="INFLUENCERS"
    ↓
    categorize_activity(d1) = ("will", "influencers")
  
  challenge c1 with audience="STAKEHOLDERS"
    ↓
    categorize_activity(c1) = ("action", "stakeholders")
  
  ...repeat for all activities

STEP 2: Build Matrix Dictionary
  matrix = {
    "awareness": {"public": 0, "influencers": 0, "stakeholders": 0},
    "will": {"public": 0, "influencers": 0, "stakeholders": 0},
    "action": {"public": 0, "influencers": 0, "stakeholders": 0},
  }
  
  For each activity (category, audience):
    matrix[category][audience] += 1

  Result:
  {
    "awareness": {"public": 5, "influencers": 2, "stakeholders": 3},
    "will": {"public": 1, "influencers": 4, "stakeholders": 6},
    "action": {"public": 1, "influencers": 2, "stakeholders": 8},
  }

STEP 3: Generate Recommendation
  Find cell with minimum value:
    min_value = 1 (multiple cells)
    min_cell = ("action", "public")
  
  Generate text:
    "You have an opportunity to grow. Focus on building action 
     with public. Try creating more content or starting a 
     discussion targeted at this group."

STEP 4: Format Response
  Convert dict to 3×3 array (row-major order):
  [
    [5, 2, 3],      // awareness: [public, influencers, stakeholders]
    [1, 4, 6],      // will: [public, influencers, stakeholders]
    [1, 2, 8]       // action: [public, influencers, stakeholders]
  ]

  Return:
  {
    "matrix": [[5, 2, 3], [1, 4, 6], [1, 2, 8]],
    "recommendation": "You have an opportunity..."
  }
```

### Frontend Bubble Rendering Calculation

```
Input: Matrix value N

Step 1: Find max
  maxVal = max(flatten(all_matrix_values))
  = max(5, 2, 3, 1, 4, 6, 1, 2, 8)
  = 8

Step 2: Calculate scale
  scale = max(0.1, N / maxVal)
  
  For value 8: scale = 8/8 = 1.0
  For value 5: scale = 5/8 = 0.625
  For value 1: scale = 1/8 = 0.125 → max(0.1, 0.125) = 0.125
  For value 0: scale = 0/8 = 0.0 → max(0.1, 0.0) = 0.1

Step 3: Calculate bubble dimensions
  width = scale * 80%
  height = scale * 80%
  
  For scale 1.0: 80% × 80%
  For scale 0.625: 50% × 50%
  For scale 0.125: 10% × 10%

Step 4: Calculate color opacity
  backgroundColor: rgba(74, 89, 105, ${scale})
  
  For scale 1.0: opacity = 1.0 (opaque)
  For scale 0.625: opacity = 0.625 (semi-transparent)
  For scale 0.1: opacity = 0.1 (very transparent)

Step 5: Calculate text color
  if scale > 0.5:
    color = "white"  // Visible on dark background
  else:
    color = "black"  // Visible on light background
  
  For scale 1.0: white
  For scale 0.625: white
  For scale 0.4: black
  For scale 0.1: black

Result: Bubble rendered with scaled size and opacity
        Text overlaid with appropriate color
```

---

## Error Handling Strategy

### AdvocacyImpactMatrix Error Handling (Complete)

```
Try Block:
  ├─ API call executed
  ├─ Response received
  └─ Data set

Catch Block:
  ├─ setError('Failed to load advocacy impact data. Please try again later.')
  └─ console.error(err)

Finally Block:
  └─ setLoading(false)

Render Decision:
  if (loading) → CircularProgress
  else if (error) → Alert severity="error" with error text
  else if (!matrixData) → Typography with "No data" message
  else → Full matrix + recommendation
```

### UserEngagementChart Error Handling (Incomplete)

```
Try Block:
  ├─ API call executed
  ├─ Response received
  └─ setUserEngagement(data)

Catch Block:
  └─ console.error('Error fetching user engagement data:', error)
     ↓
     SILENT FAILURE - NO USER FEEDBACK!

Render: Always shows table (empty if data not loaded)
```

### PostEngagementChart Error Handling (Incomplete)

```
Try Block:
  ├─ API call executed
  ├─ Response received
  └─ setPostEngagement(data)

Catch Block:
  └─ console.error('Error fetching post engagement data:', error)
     ↓
     SILENT FAILURE - NO USER FEEDBACK!

Render: Always shows table (empty if data not loaded)
```

---

## Network Request Waterfall

### Page Load Timeline

```
Time 0ms: User navigates to /analytics
Time 10ms: MainLayout routes to AnalyticsBar
Time 20ms: AnalyticsBar renders (BLANK - empty component)
           [If AnalyticsBar was implemented:]
           → AnalyticsDashboard mounts

Time 30ms: AdvocacyImpactMatrix mounts
           UserEngagementChart mounts
           PostEngagementChart mounts

Time 35ms: All 3 useEffect hooks execute (in parallel)
           
           REQUEST 1: GET /api/v1/analytics/advocacy-matrix/{userId}
           REQUEST 2: GET /api/v1/analytics/user-engagement
           REQUEST 3: GET /api/v1/analytics/post-engagement

           (These may complete in different orders)

Time 150ms: REQUEST 1 completes (fastest, single user data)
            AdvocacyImpactMatrix state updates
            Matrix renders with bubbles

Time 200ms: REQUEST 2 completes (slower, all users data)
            UserEngagementChart state updates
            Table renders with all users

Time 250ms: REQUEST 3 completes (slowest, all posts data)
            PostEngagementChart state updates
            Table renders with all posts

Time 260ms: Full page rendered with all 3 sections
```

---

## Performance Analysis

### Computational Complexity

| Operation | Complexity | Scale |
|-----------|-----------|-------|
| Advocacy matrix calculation | O(n) | n = total activities |
| Bubble sizing | O(1) | 9 cells always |
| Text rendering | O(9) | 9 bubbles |
| User table render | O(u) | u = number of users |
| Post table render | O(p) | p = number of posts |

### Memory Usage

| Component | Size | Notes |
|-----------|------|-------|
| Matrix data | ~1KB | Fixed size (9 cells + text) |
| User list | 0.5KB per user | Could be large dataset |
| Post list | 0.5KB per post | Could be large dataset |
| DOM nodes | ~50-100+ | Depends on table rows |

### Optimization Opportunities

1. **Combine APIs**: 3 calls → 1 call (save latency)
2. **Pagination**: Limit users/posts per page (reduce transfer)
3. **Caching**: Use React Query or SWR (avoid refetch)
4. **Lazy Load**: Load tables only when scrolled into view
5. **Memoization**: useMemo for bubble calculations
6. **Code Splitting**: Load analytics only when needed

---

## Integration Points

### With Authentication System

```
Current: No auth check visible in components
Expected: userId must come from authenticated session

Integration Points:
  ├─ FloatingNav → Protected by PrivateRoute
  ├─ MainLayout → route protected by PrivateRoute
  ├─ AnalyticsBar → route protected by PrivateRoute
  └─ AnalyticsDashboard → needs userId from auth context

Solution: useAuth() hook or useUser() to get current user ID
```

### With Notification System

```
Opportunities:
  ├─ When recommendation updates → notify user
  ├─ When user reaches milestone → celebrate
  └─ When follow-up action needed → send notification

Current: None implemented
```

### With Theme System

```
Color Integration:
  ├─ Primary color: RGB(74, 89, 105) - hardcoded
  ├─ Should use: theme.palette.primary.main
  └─ Background: theme.palette.background.paper

Current: Only partially integrated
Fix: Use useTheme() hook and sx prop for theme colors
```

---

## Testing Strategy

### Unit Tests Needed

```
AdvocacyImpactMatrix:
  ├─ Verify API endpoint called with correct userId
  ├─ Verify loading state shows CircularProgress
  ├─ Verify error state shows Alert
  ├─ Verify matrix renders 9 cells
  ├─ Verify bubble scaling: scale = value/maxVal
  ├─ Verify opacity: rgba(primary, scale)
  ├─ Verify text color: white if scale > 0.5 else black
  ├─ Verify recommendation text displays
  └─ Verify hover effect transforms to scale(1.1)

UserEngagementChart:
  ├─ Verify API endpoint called on mount
  ├─ Verify table renders with all users
  ├─ Verify columns: User, Posts, Comments, Following, Followers
  ├─ Verify numeric columns right-aligned
  └─ Verify no error UI on failure

PostEngagementChart:
  ├─ Verify API endpoint called on mount
  ├─ Verify table renders with all posts
  ├─ Verify columns: Post, Author, Comments, Likes
  ├─ Verify numeric columns right-aligned
  └─ Verify no error UI on failure
```

### Integration Tests Needed

```
AnalyticsDashboard:
  ├─ All 3 child components mount
  ├─ All 3 API calls fire in parallel
  ├─ Title displays "Analytics Dashboard"
  ├─ Sections display in order: Matrix, User, Post
  ├─ Spacing between sections (mb={4})
  └─ userId prop flows to AdvocacyImpactMatrix

AnalyticsBar:
  └─ [NEEDS IMPLEMENTATION TEST]
```

### E2E Tests Needed

```
/analytics Route:
  ├─ User navigates to /analytics
  ├─ Page loads with all 3 sections
  ├─ Matrix displays with bubbles
  ├─ User engagement table shows data
  ├─ Post engagement table shows data
  ├─ Hover on bubbles scales them
  ├─ Recommendation text is readable
  └─ No console errors

User Workflows:
  ├─ View current analytics
  ├─ Understand recommendation
  ├─ Scroll through engagement tables
  └─ Hover on matrix to explore
```

---

## Security Considerations

### Current Security Issues

1. **Authorization**: Unclear if user can see other users' analytics
   - API endpoints don't show authorization logic
   - UserEngagementChart queries ALL users (not filtered)
   - PostEngagementChart queries ALL posts (not filtered)

2. **Data Exposure**: Potential to leak:
   - User personal stats (posts, comments, follows)
   - Post engagement metrics (useful for stalking)
   - Advocacy strategy (via recommendation)

### Recommended Fixes

```
Backend:
  ├─ Add authorization check in endpoints
  ├─ Verify user can only see their own advocacy matrix
  ├─ For user/post tables: add user_id filter or make read-only
  ├─ Log access to sensitive analytics
  └─ Add rate limiting

Frontend:
  ├─ Verify currentUserId matches dashboard userId
  ├─ Don't expose other users' detailed stats
  └─ Add disclaimer about data collection
```

---

## Future Enhancements

### Phase 2 Features

1. **Time Series Analytics**
   - Track advocacy efforts over time
   - Show trends/growth patterns
   - Weekly/monthly breakdowns

2. **Detailed Breakdowns**
   - Click matrix cell → see activities in that cell
   - Click user row → see detailed profile
   - Click post row → see post and comments

3. **Comparative Analytics**
   - Compare with other users
   - See peer benchmarks
   - Identify gaps vs peers

4. **Actionable Insights**
   - AI-generated recommendations
   - Suggested content ideas
   - Optimal posting times

5. **Export & Sharing**
   - Download analytics report
   - Share specific insights
   - Print-friendly view

### Podcast-Specific Analytics

```
DetailedAnalytics component (currently stub):
  ├─ Episode performance metrics
  ├─ Listener demographics
  ├─ Listener retention/drop-off
  ├─ Download trends
  └─ Subscriber growth

ImpressionAnalytics component (currently stub):
  ├─ Impression counts per episode
  ├─ Click-through rates
  ├─ Engagement by topic
  └─ Competitor benchmarks
```

---

## Dependency Map

### Frontend Dependencies

```
AnalyticsBar
  └─ AnalyticsDashboard
      ├─ AdvocacyImpactMatrix
      │  ├─ Material-UI: Paper, Typography, Box, Grid
      │  ├─ Material-UI: CircularProgress, Alert
      │  ├─ HTTP: apiClient (axios wrapper)
      │  └─ Hooks: useState, useEffect
      │
      ├─ UserEngagementChart
      │  ├─ Material-UI: Table, TableContainer, TableHead, TableBody
      │  ├─ Material-UI: TableRow, TableCell, Paper
      │  ├─ HTTP: fetch API
      │  └─ Hooks: useState, useEffect
      │
      └─ PostEngagementChart
         ├─ Material-UI: Table, TableContainer, TableHead, TableBody
         ├─ Material-UI: TableRow, TableCell, Paper
         ├─ HTTP: fetch API
         └─ Hooks: useState, useEffect
```

### Backend Dependencies

```
/api/v1/analytics/advocacy-matrix/{user_id}
  ├─ FastAPI: APIRouter, Depends
  ├─ SQLAlchemy: Session, Query
  ├─ Models:
  │  ├─ Post (Query author_id)
  │  ├─ Document (Query author_id)
  │  ├─ Poll (Query author_id)
  │  ├─ Study (Query author_id)
  │  ├─ Event (Query owner_id)
  │  └─ Challenge (Query creator_id)
  ├─ Schemas: AdvocacyImpactMatrix
  ├─ Core: get_db dependency
  └─ Python: uuid, Dict, Any, List
```

---

## Debugging Guide

### Common Issues & Solutions

**Issue**: Page is blank at /analytics

**Diagnosis**:
```javascript
// Check AnalyticsBar is empty
cat /path/to/AnalyticsBar.jsx  // Results in 0 bytes

// Check route exists
// grep "/analytics" MainLayout.jsx
```

**Solution**: Implement AnalyticsBar wrapper

---

**Issue**: Matrix shows but no data

**Diagnosis**:
```javascript
// Check userId is undefined
console.log('userId:', userId)  // undefined

// Check API response
// Network tab → GET /api/v1/analytics/advocacy-matrix/{userId}
// Returns 404 or null
```

**Solution**: Get userId from auth context/hook

---

**Issue**: Tables show but user/post engagement data empty

**Diagnosis**:
```javascript
// Check API endpoints exist
// curl http://localhost:8000/api/v1/analytics/user-engagement
// Returns 404

// Check backend returns data
// Check query logic in endpoints
```

**Solution**: Implement missing endpoints in backend

---

**Issue**: Bubbles all same size

**Diagnosis**:
```javascript
// Matrix values all equal
console.log('maxVal:', maxVal)  // 5
console.log('matrix:', matrixData.matrix)  // [[5,5,5],[5,5,5],[5,5,5]]

// Scale calculation
scale = 5/5 = 1.0 for all cells
```

**Solution**: Create test data with varying values

---

## Summary

**Analytics Page** is a sophisticated advocacy impact visualization system with:

- **Frontend**: 3 React components handling matrix visualization and engagement tables
- **Backend**: Advocacy matrix calculation endpoint (2 more endpoints missing)
- **Architecture**: Independent component state management with parallel API calls
- **Status**: 70% complete (critical wrapper missing, some endpoints missing, error handling incomplete)

**To Deploy**: Implement AnalyticsBar, add missing endpoints, fix user ID passing, add error UI.
