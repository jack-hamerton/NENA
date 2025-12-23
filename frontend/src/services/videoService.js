
import { realtimeService } from './realtimeService';
import { EventEmitter } from 'events';

class VideoService extends EventEmitter {
  constructor() {
    super();
    this.peerConnection = null;
    this.localStream = null;

    realtimeService.on('webrtc-offer', this.handleOffer.bind(this));
    realtimeService.on('webrtc-answer', this.handleAnswer.bind(this));
    realtimeService.on('webrtc-ice-candidate', this.handleIceCandidate.bind(this));
  }

  async getLocalStream() {
    if (!this.localStream) {
      this.localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    }
    return this.localStream;
  }

  createPeerConnection() {
    this.peerConnection = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    });

    this.localStream.getTracks().forEach((track) => {
      this.peerConnection.addTrack(track, this.localStream);
    });

    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        realtimeService.send({ type: 'webrtc-ice-candidate', candidate: event.candidate });
      }
    };

    this.peerConnection.ontrack = (event) => {
      this.emit('stream', event.streams[0]);
    };
  }

  async callUser(userId) {
    this.createPeerConnection();
    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(offer);
    realtimeService.send({ type: 'webrtc-offer', offer, to: userId });
  }

  async handleOffer(data) {
    this.createPeerConnection();
    await this.peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));
    const answer = await this.peerConnection.createAnswer();
    await this.peerConnection.setLocalDescription(answer);
    realtimeService.send({ type: 'webrtc-answer', answer, to: data.from });
  }

  async handleAnswer(data) {
    await this.peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
  }

  async handleIceCandidate(data) {
    await this.peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
  }
}

export const videoService = new VideoService();
