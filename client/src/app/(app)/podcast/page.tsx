"use client";

import { useEffect, useState } from "react";
import { podcastService } from "@/services/podcast.service";
import { PodcastSummary } from "@/types/podcast";
import { Discovery } from "@/components/podcast/Discovery";
import { Loader2, Headphones } from "lucide-react";

export default function PodcastPage() {
  const [trending, setTrending] = useState<PodcastSummary[]>([]);
  const [topListened, setTopListened] = useState<PodcastSummary[]>([]);
  const [topViewed, setTopViewed] = useState<PodcastSummary[]>([]);
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

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-y-auto">
      <div className="p-8 border-b bg-gradient-to-r from-primary/10 via-transparent to-transparent">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-primary/20 text-primary">
            <Headphones className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Podcast Hub</h1>
        </div>
        <p className="text-muted-foreground text-sm max-w-lg">
          Explore the latest stories, deep dives, and conversations from your favorite creators.
        </p>
      </div>

      <div className="p-8 space-y-12 pb-20">
        <Discovery title="Trending Now" podcasts={trending} />
        <Discovery title="Most Listened in the US" podcasts={topListened} />
        <Discovery title="Top Viewed This Week" podcasts={topViewed} />
         
        {trending.length === 0 && (
          <div className="text-center py-20 text-muted-foreground bg-accent/20 rounded-2xl">
            <p>No podcasts found. Start creating your own!</p>
          </div>
        )}
      </div>
    </div>
  );
}
