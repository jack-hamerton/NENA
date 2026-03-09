"use client";

import React, { useState, useReducer } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ParticipantGrid } from "@/components/rooms/ParticipantGrid";
import { RoomControls } from "@/components/rooms/RoomControls";
import { RoomSidebar } from "@/components/rooms/RoomSidebar";
import { 
  Radio, 
  ChevronLeft, 
  PanelRightOpen, 
  PanelRightClose,
  ShieldCheck,
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Participant } from "@/types";

interface RoomMessage {
  id: string;
  username: string;
  content: string;
  createdAt: string;
}

// Mimicking copy's useReducer state management for cleaner organization
interface RoomState {
  name: string;
  topic: string;
  category: string;
  hostName: string;
  participants: Participant[];
  messages: RoomMessage[];
}

type RoomAction = 
  | { type: 'ADD_MESSAGE'; payload: RoomMessage }
  | { type: 'TOGGLE_HAND' }
  | { type: 'TOGGLE_MUTE' };

function roomReducer(state: RoomState, action: RoomAction): RoomState {
  switch (action.type) {
    case 'ADD_MESSAGE':
      return { ...state, messages: [...state.messages, action.payload] };
    case 'TOGGLE_HAND':
      return {
        ...state,
        participants: state.participants.map((p: Participant) => 
          p.username === 'you' ? { ...p, isHandRaised: !p.isHandRaised } : p
        )
      };
    case 'TOGGLE_MUTE':
      return {
        ...state,
        participants: state.participants.map((p: Participant) => 
          p.username === 'you' ? { ...p, isMuted: !p.isMuted } : p
        )
      };
    default:
      return state;
  }
}

// Mock room data (from copy)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockRoomData: Record<string, any> = {
  "room-1": {
    name: "African Design Systems",
    topic: "Exploring how traditional African design patterns can influence modern UI/UX",
    category: "tech",
    hostName: "Alice Wambui",
    participants: [
      { id: "p1", username: "alice_w", displayName: "Alice Wambui", role: "host", isMuted: false, avatarUrl: "/avatars/alice.png" },
      { id: "p2", username: "bob_o", displayName: "Bob Otieno", role: "speaker", isMuted: false, avatarUrl: "/avatars/bob.png" },
      { id: "p3", username: "grace_m", displayName: "Grace Muthoni", role: "speaker", isMuted: true },
      { id: "p4", username: "james_k", displayName: "James Kamau", role: "listener", isMuted: true },
      { id: "you", username: "you", displayName: "You", role: "listener", isMuted: true },
      { id: "p6", username: "daniel_n", displayName: "Daniel Nzomo", role: "listener", isMuted: true },
      { id: "p7", username: "sarah_o", displayName: "Sarah Odera", role: "listener", isMuted: true, isHandRaised: true },
    ],
    messages: [
      { id: "m1", username: "alice_w", content: "Welcome everyone! Today we're exploring African design patterns 🎨", createdAt: new Date(Date.now() - 600000).toISOString() },
      { id: "m2", username: "bob_o", content: "So excited for this discussion! I've been researching Adinkra symbols.", createdAt: new Date(Date.now() - 540000).toISOString() },
    ],
  }
};

const defaultRoom = {
  name: "Community Room",
  topic: "Live community discussion",
  category: "general",
  hostName: "NENA Host",
  participants: [
    { id: "you", username: "you", displayName: "You", role: "host", isMuted: true },
  ],
  messages: [],
};

export default function RoomPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const router = useRouter();
  const roomId = resolvedParams.id;

  const initialData = mockRoomData[roomId] || { ...defaultRoom, name: `Room ${roomId}` };
  const [state, dispatch] = useReducer(roomReducer, initialData);

  const [isMuted, setIsMuted] = useState(true);
  const [isVideoOff, setIsVideoOff] = useState(true);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleSendMessage = (content: string) => {
    dispatch({
      type: 'ADD_MESSAGE',
      payload: {
        id: `m-${Date.now()}`,
        username: "you",
        content,
        createdAt: new Date().toISOString(),
      }
    });
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    dispatch({ type: 'TOGGLE_MUTE' });
  };

  const toggleHand = () => {
    setIsHandRaised(!isHandRaised);
    dispatch({ type: 'TOGGLE_HAND' });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] lg:h-screen bg-background overflow-hidden">
      {/* Premium Navigation/Top Bar (Improved Header) */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-border/50 bg-card/10 backdrop-blur-md flex-shrink-0 z-20">
        <div className="flex items-center gap-4 min-w-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 flex-shrink-0 hover:bg-muted"
            onClick={() => router.push("/rooms")}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <h1 className="text-base font-bold truncate tracking-tight">{state.name}</h1>
              <Badge variant="destructive" className="gap-1.5 text-[10px] px-2 py-0.5 h-5 flex-shrink-0 rounded-full bg-red-500/10 text-red-500 border-red-500/20">
                <Radio className="h-3 w-3 animate-pulse" /> LIVE
              </Badge>
              <div className="hidden sm:flex items-center gap-1.5 text-[10px] text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">
                <ShieldCheck className="h-3 w-3 text-green-500" />
                Encrypted
              </div>
            </div>
            {state.topic && (
              <p className="text-[11px] text-muted-foreground truncate italic mt-0.5">{state.topic}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
           <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground">
             <Settings className="h-4 w-4" />
           </Button>
           <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-9 w-9 transition-colors",
              isSidebarOpen ? "text-primary" : "text-muted-foreground"
            )}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? <PanelRightClose className="h-5 w-5" /> : <PanelRightOpen className="h-5 w-5" />}
          </Button>
        </div>
      </header>

      {/* Modern Layout Mimicring NENA Copy */}
      <main className="flex flex-1 overflow-hidden relative">
        {/* Main Workspace (Participant Grid) */}
        <section className="flex-1 flex flex-col min-w-0 bg-gradient-to-br from-background via-background to-primary/5">
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="max-w-5xl mx-auto py-8">
              <ParticipantGrid participants={state.participants} />
            </div>
          </div>
        </section>

        {/* Improved Sidebar (mimicking copy's tabbed sidebar) */}
        <aside
          className={cn(
            "border-l border-border/50 transition-all duration-500 ease-in-out bg-card/5 z-10",
            isSidebarOpen ? "w-full md:w-[350px] lg:w-[400px]" : "w-0 overflow-hidden"
          )}
        >
          {isSidebarOpen && (
            <RoomSidebar 
              messages={state.messages} 
              onSendMessage={handleSendMessage} 
              roomParticipants={state.participants}
            />
          )}
        </aside>
      </main>

      {/* Control Bar */}
      <RoomControls
        isMuted={isMuted}
        isVideoOff={isVideoOff}
        isHandRaised={isHandRaised}
        onToggleMute={toggleMute}
        onToggleVideo={() => setIsVideoOff(!isVideoOff)}
        onToggleHand={toggleHand}
        onLeave={() => router.push("/rooms")}
      />
    </div>
  );
}
