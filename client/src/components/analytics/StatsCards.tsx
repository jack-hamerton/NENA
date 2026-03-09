"use client";

import { TrendingUp, Eye, Heart, Users, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const stats = [
  { icon: Eye, label: "Views", value: "12.4K", change: "+12%", trend: "up" },
  { icon: Heart, label: "Likes", value: "3.2K", change: "+8%", trend: "up" },
  { icon: Users, label: "Followers", value: "1.2K", change: "+24%", trend: "up" },
  { icon: TrendingUp, label: "Engagement", value: "18.3%", change: "-2%", trend: "down" },
];

export function StatsCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="border-white/5 bg-card/40 backdrop-blur-sm overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-center justify-between font-medium">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <stat.icon className="h-5 w-5" />
              </div>
              <div className={cn(
                "flex items-center gap-1 text-xs px-2 py-1 rounded-full",
                stat.trend === "up" ? "bg-green-500/10 text-green-500" : "bg-destructive/10 text-destructive"
              )}>
                {stat.change}
                {stat.trend === "up" ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1 font-medium">{stat.label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
