# Analytics Page - Complete Frontend Guide

## Overview

The Analytics Page is a comprehensive dashboard for users to track and understand their advocacy impact across different audiences and activity types. It combines multiple visualization components to provide insights into user engagement and strategic recommendations.

**Location**: `/analytics` route  
**Current Status**: Partially implemented (AnalyticsBar is empty, but AnalyticsDashboard component exists)

---

## Page Structure

### Component Hierarchy

```
AnalyticsBar (Main Page - Currently Empty)
├── AnalyticsDashboard (Main Dashboard Component)
│   ├── AdvocacyImpactMatrix (3x3 Matrix Visualization)
│   ├── UserEngagementChart (User Stats Table)
│   └── PostEngagementChart (Post Stats Table)
└── (Other components: DetailedAnalytics, ImpressionAnalytics - Stubs)
```

---

## Main Components

### 1. AnalyticsDashboard.jsx (37 LOC)

**Purpose**: Root container that orchestrates all analytics visualizations

**Props**:
- `userId` (UUID) - The user whose analytics to display

**Structure**:
```
┌─────────────────────────────────────┐
│   Analytics Dashboard (Title)       │
├─────────────────────────────────────┤
│                                     │
│  Advocacy Impact Matrix Section     │
│  (Shows 3x3 matrix with bubbles)    │
│                                     │
│  ─────────────────────────────────  │
│                                     │
│  User Engagement Section (Title)    │
│  (Shows user stats in table)        │
│                                     │
│  ─────────────────────────────────  │
│                                     │
│  Post Engagement Section (Title)    │
│  (Shows post stats in table)        │
│                                     │
└─────────────────────────────────────┘
```

**Key Features**:
- Responsive grid layout with Material-UI Box components
- Section spacing using `mb` (margin-bottom) utilities
- Typography hierarchy (h4 for title, h5 for sections)
- Passes userId to AdvocacyImpactMatrix

**Data Flow**:
```
AnalyticsDashboard
    ↓
    ├─→ AdvocacyImpactMatrix (receives userId)
    ├─→ UserEngagementChart (no props)
    └─→ PostEngagementChart (no props)
```

---

### 2. AdvocacyImpactMatrix.jsx (120+ LOC)

**Purpose**: Interactive 3x3 matrix visualization showing user advocacy efforts

**Props**:
- `userId` (UUID) - Required, triggers data fetch

**Matrix Structure**:

```
                    Y-Axis
                    ├─ Awareness
                    ├─ Will
                    └─ Action

X-Axis:
├─ Public
├─ Influencers
└─ Stakeholders

Layout:
┌───────────┬──────────┬──────────┬──────────┐
│           │ Public   │ Influ.   │ Stakeh.  │
├───────────┼──────────┼──────────┼──────────┤
│Awareness  │ 15       │ 8        │ 12       │
│           │ [○]      │ [●]      │ [◉]      │
├───────────┼──────────┼──────────┼──────────┤
│Will       │ 3        │ 9        │ 14       │
│           │ [◌]      │ [◈]      │ [◆]      │
├───────────┼──────────┼──────────┼──────────┤
│Action     │ 2        │ 5        │ 20       │
│           │ [·]      │ [▪]      │ [■]      │
└───────────┴──────────┴──────────┴──────────┘

Where bubble size ∝ activity count
```

**API Endpoint**: 
- GET `/api/v1/analytics/advocacy-matrix/{userId}`
- Returns: `{ matrix: List[List[int]], recommendation: string }`

**Data Structure**:
```javascript
matrixData = {
  matrix: [
    [awareness_public, awareness_influencers, awareness_stakeholders],
    [will_public, will_influencers, will_stakeholders],
    [action_public, action_influencers, action_stakeholders]
  ],
  recommendation: "Strategic recommendation text"
}
```

**State Management**:
```javascript
const [matrixData, setMatrixData] = useState(null)
const [loading, setLoading] = useState(true)
const [error, setError] = useState(null)
```

**Lifecycle**:
1. Component mounts
2. useEffect triggers if userId exists
3. setLoading(true)
4. Fetch from API endpoint
5. setMatrixData on success
6. setError on failure
7. setLoading(false) always

**Visual Details**:

