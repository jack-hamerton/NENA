const express = require('express');
const router = express.Router();
const controller = require('../controllers/calendar.controller');

router.get('/', controller.getEvents);
router.post('/', controller.createEvent);

module.exports = router;
