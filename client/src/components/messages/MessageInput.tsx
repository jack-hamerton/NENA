"use client";

import { useState } from "react";
import { Send, Image as ImageIcon, Smile } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function MessageInput({ conversationId }: { conversationId: string }) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!message.trim()) return;
    console.log(`Send to ${conversationId}:`, message);
    setMessage("");
  };

  return (
    <div className="flex items-center gap-2 border-t bg-background/50 p-3 backdrop-blur-sm">
      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
        <ImageIcon className="h-5 w-5" />
      </Button>
      <div className="relative flex-1">
        <Input
          placeholder="Type a message…"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="pr-10 bg-muted/30 border-none focus-visible:ring-1"
        />
        <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground hover:text-primary">
          <Smile className="h-4 w-4" />
        </Button>
      </div>
      <Button 
        size="icon" 
        onClick={handleSend} 
        disabled={!message.trim()}
        className={cn(
          "h-9 w-9 rounded-full transition-transform",
          message.trim() ? "scale-100" : "scale-90"
        )}
      >
        <Send className="h-4 w-4" />
      </Button>
    </div>
  );
}
