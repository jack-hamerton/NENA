"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleConnection = void 0;
const ws_1 = __importDefault(require("ws"));
const clients = new Set();
const handleConnection = (ws) => {
    console.log('Client connected');
    clients.add(ws);
    ws.on('message', (message) => {
        console.log(`Received message: ${message}`);
        // Broadcast the message to all connected clients
        for (const client of clients) {
            if (client.readyState === ws_1.default.OPEN) {
                client.send(message);
            }
        }
    });
    ws.on('close', () => {
        console.log('Client disconnected');
        clients.delete(ws);
    });
    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
};
exports.handleConnection = handleConnection;
