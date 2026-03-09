"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Hand, 
  SmilePlus, 
  LogOut,
  ScreenShare,
  Radio,
  Image as ImageIcon
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RoomControlsProps {
  isMuted: boolean;
  isVideoOff: boolean;
  isHandRaised: boolean;
  onToggleMute: () => void;
  onToggleVideo: () => void;
  onToggleHand: () => void;
  onLeave: () => void;
}

const reactionEmojis = ["👏", "🔥", "❤️", "😂", "💡", "🎵"];

export function RoomControls({
  isMuted,
  isVideoOff,
  isHandRaised,
  onToggleMute,
  onToggleVideo,
  onToggleHand,
  onLeave,
}: RoomControlsProps) {
  const [showReactions, setShowReactions] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [floatingEmojis, setFloatingEmojis] = useState<Array<{ id: number; emoji: string }>>([]);

  const sendReaction = (emoji: string) => {
    const id = Date.now();
    setFloatingEmojis((prev) => [...prev, { id, emoji }]);
    setTimeout(() => {
      setFloatingEmojis((prev) => prev.filter((e) => e.id !== id));
    }, 2000);
    setShowReactions(false);
  };

  return (
    <div className="contents">
      {/* Floating Reactions */}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 pointer-events-none z-50">
        {floatingEmojis.map((e) => (
          <span
            key={e.id}
            className="absolute text-4xl"
            style={{
              left: `${Math.random() * 100 - 50}px`,
              animation: "float-up 2s cubic-bezier(0.22, 1, 0.36, 1) forwards",
            }}
          >
            {e.emoji}
          </span>
        ))}
      </div>

      {/* Reaction Picker Popover */}
      {showReactions && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 animate-in fade-in zoom-in slide-in-from-bottom-4 duration-200">
          <div className="flex gap-2 bg-background/80 backdrop-blur-xl border border-border/50 rounded-full px-4 py-2.5 shadow-2xl ring-1 ring-white/10">
            {reactionEmojis.map((emoji) => (
              <button
                key={emoji}
                onClick={() => sendReaction(emoji)}
                className="text-2xl hover:scale-125 hover:-translate-y-1 transition-all duration-200 p-1"
                title={emoji}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Controls Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 lg:left-64 flex justify-center p-4">
        <div className="bg-background/60 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl px-2 py-2 flex items-center gap-1.5 md:gap-3 ring-1 ring-white/5">
          
          {/* Main Toggles */}
          <div className="flex items-center gap-1.5 border-r border-white/10 pr-1.5 md:pr-3">
            <ControlButton 
              onClick={onToggleMute} 
              active={!isMuted} 
              variant={isMuted ? "destructive" : "secondary"}
              label={isMuted ? "Unmute Mic" : "Mute Mic"}
            >
              {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </ControlButton>

            <ControlButton 
              onClick={onToggleVideo} 
              active={!isVideoOff} 
              variant={isVideoOff ? "secondary" : "secondary"}
              label={isVideoOff ? "Start Camera" : "Stop Camera"}
            >
              {isVideoOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
            </ControlButton>
          </div>

          {/* Mimic Copy Features: Share, Record, Background */}
          <div className="flex items-center gap-1.5">
            <ControlButton 
              onClick={() => setIsSharing(!isSharing)} 
              active={isSharing}
              label="Share Screen"
              className="hidden sm:flex"
            >
              <ScreenShare className="h-5 w-5" />
            </ControlButton>

            <ControlButton 
              onClick={() => setIsRecording(!isRecording)} 
              active={isRecording}
              label="Record Session"
              className={cn("hidden sm:flex", isRecording && "text-red-500")}
            >
              <Radio className={cn("h-5 w-5", isRecording && "animate-pulse")} />
            </ControlButton>

            <ControlButton 
              label="Virtual Background"
              className="hidden md:flex"
            >
              <ImageIcon className="h-5 w-5" />
            </ControlButton>

            <ControlButton 
              onClick={onToggleHand} 
              active={isHandRaised}
              label="Raise Hand"
              className={cn(isHandRaised && "bg-amber-500 text-white hover:bg-amber-600")}
            >
              <Hand className="h-5 w-5" />
            </ControlButton>

            <ControlButton 
              onClick={() => setShowReactions(!showReactions)} 
              active={showReactions}
              label="Send Reaction"
            >
              <SmilePlus className="h-5 w-5" />
            </ControlButton>
          </div>

          <div className="border-l border-white/10 pl-1.5 md:pl-3">
             <Button
                variant="destructive"
                className="rounded-2xl h-11 px-4 md:px-6 shadow-lg shadow-destructive/20 gap-2 font-semibold"
                onClick={onLeave}
              >
                <LogOut className="h-4 w-4" /> 
                <span className="hidden sm:inline">Leave Room</span>
              </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ControlButton({ 
  children, 
  onClick, 
  active, 
  variant = "secondary", 
  label,
  className 
}: { 
  children: React.ReactNode; 
  onClick?: () => void; 
  active?: boolean;
  variant?: "secondary" | "destructive";
  label: string;
  className?: string;
}) {
  return (
    <Button
      variant={variant}
      size="icon"
      onClick={onClick}
      title={label}
      className={cn(
        "rounded-2xl h-11 w-11 transition-all duration-200 border border-white/5",
        active && variant !== "destructive" && "bg-primary/20 text-primary border-primary/20",
        !active && "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground",
        className
      )}
    >
      {children}
    </Button>
  );
}
