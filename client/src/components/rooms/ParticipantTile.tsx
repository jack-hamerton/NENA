"use client";

import { useEffect, useRef } from "react";
import { Participant } from "@/types/room";
import { MicOff, VideoOff, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface ParticipantTileProps {
  participant: Participant;
  stream?: MediaStream;
  isLocal?: boolean;
}

export function ParticipantTile({ participant, stream, isLocal }: ParticipantTileProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="relative aspect-video bg-muted rounded-xl overflow-hidden group shadow-sm border border-border/50">
      {participant.isVideoOff || !stream ? (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/80 backdrop-blur-sm">
          <div className="h-20 w-20 rounded-full bg-background flex items-center justify-center border shadow-inner">
            <User className="h-10 w-10 text-muted-foreground" />
          </div>
        </div>
      ) : (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isLocal}
          className={cn(
            "h-full w-full object-cover",
            isLocal && "scale-x-[-1]" // Mirror local video
          )}
        />
      )}

      {/* Overlays */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
        <div className="flex items-center gap-2 px-2 py-1 rounded-md bg-background/60 backdrop-blur-md border border-white/10 text-xs font-medium shadow-sm">
          {participant.username} {isLocal && "(You)"}
          {participant.isSpeaking && (
            <div className="flex gap-0.5 ml-1">
              <div className="h-2 w-0.5 bg-primary animate-pulse" />
              <div className="h-2.5 w-0.5 bg-primary animate-pulse delay-75" />
              <div className="h-2 w-0.5 bg-primary animate-pulse delay-150" />
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-1.5">
          {participant.isMuted && (
            <div className="p-1.5 rounded-full bg-destructive/80 text-destructive-foreground shadow-sm">
              <MicOff className="h-3 w-3" />
            </div>
          )}
          {participant.isVideoOff && (
            <div className="p-1.5 rounded-full bg-destructive/80 text-destructive-foreground shadow-sm">
              <VideoOff className="h-3 w-3" />
            </div>
          )}
        </div>
      </div>
      
      {/* Active Speaker Border */}
      {participant.isSpeaking && (
        <div className="absolute inset-0 border-2 border-primary rounded-xl" />
      )}
    </div>
  );
}
