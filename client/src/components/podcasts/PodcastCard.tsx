"use client";

import { Headphones, Play } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface PodcastCardProps {
  title: string;
  host: string;
  episodes: number;
}

export function PodcastCard({ title, host, episodes }: PodcastCardProps) {
  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer border-white/10 bg-card/60 backdrop-blur-sm">
      <CardContent className="p-0">
        <div className="relative aspect-square w-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
          <Headphones className="h-12 w-12 text-primary opacity-40 group-hover:scale-110 transition-transform duration-300" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-xl">
              <Play className="h-6 w-6 ml-1" />
            </div>
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-bold text-sm truncate group-hover:text-primary transition-colors">{title}</h3>
          <p className="text-xs text-muted-foreground mt-1">by {host}</p>
          <p className="text-[10px] text-muted-foreground font-medium mt-2 uppercase tracking-wider">{episodes} episodes</p>
        </div>
      </CardContent>
    </Card>
  );
}
