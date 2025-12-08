import WebSocket from 'ws';

const clients = new Set<WebSocket>();

export const handleConnection = (ws: WebSocket) => {
    console.log('Client connected');
    clients.add(ws);

    ws.on('message', (message: string) => {
        console.log(`Received message: ${message}`);
        // Broadcast the message to all connected clients
        for (const client of clients) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
        clients.delete(ws);
    });

    ws.on('error', (error: Error) => {
        console.error('WebSocket error:', error);
    });
};
