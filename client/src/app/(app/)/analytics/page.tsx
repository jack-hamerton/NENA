import { StatsCards } from "@/components/analytics/StatsCards";
import { EngagementChart } from "@/components/analytics/EngagementChart";

export default function AnalyticsPage() {
  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-sm text-muted-foreground">Track your growth and engagement.</p>
      </div>

      <StatsCards />
      
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <EngagementChart />
        </div>
        <div className="rounded-2xl border border-white/5 bg-card/40 p-6 backdrop-blur-sm">
          <h3 className="font-bold text-sm mb-4">Top Performing Posts</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-10 w-10 rounded bg-primary/10" />
                <div className="flex-1">
                  <div className="h-2 w-24 bg-muted rounded" />
                  <div className="h-1.5 w-16 bg-muted/50 rounded mt-2" />
                </div>
                <div className="text-xs font-bold text-primary">+12%</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
