import { SearchBar } from "@/components/discover/SearchBar";
import { TrendingTopics } from "@/components/discover/TrendingTopics";
import { RoomCard } from "@/components/rooms/RoomCard";

export default function DiscoverPage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Discover</h1>
        <p className="text-muted-foreground">Explore trending topics and new communities.</p>
      </div>
      
      <SearchBar />

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <section className="space-y-4">
            <h2 className="text-lg font-semibold">Live Rooms</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <RoomCard id="r1" name="Visual Arts Masterclass" participants={42} isLive={true} />
              <RoomCard id="r2" name="Weekly Design Critique" participants={15} isLive={true} />
            </div>
          </section>
        </div>
        
        <div className="space-y-6">
          <TrendingTopics />
        </div>
      </div>
    </div>
  );
}
