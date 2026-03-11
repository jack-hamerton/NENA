"use client";

import { PodcastSummary } from "@/types/podcast";
import { PodcastCard } from "./PodcastCard";

interface HostRecommendationsProps {
  recommendations: PodcastSummary[];
}

export function HostRecommendations({ recommendations }: HostRecommendationsProps) {
  if (!recommendations || recommendations.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold tracking-tight">Host Recommendations</h3>
      <div className="w-full overflow-x-auto pb-4 scrollbar-hide flex gap-4 snap-x">
        {recommendations.map((podcast) => (
          <div key={podcast.id} className="w-[160px] flex-shrink-0 snap-start">
            <PodcastCard podcast={podcast} />
          </div>
        ))}
      </div>
    </div>
  );
}
