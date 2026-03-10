"use client";

import { useNotifications } from "@/context/NotificationContext";
import { NotificationItem } from "@/components/notification/NotificationItem";
import { Bell, CheckCheck, Trash2, Zap, Filter, Search as SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function NotificationsPage() {
  const { notifications, unreadCount, markAsRead, clearReadNotifications } = useNotifications();

  const handleRead = (id: string) => {
    markAsRead(id);
  };

  const hasNotifications = notifications.length > 0;

  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-y-auto p-8 gap-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/20 text-primary">
              <Bell className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-black italic tracking-tighter uppercase">Activity Hub</h1>
          </div>
          <p className="text-muted-foreground text-sm max-w-lg font-medium leading-relaxed">
            Stay updated with your latest interactions, mentions, and system updates. You have {unreadCount} unread notifications.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            className="rounded-xl font-bold gap-2 px-6 h-11 border-white/5 bg-accent/20"
            onClick={() => notifications.forEach(n => !n.read && markAsRead(n.id))}
          >
            <CheckCheck className="h-4 w-4" /> Mark All Read
          </Button>
          <Button 
            variant="outline" 
            className="rounded-xl font-bold gap-2 px-6 h-11 border-white/5 bg-accent/20 text-destructive hover:bg-destructive/10"
            onClick={clearReadNotifications}
          >
            <Trash2 className="h-4 w-4" /> Clear History
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search notifications..." className="pl-10 h-11 rounded-xl bg-accent/10 border-white/5" />
        </div>
        <div className="flex gap-2">
           <Button variant="outline" className="rounded-xl font-bold gap-2 h-11 border-white/5 bg-accent/20">
             <Filter className="h-4 w-4" /> All Activities
           </Button>
           <Button variant="outline" className="rounded-xl font-bold gap-2 h-11 border-white/5 bg-accent/20">
             <Zap className="h-4 w-4" /> Important
           </Button>
        </div>
      </div>

      {/* Notification List */}
      <div className="bg-card border shadow-2xl rounded-3xl overflow-hidden divide-y divide-white/5">
        {hasNotifications ? (
          notifications.map((notification) => (
            <NotificationItem 
              key={notification.id} 
              notification={notification} 
              onRead={handleRead}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center p-20 text-center space-y-6 opacity-50 capitalize">
            <div className="p-6 rounded-full bg-accent/20 border-2 border-dashed border-white/10 animate-pulse">
              <Bell className="h-12 w-12 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black italic tracking-tighter">Your feed is silent</h2>
              <p className="text-sm font-bold text-muted-foreground max-w-xs mx-auto leading-relaxed">
                When you interact with the network or receive invitations, they'll appear here in real-time.
              </p>
            </div>
            <Button size="lg" className="rounded-xl font-black italic px-10 shadow-lg shadow-primary/20">
              EXPLORE THE NETWORK
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
