const admin = require('firebase-admin');
const config = require('../config/config');

// if (!admin.apps.length) {
//   admin.initializeApp({
//     credential: admin.credential.cert(require('../../serviceAccountKey.json'))
//   });
// }

const db = {
  collection: (name) => ({
    doc: (id) => ({
      get: async () => null,
      set: async (data) => null,
      update: async (data) => null,
      delete: async () => null
    }),
    add: async (data) => null,
    where: () => this,
    get: async () => []
  })
};

module.exports = db;
