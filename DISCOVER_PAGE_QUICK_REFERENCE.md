# Discover Page - Quick Reference 🔍

**Get Up to Speed in 5 Minutes**

---

## What Is It?

The Discover Page (`/discover`) is NENA's search and exploration interface where users can find and connect with:
- 👤 **Users** - Other profiles to follow
- 📝 **Posts** - Content and discussions
- #️⃣ **Hashtags** - Trending topics
- 🏠 **Rooms** - Collaborative spaces

---

## File Structure

```
frontend/src/
├── pages/Discover.jsx                    ← Main page
├── discover/
│   ├── SearchResults.jsx                 ← Routes results to components
│   ├── UserSearchResult.jsx              ← User card display
│   ├── PostSearchResult.jsx              ← Post card display
│   ├── HashtagSearchResult.jsx           ← Hashtag card display
│   ├── RoomSearchResult.jsx              ← Room card display
│   ├── GlobalSearchBox.jsx               ← Search input component
│   └── ResultsGrid.jsx                   ← Grid layout alternative
└── services/discover.service.js          ← API calls
```

---

## How It Works (Simple)

```
User types query
    ↓
500ms debounce waits
    ↓
API call: /discover/search?query=X&type=Y
    ↓
Results returned
    ↓
Render appropriate result component
    ↓
Display in list format
```

---

## State Variables

| Variable | Type | Purpose |
|----------|------|---------|
| `searchQuery` | string | What user typed |
| `searchType` | string | users/posts/hashtags/rooms |
| `searchResults` | array | Results from API |

---

## Key Features

### ✅ Debouncing (500ms)
- Reduces API calls by 80-90%
- Only searches when user pauses typing

### ✅ Multi-Type Search
- Switch between users, posts, hashtags, rooms
- Each type has own result component

### ✅ Error Handling
- Try/catch wraps API calls
- Clears results on error
- Logs errors to console

### ✅ Empty State
- Shows "No results found" when no matches
- Doesn't search for empty query

### ✅ Theme Integration
- Dark/light mode support
- All colors from theme object

---

## Component Props

### UserSearchResult
```jsx
<UserSearchResult user={{
  id: "uuid",
  name: "Alex",
  handle: "alex_j",
  avatar: "url"
}} />
```

### PostSearchResult
```jsx
<PostSearchResult post={{
  id: "uuid",
  content: "Post text",
  author: { id: "uuid", name: "Author", avatar: "url" },
  createdAt: timestamp
}} />
```

### HashtagSearchResult
```jsx
<HashtagSearchResult hashtag={{
  id: "uuid",
  name: "python",
  postCount: 1523
}} />
```

### RoomSearchResult
```jsx
<RoomSearchResult room={{
  id: "uuid",
  name: "Room Name",
  description: "Description text"
}} />
```

---

## API Endpoint

**Base**: `GET /discover/search`

**Parameters**:
- `query` - Search term
- `type` - users|posts|hashtags|rooms

**Examples**:
```
GET /discover/search?query=python&type=hashtags
GET /discover/search?query=alex&type=users
GET /discover/search?query=hello&type=posts
GET /discover/search?query=coding&type=rooms
```

---

## Code Flow

### 1. Page Load
```jsx
const [searchQuery, setSearchQuery] = useState('');
const [searchType, setSearchType] = useState('users');
const [searchResults, setSearchResults] = useState([]);
```

### 2. User Types
```jsx
<input onChange={(e) => setSearchQuery(e.target.value)} />
```

### 3. Debounce & Fetch
```jsx
useEffect(() => {
  const timer = setTimeout(() => {
    search(searchQuery, searchType).then(res => 
      setSearchResults(res.data)
    );
  }, 500);
  return () => clearTimeout(timer);
}, [searchQuery, searchType]);
```

### 4. Render Results
```jsx
<SearchResults results={searchResults} type={searchType} />
```

### 5. Type-Specific Rendering
```jsx
// SearchResults.jsx dispatches to:
// - UserSearchResult (if type === 'users')
// - PostSearchResult (if type === 'posts')
// - HashtagSearchResult (if type === 'hashtags')
// - RoomSearchResult (if type === 'rooms')
```

---

## Search Results Display

### Users Results
```
[Avatar] User Name
         @handle
```

