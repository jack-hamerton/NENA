"use client";

import { AdvocacyImpactMatrix } from "./AdvocacyImpactMatrix";
import { UserEngagementChart } from "./UserEngagementChart";
import { PostEngagementChart } from "./PostEngagementChart";
import { useAuth } from "@/context/AuthContext";
import { BarChart3, PieChart, ShieldCheck } from "lucide-react";

export function AnalyticsDashboard() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="space-y-12 pb-20 animate-in fade-in duration-500">
      {/* Visual Impact Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 px-1">
          <PieChart className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-black italic tracking-tighter uppercase underline decoration-primary/30 decoration-4 underline-offset-8">Influence Mapping</h2>
        </div>
        <AdvocacyImpactMatrix userId={user.id} />
      </section>

      {/* Engagement Metrics Section */}
      <section className="space-y-8">
        <div className="flex items-center gap-2 px-1">
          <BarChart3 className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-black italic tracking-tighter uppercase underline decoration-primary/30 decoration-4 underline-offset-8">Engagement Analytics</h2>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <UserEngagementChart />
          <PostEngagementChart />
        </div>
      </section>

      {/* Trust & Security Footnote (Visual Polish) */}
      <div className="flex items-center justify-center gap-2 py-8 border-t border-white/5 opacity-40 grayscale group hover:grayscale-0 transition-all duration-500">
         <ShieldCheck className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
         <span className="text-[10px] font-black uppercase tracking-[0.2em]">Verified Analytics Engine v2.4</span>
      </div>
    </div>
  );
}
