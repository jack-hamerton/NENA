"use client";

import { useEffect, useState } from "react";
import { podcastService } from "@/services/podcast.service";
import { PodcastSummary } from "@/types/podcast";
import { Discovery } from "@/components/podcast/Discovery";
import { BestPlaceToStart } from "@/components/podcast/BestPlaceToStart";
import { PodcastList } from "@/components/podcast/PodcastList";
import { CreatePodcast } from "@/components/podcast/CreatePodcast";
import { Loader2, Headphones, Search, Plus, Sparkles, LayoutGrid, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function PodcastPage() {
  const [trending, setTrending] = useState<PodcastSummary[]>([]);
  const [topListened, setTopListened] = useState<PodcastSummary[]>([]);
  const [topViewed, setTopViewed] = useState<PodcastSummary[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"discovery" | "curated">("discovery");
  const [showCreate, setShowCreate] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [all, listened, viewed] = await Promise.all([
          podcastService.getPodcasts(),
          podcastService.getTopPodcasts("listened"),
          podcastService.getTopPodcasts("viewed")
        ]);
        setTrending(all || []);
        setTopListened(listened || []);
        setTopViewed(viewed || []);
      } catch (error) {
        console.error("Failed to fetch podcasts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredPodcasts = trending.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-y-auto">
      <div className="p-8 border-b bg-gradient-to-r from-primary/10 via-transparent to-transparent flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/20 text-primary">
              <Headphones className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-black italic tracking-tighter">PODCAST HUB</h1>
          </div>
          <p className="text-muted-foreground text-sm max-w-lg font-medium">
            Explore the latest stories, deep dives, and conversations from your favorite creators.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:w-64 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="Search podcasts..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-11 bg-accent/20 border-white/5 shadow-inner"
            />
          </div>
          <Button 
            onClick={() => setShowCreate(!showCreate)}
            variant={showCreate ? "outline" : "default"}
            className="font-bold gap-2 italic h-11 px-6 shadow-lg shadow-primary/20"
          >
            {showCreate ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {showCreate ? "Close" : "Create"}
          </Button>
        </div>
      </div>

      {showCreate && (
        <div className="p-8 bg-accent/5 border-b animate-in fade-in slide-in-from-top-4 duration-300">
          <CreatePodcast />
        </div>
      )}

      <div className="px-8 pt-8 flex items-center gap-4">
        <Button 
          variant={activeTab === "discovery" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("discovery")}
          className="rounded-full gap-2 font-bold"
        >
          <Sparkles className="h-3.5 w-3.5" /> Discovery
        </Button>
        <Button 
          variant={activeTab === "curated" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("curated")}
          className="rounded-full gap-2 font-bold"
        >
          <LayoutGrid className="h-3.5 w-3.5" /> Curated
        </Button>
      </div>

      <div className="p-8 space-y-16 pb-20">
        {searchQuery ? (
          <div className="space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              Search results for <span className="text-primary italic">"{searchQuery}"</span>
            </h2>
            <PodcastList podcasts={filteredPodcasts} />
          </div>
        ) : (
          <>
            {activeTab === "discovery" ? (
              <>
                <BestPlaceToStart />
                <Discovery title="Trending Now" podcasts={trending} />
              </>
            ) : (
              <>
                <Discovery title="Most Listened in the US" podcasts={topListened} />
                <Discovery title="Top Viewed This Week" podcasts={topViewed} />
              </>
            )}
          </>
        )}
         
        {trending.length === 0 && (
          <div className="text-center py-20 text-muted-foreground bg-accent/20 rounded-2xl">
            <p>No podcasts found. Start creating your own!</p>
          </div>
        )}
      </div>
    </div>
  );
}
