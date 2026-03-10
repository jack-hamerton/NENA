"use client";

import { Episode } from "@/types/podcast";
import { Play, Clock, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface EpisodeListProps {
  episodes: Episode[];
  selectedId?: string;
  onEpisodeSelect: (episode: Episode) => void;
}

export function EpisodeList({ episodes, selectedId, onEpisodeSelect }: EpisodeListProps) {
  if (!episodes || episodes.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground italic border rounded-2xl border-dashed">
        No episodes published yet.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {episodes.map((ep) => (
        <button
          key={ep.id}
          onClick={() => onEpisodeSelect(ep)}
          className={cn(
            "w-full flex items-center gap-4 p-4 rounded-xl transition-all text-left group",
            selectedId === ep.id 
              ? "bg-primary/10 border border-primary/20" 
              : "hover:bg-accent/50 border border-transparent hover:border-border"
          )}
        >
          <div className={cn(
            "h-12 w-12 flex-shrink-0 rounded-lg flex items-center justify-center transition-colors",
            selectedId === ep.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary"
          )}>
            <Play className={cn("h-5 w-5", selectedId === ep.id && "fill-current")} />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className={cn("font-bold text-sm truncate", selectedId === ep.id ? "text-primary" : "text-foreground")}>
              {ep.title}
            </h4>
            <div className="flex items-center gap-3 mt-1">
              <span className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground">
                <Calendar className="h-2.5 w-2.5" /> {ep.releaseDate}
              </span>
              <span className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground">
                <Clock className="h-2.5 w-2.5" /> {Math.floor(ep.duration / 60)}m
              </span>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
