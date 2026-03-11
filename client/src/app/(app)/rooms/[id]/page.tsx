"use client";

import React, { useEffect, useState, useRef, useReducer } from "react";
import { useParams, useRouter } from "next/navigation";
import { roomService } from "@/services/room.service";
import { WebRTCManager } from "@/services/webrtc.service";
import { Room, Participant, RoomMessage } from "@/types/room";
import { RoomVideoGrid } from "@/components/rooms/RoomVideoGrid";
import { ControlsBar } from "@/components/rooms/ControlsBar";
import { RoomSidebar } from "@/components/rooms/RoomSidebar";
import { Loader2, ChevronLeft, Radio, ShieldCheck, Settings, PanelRightOpen, PanelRightClose } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { authService } from "@/services/auth.service";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

// State management for UI interactions
interface RoomUIState {
  isSidebarOpen: boolean;
  activeTab: string;
}

type RoomUIAction = 
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_TAB'; payload: string };

function roomUIReducer(state: RoomUIState, action: RoomUIAction): RoomUIState {
  switch (action.type) {
    case 'TOGGLE_SIDEBAR':
      return { ...state, isSidebarOpen: !state.isSidebarOpen };
    case 'SET_TAB':
      return { ...state, activeTab: action.payload };
    default:
      return state;
  }
}

export default function ActiveRoomPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  
  const [room, setRoom] = useState<Room | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [messages, setMessages] = useState<RoomMessage[]>([]);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<Map<string, MediaStream>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  
  const [uiState, dispatchUI] = useReducer(roomUIReducer, { isSidebarOpen: true, activeTab: 'chat' });
  
  const webrtcManager = useRef<WebRTCManager | null>(null);
  const [localParticipant, setLocalParticipant] = useState<Participant | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const init = async () => {
      try {
        if (!user) return;
        const roomData = await roomService.getRoomById(id);
        
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
          username: user.displayName || user.username || "User",
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

  const handleSendMessage = (content: string) => {
    const newMsg: RoomMessage = {
      id: `m-${Date.now()}`,
      username: localParticipant?.username || "You",
      content,
      createdAt: new Date().toISOString(),
    };
    setMessages(prev => [...prev, newMsg]);
    // In real app, emit via socket/webrtc
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background min-h-screen">
        <div className="text-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground animate-pulse font-medium">Setting up your connection...</p>
        </div>
      </div>
    );
  }

  if (!room || !localParticipant) return null;

  return (
    <div className="flex flex-col h-screen bg-slate-950 overflow-hidden relative">
      {/* Premium Navigation Top Bar */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-black/40 backdrop-blur-xl flex-shrink-0 z-20">
        <div className="flex items-center gap-4 min-w-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 flex-shrink-0 text-white hover:bg-white/10"
            onClick={handleLeave}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <h1 className="text-white font-bold truncate tracking-tight">{room.name}</h1>
              <Badge variant="destructive" className="gap-1.5 text-[10px] px-2 py-0.5 h-5 flex-shrink-0 rounded-full bg-red-500/10 text-red-500 border-red-500/20">
                <Radio className="h-3 w-3 animate-pulse" /> LIVE
              </Badge>
              <div className="hidden sm:flex items-center gap-1.5 text-[10px] text-white/40 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
                <ShieldCheck className="h-3 w-3 text-green-500" />
                Encrypted
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
           <Button variant="ghost" size="icon" className="h-9 w-9 text-white/60 hover:text-white hover:bg-white/10">
             <Settings className="h-4 w-4" />
           </Button>
           <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-9 w-9 transition-colors hover:bg-white/10",
              uiState.isSidebarOpen ? "text-primary" : "text-white/60"
            )}
            onClick={() => dispatchUI({ type: 'TOGGLE_SIDEBAR' })}
          >
            {uiState.isSidebarOpen ? <PanelRightClose className="h-5 w-5" /> : <PanelRightOpen className="h-5 w-5" />}
          </Button>
        </div>
      </header>

      <main className="flex flex-1 overflow-hidden relative">
        <div className="flex-1 relative">
          <RoomVideoGrid
            participants={participants}
            remoteStreams={remoteStreams}
            localStream={localStream}
            localParticipant={localParticipant}
          />
        </div>

        {/* Improved Workspace Sidebar */}
        <aside
          className={cn(
            "border-l border-white/5 transition-all duration-500 ease-in-out bg-black/20 backdrop-blur-md z-10",
            uiState.isSidebarOpen ? "w-full md:w-[350px] lg:w-[400px]" : "w-0 overflow-hidden"
          )}
        >
          {uiState.isSidebarOpen && (
            <RoomSidebar 
              roomId={id}
              messages={messages} 
              onSendMessage={handleSendMessage} 
              roomParticipants={[localParticipant, ...participants]}
            />
          )}
        </aside>
      </main>

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
