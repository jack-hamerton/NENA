"use client";

import { Mic, MicOff, VideoIcon, VideoOff, PhoneOff, ScreenShare, MoreVertical, MessageCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function ControlsBar() {
  const [muted, setMuted] = useState(false);
  const [videoOff, setVideoOff] = useState(false);

  return (
    <div className="flex items-center justify-between border-t bg-background/80 p-4 backdrop-blur-md">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <MessageCircle className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <Button 
          variant={muted ? "destructive" : "secondary"} 
          size="icon" 
          onClick={() => setMuted(!muted)} 
          className="rounded-full"
        >
          {muted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
        </Button>
        <Button 
          variant={videoOff ? "destructive" : "secondary"} 
          size="icon" 
          onClick={() => setVideoOff(!videoOff)}
          className="rounded-full"
        >
          {videoOff ? <VideoOff className="h-5 w-5" /> : <VideoIcon className="h-5 w-5" />}
        </Button>
        <Button variant="secondary" size="icon" className="rounded-full hidden sm:flex">
          <ScreenShare className="h-5 w-5" />
        </Button>
        <Button variant="destructive" size="icon" className="rounded-full px-6 w-auto gap-2">
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
