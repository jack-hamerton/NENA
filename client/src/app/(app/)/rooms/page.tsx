import { RoomCard } from "@/components/rooms/RoomCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function RoomsPage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">Audio Rooms</h1>
          <p className="text-sm text-muted-foreground">Jump into live conversations.</p>
        </div>
        <Button variant="nena" className="gap-2">
          <Plus className="h-4 w-4" /> Create Room
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <RoomCard id="r1" name="Visual Arts Masterclass" participants={42} isLive={true} />
        <RoomCard id="r2" name="Weekly Design Critique" participants={15} isLive={true} />
        <RoomCard id="r3" name="Nairobi Tech Scene" participants={89} isLive={false} />
        <RoomCard id="r4" name="Creative Freelancing" participants={23} isLive={false} />
      </div>
    </div>
  );
}
