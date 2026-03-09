/**
 * Communication Component - Message Model
 * Collection: 'communication/conversations/messages'
 * Fields: id, senderId, conversationId, content, timestamp, readBy
 */
module.exports = {
  collection: 'messages',
  fields: ['senderId', 'conversationId', 'content', 'timestamp']
};
