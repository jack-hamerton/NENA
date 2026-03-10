export interface Room {
  id: string;
  name: string;
  description?: string;
  hostId: string;
  participantsCount: number;
  isLive: boolean;
  createdAt: string;
  thumbnail?: string;
  category?: string;
}

export interface Participant {
  id: string;
  userId: string;
  username: string;
  avatar?: string;
  role: "host" | "speaker" | "listener";
  isMuted: boolean;
  isVideoOff: boolean;
  isHandRaised?: boolean;
  isSpeaking?: boolean;
  peerId?: string; // WebRTC peer ID
}

export interface CreateRoomInput {
  name: string;
  description?: string;
  category?: string;
  isPrivate?: boolean;
}
