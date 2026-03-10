"use client";

import { useState, useEffect } from "react";
import { AdvocacyMatrix } from "@/types/analytics";
import { analyticsService } from "@/services/analytics.service";
import { Loader2, AlertCircle, TrendingUp, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdvocacyImpactMatrixProps {
  userId: string;
}

const ROWS = ["Awareness", "Will", "Action"];
const COLS = ["Public", "Influencers", "Stakeholders"];

export function AdvocacyImpactMatrix({ userId }: AdvocacyImpactMatrixProps) {
  const [data, setData] = useState<AdvocacyMatrix | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const matrixData = await analyticsService.getAdvocacyMatrix(userId);
        setData(matrixData);
      } catch (err) {
        console.error("Failed to fetch matrix data:", err);
        setError("Unable to load advocacy matrix data.");
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) fetchData();
  }, [userId]);

  if (isLoading) {
    return (
      <div className="h-[400px] flex items-center justify-center bg-card rounded-3xl border border-white/5">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="h-[400px] flex flex-col items-center justify-center bg-card rounded-3xl border border-destructive/20 p-6 text-center">
        <AlertCircle className="h-10 w-10 text-destructive mb-4" />
        <p className="text-muted-foreground font-medium">{error || "No data available."}</p>
      </div>
    );
  }

  // Find max value for scaling bubbles
  const maxVal = Math.max(...data.matrix.flat(), 1);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="bg-card border shadow-2xl rounded-3xl overflow-hidden">
        <div className="p-6 border-b bg-accent/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="p-2 rounded-xl bg-primary/20 text-primary">
                <TrendingUp className="h-5 w-5" />
             </div>
             <div>
               <h3 className="text-xl font-black italic tracking-tighter uppercase">Advocacy Impact Matrix</h3>
               <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Influence mapping & strategy</p>
             </div>
          </div>
        </div>

        <div className="p-8 pb-12 overflow-x-auto">
          <div className="min-w-[500px] grid grid-cols-4 gap-4">
            {/* Corner */}
            <div className="flex items-end justify-end p-2 border-r-2 border-b-2 border-white/5 pb-4 pr-4">
               <span className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground rotate-[-45deg]">Audience →</span>
            </div>

            {/* Horizontal Header */}
            {COLS.map(col => (
              <div key={col} className="flex items-center justify-center p-2">
                <span className="text-xs font-black uppercase tracking-widest text-primary italic">{col}</span>
              </div>
            ))}

            {/* Matrix Body */}
            {ROWS.map((row, rowIdx) => (
              <>
                {/* Vertical Header */}
                <div key={row} className="flex items-center justify-end pr-4 py-8">
                  <span className="text-xs font-black uppercase tracking-widest text-primary italic">{row}</span>
                </div>

                {/* Data Cells */}
                {data.matrix[rowIdx].map((val, colIdx) => {
                  const scale = val / maxVal;
                  return (
                    <div 
                      key={`${rowIdx}-${colIdx}`} 
                      className="relative h-24 flex items-center justify-center border border-white/5 rounded-2xl bg-accent/5 hover:bg-accent/10 transition-colors group"
                    >
                      <div 
                        className={cn(
                          "rounded-full transition-all duration-500 group-hover:scale-110 shadow-lg shadow-primary/20",
                          val === 0 ? "h-1 w-1 bg-muted/20" : ""
                        )}
                        style={{
                          width: val === 0 ? '4px' : `${Math.max(20, scale * 80)}%`,
                          height: val === 0 ? '4px' : `${Math.max(20, scale * 80)}%`,
                          backgroundColor: `rgba(var(--primary), ${Math.max(0.1, scale)})`,
                        }}
                      />
                      {val > 0 && (
                        <span className={cn(
                          "absolute text-xs font-black drop-shadow-md",
                          scale > 0.5 ? "text-white" : "text-primary"
                        )}>
                          {val}
                        </span>
                      )}
                    </div>
                  );
                })}
              </>
            ))}
          </div>
        </div>
      </div>

      {/* Recommendation Block */}
      <div className="p-8 bg-gradient-to-br from-primary/20 via-primary/5 to-transparent border rounded-3xl shadow-xl relative overflow-hidden group">
         <Sparkles className="absolute -right-4 -top-4 h-32 w-32 text-primary/10 rotate-12 group-hover:rotate-45 transition-transform duration-1000" />
         <div className="relative space-y-4">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-[10px] font-black uppercase tracking-wider">
             <Sparkles className="h-3 w-3" />
             AI Recommendation
           </div>
           <p className="text-xl font-bold leading-relaxed max-w-2xl tracking-tight">
             {data.recommendation}
           </p>
         </div>
      </div>
    </div>
  );
}
