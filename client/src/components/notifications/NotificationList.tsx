"use client";

import { Heart, UserPlus, MessageCircle, Mic, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const mockNotifications = [
  { id: "1", type: "like" as const, message: "Alice liked your post", read: false, createdAt: "2024-03-09T11:58:00Z" },
  { id: "2", type: "follow" as const, message: "Bob started following you", read: false, createdAt: "2024-03-09T11:00:00Z" },
  { id: "3", type: "room_invite" as const, message: "Carol invited you to the 'Dev Talk' room", read: true, createdAt: "2024-03-09T09:00:00Z" },
  { id: "4", type: "comment" as const, message: "John commented on your post", read: true, createdAt: "2024-03-08T20:00:00Z" },
];

const iconMap = {
  like: Heart,
  follow: UserPlus,
  comment: MessageCircle,
  mention: MessageCircle,
  room_invite: Mic,
};

export function NotificationList() {
  return (
    <div className="space-y-1">
      {mockNotifications.map((n) => {
        const Icon = iconMap[n.type] || Star;
        return (
          <div
            key={n.id}
            className={cn(
              "flex items-center gap-4 rounded-xl p-4 transition-all duration-200 cursor-pointer",
              n.read ? "opacity-60 hover:opacity-100" : "bg-primary/5 hover:bg-primary/10"
            )}
          >
            <div className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
              n.read ? "bg-muted" : "bg-primary/20 text-primary"
            )}>
              <Icon className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">{n.message}</p>
              <p className="text-[10px] text-muted-foreground mt-1 uppercase font-bold tracking-tight">
                {formatTimeAgo(n.createdAt)}
              </p>
            </div>
            {!n.read && <div className="h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_oklch(var(--primary))]" />}
          </div>
        );
      })}
    </div>
  );
}
