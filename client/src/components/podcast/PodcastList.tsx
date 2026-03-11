"use client";

import { PodcastSummary } from "@/types/podcast";
import Link from "next/link";
import { Play, TrendingUp, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PodcastListProps {
  podcasts: PodcastSummary[];
}

export function PodcastList({ podcasts }: PodcastListProps) {
  if (podcasts.length === 0) {
    return (
      <div className="text-center py-20 bg-accent/5 rounded-3xl border border-dashed">
        <p className="text-muted-foreground">No results found.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {podcasts.map((podcast) => (
        <Link
          key={podcast.id}
          href={`/podcasts/${podcast.id}`}
          className="group flex flex-col sm:flex-row items-start sm:items-center gap-6 p-4 rounded-2xl border bg-card hover:bg-accent/50 transition-all hover:shadow-xl hover:-translate-y-0.5"
        >
          <div className="h-32 w-32 flex-shrink-0 relative rounded-xl overflow-hidden shadow-md">
            <img
              src={podcast.imageUrl || "/placeholder-podcast.jpg"}
              alt={podcast.title}
              className="h-full w-full object-cover transition-transform group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg">
                <Play className="h-5 w-5 fill-current ml-0.5" />
              </div>
            </div>
          </div>
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-[10px] font-bold uppercase">{podcast.category}</Badge>
              {podcast.id.includes("trending") && (
                <Badge className="bg-orange-500/10 text-orange-500 border-orange-500/20 text-[10px] gap-1">
                  <TrendingUp className="h-3 w-3" /> Trending
                </Badge>
              )}
            </div>
            <h3 className="text-xl font-bold truncate group-hover:text-primary transition-colors">{podcast.title}</h3>
            <div className="flex items-center gap-4 text-sm text-muted-foreground font-medium">
              <span className="flex items-center gap-1.5"><Users className="h-4 w-4" /> {podcast.author}</span>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              Explore the latest from {podcast.author} in this compelling series.
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
