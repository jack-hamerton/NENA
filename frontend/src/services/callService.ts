
import { realtimeService } from './realtimeService';
import { EventEmitter } from 'events';

export interface Participant {
  id: string;
  name: string;
  identity: string;
  videoStream: MediaStream;
  isMuted: boolean;
  isSpeaking: boolean;
  isSharingScreen: boolean;
  isLocal: boolean;
}

class CallService extends EventEmitter {
  private peerConnection: RTCPeerConnection;
  private localStream: MediaStream | null = null;
  private participants: Participant[] = [];

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
      const newParticipant: Participant = {
        id: 'remote-user', // This would be the actual user ID
        name: 'Remote User',
        identity: 'remote-user',
        videoStream: event.streams[0],
        isMuted: false,
        isSpeaking: false,
        isSharingScreen: false,
        isLocal: false,
      };
      this.participants = [...this.participants, newParticipant];
      this.emit('participantsChanged', this.participants);
    };

    // Listen for signaling messages from the realtimeService
    realtimeService.on('offer', this.handleOffer.bind(this));
    realtimeService.on('answer', this.handleAnswer.bind(this));
    realtimeService.on('ice-candidate', this.handleIceCandidate.bind(this));
    realtimeService.on('incoming-call', (from: string) => this.emit('incomingCall', from));
  }

  async joinCall(roomId: string): Promise<void> {
    this.localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    this.localStream.getTracks().forEach(track => {
      this.peerConnection.addTrack(track, this.localStream!);
    });

    const localParticipant: Participant = {
      id: 'local-user', // This would be the actual user ID
      name: 'Local User',
      identity: 'local-user',
      videoStream: this.localStream,
      isMuted: false,
      isSpeaking: false,
      isSharingScreen: false,
      isLocal: true,
    };

    this.participants = [...this.participants, localParticipant];
    this.emit('participantsChanged', this.participants);
  }

  leaveCall() {
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
    }
    this.peerConnection.close();
    this.participants = [];
    this.emit('participantsChanged', this.participants);
  }

  toggleMute() {
    if (this.localStream) {
      this.localStream.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
    }
  }

  toggleScreenShare() {
    // Screen sharing implementation would go here
    console.log('Toggling screen share');
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

  getParticipants(): Participant[] {
    return this.participants;
  }

}

export const callService = new CallService();
