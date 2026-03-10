"use client";

import { useState } from "react";
import { MessageSquare, BarChart3, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface RoomSidebarProps {
  roomId: string;
}

export function RoomSidebar({ roomId }: RoomSidebarProps) {
  const [activeTab, setActiveTab] = useState<"chat" | "polls" | "participants">("chat");

  return (
    <div className="w-80 border-l bg-background flex flex-col h-full hidden lg:flex">
      <div className="flex border-b">
        <button
          onClick={() => setActiveTab("chat")}
          className={cn(
            "flex-1 py-3 text-xs font-medium border-b-2 transition-colors",
            activeTab === "chat" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          <div className="flex items-center justify-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Chat
          </div>
        </button>
        <button
          onClick={() => setActiveTab("polls")}
          className={cn(
            "flex-1 py-3 text-xs font-medium border-b-2 transition-colors",
            activeTab === "polls" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          <div className="flex items-center justify-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Polls
          </div>
        </button>
        <button
          onClick={() => setActiveTab("participants")}
          className={cn(
            "flex-1 py-3 text-xs font-medium border-b-2 transition-colors",
            activeTab === "participants" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          <div className="flex items-center justify-center gap-2">
            <Users className="h-4 w-4" />
            Users
          </div>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === "chat" && (
          <div className="flex flex-col h-full">
            <div className="flex-1 text-center py-20 text-muted-foreground">
              <MessageSquare className="h-10 w-10 mx-auto mb-4 opacity-20" />
              <p className="text-sm">Welcome to the chat!</p>
              <p className="text-xs mt-1">Messages are end-to-end encrypted.</p>
            </div>
            <div className="mt-auto">
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-[10px] text-muted-foreground mb-2 italic">Chat integration coming soon...</p>
                <div className="flex gap-2">
                  <input 
                    disabled 
                    placeholder="Type a message..." 
                    className="flex-1 bg-background border rounded px-3 py-1.5 text-sm outline-none opacity-50"
                  />
                  <Button size="sm" disabled>Send</Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "polls" && (
          <div className="text-center py-20 text-muted-foreground">
            <BarChart3 className="h-10 w-10 mx-auto mb-4 opacity-20" />
            <p className="text-sm">No active polls</p>
            <Button variant="outline" size="sm" className="mt-4" disabled>Create Poll</Button>
          </div>
        )}

        {activeTab === "participants" && (
          <div className="space-y-4">
             <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold">ME</div>
                <span className="text-sm font-medium">You (Host)</span>
             </div>
             <p className="text-[10px] text-muted-foreground italic uppercase tracking-wider mt-6">Participating</p>
          </div>
        )}
      </div>
    </div>
  );
}
