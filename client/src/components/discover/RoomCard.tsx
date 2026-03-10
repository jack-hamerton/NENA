"use client";

import { Radio } from "lucide-react";
import { Room } from "@/types";
import { useRouter } from "next/navigation";

interface RoomCardProps {
  room: Room;
}

export function RoomCard({ room }: RoomCardProps) {
  const router = useRouter();

  return (
    <div 
      className="p-4 rounded-xl border bg-card hover:bg-accent/50 transition-colors cursor-pointer"
      onClick={() => router.push(`/rooms/${room.id}`)}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Radio className="h-4 w-4 text-primary" />
          </div>
          <h3 className="font-semibold truncate">{room.name}</h3>
        </div>
        {room.isLive && (
          <span className="flex items-center gap-1 text-[10px] font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded-full uppercase italic">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
            Live
          </span>
        )}
      </div>
      {room.description && (
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {room.description}
        </p>
      )}
      <div className="text-xs text-muted-foreground italic">
        {room.participantsCount} participants
      </div>
    </div>
  );
}
