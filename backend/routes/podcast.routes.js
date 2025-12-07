const express = require('express');
const router = express.Router();
const controller = require('../controllers/podcast.controller');

router.get('/', controller.getPodcasts);

module.exports = router;
