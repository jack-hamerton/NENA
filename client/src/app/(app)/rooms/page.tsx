"use client";

import { useEffect, useState } from "react";
import { roomService } from "@/services/room.service";
import { Room } from "@/types/room";
import { RoomCard } from "@/components/rooms/RoomCard";
import { Button } from "@/components/ui/button";
import { Plus, Radio, Loader2 } from "lucide-react";

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const data = await roomService.getRooms();
        setRooms(data || []);
      } catch (error) {
        console.error("Failed to fetch rooms:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRooms();
  }, []);

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="p-6 border-b flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Rooms</h1>
          <p className="text-muted-foreground text-sm">Join a live room or start your own.</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Start Room
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : rooms.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-4">
              <Radio className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold">No live rooms</h2>
            <p className="text-muted-foreground mt-1">Be the first to start a conversation!</p>
            <Button variant="outline" className="mt-4 gap-2">
              <Plus className="h-4 w-4" /> Create One
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {rooms.map((room) => (
              <RoomCard 
                key={room.id} 
                id={room.id}
                name={room.name}
                participants={room.participantsCount}
                isLive={room.isLive}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
