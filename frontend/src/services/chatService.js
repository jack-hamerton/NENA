
import { EventEmitter } from 'events';
import { callService } from './callService'; // We will integrate this later

class ChatService extends EventEmitter {
    constructor() {
        super();
        this.socket = null;
        this.userId = null;
    }

    connect(userId) {
        this.userId = userId;
        // In a real app, you'd use wss for secure connections
        const wsUrl = `ws://localhost:8000/ws/chat/${userId}`;
        this.socket = new WebSocket(wsUrl);

        this.socket.onopen = () => {
            console.log('Chat WebSocket connection established.');
            this.emit('connected');
        };

        this.socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            
            if (message.type === 'message') {
                this.emit('new-message', message);
            } else if (message.type === 'file') {
                this.emit('new-file', message);
            } else if (message.type === 'presence') {
                this.emit('presence-update', message);
            }
        };

        this.socket.onclose = () => {
            console.log('Chat WebSocket connection closed.');
            this.emit('disconnected');
            // Optional: Implement reconnection logic here
        };

        this.socket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
    }

    sendMessage({ text, conversationId, recipientId }) {
        const message = {
            type: 'message',
            text,
            conversationId,
            senderId: this.userId,
            recipientId,
            timestamp: new Date().toISOString(),
        };
        this.socket.send(JSON.stringify(message));
        // The server will broadcast this message, so we'll receive it back
    }

    sendFile({ file, conversationId, recipientId }) {
        const reader = new FileReader();
        reader.onload = () => {
            const fileData = reader.result.split(',')[1]; // Base64 encoded file
            const message = {
                type: 'file',
                fileName: file.name,
                fileType: file.type,
                fileData, // The backend will decode this
                conversationId,
                senderId: this.userId,
                recipientId,
                timestamp: new Date().toISOString(),
            };
            this.socket.send(JSON.stringify(message));
        };
        reader.readAsDataURL(file);
    }

    // Integration with callService
    startCall(recipientId) {
        // Assuming a call is a 1-on-1 interaction for now
        // The callService will handle the WebRTC logic.
        // We just need to signal the intent to call.
        const callMessage = {
            type: 'call-invite',
            recipientId,
            senderId: this.userId,
        };
        this.socket.send(JSON.stringify(callMessage));
        
        // Here, you would also initiate the call on the client-side
        // using the callService.
        callService.joinCall(recipientId); // This needs to be adapted for 1-on-1
    }
}

export const chatService = new ChatService();
