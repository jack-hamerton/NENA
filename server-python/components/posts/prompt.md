# Prompt for Real-time Posts Implementation

## Objective
Implement a real-time posting system for NENA-APP, mirroring the premium design and following the component-based architecture established in the `chat` feature.

## Phase 1: Research & Setup
1. **Branch Management**: Create a new branch named `posts` from `develop`.
2. **Analysis**: Use the `Content` model from `real-time-forum-master/backend/models/models.go` as inspiration for posts and comments logic.

## Phase 2: Backend Implementation (Python)
1. **Directory**: Create `server-python/components/posts/`.
2. **Component Structure**:
   - `routes.py`: Flask Blueprint for `/api/posts` endpoints.
   - `services.py`: Business logic for creating, fetching, and interacting (like/dislike) with posts.
   - `models.py`: Data classes for `Post` and `Comment`.
3. **Firebase**: Update `server-python/services/firebase_service.py` (if needed) to handle the new collections.

## Phase 3: Frontend Implementation (Next.js)
1. **Context**: Create `client/src/context/PostContext.tsx` to manage post state, feed fetching, and real-time updates via Firebase.
2. **Components**:
   - Update/Create post feed components (e.g., `PostCard`, `PostInput`).
   - Integrate with the new `PostContext`.
3. **Integration**: Wrap relevant pages with the `PostProvider`.

## Phase 4: Documentation & Cleanup
1. **README**: Create `server-python/components/posts/README.md` documenting:
   - API endpoints.
   - Firestore collection schemas (`posts`, `comments`).
   - Data models.
2. **Venv**: Ensure all dependencies are managed within the established `venv`.

## Phase 5: Git Workflow & Finalization
1. **Commits**: Commit every individual file modification/creation with a clear, one-liner message.
2. **Verification**: Verify the real-time feed updates and interaction persistence.
3. **Merge**: Once verified, forcefully merge the `posts` branch into `develop` and delete the `posts` branch.

## Reference Schema (Firestore)
### `posts`
- `id`: string
- `authorId`: string
- `title`: string
- `content`: string
- `likesCount`: number
- `dislikesCount`: number
- `commentCount`: number
- `createdAt`: timestamp

### `comments`
- `id`: string
- `postId`: string
- `authorId`: string
- `content`: string
- `createdAt`: timestamp
