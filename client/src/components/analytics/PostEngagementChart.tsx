"use client";

import { useState, useEffect } from "react";
import { PostEngagement } from "@/types/analytics";
import { analyticsService } from "@/services/analytics.service";
import { MessageSquare, Heart, Layout, Loader2, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function PostEngagementChart() {
  const [data, setData] = useState<PostEngagement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const stats = await analyticsService.getPostEngagement();
        setData(stats);
      } catch (err) {
        console.error("Failed to fetch post engagement:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="h-[300px] flex items-center justify-center bg-card rounded-3xl border border-white/5">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="bg-card border shadow-xl rounded-3xl overflow-hidden">
      <div className="p-6 border-b bg-accent/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
           <div className="p-2 rounded-xl bg-purple-500/20 text-purple-500">
              <Layout className="h-5 w-5" />
           </div>
           <div>
             <h3 className="text-lg font-black italic tracking-tighter uppercase">High Impact Posts</h3>
             <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Sentiment & engagement analysis</p>
           </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-accent/10 border-b">
            <tr>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground w-1/2">Post Content</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Author</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">Comments</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">Likes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {data.map((post) => (
              <tr key={post.post_id} className="hover:bg-accent/5 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1 max-w-md">
                    <p className="text-sm font-bold tracking-tight line-clamp-1 group-hover:text-primary transition-colors">{post.text}</p>
                    <p className="text-[10px] text-muted-foreground font-medium truncate italic">ID: {post.post_id.slice(0, 8)}...</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs font-black uppercase tracking-tighter text-muted-foreground">{post.author}</span>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="inline-flex items-center gap-1 text-sm font-black tabular-nums">
                    <MessageSquare className="h-3 w-3 text-muted-foreground" />
                    {post.comments_count}
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-500/10 text-red-500 text-[10px] font-black border border-red-500/10">
                    <Heart className="h-2.5 w-2.5 fill-current" />
                    {post.likes_count}
                    <ArrowUpRight className="h-2.5 w-2.5 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
