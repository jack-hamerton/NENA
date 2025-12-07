const mongoose = require('mongoose');

const podcastSchema = new mongoose.Schema({
  title: { type: String, required: true },
  episodeUrl: { type: String, required: true },
  // Add other fields as necessary
});

module.exports = mongoose.model('Podcast', podcastSchema);
