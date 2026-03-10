"use client";

import { Participant } from "@/types/room";

type SignalingMessage = {
  type: "existing-peers" | "new-peer" | "peer-left" | "webrtc_offer" | "webrtc_answer" | "webrtc_ice_candidate";
  peerId?: string;
  peerIds?: string[];
  from?: string;
  data?: any;
};

export class WebRTCManager {
  private roomId: string;
  private socket: WebSocket | null = null;
  private peerConnections: Map<string, RTCPeerConnection> = new Map();
  private localStream: MediaStream | null = null;
  private onRemoteStream: (peerId: string, stream: MediaStream) => void;
  private onPeerJoined: (peerId: string) => void;
  private onPeerLeft: (peerId: string) => void;

  constructor(
    roomId: string,
    callbacks: {
      onRemoteStream: (peerId: string, stream: MediaStream) => void;
      onPeerJoined: (peerId: string) => void;
      onPeerLeft: (peerId: string) => void;
    }
  ) {
    this.roomId = roomId;
    this.onRemoteStream = callbacks.onRemoteStream;
    this.onPeerJoined = callbacks.onPeerJoined;
    this.onPeerLeft = callbacks.onPeerLeft;
  }

  async setLocalStream(stream: MediaStream) {
    this.localStream = stream;
  }

  connect(userId: string) {
    const socketUrl = `${process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000"}/api/ws/${this.roomId}/${userId}`;
    this.socket = new WebSocket(socketUrl);

    this.socket.onmessage = async (event) => {
      const message: SignalingMessage = JSON.parse(event.data);
      console.log("WebRTC Signaling:", message.type, message);

      switch (message.type) {
        case "existing-peers":
          message.peerIds?.forEach((peerId) => this.initiateCall(peerId));
          break;
        case "new-peer":
          if (message.peerId) {
            this.onPeerJoined(message.peerId);
            // new-peer will receive offers from us if we initiate
          }
          break;
        case "peer-left":
          if (message.peerId) {
            this.handlePeerLeft(message.peerId);
          }
          break;
        case "webrtc_offer":
          if (message.from && message.data) {
            this.handleOffer(message.from, message.data);
          }
          break;
        case "webrtc_answer":
          if (message.from && message.data) {
            this.handleAnswer(message.from, message.data);
          }
          break;
        case "webrtc_ice_candidate":
          if (message.from && message.data) {
            this.handleIceCandidate(message.from, message.data);
          }
          break;
      }
    };
  }

  private createPeerConnection(peerId: string): RTCPeerConnection {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    this.localStream?.getTracks().forEach((track) => {
      if (this.localStream) {
        pc.addTrack(track, this.localStream);
      }
    });

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        this.sendSignalingMessage({
          type: "webrtc_ice_candidate",
          peerId, // to peer
          data: event.candidate,
        });
      }
    };

    pc.ontrack = (event) => {
      this.onRemoteStream(peerId, event.streams[0]);
    };

    this.peerConnections.set(peerId, pc);
    return pc;
  }

  private async initiateCall(peerId: string) {
    const pc = this.createPeerConnection(peerId);
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    this.sendSignalingMessage({
      type: "webrtc_offer",
      peerId,
      data: offer,
    });
  }

  private async handleOffer(peerId: string, offer: RTCSessionDescriptionInit) {
    const pc = this.createPeerConnection(peerId);
    await pc.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    this.sendSignalingMessage({
      type: "webrtc_answer",
      peerId,
      data: answer,
    });
  }

  private async handleAnswer(peerId: string, answer: RTCSessionDescriptionInit) {
    const pc = this.peerConnections.get(peerId);
    if (pc) {
      await pc.setRemoteDescription(new RTCSessionDescription(answer));
    }
  }

  private async handleIceCandidate(peerId: string, candidate: RTCIceCandidateInit) {
    const pc = this.peerConnections.get(peerId);
    if (pc) {
      await pc.addIceCandidate(new RTCIceCandidate(candidate));
    }
  }

  private handlePeerLeft(peerId: string) {
    const pc = this.peerConnections.get(peerId);
    if (pc) {
      pc.close();
      this.peerConnections.delete(peerId);
    }
    this.onPeerLeft(peerId);
  }

  private sendSignalingMessage(message: any) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    }
  }

  disconnect() {
    this.peerConnections.forEach((pc) => pc.close());
    this.peerConnections.clear();
    this.socket?.close();
  }
}
