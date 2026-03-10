import { AnalyticsDashboard } from "@/components/analytics/AnalyticsDashboard";
import { BarChart3, LineChart, Target, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function AnalyticsPage() {
  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-y-auto p-8 gap-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/20 text-primary">
              <BarChart3 className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-black italic tracking-tighter uppercase">Advocacy Center</h1>
          </div>
          <p className="text-muted-foreground text-sm max-w-lg font-medium leading-relaxed">
            Monitor your strategic impact across the network. Visualize engagement, track growth, and optimize your advocacy efforts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl font-bold gap-2 px-6 h-11 border-white/5 bg-accent/20">
            <Target className="h-4 w-4" /> Strategy
          </Button>
          <Button variant="outline" className="rounded-xl font-bold gap-2 px-6 h-11 border-white/5 bg-accent/20 text-primary">
            <Zap className="h-4 w-4 fill-current" /> High Performance
          </Button>
        </div>
      </div>

      {/* Stats Summary (Quick Peek) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {[
           { label: "Active Advocates", val: "1,240", change: "+12%", icon: Target },
           { label: "Viral Reach", val: "45.2k", change: "+24%", icon: Zap },
           { label: "Network Health", val: "94%", change: "Stable", icon: LineChart },
         ].map((stat, i) => (
           <div key={i} className="p-6 bg-card border rounded-3xl shadow-sm hover:shadow-xl transition-all group">
             <div className="flex items-center justify-between mb-4">
               <div className="p-2 rounded-lg bg-accent/10 group-hover:bg-primary/20 transition-colors">
                 <stat.icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
               </div>
               <span className={cn(
                 "text-[10px] font-black px-2 py-0.5 rounded-full",
                 stat.change.startsWith("+") ? "bg-green-500/10 text-green-500" : "bg-primary/10 text-primary"
               )}>
                 {stat.change}
               </span>
             </div>
             <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">{stat.label}</p>
             <p className="text-2xl font-black italic tracking-tight">{stat.val}</p>
           </div>
         ))}
      </div>

      <AnalyticsDashboard />
    </div>
  );
}
