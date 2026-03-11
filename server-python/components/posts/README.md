# Posts Module

This module handles real-time post creation, feed management, and interactions (likes/comments) for the NENA-APP.

## Overview

The posts module provides a social feed where users can share content, react to posts, and engage in discussions. It uses Firebase for real-time feed synchronization and a Python backend for business logic and persistence.

## Features

- **Real-time Feed**: See new posts instantly as they are created.
- **Post Creation**: Create posts with titles, content, and optional images/hashtags.
- **Interactions**: Like posts to show appreciation.
- **Comments**: Fetch and display comments for individual posts.

## Database Collections (Firestore)

### `posts`
- **Path**: `/posts/{postId}`
- **Fields**:
  - `authorId` (string): Unique ID of the post author.
  - `authorName` (string): Display name of the author.
  - `authorUsername` (string): Username of the author.
  - `title` (string): Post title.
  - `content` (string): Main post body.
  - `likesCount` (number): Total number of likes.
  - `commentsCount` (number): Total number of comments.
  - `sharesCount` (number): Total number of shares.
  - `createdAt` (timestamp): Post creation time.
  - `mediaUrl` (string, optional): URL to attached media.
  - `hashtags` (array): List of hashtags.
  - `isLiked` (boolean): Whether the current user has liked the post.

### `comments`
- **Path**: `/comments/{commentId}`
- **Fields**:
  - `postId` (string): ID of the parent post.
  - `authorId` (string): ID of the comment author.
  - `content` (string): Comment text.
  - `createdAt` (timestamp): Comment creation time.

## API Endpoints

- `GET /api/posts/`: Fetch the global post feed.
- `POST /api/posts/`: Create a new post.
  - Body: `{ "authorId": "...", "title": "...", "content": "...", "mediaUrl": "..." }`
- `POST /api/posts/{postId}/like`: Like or unlike a post.
  - Body: `{ "userId": "..." }`
- `GET /api/posts/{postId}/comments`: Fetch all comments for a post.

## Integration

The frontend utilizes the `PostContext.tsx` provider to handle global post state and real-time updates. Components like `PostCard` and `CreatePost` are connected to this context for seamless interaction.
