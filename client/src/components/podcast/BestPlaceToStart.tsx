"use client";

import { useEffect, useState } from "react";
import { podcastService } from "@/services/podcast.service";
import { PodcastSummary } from "@/types/podcast";
import { PodcastCard } from "./PodcastCard";
import { Badge } from "@/components/ui/badge";

export function BestPlaceToStart() {
  const [topListened, setTopListened] = useState<PodcastSummary[]>([]);
  const [topViewed, setTopViewed] = useState<PodcastSummary[]>([]);
  const [region, setRegion] = useState("US");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [listened, viewed] = await Promise.all([
          podcastService.getTopPodcasts("listened", region),
          podcastService.getTopPodcasts("viewed", region),
        ]);
        setTopListened(listened || []);
        setTopViewed(viewed || []);
      } catch (error) {
        console.error("Failed to fetch top podcasts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [region]);

  return (
    <div className="space-y-8 p-6 bg-accent/10 rounded-3xl border border-white/5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black tracking-tight">Best Place to Start</h2>
          <p className="text-muted-foreground text-sm">Curated picks for your region.</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-primary/10 border-primary/20 text-primary">Live Data</Badge>
          {/* Note: In a real app, I'd use the Select component here, but for simplicity/stability I'll use a basic styled select if Select is missing */}
          <select 
            value={region} 
            onChange={(e) => setRegion(e.target.value)}
            className="bg-background border rounded-lg px-3 py-1.5 text-xs font-semibold outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="US">USA (US)</option>
            <option value="UK">United Kingdom (UK)</option>
            <option value="NG">Nigeria (NG)</option>
            <option value="KE">Kenya (KE)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-4">
          <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Most Listened</h4>
          <div className="grid grid-cols-2 gap-4">
            {topListened.slice(0, 4).map((podcast) => (
              <PodcastCard key={podcast.id} podcast={podcast} />
            ))}
            {topListened.length === 0 && !isLoading && (
               <div className="col-span-2 h-32 flex items-center justify-center border border-dashed rounded-2xl text-xs text-muted-foreground">
                 No data for this region
               </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Most Viewed</h4>
          <div className="grid grid-cols-2 gap-4">
            {topViewed.slice(0, 4).map((podcast) => (
              <PodcastCard key={podcast.id} podcast={podcast} />
            ))}
            {topViewed.length === 0 && !isLoading && (
               <div className="col-span-2 h-32 flex items-center justify-center border border-dashed rounded-2xl text-xs text-muted-foreground">
                 No data for this region
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
