"use client";

import { Theme } from "@/types";

interface ThemeWordCloudProps {
  themes: Theme[];
}

const COLORS = [
  "text-primary",
  "text-emerald-500",
  "text-violet-500",
  "text-amber-500",
  "text-sky-500",
  "text-rose-500",
  "text-teal-500",
  "text-indigo-500",
  "text-orange-500",
  "text-cyan-500",
];

export function ThemeWordCloud({ themes }: ThemeWordCloudProps) {
  if (!themes.length) return null;

  const maxCount = Math.max(...themes.map((t) => t.count));

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
        Key Themes
      </h4>
      <div className="flex flex-wrap gap-3 items-center justify-center min-h-[120px]">
        {themes.map((theme, i) => {
          const ratio = theme.count / maxCount;
          const size =
            ratio > 0.8
              ? "text-3xl"
              : ratio > 0.6
              ? "text-2xl"
              : ratio > 0.4
              ? "text-xl"
              : ratio > 0.2
              ? "text-lg"
              : "text-base";

          return (
            <span
              key={i}
              className={`font-bold select-none ${size} ${
                COLORS[i % COLORS.length]
              } opacity-90 hover:opacity-100 transition-opacity cursor-default`}
              style={{
                transform: `rotate(${(i % 3) * 5 - 5}deg)`,
                display: "inline-block",
              }}
            >
              {theme.keyword}
            </span>
          );
        })}
      </div>
    </div>
  );
}
