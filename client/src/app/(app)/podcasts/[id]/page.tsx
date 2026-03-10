"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { podcastService } from "@/services/podcast.service";
import { Podcast, Episode } from "@/types/podcast";
import { PodcastPlayer } from "@/components/podcast/PodcastPlayer";
import { EpisodeList } from "@/components/podcast/EpisodeList";
import { CommentsAndPolls } from "@/components/podcast/CommentsAndPolls";
import { HostRecommendations } from "@/components/podcast/HostRecommendations";
import { FollowButton } from "@/components/podcast/FollowButton";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Share2, Heart, Info, Play, MessageSquare } from "lucide-react";
import { Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export default function PodcastPlayerPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [podcast, setPodcast] = useState<Podcast | null>(null);
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPodcast = async () => {
      try {
        const data = await podcastService.getPodcastById(id);
        setPodcast(data);
        if (data.episodes && data.episodes.length > 0) {
          setSelectedEpisode(data.episodes[0]);
        }
      } catch (error) {
        console.error("Failed to fetch podcast:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPodcast();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!podcast || !selectedEpisode) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-background">
        <p className="text-muted-foreground mb-4">Podcast not found.</p>
        <Button onClick={() => router.push("/podcasts")}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-y-auto">
      <div className="p-4 flex items-center justify-between sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
            <Heart className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto w-full p-6 md:p-10 space-y-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row gap-8 items-start md:items-end">
          <div className="h-48 w-48 md:h-64 md:w-64 flex-shrink-0 rounded-2xl overflow-hidden shadow-2xl">
            <img
              src={podcast.imageUrl || "/placeholder-podcast.jpg"}
              alt={podcast.title}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex-1 space-y-4 pb-2">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-widest text-primary">{podcast.category}</span>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight">{podcast.title}</h1>
            </div>
            
            <div className="flex items-center gap-3">
              <Avatar className="h-6 w-6 border">
                <AvatarImage src="/placeholder-avatar.jpg" alt={podcast.author} />
                <AvatarFallback>{podcast.author.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-semibold">{podcast.author}</span>
            </div>

            <div className="pt-2">
              <FollowButton podcastId={podcast.id} />
            </div>
          </div>
        </div>

        {/* Player Component */}
        <PodcastPlayer episode={selectedEpisode} />

        {/* Missing Recommendations */}
        {podcast.recommendations && (
          <HostRecommendations recommendations={[]} /> // Fetching recs would be ideal
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-12">
            <div className="space-y-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Info className="h-4 w-4 text-primary" />
                About this Episode
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {selectedEpisode.description || podcast.description}
              </p>
            </div>

            {/* Comments and Polls */}
            <CommentsAndPolls episodeId={selectedEpisode.id} />

            {selectedEpisode.notes && (
              <div className="p-6 rounded-2xl bg-accent/20 border border-border/50">
                <h4 className="font-bold mb-3">Show Notes</h4>
                <div className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                  {selectedEpisode.notes}
                </div>
              </div>
            )}
            
            {selectedEpisode.transcription && (
               <div className="space-y-4">
                 <h3 className="text-lg font-bold">Transcription</h3>
                 <div className="h-64 overflow-y-auto p-4 rounded-xl bg-muted/30 text-sm text-muted-foreground leading-loose">
                   {selectedEpisode.transcription}
                 </div>
               </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="p-6 rounded-2xl border bg-card">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-primary" />
                Community
              </h3>
              <div className="text-center py-6 space-y-2">
                 <p className="text-xs text-muted-foreground">Join the conversation with other listeners.</p>
                 <Button variant="outline" size="sm" className="w-full">Open Comments</Button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">More Episodes</h3>
              <EpisodeList 
                episodes={podcast.episodes} 
                selectedId={selectedEpisode.id}
                onEpisodeSelect={setSelectedEpisode}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
