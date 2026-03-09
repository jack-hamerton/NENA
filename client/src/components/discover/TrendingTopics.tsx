"use client";

import { TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const trending = ["#creativity", "#techtalks", "#music", "#advocacy", "#wellness", "#code", "#kenya", "#innovation"];

export function TrendingTopics() {
  return (
    <div className="space-y-4 rounded-xl border bg-card p-5">
      <div className="flex items-center gap-2">
        <TrendingUp className="h-5 w-5 text-primary" />
        <h2 className="font-semibold text-sm">Trending Topics</h2>
      </div>
      <div className="flex flex-wrap gap-2">
        {trending.map((tag) => (
          <Badge key={tag} variant="secondary" className="cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors py-1">
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  );
}
