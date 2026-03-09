export interface Room {
  id: string;
  name: string;
  description?: string;
  hostId: string;
  participantsCount: number;
  isLive: boolean;
  createdAt: string;
}

export interface Participant {
  id: string;
  userId: string;
  username: string;
  role: "host" | "speaker" | "listener";
  isMuted: boolean;
  isVideoOff: boolean;
}
