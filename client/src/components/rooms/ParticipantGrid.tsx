"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, Hand } from "lucide-react";
import { cn } from "@/lib/utils";

interface ParticipantTile {
  id: string;
  username: string;
  displayName?: string;
  avatarUrl?: string;
  role: "host" | "speaker" | "listener";
  isMuted?: boolean;
  isHandRaised?: boolean;
}

interface ParticipantGridProps {
  participants: ParticipantTile[];
}

const roleBadgeStyles: Record<string, string> = {
  host: "bg-primary/20 text-primary border-primary/30",
  speaker: "bg-green-500/20 text-green-400 border-green-500/30",
  listener: "bg-muted text-muted-foreground border-border",
};

export function ParticipantGrid({ participants }: ParticipantGridProps) {
  // Partition: hosts/speakers first, then listeners
  const speakers = participants.filter((p) => p.role !== "listener");
  const listeners = participants.filter((p) => p.role === "listener");

  return (
    <div className="space-y-6 p-4">
      {/* Speakers Section */}
      {speakers.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Speakers
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {speakers.map((p) => (
              <ParticipantCard key={p.id} participant={p} size="lg" />
            ))}
          </div>
        </div>
      )}

      {/* Listeners Section */}
      {listeners.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Listeners ({listeners.length})
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {listeners.map((p) => (
              <ParticipantCard key={p.id} participant={p} size="sm" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ParticipantCard({
  participant,
  size,
}: {
  participant: ParticipantTile;
  size: "lg" | "sm";
}) {
  const isLarge = size === "lg";

  return (
    <div className="flex flex-col items-center gap-2 group">
      <div className="relative">
        <Avatar
          className={cn(
            "border-2 transition-all",
            isLarge ? "h-20 w-20" : "h-12 w-12",
            participant.role === "host"
              ? "border-primary ring-2 ring-primary/20"
              : "border-border"
          )}
        >
          <AvatarImage src={participant.avatarUrl} />
          <AvatarFallback
            fallback={participant.displayName || participant.username}
            className={isLarge ? "text-lg" : "text-xs"}
          />
        </Avatar>

        {/* Mute indicator */}
        <div
          className={cn(
            "absolute -bottom-1 -right-1 rounded-full border-2 border-background flex items-center justify-center",
            isLarge ? "h-6 w-6" : "h-4 w-4",
            participant.isMuted ? "bg-destructive" : "bg-green-500"
          )}
        >
          {participant.isMuted ? (
            <MicOff className={isLarge ? "h-3 w-3 text-white" : "h-2 w-2 text-white"} />
          ) : (
            <Mic className={isLarge ? "h-3 w-3 text-white" : "h-2 w-2 text-white"} />
          )}
        </div>

        {/* Hand raised */}
        {participant.isHandRaised && (
          <div className="absolute -top-1 -right-1 h-6 w-6 bg-amber-500 rounded-full flex items-center justify-center border-2 border-background animate-bounce">
            <Hand className="h-3 w-3 text-white" />
          </div>
        )}
      </div>

      {/* Name + Role */}
      <div className="text-center min-w-0 w-full">
        <p className={cn("font-medium truncate", isLarge ? "text-xs" : "text-[10px]")}>
          {participant.displayName || participant.username}
        </p>
        {isLarge && (
          <Badge
            variant="outline"
            className={cn("text-[9px] mt-0.5 capitalize", roleBadgeStyles[participant.role])}
          >
            {participant.role}
          </Badge>
        )}
      </div>
    </div>
  );
}
