"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const connectionsController_1 = require("../controllers/connectionsController");
const router = (0, express_1.Router)();
router.get('/:userId', connectionsController_1.getConnections);
exports.default = router;
