const express = require('express');
const router = express.Router();

router.get('/', (req, res) => res.json({ message: 'Calendar route' }));

module.exports = router;
