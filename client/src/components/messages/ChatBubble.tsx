"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Check, CheckCheck, Lock, Eye, Clock, Image as ImageIcon } from "lucide-react";

interface ChatBubbleProps {
  sender: "me" | "them";
  message: string;
  timestamp: string;
  isRead?: boolean;
  messageType?: "text" | "system" | "image" | "file";
  mediaUrl?: string;
  isViewOnce?: boolean;
  isDisappearing?: boolean;
  disappearingTimer?: number;
  isEncrypted?: boolean;
}

export function ChatBubble({ 
  sender, 
  message, 
  timestamp, 
  isRead,
  messageType = "text",
  mediaUrl,
  isViewOnce,
  isDisappearing,
  disappearingTimer = 60,
  isEncrypted = true
}: ChatBubbleProps) {
  const [timeLeft, setTimeLeft] = useState(disappearingTimer);
  const [hasViewed, setHasViewed] = useState(false);
  const [isDecrypting, setIsDecrypting] = useState(isEncrypted);
  const [displayMessage, setDisplayMessage] = useState(message);

  // Simulate decryption delay for visual effect
  useEffect(() => {
    if (isEncrypted && sender === "them") {
      const timer = setTimeout(() => {
        setIsDecrypting(false);
      }, 800);
      return () => clearTimeout(timer);
    } else {
      setIsDecrypting(false);
    }
  }, [isEncrypted, sender]);

  // Handle disappearing messages
  useEffect(() => {
    if (isDisappearing && !isDecrypting) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            // In a real app, delete from context/API here
            setDisplayMessage("This message has disappeared");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isDisappearing, isDecrypting]);

  if (messageType === "system") {
    return (
      <div className="flex justify-center my-4">
        <span className="text-xs bg-muted text-muted-foreground px-3 py-1 rounded-full">
          {message}
        </span>
      </div>
    );
  }

  const renderContent = () => {
    if (isDecrypting) {
      return (
        <span className="flex items-center gap-2 italic opacity-70">
          <Lock className="h-3 w-3 animate-pulse" /> Decrypting...
        </span>
      );
    }

    if (isDisappearing && timeLeft === 0) {
      return <span className="italic opacity-50">{displayMessage}</span>;
    }

    if (isViewOnce) {
      if (hasViewed) {
        return <span className="italic opacity-50 flex items-center gap-1"><CheckCheck className="h-3 w-3"/> Opened</span>;
      }
      return (
        <button 
          onClick={() => setHasViewed(true)}
          className="flex items-center gap-2 font-medium bg-background/20 hover:bg-background/30 px-4 py-3 rounded-lg transition-colors w-full justify-center"
        >
          <ImageIcon className="h-5 w-5" /> Tap to view photo
        </button>
      );
    }

    if (messageType === "image" && mediaUrl) {
      // eslint-disable-next-line @next/next/no-img-element
      return <img src={mediaUrl} alt="message attachment" className="rounded-lg max-w-full h-auto mb-2" />;
    }

    return displayMessage;
  };

  return (
    <div className={cn("flex w-full", sender === "me" ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[75%] rounded-2xl px-4 py-2 shadow-sm group relative",
          sender === "me"
            ? "bg-primary text-primary-foreground rounded-tr-none"
            : "bg-muted rounded-tl-none"
        )}
      >
        <div className="text-sm whitespace-pre-wrap break-words">
          {renderContent()}
        </div>
        
        <div className={cn("flex items-center justify-end gap-1.5 mt-1 relative", sender === "me" ? "text-primary-foreground/70" : "text-muted-foreground")}>
          {isDisappearing && timeLeft > 0 && !isDecrypting && (
            <span className="flex items-center gap-0.5 text-[10px] bg-background/20 px-1 rounded">
              <Clock className="h-2.5 w-2.5" /> {timeLeft}s
            </span>
          )}
          {isEncrypted && !isDecrypting && <Lock className="h-2.5 w-2.5 opacity-50" />}
          <span className="text-[10px]">{timestamp}</span>
          {sender === "me" && (
            <span className="flex">
              {isRead ? (
                <CheckCheck className="h-3 w-3" />
              ) : (
                <Check className="h-3 w-3" />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
