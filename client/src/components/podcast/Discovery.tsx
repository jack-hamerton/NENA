import { PodcastSummary } from "@/types/podcast";
import { PodcastCard } from "./PodcastCard";

interface DiscoveryProps {
  title: string;
  podcasts: PodcastSummary[];
}

export function Discovery({ title, podcasts }: DiscoveryProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight">{title}</h2>
      </div>
      <div className="w-full overflow-x-auto pb-4 scrollbar-hide flex gap-4 snap-x">
        {podcasts.map((podcast) => (
          <div key={podcast.id} className="w-[180px] flex-shrink-0 snap-start">
            <PodcastCard podcast={podcast} />
          </div>
        ))}
      </div>
    </div>
  );
}
