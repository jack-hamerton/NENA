"use client";

import { useState, useRef, useEffect } from "react";
import { useNotifications } from "@/context/NotificationContext";
import { NotificationItem } from "./NotificationItem";
import { Bell, CheckCheck, Trash2, Zap, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function NotificationMenu() {
  const { notifications, unreadCount, markAsRead, clearReadNotifications } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleRead = (id: string) => {
    markAsRead(id);
  };

  const hasNotifications = notifications.length > 0;

  return (
    <div className="relative" ref={menuRef}>
      <Button 
        variant="ghost" 
        size="icon" 
        className="relative group transition-all duration-300 hover:bg-primary/10"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
      >
        <Bell className={cn(
          "h-5 w-5 transition-transform group-hover:rotate-12",
          unreadCount > 0 ? "text-primary animate-pulse" : "text-muted-foreground"
        )} />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[8px] font-black text-white shadow-lg ring-2 ring-background ring-offset-1 ring-offset-background/50">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-[380px] border border-white/5 bg-background/95 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden z-50 animate-in fade-in zoom-in duration-200 origin-top-right">
          <div className="p-6 border-b bg-accent/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
               <div className="p-2 rounded-xl bg-primary/20 text-primary">
                  <Zap className="h-5 w-5" />
               </div>
               <div>
                 <h3 className="text-xl font-black italic tracking-tighter uppercase leading-none">Activity Feed</h3>
                 <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">Real-time network events</p>
               </div>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 rounded-lg text-muted-foreground hover:text-primary transition-colors"
                title="Mark all as read"
                onClick={() => notifications.forEach(n => !n.read && markAsRead(n.id))}
              >
                <CheckCheck className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive transition-colors"
                onClick={clearReadNotifications}
                title="Clear read"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 rounded-lg text-muted-foreground lg:hidden"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="max-h-[450px] overflow-y-auto overflow-x-hidden scrollbar-hide">
            {hasNotifications ? (
              <div className="divide-y divide-white/5">
                {notifications.map((notification) => (
                  <NotificationItem 
                    key={notification.id} 
                    notification={notification} 
                    onRead={handleRead}
                  />
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-12 text-center space-y-4 opacity-50">
                 <div className="p-4 rounded-full bg-accent/20 border-2 border-dashed border-white/10">
                   <Bell className="h-8 w-8 text-muted-foreground" />
                 </div>
                 <div className="space-y-1">
                   <p className="text-sm font-black uppercase tracking-tighter italic">Silent for now</p>
                   <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Connect with others to see activity</p>
                 </div>
              </div>
            )}
          </div>
          
          <div className="p-4 bg-accent/10 border-t flex justify-center">
             <Button variant="link" className="text-[10px] font-black uppercase tracking-widest text-primary hover:no-underline hover:scale-105 transition-transform">
               View All Activity History
             </Button>
          </div>
        </div>
      )}
    </div>
  );
}
