/**
 * User Model
 * Collection: 'users'
 * Fields: id, email, passwordHash, roleId, profile: { name, avatar... }
 */
module.exports = {
  collection: 'users',
  fields: ['email', 'passwordHash', 'roleId', 'profile']
};
