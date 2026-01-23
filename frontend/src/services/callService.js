
import { v4 as uuidv4 } from 'uuid';

// This class will manage all the WebRTC logic for multi-party calls.
class CallService {
    constructor() {
        this.socket = null;
        this.peerConnections = new Map(); // Use a Map to store connections to multiple peers {userId: RTCPeerConnection}
        this.localStream = null;
        this.remoteStreams = new Map(); // {userId: MediaStream}
        
        // Event listeners for the UI to subscribe to
        this.onParticipantsChanged = null;
        this.onLocalStream = null;

        this.roomId = null;
        this.userId = `user_${uuidv4()}`; // Simple unique ID for this user
    }

    // Initialize and join a call
    async joinCall(roomId) {
        this.roomId = roomId;
        this.localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (this.onLocalStream) {
            this.onLocalStream(this.localStream);
        }

        // Establish WebSocket connection for signaling
        const wsUrl = `ws://localhost:8000/ws/${this.roomId}/${this.userId}`;
        this.socket = new WebSocket(wsUrl);

        this.socket.onopen = () => {
            console.log("Signaling WebSocket connection established.");
            // When the connection opens, we can start the process of connecting to other peers
            // The server will likely send a message with current participants, or we can request it.
            // For now, our backend broadcasts to everyone, so new users will send offers.
        };

        this.socket.onmessage = this.handleSignalingMessage.bind(this);

        this.socket.onclose = () => {
            console.log("Signaling WebSocket connection closed.");
            this.leaveCall(); // Clean up if the socket closes
        };
    }

    // Handle incoming signaling messages from the server
    async handleSignalingMessage(event) {
        const message = JSON.parse(event.data);
        const fromUserId = message.userId; // The user who sent the message

        // Don't process messages from ourselves
        if (fromUserId === this.userId) {
            return;
        }

        // When a new user joins, create an offer and send it
        if (message.type === 'new-user') {
             this.createAndSendOffer(fromUserId);
        } else if (message.type === 'offer') {
            this.handleOffer(fromUserId, message.sdp);
        } else if (message.type === 'answer') {
            this.handleAnswer(fromUserId, message.sdp);
        } else if (message.type === 'candidate') {
            this.handleNewICECandidate(fromUserId, message.candidate);
        } else if (message.type === 'user-left') {
            this.handleUserLeft(fromUserId);
        }
    }

    // Create a new RTCPeerConnection for a given user
    createPeerConnection(remoteUserId) {
        const pc = new RTCPeerConnection({
            iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
        });

        // Add local stream tracks to the new peer connection
        this.localStream.getTracks().forEach(track => {
            pc.addTrack(track, this.localStream);
        });

        // Handle incoming ICE candidates from the remote peer
        pc.onicecandidate = (event) => {
            if (event.candidate) {
                this.socket.send(JSON.stringify({
                    type: 'candidate',
                    candidate: event.candidate,
                    userId: this.userId,
                    to: remoteUserId // Send directly to the specific peer
                }));
            }
        };

        // When a remote stream is added
        pc.ontrack = (event) => {
            const [stream] = event.streams;
            this.remoteStreams.set(remoteUserId, stream);
            this.updateParticipants();
        };

        this.peerConnections.set(remoteUserId, pc);
        return pc;
    }
    
    // Create and send an offer to a new user
    async createAndSendOffer(remoteUserId) {
        const pc = this.createPeerConnection(remoteUserId);
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        this.socket.send(JSON.stringify({
            type: 'offer',
            sdp: pc.localDescription,
            userId: this.userId,
            to: remoteUserId
        }));
    }

    // Handle an incoming offer from a remote peer
    async handleOffer(remoteUserId, sdp) {
        const pc = this.createPeerConnection(remoteUserId);
        await pc.setRemoteDescription(new RTCSessionDescription(sdp));

        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        this.socket.send(JSON.stringify({
            type: 'answer',
            sdp: pc.localDescription,
            userId: this.userId,
            to: remoteUserId
        }));
    }

    // Handle an incoming answer from a remote peer
    async handleAnswer(remoteUserId, sdp) {
        const pc = this.peerConnections.get(remoteUserId);
        if (pc) {
            await pc.setRemoteDescription(new RTCSessionDescription(sdp));
        }
    }
    
    // Handle a new ICE candidate from a remote peer
    async handleNewICECandidate(remoteUserId, candidate) {
        const pc = this.peerConnections.get(remoteUserId);
        if (pc && candidate) {
            await pc.addIceCandidate(new RTCIceCandidate(candidate));
        }
    }

    // Handle a user leaving the call
    handleUserLeft(remoteUserId) {
        const pc = this.peerConnections.get(remoteUserId);
        if (pc) {
            pc.close();
            this.peerConnections.delete(remoteUserId);
        }
        this.remoteStreams.delete(remoteUserId);
        this.updateParticipants();
    }
    
    // Notify the UI about participant changes
    updateParticipants() {
        if (this.onParticipantsChanged) {
            const participants = Array.from(this.remoteStreams.keys()).map(userId => ({
                userId,
                stream: this.remoteStreams.get(userId),
                isLocal: false,
            }));
            this.onParticipantsChanged(participants);
        }
    }

    // Leave the call and clean up resources
    leaveCall() {
        // Stop local media tracks
        this.localStream?.getTracks().forEach(track => track.stop());
        
        // Close all peer connections
        for (const pc of this.peerConnections.values()) {
            pc.close();
        }
        this.peerConnections.clear();
        this.remoteStreams.clear();
        
        // Close WebSocket connection
        this.socket?.close();
        
        this.updateParticipants();
    }
}

export const callService = new CallService();
