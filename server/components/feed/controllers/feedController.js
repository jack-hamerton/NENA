const feedService = require('../services/feedService');

exports.getFeed = async (req, res) => {
  try {
    const data = await feedService.getFeed();
    res.json({ status: 'success', data });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};
