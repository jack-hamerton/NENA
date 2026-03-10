"use client";

import { Participant } from "@/types/room";
import { ParticipantTile } from "./ParticipantTile";

interface RoomVideoGridProps {
  participants: Participant[];
  remoteStreams: Map<string, MediaStream>;
  localStream: MediaStream | null;
  localParticipant: Participant;
}

export function RoomVideoGrid({ 
  participants, 
  remoteStreams, 
  localStream, 
  localParticipant 
}: RoomVideoGridProps) {
  // Combine local and remote participants for the grid
  const allParticipants = [
    { ...localParticipant, id: "local" },
    ...participants
  ];

  const getGridClass = (count: number) => {
    if (count === 1) return "grid-cols-1";
    if (count === 2) return "grid-cols-1 md:grid-cols-2";
    if (count <= 4) return "grid-cols-2";
    if (count <= 6) return "grid-cols-2 lg:grid-cols-3";
    return "grid-cols-2 md:grid-cols-3 lg:grid-cols-4";
  };

  return (
    <div className={`grid gap-4 w-full h-full p-4 overflow-y-auto content-start ${getGridClass(allParticipants.length)}`}>
      {allParticipants.map((p) => (
        <ParticipantTile
          key={p.id}
          participant={p}
          isLocal={p.id === "local"}
          stream={p.id === "local" ? localStream || undefined : remoteStreams.get(p.id)}
        />
      ))}
    </div>
  );
}
