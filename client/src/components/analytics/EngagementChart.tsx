"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

export function EngagementChart() {
  return (
    <Card className="border-white/5 bg-card/40 backdrop-blur-sm overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
        <CardTitle className="text-base font-bold">Engagement Over Time</CardTitle>
        <BarChart3 className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="h-64 flex flex-col items-center justify-center text-center space-y-4">
        <div className="relative h-40 w-full flex items-end justify-around gap-2 px-4">
          {[40, 70, 45, 90, 65, 80, 55, 30, 60, 75, 50, 85].map((h, i) => (
            <div 
              key={i} 
              className="w-full bg-primary/20 rounded-t-sm hover:bg-primary/40 transition-colors" 
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
        <p className="text-xs text-muted-foreground font-medium">
          Chart.js + react-chartjs-2 line chart will be integrated here
        </p>
      </CardContent>
    </Card>
  );
}
