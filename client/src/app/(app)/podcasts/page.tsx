"use client";

import { useEffect, useState } from "react";
import { Podcast } from "@/types/podcast";
import { podcastService } from "@/services/podcast.service";
import { PodcastDiscovery } from "@/components/podcast/PodcastDiscovery";
import { PodcastCard } from "@/components/podcast/PodcastCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";

export default function PodcastsPage() {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"recommendations" | "playlists">("recommendations");

  useEffect(() => {
    podcastService.getPodcasts().then((data) => {
      setPodcasts(data);
      setLoading(false);
    });
  }, []);

  const filteredPodcasts = podcasts.filter((podcast) =>
    podcast.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (typeof podcast.host === "string" ? podcast.host : podcast.host.name).toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-3.5rem)] items-center justify-center relative overflow-hidden">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="container max-w-5xl mx-auto py-8 px-4 h-[calc(100vh-3.5rem)] overflow-y-auto hide-scrollbar">
      <div className="mb-8 space-y-4">
        <h1 className="text-3xl font-bold tracking-tight text-primary">Podcasts</h1>
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Search podcasts or hosts..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-muted/50 border-none focus-visible:ring-1"
          />
        </div>
      </div>

      {!searchQuery && (
        <div className="flex gap-2 mb-8 border-b pb-4">
          <Button 
            variant={activeTab === "recommendations" ? "default" : "outline"}
            onClick={() => setActiveTab("recommendations")}
            className="rounded-full"
          >
            Personalized Recommendations
          </Button>
          <Button 
            variant={activeTab === "playlists" ? "default" : "outline"}
            onClick={() => setActiveTab("playlists")}
            className="rounded-full"
          >
            Curated Playlists
          </Button>
        </div>
      )}

      {searchQuery ? (
        <div className="space-y-6 animate-in fade-in duration-300">
          <h2 className="text-xl font-semibold">Search Results for "{searchQuery}"</h2>
          {filteredPodcasts.length > 0 ? (
            <div className="flex flex-wrap gap-4">
               {filteredPodcasts.map((podcast) => (
                  <div key={podcast.id} className="w-[160px] md:w-[200px]">
                    <PodcastCard podcast={podcast} />
                  </div>
               ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              No podcasts found matching your search.
            </div>
          )}
        </div>
      ) : activeTab === "recommendations" ? (
        <div className="animate-in fade-in duration-300">
          <PodcastDiscovery podcasts={podcasts} />
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in duration-300">
          <h2 className="text-xl font-semibold">Curated Playlists</h2>
          <div className="flex flex-wrap gap-4">
             {podcasts.map((podcast) => (
                <div key={podcast.id} className="w-[160px] md:w-[200px]">
                  <PodcastCard podcast={podcast} />
                </div>
             ))}
          </div>
        </div>
      )}
    </div>
  );
}
