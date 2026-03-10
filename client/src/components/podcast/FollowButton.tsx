"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Bell, BellOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface FollowButtonProps {
  podcastId: string;
}

export function FollowButton({ podcastId }: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [notifications, setNotifications] = useState(true);

  useEffect(() => {
    const followed = localStorage.getItem(`follow_${podcastId}`);
    setIsFollowing(!!followed);
  }, [podcastId]);

  const toggleFollow = () => {
    const newState = !isFollowing;
    setIsFollowing(newState);
    if (newState) {
      localStorage.setItem(`follow_${podcastId}`, "true");
    } else {
      localStorage.removeItem(`follow_${podcastId}`);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={toggleFollow}
        variant={isFollowing ? "outline" : "default"}
        className={cn(
          "rounded-full px-6 font-bold transition-all",
          isFollowing && "bg-primary/10 border-primary/20 text-primary hover:bg-primary/20"
        )}
      >
        <Heart className={cn("h-4 w-4 mr-2", isFollowing && "fill-current")} />
        {isFollowing ? "Following" : "Follow"}
      </Button>
      
      {isFollowing && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setNotifications(!notifications)}
          className="rounded-full text-muted-foreground hover:text-primary"
        >
          {notifications ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
        </Button>
      )}
    </div>
  );
}