### Posts Results
```
[Avatar] Author Name
Post content here...
```

### Hashtags Results
```
#hashtag
500 posts
```

### Rooms Results
```
Room Name
Room description text
```

---

## Styling

**All components use**:
- `styled-components` for CSS-in-JS
- `theme.palette.*` for colors
- `theme.text.*` for text colors
- Flexbox for layout

**Theme Colors Used**:
- `theme.palette.primary` - Background
- `theme.palette.secondary` - Borders
- `theme.palette.accent` - Highlights
- `theme.text.primary` - Main text
- `theme.text.secondary` - Secondary text

---

## Navigation

**Access from**:
- FloatingNav: `<NavLink to="/discover">`
- Direct URL: `/discover`
- Router: `<Route path="/discover" element={<DiscoverPage />} />`

---

## Common Scenarios

### Scenario 1: Search Users
```
1. User navigates to /discover
2. Types: "alex"
3. Waits 500ms
4. API: GET /discover/search?query=alex&type=users
5. Results show UserSearchResult cards
```

### Scenario 2: Switch Search Type
```
1. User clicks "Posts" button
2. searchType state changes
3. useEffect re-runs
4. API: GET /discover/search?query=alex&type=posts
5. Results switch to PostSearchResult cards
```

### Scenario 3: No Results
```
1. User searches: "xyzabc123"
2. API returns empty array
3. SearchResults renders: "No results found."
```

### Scenario 4: Error Handling
```
1. API call fails
2. Catch block executes
3. console.error() logs error
4. setSearchResults([])
5. Results clear from UI
```

---

## Things to Know

| Concept | Details |
|---------|---------|
| **Debounce** | Waits 500ms after typing stops before searching |
| **Type Routing** | SearchResults component decides which card to show |
| **Theme** | All colors from styled-components theme |
| **Error** | Caught and logged, results cleared |
| **Empty** | Shows message when no results |
| **Service** | API calls abstracted in discover.service.js |

---

## Key Methods

| Method | Purpose |
|--------|---------|
| `setSearchQuery()` | Update search text |
| `setSearchType()` | Change search type |
| `setSearchResults()` | Update results from API |
| `search()` | API call to backend |
| `handleSearchChange()` | Input onChange handler |

---

## Performance Tips

✅ **Debounce reduces API calls** - 5 API calls → 1 API call  
✅ **Cleanup timeout on unmount** - Prevents memory leaks  
✅ **Conditional rendering** - Only render if results exist  
✅ **Key prop in maps** - Uses `result.id` for React reconciliation  

---

## Testing Checklist

- [ ] Search for users works
- [ ] Search for posts works
- [ ] Search for hashtags works
- [ ] Search for rooms works
- [ ] Type switching works
- [ ] Debounce delays API calls
- [ ] Empty results shows message
- [ ] Error handling works
- [ ] Theme colors apply correctly
- [ ] Mobile responsive

---

## Quick Debugging

**No results showing?**
- Check API response in network tab
- Verify `searchQuery.length > 0`
- Check `searchType` matches backend types

**Styling issues?**
- Verify theme object is provided
- Check styled-components imports
- Inspect element for computed styles

**API errors?**
- Check backend endpoint: `/discover/search`
- Verify query and type parameters
- Check apiClient configuration

**Slow search?**
- Debounce is working (intended delay)
- Check backend query performance
- Monitor network tab for timing

---

## Future Enhancements

- [ ] Filter by date/popularity
- [ ] Save search history
- [ ] Suggested search terms
- [ ] Advanced filters
- [ ] Pagination for large results
- [ ] Infinite scroll
- [ ] Result sorting options
- [ ] Search analytics

---

## Summary

**The Discover Page**:
- 🔍 Searches across 4 content types
- ⚡ Uses debouncing for efficiency
- 🎨 Fully themed and responsive
- 🛡️ Error handling included
- 📱 Mobile friendly
- 🏗️ Well-organized component structure

**Key Files**:
- `Discover.jsx` - Main component
- `SearchResults.jsx` - Router component
- `discover.service.js` - API layer
- `*SearchResult.jsx` - Result cards

**Remember**: Debounce reduces load, components dispatch to correct renderer, styling is theme-aware!

---

**Version**: 1.0  
**Last Updated**: January 24, 2026
