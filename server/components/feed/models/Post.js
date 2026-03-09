/**
 * Feed Component - Post Model
 * Collection: 'feed/posts'
 * Fields: id, authorId, content, mediaUrl, timestamp, likesCount, commentsCount
 */
module.exports = {
  collection: 'posts',
  fields: ['authorId', 'content', 'mediaUrl', 'timestamp']
};
