// This is a mock call service. In a real application, this would be replaced with a WebRTC library like Twilio Video or a custom implementation.

export interface Participant {
  id: string;
  name: string;
  isSpeaking: boolean;
  isScreenSharing: boolean;
  isLocal: boolean;
}

let localParticipant: Participant | null = null;
let remoteParticipants: Participant[] = [];

const listeners: { [key: string]: Function[] } = {};

const emit = (event: string, ...args: any[]) => {
  if (listeners[event]) {
    listeners[event].forEach(listener => listener(...args));
  }
};

export const callService = {
  async joinCall(roomId: string, participantName: string): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        localParticipant = {
          id: `local-${Math.random().toString(36).substr(2, 9)}`,
          name: participantName,
          isSpeaking: false,
          isScreenSharing: false,
          isLocal: true,
        };

        // Simulate other participants already in the call
        remoteParticipants = [
          {
            id: `remote-${Math.random().toString(36).substr(2, 9)}`,
            name: 'Remote User 1',
            isSpeaking: false,
            isScreenSharing: false,
            isLocal: false,
          },
          {
            id: `remote-${Math.random().toString(36).substr(2, 9)}`,
            name: 'Remote User 2',
            isSpeaking: true,
            isScreenSharing: false,
            isLocal: false,
          },
        ];

        emit('participantsChanged', [localParticipant, ...remoteParticipants]);
        resolve();
      }, 500);
    });
  },

  leaveCall(): void {
    localParticipant = null;
    remoteParticipants = [];
    emit('participantsChanged', []);
  },

  toggleMute(isMuted: boolean): void {
    if (localParticipant) {
      localParticipant.isSpeaking = !isMuted;
      emit('participantsChanged', [localParticipant, ...remoteParticipants]);
    }
  },

  toggleScreenShare(isScreenSharing: boolean): void {
    if (localParticipant) {
      localParticipant.isScreenSharing = isScreenSharing;
      emit('participantsChanged', [localParticipant, ...remoteParticipants]);
    }
  },

  getParticipants(): (Participant | null)[] {
    return [localParticipant, ...remoteParticipants];
  },

  on(event: string, callback: Function) {
    if (!listeners[event]) {
      listeners[event] = [];
    }
    listeners[event].push(callback);
  },

  off(event: string, callback: Function) {
    if (listeners[event]) {
      listeners[event] = listeners[event].filter(l => l !== callback);
    }
  },
};
