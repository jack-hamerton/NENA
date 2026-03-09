"use client";

import { Play, SkipBack, SkipForward, Volume2, Maximize2, Repeat, Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AudioPlayer() {
  return (
    <div className="rounded-2xl border border-white/10 bg-card/80 p-6 backdrop-blur-md shadow-2xl">
      <div className="flex items-center gap-4 mb-6">
        <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
          <Play className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h4 className="font-bold text-sm">Episode Title Goes Here</h4>
          <p className="text-xs text-muted-foreground">Podcast Name • Host Name</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-center gap-6">
          <Button variant="ghost" size="icon" className="text-muted-foreground"><Shuffle className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon"><SkipBack className="h-5 w-5" /></Button>
          <Button size="icon" variant="nena" className="h-12 w-12 rounded-full shadow-nena-glow">
            <Play className="h-6 w-6 ml-1" />
          </Button>
          <Button variant="ghost" size="icon"><SkipForward className="h-5 w-5" /></Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground"><Repeat className="h-4 w-4" /></Button>
        </div>

        <div className="space-y-1">
          <div className="h-1.5 w-full rounded-full bg-muted/30 overflow-hidden">
            <div className="h-full w-1/3 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary),0.5)]" />
          </div>
          <div className="flex justify-between text-[10px] font-medium text-muted-foreground">
            <span>12:45</span>
            <span>45:30</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <Volume2 className="h-4 w-4 text-muted-foreground" />
            <div className="w-20 h-1 rounded-full bg-muted/30">
              <div className="w-2/3 h-full bg-muted-foreground rounded-full" />
            </div>
          </div>
          <Button variant="ghost" size="icon" className="text-muted-foreground"><Maximize2 className="h-4 w-4" /></Button>
        </div>
      </div>
    </div>
  );
}
