"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Award, Hash, Users } from "lucide-react";

interface ProfileMetricsProps {
  metrics?: {
    supporters?: number;
    amplifiers?: number;
    learners?: number;
    topicsEngaged?: string[];
    badges?: string[];
    impactScore?: number;
  };
}

export function ProfileMetrics({ metrics }: ProfileMetricsProps) {
  const defaults = {
    supporters: metrics?.supporters ?? 0,
    amplifiers: metrics?.amplifiers ?? 0,
    learners: metrics?.learners ?? 0,
    topicsEngaged: metrics?.topicsEngaged ?? [],
    badges: metrics?.badges ?? [],
    impactScore: metrics?.impactScore ?? 0,
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Follower Intent */}
      <Card className="bg-card/60 backdrop-blur-sm border-white/5">
        <CardHeader className="pb-2 pt-4 px-4">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Users className="h-4 w-4 text-primary" />
            Follower Intent
          </div>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 rounded-lg bg-green-500/10">
              <p className="text-lg font-bold text-green-500">{defaults.supporters}</p>
              <p className="text-[10px] text-muted-foreground font-medium">Supporters</p>
            </div>
            <div className="p-2 rounded-lg bg-amber-500/10">
              <p className="text-lg font-bold text-amber-500">{defaults.amplifiers}</p>
              <p className="text-[10px] text-muted-foreground font-medium">Amplifiers</p>
            </div>
            <div className="p-2 rounded-lg bg-blue-500/10">
              <p className="text-lg font-bold text-blue-500">{defaults.learners}</p>
              <p className="text-[10px] text-muted-foreground font-medium">Learners</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Impact & Badges */}
      <Card className="bg-card/60 backdrop-blur-sm border-white/5">
        <CardHeader className="pb-2 pt-4 px-4">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <TrendingUp className="h-4 w-4 text-accent" />
            Community Impact
          </div>
        </CardHeader>
        <CardContent className="px-4 pb-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Impact Score</span>
            <span className="text-sm font-bold text-primary">{defaults.impactScore}</span>
          </div>
          
          {defaults.badges.length > 0 && (
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Award className="h-3 w-3" /> Badges
              </div>
              <div className="flex flex-wrap gap-1.5">
                {defaults.badges.map((badge) => (
                  <Badge key={badge} variant="secondary" className="text-[10px]">
                    {badge}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {defaults.topicsEngaged.length > 0 && (
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Hash className="h-3 w-3" /> Topics
              </div>
              <div className="flex flex-wrap gap-1.5">
                {defaults.topicsEngaged.map((topic) => (
                  <Badge key={topic} variant="outline" className="text-[10px]">
                    #{topic}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
