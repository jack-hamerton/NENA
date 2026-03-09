/**
 * Communication - Conversation Model
 * Collection: 'communication/conversations'
 * Fields: id, participantIds, lastMessage, lastTimestamp, type: 'direct' | 'group'
 */
module.exports = {
  collection: 'conversations',
  fields: ['participantIds', 'lastMessage', 'type']
};
