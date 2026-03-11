# Communication Module

This module handles all real-time messaging and conversation management for the NENA-APP.

## Overview

The communication module is responsible for private messages between users, conversation tracking, and real-time status updates. It integrates with Firebase for real-time data synchronization.

## Features

- **Private Messaging**: Send and receive messages in real-time.
- **Conversation List**: Fetch a list of active conversations for a user.
- **Message History**: Retrieve historical messages between two users.
- **Real-time Updates**: Instant message delivery and notification triggers.

## Database Collections (Firestore)

The following collections are used for data persistence:

### `messages`
Stores individual chat messages.
- **Path**: `/messages/{messageId}`
- **Fields**:
  - `senderId` (string): User ID of the sender.
  - `receiverId` (string): User ID of the recipient.
  - `content` (string): Message text.
  - `createdAt` (timestamp): Server timestamp.
  - `isRead` (boolean): Read status.

### `conversations`
Stores conversation metadata for quick retrieval.
- **Path**: `/conversations/{conversationId}`
- **Fields**:
  - `participants` (array): List of user IDs.
  - `lastMessage` (string): Text snippet of the latest message.
  - `unreadCount` (map): Count of unread messages per participant.
  - `updatedAt` (timestamp): Last activity timestamp.

## API Endpoints

- `GET /api/communication/messages`: Fetch messages between two users.
  - Query Params: `senderId`, `receiverId`
- `POST /api/communication/messages`: Send a new message.
  - Body: `{ "senderId": "...", "receiverId": "...", "content": "..." }`
- `GET /api/communication/conversations`: Fetch all conversations for a user.
  - Query Params: `userId`

## Integration

The frontend integrates with this module via the `ChatContext.tsx`, which uses a combination of these REST API endpoints for state initialization and Firebase Web SDK for real-time listeners on the Firestore collections.
