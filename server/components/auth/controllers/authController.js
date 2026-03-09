const authService = require('../services/authService');

exports.login = async (req, res) => {
  try {
    const data = await authService.login(req.body);
    res.json({ status: 'success', data });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};
