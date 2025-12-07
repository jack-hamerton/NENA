const Podcast = require('../models/podcast.model');

exports.getPodcasts = async (req, res) => {
  try {
    const podcasts = await Podcast.find();
    res.status(200).send(podcasts);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Add other podcast-related functions (create, delete, etc.)
