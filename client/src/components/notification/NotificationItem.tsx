"use client";

import { Notification } from "@/types/notification";
import { formatDistanceToNow } from "date-fns";
import { 
  Calendar, 
  MessageSquare, 
  UserPlus, 
  Heart, 
  MessageCircle, 
  Bell, 
  Check,
  ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface NotificationItemProps {
  notification: Notification;
  onRead: (id: string) => void;
}

const getIcon = (type: string) => {
  switch (type) {
    case "event_invitation":
    case "event_reminder":
      return <Calendar className="h-4 w-4" />;
    case "new_message":
      return <MessageSquare className="h-4 w-4" />;
    case "follow":
      return <UserPlus className="h-4 w-4" />;
    case "like":
      return <Heart className="h-4 w-4" />;
    case "comment":
      return <MessageCircle className="h-4 w-4" />;
    default:
      return <Bell className="h-4 w-4" />;
  }
};

export function NotificationItem({ notification, onRead }: NotificationItemProps) {
  const { type, payload, read, created_at } = notification;

  return (
    <div 
      className={cn(
        "flex gap-4 p-4 transition-colors relative group",
        !read ? "bg-primary/5 hover:bg-primary/10" : "hover:bg-accent/5"
      )}
      onClick={() => onRead(notification.id)}
    >
      {!read && (
        <div className="absolute left-1 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-full" />
      )}
      
      <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
        {payload.sender?.avatarUrl ? (
          <AvatarImage src={payload.sender.avatarUrl} />
        ) : (
          <AvatarFallback className="bg-accent text-[10px] font-black uppercase">
            {payload.sender?.username?.charAt(0) || "N"}
          </AvatarFallback>
        )}
      </Avatar>

      <div className="flex-1 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <p className={cn(
            "text-sm leading-snug tracking-tight",
            !read ? "font-bold text-foreground" : "font-medium text-muted-foreground"
          )}>
            {payload.message}
          </p>
          <div className={cn(
            "p-1.5 rounded-lg shrink-0 transition-transform group-hover:scale-110",
            type === "event_invitation" ? "bg-blue-500/20 text-blue-500" :
            type === "event_reminder" ? "bg-orange-500/20 text-orange-500" :
            "bg-primary/20 text-primary"
          )}>
            {getIcon(type)}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            {formatDistanceToNow(new Date(created_at), { addSuffix: true })}
          </span>
          
          {type === "event_invitation" && !read && (
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="h-7 px-3 text-[10px] font-black uppercase tracking-tighter rounded-lg border-white/10 hover:bg-primary hover:text-white transition-all">
                Decline
              </Button>
              <Button size="sm" className="h-7 px-3 text-[10px] font-black uppercase tracking-tighter rounded-lg shadow-lg shadow-primary/20">
                Accept
              </Button>
            </div>
          )}
          
          {read && (
            <Check className="h-3 w-3 text-muted-foreground/30" />
          )}
        </div>
      </div>
    </div>
  );
}
