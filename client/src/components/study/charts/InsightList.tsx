"use client";

interface InsightListProps {
  insights: string[];
  title?: string;
}

export function InsightList({ insights, title = "Key Insights" }: InsightListProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
        {title}
      </h4>
      <ul className="space-y-2">
        {insights.map((insight, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-foreground">
            <span className="mt-1 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
            {insight}
          </li>
        ))}
      </ul>
    </div>
  );
}
