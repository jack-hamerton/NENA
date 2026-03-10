"use client";

import { Mic, MicOff, VideoIcon, VideoOff, PhoneOff, ScreenShare, MoreVertical, MessageCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface ControlsBarProps {
  onToggleAudio: () => void;
  onToggleVideo: () => void;
  onLeave: () => void;
  isAudioMuted: boolean;
  isVideoOff: boolean;
}

export function ControlsBar({
  onToggleAudio,
  onToggleVideo,
  onLeave,
  isAudioMuted,
  isVideoOff,
}: ControlsBarProps) {

  return (
    <div className="flex items-center justify-between border-t bg-background/80 p-4 backdrop-blur-md">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <MessageCircle className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <Button 
          variant={isAudioMuted ? "destructive" : "secondary"} 
          size="icon" 
          onClick={onToggleAudio} 
          className="rounded-full h-12 w-12"
        >
          {isAudioMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
        </Button>
        <Button 
          variant={isVideoOff ? "destructive" : "secondary"} 
          size="icon" 
          onClick={onToggleVideo}
          className="rounded-full h-12 w-12"
        >
          {isVideoOff ? <VideoOff className="h-5 w-5" /> : <VideoIcon className="h-5 w-5" />}
        </Button>
        <Button variant="secondary" size="icon" className="rounded-full h-12 w-12 hidden sm:flex">
          <ScreenShare className="h-5 w-5" />
        </Button>
        <Button 
          variant="destructive" 
          size="icon" 
          onClick={onLeave}
          className="rounded-full px-6 h-12 w-auto gap-2"
        >
          <PhoneOff className="h-5 w-5" />
          <span className="hidden sm:inline text-xs font-bold">Leave</span>
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <MoreVertical className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
