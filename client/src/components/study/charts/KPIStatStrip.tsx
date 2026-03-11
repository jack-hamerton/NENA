"use client";

interface KPIStat {
  title: string;
  value: string | number;
  icon?: string;
}

interface KPIStatStripProps {
  stats: KPIStat[];
}

export function KPIStatStrip({ stats }: KPIStatStripProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {stats.map((stat, i) => (
        <div
          key={i}
          className="bg-card border border-border rounded-xl p-4 flex flex-col gap-1 text-center hover:border-primary/40 transition-colors"
        >
          {stat.icon && (
            <span className="text-2xl mb-1">{stat.icon}</span>
          )}
          <p className="text-2xl font-bold text-foreground">{stat.value}</p>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
            {stat.title}
          </p>
        </div>
      ))}
    </div>
  );
}
