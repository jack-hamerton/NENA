import http from 'http';
import express from 'express';
import WebSocket from 'ws';
import connectionsRouter from './routes/connections';
import { handleConnection } from './controllers/messagesController';

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const port = process.env.PORT || 3001;

app.use('/api/connections', connectionsRouter);

wss.on('connection', handleConnection);

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
