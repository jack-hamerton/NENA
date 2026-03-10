"use client";

import { useState, useEffect } from "react";
import { UserEngagement } from "@/types/analytics";
import { analyticsService } from "@/services/analytics.service";
import { Users, Loader2, TrendingUp, ChevronUp } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export function UserEngagementChart() {
  const [data, setData] = useState<UserEngagement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const stats = await analyticsService.getUserEngagement();
        setData(stats);
      } catch (err) {
        console.error("Failed to fetch user engagement:", err);
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
           <div className="p-2 rounded-xl bg-orange-500/20 text-orange-500">
              <Users className="h-5 w-5" />
           </div>
           <div>
             <h3 className="text-lg font-black italic tracking-tighter uppercase">User Participation</h3>
             <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Network health metrics</p>
           </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-accent/10 border-b">
            <tr>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">User</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">Posts</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">Comments</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">Following</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">Followers</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {data.map((user) => (
              <tr key={user.user_id} className="hover:bg-accent/5 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 border shadow-sm">
                      <AvatarImage src={`/avatars/${user.full_name?.split(' ')[0].toLowerCase()}.png`} />
                      <AvatarFallback className="text-[10px] font-bold">{user.full_name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-bold tracking-tight">{user.full_name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="inline-flex items-center gap-1 text-sm font-black tabular-nums">
                    {user.posts_count}
                    <ChevronUp className="h-3 w-3 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </td>
                <td className="px-6 py-4 text-center font-bold text-sm tabular-nums text-muted-foreground">{user.comments_count}</td>
                <td className="px-6 py-4 text-center font-bold text-sm tabular-nums text-muted-foreground">{user.following_count}</td>
                <td className="px-6 py-4 text-center">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black">
                    {user.followers_count}
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
