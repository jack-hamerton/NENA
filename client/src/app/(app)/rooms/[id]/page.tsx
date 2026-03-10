"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { roomService } from "@/services/room.service";
import { WebRTCManager } from "@/services/webrtc.service";
import { Room, Participant } from "@/types/room";
import { RoomVideoGrid } from "@/components/rooms/RoomVideoGrid";
import { ControlsBar } from "@/components/rooms/ControlsBar";
import { Loader2 } from "lucide-react";
import { authService } from "@/services/auth.service";

export default function ActiveRoomPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [room, setRoom] = useState<Room | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<Map<string, MediaStream>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  
  const webrtcManager = useRef<WebRTCManager | null>(null);
  const [localParticipant, setLocalParticipant] = useState<Participant | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const [roomData, user] = await Promise.all([
          roomService.getRoomById(id),
          authService.getCurrentUser()
        ]);
        
        setRoom(roomData);
        
        // Setup local media
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setLocalStream(stream);

        const self: Participant = {
          id: user.id,
          userId: user.id,
          username: user.name || user.handle,
          role: roomData.hostId === user.id ? "host" : "listener",
          isMuted: false,
          isVideoOff: false,
        };
        setLocalParticipant(self);

        // Initialize WebRTC
        webrtcManager.current = new WebRTCManager(id, {
          onRemoteStream: (peerId, remoteStream) => {
            setRemoteStreams((prev) => {
              const next = new Map(prev);
              next.set(peerId, remoteStream);
              return next;
            });
          },
          onPeerJoined: async (peerId) => {
             // In a real app, you'd fetch user info for this peerId
             console.log("Peer joined:", peerId);
          },
          onPeerLeft: (peerId) => {
            setRemoteStreams((prev) => {
              const next = new Map(prev);
              next.delete(peerId);
              return next;
            });
            setParticipants(prev => prev.filter(p => p.id !== peerId));
          },
        });

        await webrtcManager.current.setLocalStream(stream);
        webrtcManager.current.connect(user.id);

        setIsLoading(false);
      } catch (error) {
        console.error("Failed to initialize room:", error);
        setIsLoading(false);
      }
    };

    init();

    return () => {
      webrtcManager.current?.disconnect();
      localStream?.getTracks().forEach(t => t.stop());
    };
  }, [id]);

  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioMuted(!audioTrack.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(!videoTrack.enabled);
      }
    }
  };

  const handleLeave = async () => {
    await roomService.leaveRoom(id);
    router.push("/rooms");
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground animate-pulse">Setting up your connection...</p>
        </div>
      </div>
    );
  }

  if (!room || !localParticipant) return null;

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 overflow-hidden relative">
      {/* Room Header Overlay */}
      <div className="absolute top-0 left-0 right-0 p-4 z-20 bg-gradient-to-b from-black/60 to-transparent pointer-events-none">
        <h2 className="text-white font-bold text-lg">{room.name}</h2>
        <div className="flex items-center gap-2 mt-1">
          <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-white/70 text-xs">Live • {remoteStreams.size + 1} participants</span>
        </div>
      </div>

      <div className="flex-1 relative">
        <RoomVideoGrid
          participants={participants}
          remoteStreams={remoteStreams}
          localStream={localStream}
          localParticipant={localParticipant}
        />
      </div>

      <ControlsBar
        isAudioMuted={isAudioMuted}
        isVideoOff={isVideoOff}
        onToggleAudio={toggleAudio}
        onToggleVideo={toggleVideo}
        onLeave={handleLeave}
      />
    </div>
  );
}
