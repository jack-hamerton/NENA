import { PodcastCard } from "@/components/podcasts/PodcastCard";

export default function PodcastsPage() {
  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">Podcasts</h1>
        <p className="text-sm text-muted-foreground">Listen to stories from the creative community.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <PodcastCard title="The Creative Journey" host="Sarah Wanjiku" episodes={12} />
        <PodcastCard title="Design in Africa" host="Mark Kamau" episodes={24} />
        <PodcastCard title="Art & Tech" host="David Omari" episodes={8} />
        <PodcastCard title="Freelance Life" host="Janet Anyango" episodes={15} />
      </div>
    </div>
  );
}
