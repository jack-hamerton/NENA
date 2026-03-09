"use client";

import { Quote } from "@/types";

interface QuoteCardProps {
  quote: Quote;
}

export function QuoteCard({ quote }: QuoteCardProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 flex flex-col gap-2 hover:border-primary/30 transition-colors">
      <p className="text-foreground italic text-sm leading-relaxed">
        &ldquo;{quote.text}&rdquo;
      </p>
      <p className="text-muted-foreground text-xs text-right font-medium">
        — {quote.author}
      </p>
    </div>
  );
}
