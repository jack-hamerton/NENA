const dashboardService = require('../services/dashboardService');

exports.getStats = async (req, res) => {
  try {
    const data = await dashboardService.getStats();
    res.json({ status: 'success', data });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};