- **Bubble Sizing**: Linear scaling from 0-80% of cell width/height
- **Color**: RGBA of primary color (74, 89, 105) with opacity based on scale
- **Hover Effect**: Bubble scales to 1.1x on hover
- **Text**: White text if bubble is dark (scale > 0.5), black otherwise
- **Borders**: Light gray (1px solid #e0e0e0)

**Components Used**:
- Paper (elevation 3, padding 3, margin-top 4)
- Grid (12-column layout)
- CircularProgress (loading state)
- Alert (error state)
- Box (bubble container with hover effects)
- Typography (labels and recommendation text)

**Recommendation Section**:
```
┌──────────────────────────────────────────┐
│ Next Step Recommendation                  │
│                                          │
│ "You have an opportunity to grow. Focus  │
│  on building {category} with {audience}. │
│  Try creating more content or starting   │
│  a discussion targeted at this group."   │
└──────────────────────────────────────────┘
```

---

### 3. UserEngagementChart.jsx (51 LOC)

**Purpose**: Tabular display of user engagement metrics

**Table Columns**:
| Column | Type | Meaning |
|--------|------|---------|
| User | String | User's full name |
| Posts | Number | Total posts created |
| Comments | Number | Total comments made |
| Following | Number | Users they follow |
| Followers | Number | Users following them |

**API Endpoint**:
- GET `/api/v1/analytics/user-engagement`
- Returns: `List[UserEngagement]`

**Data Structure**:
```javascript
[
  {
    user_id: UUID,
    full_name: string,
    posts_count: number,
    comments_count: number,
    following_count: number,
    followers_count: number
  },
  ...
]
```

**State Management**:
```javascript
const [userEngagement, setUserEngagement] = useState([])
```

**Lifecycle**:
1. Component mounts
2. useEffect triggers
3. Fetch from API
4. setUserEngagement(data)
5. Catch and log errors (no error UI)

**Table Structure**:
```
┌──────────────┬───────┬──────────┬──────────┬───────────┐
│ User         │ Posts │ Comments │ Following│ Followers │
├──────────────┼───────┼──────────┼──────────┼───────────┤
│ Alice Johnson│   15  │    42    │    28    │    145    │
│ Bob Smith    │    8  │    23    │    35    │     89    │
│ Carol Davis  │   22  │    67    │    12    │    234    │
└──────────────┴───────┴──────────┴──────────┴───────────┘
```

**Features**:
- TableContainer with Paper elevation
- Right-aligned number columns
- Responsive Material-UI table
- Silent error handling (logs to console only)

---

### 4. PostEngagementChart.jsx (51 LOC)

**Purpose**: Tabular display of post engagement metrics

**Table Columns**:
| Column | Type | Meaning |
|--------|------|---------|
| Post | String | Post content/text |
| Author | String | Author's name |
| Comments | Number | Comment count |
| Likes | Number | Like count |

**API Endpoint**:
- GET `/api/v1/analytics/post-engagement`
- Returns: `List[PostEngagement]`

**Data Structure**:
```javascript
[
  {
    post_id: UUID,
    text: string,
    author: string,
    comments_count: number,
    likes_count: number
  },
  ...
]
```

**State Management**:
```javascript
const [postEngagement, setPostEngagement] = useState([])
```

**Lifecycle**: Same as UserEngagementChart

**Table Structure**:
```
┌──────────────────────────────┬────────────┬──────────┬───────┐
│ Post                         │ Author     │ Comments │ Likes │
├──────────────────────────────┼────────────┼──────────┼───────┤
│ Just launched my new study... │ Alice J.   │    12    │  45   │
│ Check out this podcast ep... │ Bob Smith  │     5    │  23   │
│ New challenge starting now... │ Carol D.   │    28    │ 156   │
└──────────────────────────────┴────────────┴──────────┴───────┘
```

**Features**:
- Post text likely truncated due to cell width
- Right-aligned numeric columns
- Material-UI Paper wrapper
- Silent error handling

---

### 5. AnalyticsBar.jsx (Empty)

**Status**: Currently empty file (0 LOC)

**Intended Purpose**: Main analytics page component

**Should contain**:
- Either direct AnalyticsDashboard import or
- Layout wrapper around AnalyticsDashboard

**Current Issue**: Empty, so `/analytics` route renders nothing

---

### 6. DetailedAnalytics.jsx & ImpressionAnalytics.jsx (Stub Components)

**Status**: Placeholder components for future development

**Current Implementation**: Single div with text

```jsx
// DetailedAnalytics
<div>Detailed Analytics</div>

// ImpressionAnalytics
<div>Impression Analytics</div>
```

**Intended Use**: Imported in PodcastArtistProfile component for podcast-specific analytics

---

## User Flows

### Flow 1: View Analytics Dashboard

```
User clicks "/analytics" in navigation
        ↓
MainLayout routes to AnalyticsBar
        ↓
AnalyticsBar renders AnalyticsDashboard
        ↓
AnalyticsDashboard fetches:
├─→ /api/v1/analytics/advocacy-matrix/{userId}
├─→ /api/v1/analytics/user-engagement
└─→ /api/v1/analytics/post-engagement
        ↓
Data displayed in three sections:
├─→ AdvocacyImpactMatrix (3x3 grid with bubbles)
├─→ UserEngagementChart (table)
└─→ PostEngagementChart (table)
```

### Flow 2: Interact with Advocacy Matrix

```
Page loads → Matrix loads
        ↓
User hovers over bubble → Bubble scales 1.1x
        ↓
User sees recommendation box
        ↓
User can scroll to see user/post engagement tables
```

---

## API Contracts

### Advocacy Impact Matrix Endpoint

**Endpoint**: `GET /api/v1/analytics/advocacy-matrix/{user_id}`

**Path Parameters**:
- `user_id` (UUID) - Required

**Response** (200 OK):
```json
{
  "matrix": [
    [15, 8, 12],
    [3, 9, 14],
    [2, 5, 20]
  ],
  "recommendation": "You have an opportunity to grow. Focus on building action with public. Try creating more content or starting a discussion targeted at this group."
}
```

**Error Responses**:
- 404: User not found
- 500: Server error

**Backend Logic** (from backend endpoint):

1. **Categorize Activities**:
   - Posts → "Awareness"
   - Documents → "Will"
   - Polls → "Awareness"
   - Studies → "Will"
   - Events → "Action"
   - Challenges → "Action"

2. **Fetch User's Activities**: Query by author_id across all content types

3. **Build Matrix**: Count activities in each category × audience combination
   - Audience extracted from activity.audience property
   - Default values: PUBLIC, INFLUENCERS, STAKEHOLDERS

4. **Generate Recommendation**:
   - Find cell with minimum value
   - Suggest user focus on that category + audience combination
   - Default message if no clear opportunity

5. **Format Response**: Convert matrix dict to 3×3 array

---

### User Engagement Endpoint

**Endpoint**: `GET /api/v1/analytics/user-engagement`

**Response** (200 OK):
```json
[
  {
    "user_id": "uuid-here",
    "full_name": "Alice Johnson",
    "posts_count": 15,
    "comments_count": 42,
    "following_count": 28,
    "followers_count": 145
  },
  ...
]
```

**Note**: No authorization/filtering shown - returns all users' stats

---

### Post Engagement Endpoint

**Endpoint**: `GET /api/v1/analytics/post-engagement`

**Response** (200 OK):
```json
[
  {
    "post_id": "uuid-here",
    "text": "Just launched my new study...",
    "author": "Alice Johnson",
    "comments_count": 12,
    "likes_count": 45
  },
  ...
]
```

**Note**: No authorization shown - returns stats for all posts

---

## State Management

### AdvocacyImpactMatrix State
```javascript
// Local component state
const [matrixData, setMatrixData] = useState(null)
const [loading, setLoading] = useState(true)
const [error, setError] = useState(null)

// Data fetched in useEffect
useEffect(() => {
  if (userId) {
    fetchData() // Sets state based on response
  }
}, [userId]) // Dependency: userId
```

### UserEngagementChart State
```javascript
const [userEngagement, setUserEngagement] = useState([])
// Fetched in useEffect with no dependencies (runs once on mount)
```

### PostEngagementChart State
```javascript
const [postEngagement, setPostEngagement] = useState([])
// Fetched in useEffect with no dependencies (runs once on mount)
```

---

## Styling & Theme

### Material-UI Components Used
- `Box` - Layout container
- `Typography` - Text (variants: h4, h5, h6, body1, body2, subtitle1, subtitle2)
- `Paper` - Card container (elevation 3)
- `Grid` - Responsive grid system
- `Table`, `TableContainer`, `TableHead`, `TableBody`, `TableRow`, `TableCell`
- `CircularProgress` - Loading spinner
- `Alert` - Error message

### Custom Styling (AdvocacyImpactMatrix)
```javascript
// Bubble styling
Box sx={{
  width: `${scale * 80}%`,
  height: `${scale * 80}%`,
  backgroundColor: `rgba(74, 89, 105, ${scale})`, // Primary color with opacity
  borderRadius: '50%',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.1)',
  },
}}

// Text color logic
color: scale > 0.5 ? 'white' : 'black'
```

### Color Scheme
- Primary: RGB(74, 89, 105) - Dark blue-gray
- Background: Material-UI theme default
- Text: Black/White depending on context
- Borders: #e0e0e0 (light gray)

---

## Performance Characteristics

### Data Fetching
- **AdvocacyImpactMatrix**: Single API call on mount (or userId change)
- **UserEngagementChart**: Single API call on mount
- **PostEngagementChart**: Single API call on mount
- **Total API Calls on Page Load**: 3 parallel calls

### Rendering
- **AdvocacyImpactMatrix**: 9 bubble cells (3×3) rendered in Grid
- **UserEngagementChart**: Dynamic rows (depends on data)
- **PostEngagementChart**: Dynamic rows (depends on data)
- **Total DOM Elements**: 30-100+ depending on data

### Potential Optimizations
- Combine multiple analytics endpoints into single request
- Add pagination for large user/post lists
- Implement caching/memoization
- Add loading states for individual sections

---

## Known Issues & Limitations

### 1. AnalyticsBar is Empty
- **Issue**: `/analytics` route renders nothing
- **Fix**: Implement AnalyticsBar.jsx to wrap AnalyticsDashboard
- **Severity**: CRITICAL - Page non-functional

### 2. Missing User ID in Dashboard
- **Issue**: AnalyticsDashboard receives userId prop, but no mechanism to pass it
- **Workaround**: Need context/hook to get current user ID
- **Severity**: HIGH - Advocacy matrix won't work

### 3. No Pagination for Engagement Tables
- **Issue**: All users/posts returned in single API response
- **Potential**: Performance issue with large datasets
- **Severity**: MEDIUM - Database dependent

### 4. Silent Error Handling in Tables
- **Issue**: UserEngagementChart & PostEngagementChart only log errors to console
- **Fix**: Add user-facing error alerts
- **Severity**: LOW - Debugging is harder

### 5. No Real-Time Updates
- **Issue**: Data fetched once on mount, no refresh mechanism
- **Fix**: Add refresh button or auto-refresh timer
- **Severity**: LOW - Data may be stale

### 6. Stub Components Incomplete
- **Issue**: DetailedAnalytics & ImpressionAnalytics are placeholders
- **Fix**: Implement podcast-specific analytics
- **Severity**: MEDIUM - Feature incomplete

---

## Integration with Other Pages

### PodcastArtistProfile Integration
```jsx
{activeTab === 'analytics' && (
  // Currently shows: <div>Detailed Analytics</div>
  // Placeholder for future DetailedAnalytics component
)}
```

### FloatingNav Integration
```jsx
<IconLink to="/analytics" theme={theme}>
  // Analytics link in main navigation
</IconLink>
```

### MainLayout Integration
```jsx
<Route path="/analytics" element={<AnalyticsBar />} />
// AnalyticsBar is private route (requires authentication)
```

---

## Testing Recommendations

### Unit Tests
- [ ] AdvocacyImpactMatrix bubble sizing calculations
- [ ] Matrix value to opacity mapping
- [ ] API response parsing
- [ ] Error state rendering

### Integration Tests
- [ ] AnalyticsDashboard loads all three components
- [ ] userId prop flows to AdvocacyImpactMatrix
- [ ] API responses populate tables correctly
- [ ] Loading states display correctly

### E2E Tests
- [ ] Navigate to /analytics loads dashboard
- [ ] Hover over bubbles triggers scale effect
- [ ] All three tables display data
- [ ] Recommendation section shows text

---

## Data Model Mapping

### Backend Activity Types → Matrix Categories

| Backend Model | Frontend Category | Audience Source |
|---------------|------------------|-----------------|
| Post | Awareness | post.audience |
| Document | Will | doc.audience |
| Poll | Awareness | poll.audience |
| Study | Will | study.audience |
| Event | Action | event.audience |
| Challenge | Action | challenge.audience |

### Audience Values
- `PUBLIC` → Appears in "Public" column
- `INFLUENCERS` → Appears in "Influencers" column
- `STAKEHOLDERS` → Appears in "Stakeholders" column

---

## Deployment Checklist

- [ ] Implement AnalyticsBar.jsx to wrap AnalyticsDashboard
- [ ] Add current user ID context/hook to pass to Dashboard
- [ ] Verify all three API endpoints are implemented in backend
- [ ] Add pagination to engagement tables
- [ ] Add user-facing error alerts to tables
- [ ] Add refresh/reload button on dashboard
- [ ] Implement DetailedAnalytics component
- [ ] Implement ImpressionAnalytics component
- [ ] Add tests for analytics components
- [ ] Performance test with large datasets
- [ ] Update navigation/documentation

---

## Summary

The Analytics Page provides comprehensive advocacy impact visualization and engagement metrics tracking. It consists of:

1. **AdvocacyImpactMatrix**: 3×3 grid showing advocacy efforts by stage (Awareness/Will/Action) and audience (Public/Influencers/Stakeholders)
2. **UserEngagementChart**: Table of user activity metrics (posts, comments, follows)
3. **PostEngagementChart**: Table of post engagement metrics (likes, comments)

**Current Status**: 70% complete - visualizations exist but wrapper component (AnalyticsBar) is empty and needs implementation.

**Critical Path to Functional**: Implement AnalyticsBar.jsx and add user context.
