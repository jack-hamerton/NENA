"use client";

import { useEffect } from "react";
import { useChat } from "@/context/ChatContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatTimeAgo } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface ConversationListProps {
  onSelectConversation?: () => void;
}

export function ConversationList({ onSelectConversation }: ConversationListProps) {
  const { conversations, selectedConversation, isLoading, selectConversation, fetchConversations } = useChat();

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const handleSelect = (conversation: typeof conversations[0]) => {
    selectConversation(conversation);
    onSelectConversation?.();
  };

  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3 animate-pulse">
            <div className="h-10 w-10 rounded-full bg-muted" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-24 bg-muted rounded" />
              <div className="h-3 w-32 bg-muted rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center p-4">
          <p className="text-sm text-muted-foreground">No conversations yet</p>
          <p className="text-xs text-muted-foreground mt-1">Start a conversation to see it here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-1 overflow-y-auto h-[calc(100vh-8rem)]">
      {conversations.map((conv) => (
        <button
          key={conv.id}
          onClick={() => handleSelect(conv)}
          className={cn(
            "w-full flex items-center gap-3 rounded-lg p-3 hover:bg-accent transition-colors text-left",
            selectedConversation?.id === conv.id && "bg-accent"
          )}
        >
          <Avatar className="h-10 w-10">
            <AvatarFallback>{conv.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="font-medium text-sm truncate">{conv.name}</p>
              <span className="text-[10px] text-muted-foreground">
                {formatTimeAgo(conv.lastMessageAt)}
              </span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <p className={cn(
                "text-xs truncate max-w-[180px]",
                conv.unreadCount > 0 ? "text-foreground font-medium" : "text-muted-foreground"
              )}>
                {conv.lastMessage || "No messages yet"}
              </p>
              {conv.unreadCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground font-bold px-1.5">
                  {conv.unreadCount}
                </span>
              )}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
