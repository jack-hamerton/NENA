"use client";

import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatTimeAgo } from "@/lib/utils";

const mockConversations = [
  { id: "c1", name: "Alice", lastMessage: "See you at the room!", time: "2024-03-09T10:00:00Z", unread: 2 },
  { id: "c2", name: "Bob", lastMessage: "Great podcast episode!", time: "2024-03-09T09:00:00Z", unread: 0 },
  { id: "c3", name: "Carol", lastMessage: "Thanks for the follow!", time: "2024-03-09T07:00:00Z", unread: 0 },
];

export function ConversationList() {
  return (
    <div className="space-y-1">
      {mockConversations.map((conv) => (
        <Link
          key={conv.id}
          href={`/messages/${conv.id}`}
          className="flex items-center gap-3 rounded-lg p-3 hover:bg-accent transition-colors"
        >
          <Avatar size="md">
            <AvatarFallback fallback={conv.name} />
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="font-medium text-sm truncate">{conv.name}</p>
              <span className="text-[10px] text-muted-foreground">{formatTimeAgo(conv.time)}</span>
            </div>
            <p className="text-xs text-muted-foreground truncate">{conv.lastMessage}</p>
          </div>
          {conv.unread > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground font-bold">
              {conv.unread}
            </span>
          )}
        </Link>
      ))}
    </div>
  );
}
