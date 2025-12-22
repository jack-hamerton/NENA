import { v4 as uuidv4 } from 'uuid';

const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
};

export class WebRTCManager {
  constructor(roomId, localStream, onRemoteStream, onPeerLeft) {
    this.roomId = roomId;
    this.localStream = localStream;
    this.onRemoteStream = onRemoteStream;
    this.onPeerLeft = onPeerLeft;
    this.peerConnections = {};
    this.clientId = uuidv4();
    this.ws = new WebSocket(`ws://localhost:8000/api/ws/${roomId}/${this.clientId}`);

    this.ws.onmessage = this.handleWebSocketMessage.bind(this);
  }

  async handleWebSocketMessage(event) {
    const message = JSON.parse(event.data);
    const { type, from, data, peerId, peerIds } = message;

    switch (type) {
      case 'existing-peers':
        this.handleExistingPeers(peerIds);
        break;
      case 'new-peer':
        this.handleNewPeer(peerId);
        break;
      case 'peer-left':
        this.handlePeerLeft(peerId);
        break;
      case 'webrtc_offer':
        await this.handleOffer(from, data);
        break;
      case 'webrtc_answer':
        await this.handleAnswer(from, data);
        break;
      case 'webrtc_ice_candidate':
        await this.handleIceCandidate(from, data);
        break;
      default:
        break;
    }
  }

  handleExistingPeers(peerIds) {
    peerIds.forEach(peerId => {
      this.call(peerId);
    });
  }

  handleNewPeer(peerId) {
    this.call(peerId);
  }

  handlePeerLeft(peerId) {
    this.closePeerConnection(peerId);
  }

  async createPeerConnection(remoteClientId) {
    const pc = new RTCPeerConnection(ICE_SERVERS);

    this.localStream.getTracks().forEach(track => {
      pc.addTrack(track, this.localStream);
    });

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        this.sendWebSocketMessage('webrtc_ice_candidate', remoteClientId, event.candidate);
      }
    };

    pc.ontrack = (event) => {
      this.onRemoteStream(remoteClientId, event.streams[0]);
    };

    this.peerConnections[remoteClientId] = pc;
    return pc;
  }

  async call(remoteClientId) {
    if (remoteClientId === this.clientId) return;
    const pc = await this.createPeerConnection(remoteClientId);
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    this.sendWebSocketMessage('webrtc_offer', remoteClientId, offer);
  }

  async handleOffer(from, offer) {
    const pc = await this.createPeerConnection(from);
    await pc.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    this.sendWebSocketMessage('webrtc_answer', from, answer);
  }

  async handleAnswer(from, answer) {
    const pc = this.peerConnections[from];
    await pc.setRemoteDescription(new RTCSessionDescription(answer));
  }

  async handleIceCandidate(from, candidate) {
    const pc = this.peerConnections[from];
    if (pc.remoteDescription && candidate) {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
    }
  }

  sendWebSocketMessage(type, to, data) {
    const message = {
        type,
        from: this.clientId,
        to,
        data
    };
    this.ws.send(JSON.stringify(message));
  }

  closePeerConnection(peerId) {
    if (this.peerConnections[peerId]) {
      this.peerConnections[peerId].close();
      delete this.peerConnections[peerId];
      this.onPeerLeft(peerId);
    }
  }

  close() {
    this.ws.close();
    Object.keys(this.peerConnections).forEach(peerId => {
      this.closePeerConnection(peerId);
    });
  }
}
