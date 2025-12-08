"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const ws_1 = __importDefault(require("ws"));
const connections_1 = __importDefault(require("./routes/connections"));
const messagesController_1 = require("./controllers/messagesController");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const wss = new ws_1.default.Server({ server });
const port = process.env.PORT || 3001;
app.use('/api/connections', connections_1.default);
wss.on('connection', messagesController_1.handleConnection);
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
