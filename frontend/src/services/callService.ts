
import { realtimeService } from './realtimeService';
import { EventEmitter } from 'events';

class CallService extends EventEmitter {
  private peerConnection: RTCPeerConnection;

  constructor() {
    super();
    this.peerConnection = new RTCPeerConnection();

    // Listen for ICE candidates and send them to the other peer
    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        realtimeService.send('ice-candidate', event.candidate);
      }
    };

    // Listen for incoming tracks from the other peer
    this.peerConnection.ontrack = (event) => {
      // In a real app, you would attach this stream to a <video> element
      console.log('Received remote stream', event.streams[0]);
    };

    // Listen for signaling messages from the realtimeService
    realtimeService.on('offer', this.handleOffer.bind(this));
    realtimeService.on('answer', this.handleAnswer.bind(this));
    realtimeService.on('ice-candidate', this.handleIceCandidate.bind(this));
    realtimeService.on('incoming-call', (from: string) => this.emit('incomingCall', from));
  }

  async makeCall(to: string) {
    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(offer);
    realtimeService.send('offer', { to, offer });
  }

  async acceptCall() {
    const answer = await this.peerConnection.createAnswer();
    await this.peerConnection.setLocalDescription(answer);
    realtimeService.send('answer', answer);
  }

  rejectCall() {
    realtimeService.send('reject-call', {});
  }

  private async handleOffer(offer: RTCSessionDescriptionInit) {
    await this.peerConnection.setRemoteDescription(offer);
    this.emit('incomingCall');
  }

  private async handleAnswer(answer: RTCSessionDescriptionInit) {
    await this.peerConnection.setRemoteDescription(answer);
  }

  private async handleIceCandidate(candidate: RTCIceCandidateInit) {
    await this.peerConnection.addIceCandidate(candidate);
  }
}

export const callService = new CallService();
