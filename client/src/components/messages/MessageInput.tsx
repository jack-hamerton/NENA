"use client";

import { useState, useRef } from "react";
import { Send, Image as ImageIcon, Smile, Sparkles, X, Paperclip } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import EmojiPicker, { Theme } from "emoji-picker-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

interface MessageInputProps {
  onSend: (content: string) => Promise<void>;
}

const toneOptions = [
  { label: "Formal", description: "Professional and polished" },
  { label: "Friendly", description: "Warm and casual" },
  { label: "Respectful", description: "Polite and courteous" },
  { label: "Concise", description: "Brief and to the point" },
];

export function MessageInput({ onSend }: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);
  const [isRewriting, setIsRewriting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { theme } = useTheme();

  const handleSend = async () => {
    if (!message.trim()) return;
    await onSend(message.trim());
    setMessage("");
  };

  const handleRewrite = async (tone: string) => {
    if (!message.trim()) return;
    setIsRewriting(true);
    setIsAiOpen(false);
    
    try {
      const response = await fetch("/api/ai/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: message, tone }),
      });
      const data = await response.json();
      if (data.text) {
        setMessage(data.text);
      }
    } catch (err) {
      console.error("AI rewrite failed:", err);
    } finally {
      setIsRewriting(false);
    }
  };

  return (
    <div className="relative border-t bg-background/50 backdrop-blur-sm">
      {/* AI Menu */}
      {isAiOpen && (
        <div className="absolute bottom-full left-0 right-0 mb-2 mx-2 bg-background border rounded-lg shadow-lg p-2 space-y-1">
          <div className="flex items-center justify-between px-2 py-1 border-b mb-1">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Sparkles className="h-3 w-3" />
              <span>AI Assist</span>
            </div>
            <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => setIsAiOpen(false)}>
              <X className="h-3 w-3" />
            </Button>
          </div>
          {toneOptions.map((tone) => (
            <button
              key={tone.label}
              onClick={() => handleRewrite(tone.label.toLowerCase())}
              disabled={isRewriting}
              className="w-full flex flex-col items-start p-2 rounded-md hover:bg-accent transition-colors text-left disabled:opacity-50"
            >
              <span className="text-sm font-medium">{tone.label}</span>
              <span className="text-xs text-muted-foreground">{tone.description}</span>
            </button>
          ))}
        </div>
      )}

      {/* Emoji Picker */}
      {isEmojiOpen && (
        <div className="absolute bottom-full right-4 mb-2 z-50 shadow-2xl rounded-lg overflow-hidden border">
          <EmojiPicker
            theme={theme === "dark" ? Theme.DARK : Theme.LIGHT}
            onEmojiClick={(emojiData) => {
              setMessage((prev) => prev + emojiData.emoji);
              // don't auto-close, let them pick multiple 
            }}
            lazyLoadEmojis={true}
          />
        </div>
      )}

      <div className="flex items-center gap-2 p-3">
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              // Mock attachment logic
              console.log("File attached:", file.name);
              alert(`File "${file.name}" attached. Real implementation would upload this.`);
              // Reset input
              e.target.value = '';
            }
          }}
        />
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-muted-foreground hover:text-primary"
          onClick={() => fileInputRef.current?.click()}
          title="Attach File"
        >
          <Paperclip className="h-5 w-5" />
        </Button>
        <div className="relative flex-1">
          <Input
            placeholder="Type a message…"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            className="pr-10 bg-muted/30 border-none focus-visible:ring-1"
          />
          <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className={cn("h-7 w-7", isAiOpen && "text-primary bg-primary/10")}
              onClick={() => setIsAiOpen(!isAiOpen)}
            >
              <Sparkles className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className={cn("text-muted-foreground hover:text-primary", isEmojiOpen && "text-primary bg-primary/10")}
          onClick={() => setIsEmojiOpen(!isEmojiOpen)}
        >
          <Smile className="h-5 w-5" />
        </Button>
        <Button
          size="icon"
          onClick={handleSend}
          disabled={!message.trim() || isRewriting}
          className={cn(
            "h-9 w-9 rounded-full transition-transform",
            message.trim() ? "scale-100" : "scale-90"
          )}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
