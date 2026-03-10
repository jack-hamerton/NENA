"use client";

import Link from "next/link";
import { PodcastSummary } from "@/types/podcast";
import { Card, CardContent } from "@/components/ui/card";
import { Play } from "lucide-react";

interface PodcastCardProps {
  podcast: PodcastSummary;
}

export function PodcastCard({ podcast }: PodcastCardProps) {
  return (
    <Link href={`/podcast/${podcast.id}`}>
      <Card className="group relative overflow-hidden transition-all hover:scale-[1.02] border-none bg-accent/30">
        <div className="aspect-square relative overflow-hidden">
          <img
            src={podcast.imageUrl || "/placeholder-podcast.jpg"}
            alt={podcast.title}
            className="h-full w-full object-cover transition-transform group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform">
              <Play className="h-6 w-6 fill-current" />
            </div>
          </div>
        </div>
        <CardContent className="p-3">
          <h3 className="font-bold text-sm truncate leading-tight mb-1">{podcast.title}</h3>
          <p className="text-xs text-muted-foreground truncate">{podcast.author}</p>
          <div className="mt-2 text-[10px] uppercase tracking-wider text-primary font-semibold">
            {podcast.category}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
