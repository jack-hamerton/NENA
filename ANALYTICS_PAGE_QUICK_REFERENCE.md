# Analytics Page - Quick Reference

## 10 Key Facts

1. **URL**: `/analytics` (private route, requires authentication)
2. **Main Component**: AnalyticsDashboard (but rendered via empty AnalyticsBar wrapper)
3. **Three Visualizations**: Advocacy Impact Matrix, User Engagement Table, Post Engagement Table
4. **Matrix Design**: 3×3 grid (3 advocacy stages × 3 audience types) with bubble visualization
5. **Bubble Sizing**: Size represents activity count; hovers to 1.1x scale
6. **API Calls**: 3 endpoints called on page load (no caching)
7. **State Management**: Local component state (no Redux/Context)
8. **Current Status**: 70% complete - AnalyticsBar wrapper needs implementation
9. **Critical Issue**: No mechanism to pass current user ID to Dashboard component
10. **Stub Components**: DetailedAnalytics and ImpressionAnalytics exist for podcasts but are placeholders

---

## 5 Workflows

### 1. View Analytics Dashboard
**User Action**: Click "Analytics" in navigation  
**Flow**: FloatingNav → MainLayout routes to /analytics → AnalyticsBar (empty) → AnalyticsDashboard loads → 3 API calls fire  
**Result**: Advocacy matrix, user engagement table, post engagement table display with loading states

### 2. Interact with Advocacy Matrix
**User Action**: Hover over bubble in matrix  
**Flow**: Bubble component detects onHover → CSS transform: scale(1.1) applied → User sees relative size increase  
**Result**: Visual feedback showing which cell user is viewing; can read recommendation box

### 3. View User Engagement
**User Action**: Scroll to "User Engagement" section  
**Flow**: Material-UI Table renders with all users' stats from /api/v1/analytics/user-engagement  
**Result**: Sortable(?) table with posts, comments, following, followers counts per user

### 4. View Post Engagement
**User Action**: Scroll to "Post Engagement" section  
**Flow**: Material-UI Table renders with all posts' stats from /api/v1/analytics/post-engagement  
**Result**: Table with post text, author, comments count, likes count per post

### 5. Understand Recommendation
**User Action**: Read recommendation box under matrix  
**Flow**: Backend calculates lowest-value cell in matrix → generates recommendation → frontend displays in Box component  
**Result**: User sees suggested focus area (e.g., "Focus on building action with public")

---

## Component Map

```
AnalyticsBar.jsx (Empty - NEEDS IMPLEMENTATION)
  ↓
AnalyticsDashboard.jsx (37 LOC)
  ├─→ AdvocacyImpactMatrix.jsx (120 LOC)
  │   ├─ API: GET /api/v1/analytics/advocacy-matrix/{userId}
  │   └─ Renders: 3×3 grid with bubbles, recommendation text
  │
  ├─→ UserEngagementChart.jsx (51 LOC)
  │   ├─ API: GET /api/v1/analytics/user-engagement
  │   └─ Renders: Material-UI Table with 5 columns
  │
  └─→ PostEngagementChart.jsx (51 LOC)
      ├─ API: GET /api/v1/analytics/post-engagement
      └─ Renders: Material-UI Table with 4 columns

DetailedAnalytics.jsx (5 LOC - Podcast stub)
ImpressionAnalytics.jsx (5 LOC - Podcast stub)
```

---

## Data Structures

### AdvocacyImpactMatrix Response
```javascript
{
  matrix: [
    [15, 8, 12],        // Awareness: Public, Influencers, Stakeholders
    [3, 9, 14],         // Will: Public, Influencers, Stakeholders
    [2, 5, 20]          // Action: Public, Influencers, Stakeholders
  ],
  recommendation: "You have an opportunity to grow..."
}
```

### UserEngagementChart Response
```javascript
[
  {
    user_id: uuid,
    full_name: string,
    posts_count: number,
    comments_count: number,
    following_count: number,
    followers_count: number
  }
]
```

### PostEngagementChart Response
```javascript
[
  {
    post_id: uuid,
    text: string,
    author: string,
    comments_count: number,
    likes_count: number
  }
]
```

---

## API Endpoints

| Endpoint | Method | Purpose | Auth Required |
|----------|--------|---------|----------------|
| `/api/v1/analytics/advocacy-matrix/{userId}` | GET | Get 3×3 matrix + recommendation | Yes (implicit) |
| `/api/v1/analytics/user-engagement` | GET | Get all users' engagement stats | Not shown |
| `/api/v1/analytics/post-engagement` | GET | Get all posts' engagement stats | Not shown |

---

## 20 Test Scenarios

### Advocacy Matrix Tests
1. ✓ Matrix loads with 9 cells (3×3)
2. ✓ Bubble sizes scale correctly (0-80% based on value)
3. ✓ Bubble color opacity increases with value
4. ✓ Hover effect scales bubble to 1.1x
5. ✓ Recommendation text displays below matrix
6. ✓ Matrix axes labeled correctly (Awareness/Will/Action, Public/Influencers/Stakeholders)
7. ✓ Loading spinner shows while data fetches
8. ✓ Error alert displays on API failure
9. ✓ Empty state message shows if no data
10. ✓ Re-fetches when userId prop changes

### User Engagement Tests
11. ✓ Table renders with all users
12. ✓ Columns: User, Posts, Comments, Following, Followers
13. ✓ Numeric columns right-aligned
14. ✓ Each user row shows correct stats
15. ✓ Table handles empty data gracefully

### Post Engagement Tests
16. ✓ Table renders with all posts
17. ✓ Columns: Post, Author, Comments, Likes
18. ✓ Numeric columns right-aligned
19. ✓ Each post row shows correct stats
20. ✓ Table handles empty data gracefully

