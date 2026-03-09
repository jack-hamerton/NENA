"use client";

import { cn } from "@/lib/utils";

interface ChatBubbleProps {
  sender: "me" | "them";
  message: string;
  timestamp: string;
}

export function ChatBubble({ sender, message, timestamp }: ChatBubbleProps) {
  return (
    <div className={cn("flex", sender === "me" ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[75%] rounded-2xl px-4 py-2 shadow-sm",
          sender === "me" 
            ? "bg-primary text-primary-foreground rounded-tr-none" 
            : "bg-muted rounded-tl-none"
        )}
      >
        <p className="text-sm">{message}</p>
        <p className={cn("text-[10px] mt-1 text-right", sender === "me" ? "text-primary-foreground/70" : "text-muted-foreground")}>
          {timestamp}
        </p>
      </div>
    </div>
  );
}
