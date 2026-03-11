"use client";

import { Hash } from "lucide-react";
import { Hashtag } from "@/types";
import { useRouter } from "next/navigation";

interface HashtagCardProps {
  hashtag: Hashtag;
}

export function HashtagCard({ hashtag }: HashtagCardProps) {
  const router = useRouter();

  return (
    <div 
      className="flex items-center gap-4 p-4 rounded-xl border bg-card hover:bg-accent/50 transition-colors cursor-pointer"
      onClick={() => router.push(`/discover?query=${hashtag.name.replace("#", "")}&type=posts`)}
    >
      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
        <Hash className="h-6 w-6 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold truncate">{hashtag.name.startsWith("#") ? hashtag.name : `#${hashtag.name}`}</h3>
        <p className="text-sm text-muted-foreground">{hashtag.postCount.toLocaleString()} posts</p>
      </div>
    </div>
  );
}