---

## Troubleshooting

| Problem | Cause | Solution |
|---------|-------|----------|
| /analytics page is blank | AnalyticsBar.jsx is empty | Implement AnalyticsBar to render AnalyticsDashboard |
| Advocacy matrix doesn't show userId | No context/hook to get current user | Add useAuth() or useUser() hook, pass to Dashboard |
| API 404 errors | Endpoints not implemented | Verify backend has analytics.py endpoints |
| Tables show no data | userId or other filters missing from backend | Check API response structure |
| Bubbles all same size | maxVal calculation wrong | Verify Math.max(...matrix.flat()) works |
| Recommendation is generic | All cells have same value | Test with uneven activity distribution |
| Page loads slowly | 3 sequential API calls | Optimize to parallel or combine endpoints |
| Hover effect not working | CSS not applied | Check transform: 'scale(1.1)' in sx prop |

---

## 5 Features Matrix

| Feature | Implemented | Tested | Notes |
|---------|-------------|--------|-------|
| Advocacy Impact Matrix | ✓ | ? | Needs userId prop source |
| User Engagement Chart | ✓ | ? | No pagination |
| Post Engagement Chart | ✓ | ? | No pagination |
| AnalyticsBar Wrapper | ✗ | ✗ | CRITICAL - empty file |
| DetailedAnalytics (Podcast) | ✗ | ✗ | Stub only |
| ImpressionAnalytics (Podcast) | ✗ | ✗ | Stub only |
| Refresh Button | ✗ | ✗ | No way to reload data |
| Error Alerts (User Engagement) | ✗ | ✗ | Silent fail only |
| Error Alerts (Post Engagement) | ✗ | ✗ | Silent fail only |
| Search/Filter | ✗ | ✗ | Tables not filterable |
| Sort | ✗ | ✗ | Tables not sortable |
| Pagination | ✗ | ✗ | All data in single response |
| Real-Time Updates | ✗ | ✗ | No polling/WebSocket |

---

## Visual Layout

### Page Layout (Desktop)
```
┌─────────────────────────────────────────────┐
│ Analytics Dashboard                         │
├─────────────────────────────────────────────┤
│                                             │
│ ┌─────────────────────────────────────────┐│
│ │ Your Advocacy Impact Matrix             ││
│ │ This matrix visualizes your advocacy... ││
│ │ ┌──────────┬──────────┬──────────┐     ││
│ │ │ Public   │Influencers│Stakeholder││     ││
│ │ ├──────────┼──────────┼──────────┤     ││
│ │ │ 15[●]    │ 8[◆]     │ 12[▲]    │     ││
│ │ │ 3[○]     │ 9[◈]     │ 14[△]    │     ││
│ │ │ 2[◌]     │ 5[▪]     │ 20[■]    │     ││
│ │ └──────────┴──────────┴──────────┘     ││
│ │ Next Step Recommendation                ││
│ │ "Focus on building action with public" ││
│ └─────────────────────────────────────────┘│
│                                             │
│ User Engagement                             │
│ ┌─────────────────────────────────────────┐│
│ │ User      │ Posts │ Comments │ Fol│Followers
│ ├─────────────────────────────────────────┤│
│ │ Alice J.  │ 15    │ 42       │ 28 │ 145 │
│ │ Bob S.    │  8    │ 23       │ 35 │  89 │
│ └─────────────────────────────────────────┘│
│                                             │
│ Post Engagement                             │
│ ┌─────────────────────────────────────────┐│
│ │ Post     │ Author   │ Comments │ Likes  │
│ ├─────────────────────────────────────────┤│
│ │ Just...  │ Alice J. │ 12       │ 45     │
│ │ Check... │ Bob S.   │ 5        │ 23     │
│ └─────────────────────────────────────────┘│
└─────────────────────────────────────────────┘
```

---

## Deployment Checklist

- [ ] Implement AnalyticsBar.jsx
  - [ ] Import AnalyticsDashboard
  - [ ] Get current user ID from context/hook
  - [ ] Pass userId to dashboard
- [ ] Fix user ID passing mechanism
- [ ] Add pagination to tables
- [ ] Add error UI to UserEngagementChart
- [ ] Add error UI to PostEngagementChart
- [ ] Implement DetailedAnalytics component
- [ ] Implement ImpressionAnalytics component
- [ ] Add refresh button
- [ ] Add loading states per section
- [ ] Test with real data
- [ ] Performance test with 1000+ users/posts

---

## Code Examples

### How to Fix AnalyticsBar (Quick Fix)
```jsx
import React from 'react';
import AnalyticsDashboard from './AnalyticsDashboard';
import { useAuth } from '../hooks/useAuth'; // Assuming this exists

const AnalyticsBar = () => {
  const { user } = useAuth();
  
  if (!user) return <div>Loading...</div>;
  
  return <AnalyticsDashboard userId={user.id} />;
};

export default AnalyticsBar;
```

### How to Add Error UI to UserEngagementChart
```jsx
// Add error state
const [error, setError] = useState(null);

// In catch block
catch (error) {
  setError('Failed to load user engagement data');
}

// In render
if (error) return <Alert severity="error">{error}</Alert>;
```

---

## Summary

**Analytics Page** provides user advocacy impact visualization and engagement metrics. Currently **70% complete**:
- ✓ Visualizations exist (AdvocacyImpactMatrix, engagement tables)
- ✗ Main wrapper (AnalyticsBar) is empty
- ✗ No user ID passing mechanism
- ✗ Some error handling incomplete

**To Deploy**: Implement AnalyticsBar.jsx wrapper and add user context mechanism.

**Impact**: High - Strategic tool for understanding user advocacy efforts and engagement.
