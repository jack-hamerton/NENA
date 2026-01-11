
import { socket } from './socket';

class WebRTCService {
  constructor() {
    this.peerConnection = null;
    this.localStream = null;
    this.remoteStream = null;
    this.onTrackCallback = null;
    this.initialize();
  }

  initialize() {
    socket.on('webrtc-offer', async (data) => {
      const { offer, from } = data;
      // Handle incoming call offer
      // For now, we'll log it. In the next step, we'll show a notification.
      console.log('Received WebRTC offer from', from);
      // Automatically create an answer for now for testing
      // this.handleOffer(offer);
    });

    socket.on('webrtc-answer', (data) => {
      const { answer } = data;
      this.handleAnswer(answer);
    });

    socket.on('webrtc-ice-candidate', (data) => {
      const { candidate } = data;
      this.handleNewICECandidate(candidate);
    });
  }

  createPeerConnection() {
    this.peerConnection = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
      ],
    });

    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('webrtc-ice-candidate', {
          candidate: event.candidate,
          // to: the other user
        });
      }
    };

    this.peerConnection.ontrack = (event) => {
      [this.remoteStream] = event.streams;
      if (this.onTrackCallback) {
        this.onTrackCallback(this.remoteStream);
      }
    };
  }

  async startCall(to, onTrack) {
    this.onTrackCallback = onTrack;
    await this.getLocalStream();
    this.createPeerConnection();
    this.localStream.getTracks().forEach(track => {
      this.peerConnection.addTrack(track, this.localStream);
    });

    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(offer);

    socket.emit('webrtc-offer', { offer, to });
  }

  async handleOffer(offer, onTrack) {
      this.onTrackCallback = onTrack;
      this.createPeerConnection();
      await this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

      await this.getLocalStream();
      this.localStream.getTracks().forEach(track => {
          this.peerConnection.addTrack(track, this.localStream);
      });
      
      const answer = await this.peerConnection.createAnswer();
      await this.peerConnection.setLocalDescription(answer);

      return answer;
  }

  async handleAnswer(answer) {
    await this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
  }

  async handleNewICECandidate(candidate) {
    await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
  }

  async getLocalStream() {
    this.localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    return this.localStream;
  }

  hangUp() {
    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }
    if (this.localStream) {
        this.localStream.getTracks().forEach(track => track.stop());
        this.localStream = null;
    }
    this.remoteStream = null;
    this.onTrackCallback = null;
  }
}

export const webRTCService = new WebRTCService();
